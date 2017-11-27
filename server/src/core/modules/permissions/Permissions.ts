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


type GroupPermissions = {
  resource: string;
  permissions: Array<string>;
}

export class Permissions {
  public resources: Array<Resource> = [];
  public groups: Array<Group> = [];

  constructor(private aclConfig: IAclConfig, private sequelize: Sequelize) {
  }

  async init() {
    this.sequelize.addModels([path.join(__dirname, './models')]);
    await this.syncModels(path.join(__dirname, './models'));
    await this.loadData();
  }

  async loadData() {
    this.resources = await Resource.findAll<Resource>();
    this.groups = await Group.findAll<Group>({
      include: [{
        model: Permission,
        include: [Resource]
      }]
    });
  }

  async getUserGroups(userId) {
    await UserGroup.findAll({where: {userId}, include: [Permission, Group]});
  }

  async createResource(name, resourcePerms: Array<string>) {
    if (_.find(this.resources, {name})) return;
    let resource = new Resource({name, permissions: resourcePerms});
    await resource.save();
  }

  async extendResource(name, resourcePerms: Array<string>) {
    let resource = await Resource.findOne<Resource>({where: {name}});
    let newPerms = _.concat(resource.permissions, resourcePerms);
    newPerms = _.uniq(newPerms);
    resource.permissions = newPerms;
    await resource.save();
  }

  async createGroup(name: string, groupPerms: Array<GroupPermissions> = []) {
    if (_.find(this.groups, {name})) return;
    let group = new Group({name});
    await group.save();
    if (!groupPerms.length) {
      return;
    }
    await this.extendGroup(group, groupPerms);
  }

  async extendGroup(group: string | Group, groupPerms: Array<GroupPermissions>) {
    let preparedPermissions = [];
    let groupInstance = await this.getGroupInstance(group);

    await Bluebird.each(groupPerms, async (item) => {
      const resource = await Resource.findOne({where: {name: item.resource}});
      preparedPermissions.push({groupId: groupInstance.id, resourceId: resource.id, permissions: item.permissions});
    });
    await Permission.bulkCreate(preparedPermissions);
  }

  async addToGroup(group, userId) {
    let groupInstance = await this.getGroupInstance(group);
    new UserGroup({groupId: groupInstance.id, userId: userId});
  }

  async getGroupInstance(group: string | Group): Promise<Group> {
    if (group instanceof Group) {
      return group;
    }
    return await Group.findOne<Group>({where: {name: group}});
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
