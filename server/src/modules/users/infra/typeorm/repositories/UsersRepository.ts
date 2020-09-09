import { getRepository, Repository, Not } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import IFindAllProvidersDTO from '@modules/users/dtos/IFindAllProvidersDTO';

import User from '../entities/User';

class UsersRepository implements IUsersRepository {
  // Declare a private variable for the repository from TypeORM - Repository for model User
  private ormRepository: Repository<User>;

  // Initialize our repository with te base repo from typeorm
  constructor() {
    this.ormRepository = getRepository(User);
  }

  public async findAllProviders({
    except_user_id,
  }: IFindAllProvidersDTO): Promise<User[]> {
    let users: User[];

    if (except_user_id) {
      // If we want to exclude an user from the list: get all usr where the id is not the passed id
      users = await this.ormRepository.find({
        where: {
          id: Not(except_user_id),
        },
      });
    } else {
      // List all users, with no exception
      users = await this.ormRepository.find();
    }

    return users;
  }

  public async findById(id: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne(id);

    return findUser;
  }

  public async findByEmail(email: string): Promise<User | undefined> {
    const findUser = await this.ormRepository.findOne({ where: { email } });

    return findUser;
  }

  public async create(userData: ICreateUserDTO): Promise<User> {
    // Create user
    const user = this.ormRepository.create(userData);

    await this.ormRepository.save(user);

    return user;
  }

  public async save(user: User): Promise<User> {
    // Save user on database
    await this.ormRepository.save(user);

    return user;
  }
}

export default UsersRepository;
