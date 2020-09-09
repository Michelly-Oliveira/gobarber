import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';

import Input from '../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'email',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

// Test for: input with icon, error
describe('Input component', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    expect(getByPlaceholderText('E-mail')).toBeTruthy();
  });

  it('should render highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainer = getByTestId('input-container');

    fireEvent.focus(inputElement);

    await wait(() => {
      expect(inputContainer).toHaveStyle('border-color: #ff9000');
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainer).not.toHaveStyle('border-color: #ff9000');
      expect(inputContainer).not.toHaveStyle('color: #ff9000');
    });
  });

  it('should keep input border highlight when input is filled', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="email" placeholder="E-mail" />,
    );

    const inputElement = getByPlaceholderText('E-mail');
    const inputContainer = getByTestId('input-container');

    fireEvent.change(inputElement, { target: { value: 'johndoe@test.com' } });

    fireEvent.blur(inputElement);

    await wait(() => {
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });
  });
});
