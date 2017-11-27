import {Table, Column, Model, BelongsTo, ForeignKey} from 'sequelize-typescript';
import {User} from "../user/user.model";

@Table({
  timestamps: true,
  freezeTableName: true,
  tableName: 'users'
})
export class Post extends Model<Post> {

  @Column
  title: string;

  @Column
  text: string;

  @ForeignKey(() => User)
  @Column
  userId: number;

}

export default Post;
