import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import SignIn from '../../pages/SignIn';

// Create a separate variable to store the jest.fn() so the tests can have access to it, and check if it has been called
const mockedHistoryPush = jest.fn();
const mockedSignIn = jest.fn();
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
      signIn: mockedSignIn,
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

describe('SignIn Page', () => {
  beforeEach(() => {
    // Clear all executions of the function
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign in', async () => {
    // To test a component, we need to render it so that we can have access to all the elements of that component
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // Function returns a reference to that html element
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // fireEvent = simulate an event created by the user
    // onChange event on th input, pass the e.target.value
    fireEvent.change(emailField, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    // Execute the test until it works or the timer is over
    // Test async features
    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    // To test a component, we need to render it so that we can have access to all the elements of that component
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // Function returns a reference to that html element
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // fireEvent = simulate an event created by the user
    // onChange event on th input, pass the e.target.value
    fireEvent.change(emailField, { target: { value: 'not-valid-email' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    // Execute the test until it works or the timer is over
    // Test async features
    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an error if login fails', async () => {
    // Override the implementation of the signIn function to generate an error
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    // To test a component, we need to render it so that we can have access to all the elements of that component
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    // Function returns a reference to that html element
    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    // fireEvent = simulate an event created by the user
    // onChange event on th input, pass the e.target.value
    fireEvent.change(emailField, { target: { value: 'john@test.com' } });
    fireEvent.change(passwordField, { target: { value: '123456' } });

    fireEvent.click(buttonElement);

    // Execute the test until it works or the timer is over
    // Test async features
    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
