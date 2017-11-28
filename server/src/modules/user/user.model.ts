import * as bcyrpt from 'bcrypt-as-promised';
import {
  Table, Column, Model, HasMany, UpdatedAt, CreatedAt, DefaultScope, DataType,
  Scopes
} from 'sequelize-typescript';
import {Post} from "../post/post.model";

@DefaultScope({
  attributes: ['id', 'email', 'name', 'birthday']
})
@Scopes({
  full: {
    include: [() => Post]
  },
  auth: {
    attributes: ['id', 'email', 'password']
  }
})
@Table({
  timestamps: true,
  freezeTableName: true,
  tableName: 'users'
})
export class User extends Model<User> {
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

  @HasMany(() => Post)
  posts: Post[];

  public checkPassword(pass) {
    return bcyrpt.compare(pass, this.password);
  }
  public async setPassword(pass) {
    this.password = await bcyrpt.hash(pass, 10);
  }
}

export default User;
