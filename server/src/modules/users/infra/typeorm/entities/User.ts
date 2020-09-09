// Entity = something that will be saved on the database
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

@Entity('users')
// Define type of data of a User
class User {
  // Primary entry on the table, is generated automatically
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Default type is varchar = string
  @Column()
  name: string;

  @Column()
  email: string;

  // Remove password, can't access the password of a user - don't send it to frontend
  @Column()
  @Exclude()
  password: string;

  @Column()
  avatar: string;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  // Create a field to have access to the avatar url - send link to frontend
  @Expose({ name: 'avatar_url' })
  getAvatarUrl(): string | null {
    return this.avatar
      ? `${process.env.APP_API_URL}/files/${this.avatar}`
      : null;
  }
}

export default User;
