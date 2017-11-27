import {
  Table, Column, Model, HasMany, UpdatedAt, CreatedAt, DefaultScope, DataType,
  ForeignKey
} from 'sequelize-typescript';
import Group from "./group.model";

@Table({
  timestamps: false,
  freezeTableName: true,
  tableName: 'userGroups'
})
export class UserGroup extends Model<UserGroup> {
  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @Column
  userId: number;
}

export default UserGroup;
