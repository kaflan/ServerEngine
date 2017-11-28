import * as _ from 'lodash';
import * as path from "path";
import * as fs from "fs-extra";
import * as Bluebird from 'bluebird';
import {IAclConfig} from '../../interfaces/ISettings';
import {Sequelize} from "sequelize-typescript";
import Group from "./models/group.model";
import Permission from "./models/permission.model";
import Resource from "./models/resource.model";
import UserGroup from "./models/userGroup.model";
import {ApiAclDenyError} from "../../Errors";


type GroupPermissions = {
  resource: string;
  actions: Array<string>;
}

export class Permissions {
  public resources: Array<Resource> = [];
  public groups: Array<Group> = [];

  constructor(private sequelize: Sequelize) {
  }

  async init() {
    this.sequelize.addModels([path.join(__dirname, './models')]);
    await this.syncModels(path.join(__dirname, './models'));
    await this.loadData();
  }

  public checkAccess(resource, actions: Array<string> | string) {
    return (req, res, next) => {
      try {
        if (!req.user) {
          throw new ApiAclDenyError(resource, actions);
        }
        this.checkPermissions(req.user, resource, actions)
      } catch (error) {
        next(error)
      }
    }
  }

  public async getUserGroups(userId: number) {
    let data = await UserGroup.findAll<UserGroup>({
      where: {userId}, include: [{
        model: Group,
        include: [{
          model: Permission,
          include: [Resource]
        }]
      }]
    });
    return data.map(item => item.get({plain: true}));
  }

  public async getUserPermissions(userId: number) {
    let data = await UserGroup.findAll<UserGroup>({
      where: {userId}, include: [{
        model: Group,
        include: [{
          model: Permission,
          include: [Resource]
        }]
      }]
    });
    let userPermissions = {};
    for (let item of data) {
      let group = item.group.get({plain: true});
      for (let groupPermission of group.permissions) {
        if (!groupPermission.actions) {
          continue;
        }
        for (let action of groupPermission.actions) {
          userPermissions[this.getFullPermission(groupPermission.resource.name, action)] = true;
        }
      }
    }
    return userPermissions;
  }

  public async createResource(name, resourcePerms: Array<string>) {
    if (_.find(this.resources, {name})) return;
    await Resource.create({name, actions: resourcePerms});
  }

  public async extendResource(name, resourcePerms: Array<string>) {
    let resource = await Resource.findOne<Resource>({where: {name}});
    let newActions = _.concat(resource.actions, resourcePerms);
    newActions = _.uniq(newActions);
    resource.actions = newActions;
    await resource.save();
  }

  public async createGroup(name: string, groupPerms: Array<GroupPermissions> = []) {
    if (_.find(this.groups, {name})) return;
    let group = new Group({name});
    await group.save();
    if (!groupPerms.length) {
      return;
    }
    await this.extendGroup(group, groupPerms);
  }

  public async extendGroup(group: string | Group, groupPerms: Array<GroupPermissions>) {
    let preparedPermissions = [];
    let groupInstance = await this.getGroupInstance(group);

    await Bluebird.each(groupPerms, async (item) => {
      const resource = await Resource.findOne({where: {name: item.resource}});
      preparedPermissions.push({groupId: groupInstance.id, resourceId: resource.id, actions: item.actions});
    });
    await Permission.bulkCreate(preparedPermissions);
  }

  public async addToGroup(group, userId) {
    let groupInstance = await this.getGroupInstance(group);
    await UserGroup.create({groupId: groupInstance.id, userId: userId});
  }

  private async getGroupInstance(group: string | Group): Promise<Group> {
    if (group instanceof Group) {
      return group;
    }
    return await Group.findOne<Group>({where: {name: group}});
  }

  private async loadData() {
    this.resources = await Resource.findAll<Resource>();
    this.groups = await Group.findAll<Group>({
      include: [{
        model: Permission,
        include: [Resource]
      }]
    });
  }

  private getFullPermission(resource, action) {
    return `${resource}.${action}`;
  }

  private checkPermissions(user, resource, actions: Array<string> | string) {
    if (typeof actions === 'string') {
      return !!user.permissions[this.getFullPermission(resource, actions)];
    }
    let result = true;
    actions.forEach(action => {
      if (!user.permissions[this.getFullPermission(resource, action)]) {
        result = false;
      }
    });
    return result;
  }

  /**
   * Function to create tables for Permissions system
   * @param modelsPath
   * @returns {Promise<void>}
   */
  private async syncModels(modelsPath) {
    const transaction = await this.sequelize.transaction();
    try {
      let neededModels = [];
      let models = [];

      let files = fs.readdirSync(modelsPath);

      files.forEach((file) => {
        if (path.extname(file) === '.js') {
          neededModels.push(require(path.join(modelsPath, file)).default.name);
        }
      });

      let sequelize = <any>this.sequelize;
      sequelize.modelManager.forEachModel(model => {
        if (~neededModels.indexOf(model.name)) {
          models.push(model);
        }
      });

      await Bluebird.each(models, (model) => model.sync({transaction}));

      transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
