import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the user profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Smith',
      email: 'johnsmith@example.com',
    });

    expect(updateUser.name).toBe('John Smith');
    expect(updateUser.email).toBe('johnsmith@example.com');
  });

  it('should not be able to change email to another email already used', async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const user = await fakeUsersRepository.create({
      name: 'John Smith',
      email: 'johnsmith@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Smith',
        email: 'john@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Smith',
      email: 'johnsmith@example.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updateUser.password).toBe('123123');
  });

  it('should not be able to update the password without providing the old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Smith',
        email: 'johnsmith@example.com',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password if provided wrong old password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Smith',
        email: 'johnsmith@example.com',
        old_password: 'wrong_old_password',
        password: '123123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the profile of a non-existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non_existing_user_id',
        name: 'Test',
        email: 'test@example.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
