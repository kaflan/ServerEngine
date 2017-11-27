import * as Acl from 'acl'
import * as AclSequelize from 'acl-sequelize';
import {IAclConfig} from '../../interfaces/ISettings';
import {Sequelize} from "sequelize-typescript";

export class Permissions {
  public acl = null;
  constructor(private aclConfig: IAclConfig, private sequelize: Sequelize) {
    this.acl = new Acl(new AclSequelize(this.sequelize, { prefix: 'acl_' }));
  }

  init() {

  }
}
