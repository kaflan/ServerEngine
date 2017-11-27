import {Table, Column, Model, HasMany, UpdatedAt, CreatedAt, DefaultScope, DataType} from 'sequelize-typescript';

@Table({
  timestamps: true,
  freezeTableName: true,
  tableName: 'groups'
})
export class Group extends Model<Group> {
  @Column
  email: string;

  @Column
  password: string;

  @Column
  name: string;

  @Column(DataType.DATEONLY)
  birthday: Date;

  @CreatedAt
  createdAt: Date;

  @UpdatedAt
  updatedAt: Date;
}

export default Group;
