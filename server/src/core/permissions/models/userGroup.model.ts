import {
  Table, Column, Model, HasMany, UpdatedAt, CreatedAt, DefaultScope, DataType,
  ForeignKey, BelongsTo
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

  @BelongsTo(() => Group)
  group: Group;
}

export default UserGroup;
