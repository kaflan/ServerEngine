import {Table, Column, Model, HasMany, UpdatedAt, CreatedAt, DefaultScope, DataType} from 'sequelize-typescript';
import Permission from "./permission.model";

@Table({
  timestamps: false,
  freezeTableName: true,
  tableName: 'resources'
})
export class Resource extends Model<Resource> {
  @Column
  name: string;

  @Column(DataType.ARRAY(DataType.STRING()))
  actions: Array<string>;
}

export default Resource;
