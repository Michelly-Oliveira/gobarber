import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';

import Profile from '../../pages/Profile';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedUpdateUser = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      updateUser: mockedUpdateUser,
      user: {
        id: 'user123',
        name: 'John Doe',
        email: 'johndoe@test.com',
        password: '123456',
        avatar: 'avatar_url.jpg',
        avatar_url: 'http://localhost:3333/avatar_url.jpg',
      },
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('Profile Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedUpdateUser.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to update profile', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'John',
        email: 'john@test.com',
        password: '123123',
      },
    };

    apiMock.onPut('profile').reply(200, apiResponse);

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmField = getByPlaceholderText('Confirmar senha');
    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(nameField, { target: { value: 'John' } });
    fireEvent.change(emailField, { target: { value: 'john@test.com' } });
    fireEvent.change(oldPasswordField, { target: { value: '123456' } });
    fireEvent.change(passwordField, { target: { value: '123123' } });
    fireEvent.change(passwordConfirmField, { target: { value: '123123' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedUpdateUser).toHaveBeenCalledWith(apiResponse);
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should be able to update name and email', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'John',
        email: 'john@test.com',
      },
    };

    apiMock.onPut('profile').reply(200, apiResponse);

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(nameField, { target: { value: 'John' } });
    fireEvent.change(emailField, { target: { value: 'john@test.com' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedUpdateUser).toHaveBeenCalledWith(apiResponse);
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able to update profile when old password is incorrect', async () => {
    apiMock.onPut('profile').reply(400);

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const oldPasswordField = getByPlaceholderText('Senha atual');
    const passwordField = getByPlaceholderText('Nova senha');
    const passwordConfirmField = getByPlaceholderText('Confirmar senha');
    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(nameField, { target: { value: 'John' } });
    fireEvent.change(emailField, { target: { value: 'john@test.com' } });
    fireEvent.change(oldPasswordField, {
      target: { value: 'incorrect-password' },
    });
    fireEvent.change(passwordField, { target: { value: '123123' } });
    fireEvent.change(passwordConfirmField, { target: { value: '123123' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should not be able to update profile when old password is provided but no new password', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const nameField = getByPlaceholderText('Nome');
    const emailField = getByPlaceholderText('E-mail');
    const oldPasswordField = getByPlaceholderText('Senha atual');
    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(nameField, { target: { value: 'John' } });
    fireEvent.change(emailField, { target: { value: 'john@test.com' } });
    fireEvent.change(oldPasswordField, {
      target: { value: 'incorrect-password' },
    });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should display an error if update profile fails', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'John',
        email: 'john@test.com',
      },
    };

    apiMock.onPut('profile').reply(200, apiResponse);

    mockedUpdateUser.mockImplementationOnce(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<Profile />);

    const emailField = getByPlaceholderText('E-mail');
    const nameField = getByPlaceholderText('Nome');
    const buttonElement = getByText('Confirmar mudanças');

    fireEvent.change(emailField, { target: { value: 'john@test.com' } });
    fireEvent.change(nameField, { target: { value: 'John' } });

    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should be able to update avatar', async () => {
    const apiResponse = {
      user: {
        id: 'user123',
        name: 'John',
        email: 'john@test.com',
        avatar: 'new_avatar_url.jpg',
        avatar_url: 'http://localhost:3333/new_avatar_url.jpg',
      },
    };

    apiMock.onPatch('users/avatar').reply(200, apiResponse);

    const { getByTestId } = render(<Profile />);

    const file = new File(['(⌐□_□)'], 'new_avatar_url.jpg', {
      type: 'image/jpg',
    });

    const avatarField = getByTestId('input-avatar');

    fireEvent.change(avatarField, {
      target: { files: [file] },
    });

    await wait(() => {
      expect(mockedUpdateUser).toHaveBeenCalledWith(apiResponse);
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });
});
