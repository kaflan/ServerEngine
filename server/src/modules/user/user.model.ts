import * as bcyrpt from 'bcrypt-as-promised';
import {Table, Column, Model, HasMany, UpdatedAt, CreatedAt, DefaultScope, DataType} from 'sequelize-typescript';
import {Post} from "../post/post.model";

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
