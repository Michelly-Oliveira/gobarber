// Entity = something that will be saved on the database
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

@Entity('appointments')
// Define type of data of an Appointment
class Appointment {
  // Primary entry on the table, is generated automatically
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Default type is varchar = string
  @Column()
  provider_id: string;

  // Define the relation:
  // Creates a prop called provider that is an instace of the User model
  // When the prop is called, @ returns the type
  // Many appointments to one user
  @ManyToOne(() => User)
  // Specify the column that identifies who is the provider of the appointment
  @JoinColumn({ name: 'provider_id' })
  provider: User;

  @Column()
  user_id: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  // name of relation
  user: User;

  @Column('timestamp with time zone')
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;
}

export default Appointment;
