import {Table, Column, Model, HasMany, UpdatedAt, CreatedAt, DefaultScope, DataType} from 'sequelize-typescript';
import Permission from "./permission.model";

@Table({
  timestamps: false,
  freezeTableName: true,
  tableName: 'groups'
})
export class Group extends Model<Group> {
  @Column
  name: string;

  @HasMany(() => Permission)
  permissions: Permission[];
}

export default Group;
