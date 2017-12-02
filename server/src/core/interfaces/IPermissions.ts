import Group from "../permissions/models/group.model";
import {Permissions} from "../permissions/Permissions";
import {RequestHandler} from "express";

export interface IPermissions {
  init(): Promise<void>;
  checkAccess(resource, actions: Array<string> | string): RequestHandler;
  getUserGroups(userId: number): Promise<Array<UserGroups>>;
  getUserPermissions(userId: number): Promise<Object>;
  createResource(name: string, resourcePerms: Array<string>): Promise<void>;
  extendResource(name: string, resourcePerms: Array<string>): Promise<void>;
  createGroup(name: string, groupPerms: Array<GroupPermissions>): Promise<void>;
  extendGroup(group: string | Group, groupPerms: Array<GroupPermissions>): Promise<void>;
  addToGroup(group: string | Group, userId: number): Promise<void>;
}

export type GroupPermissions = {
  resource: string;
  actions: Array<string>;
}

export type UserGroups = {
  userId: number;
  groupId: number;
  group: {
    name: string;
    permissions: Array<GroupPermission>
  }
}

type GroupPermission = {
  groupId: number;
  resourceId: number;
  actions: Array<string>
  resource: Resource
}

type Resource = {
  name: string;
  actions: Array<string>;
}
