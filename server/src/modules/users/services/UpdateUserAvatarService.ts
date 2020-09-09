import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '../repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IRequest {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute({ user_id, avatarFileName }: IRequest): Promise<User> {
    // Find user by id on the database through the repo
    const user = await this.usersRepository.findById(user_id);

    // Check if user doesn't exist
    if (!user) {
      throw new AppError('Only authenticated users can change avatar', 401);
    }

    // Check if user already has an avatar on storage
    if (user.avatar) {
      // Delete avatar
      await this.storageProvider.deleteFile(user.avatar);
    }

    // Save new avatar on storage
    const fileName = await this.storageProvider.saveFile(avatarFileName);

    // Add new image to user field avatar
    user.avatar = fileName;

    // Update user data on the database
    await this.usersRepository.save(user);

    return user;
  }
}

export default UpdateUserAvatarService;
