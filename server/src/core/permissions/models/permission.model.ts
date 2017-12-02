import {
  Table, Column, Model, HasMany, UpdatedAt, CreatedAt, DefaultScope, DataType,
  ForeignKey, BelongsTo
} from 'sequelize-typescript';
import Group from "./group.model";
import Resource from "./resource.model";

@Table({
  timestamps: false,
  freezeTableName: true,
  tableName: 'permissions'
})
export class Permission extends Model<Permission> {
  @ForeignKey(() => Group)
  @Column
  groupId: number;

  @ForeignKey(() => Resource)
  @Column
  resourceId: number;

  @Column(DataType.ARRAY(DataType.STRING()))
  actions: Array<string>;

  @BelongsTo(() => Resource)
  resource: Resource;
}

export default Permission;
