import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticateUser = container.resolve(AuthenticateUserService);

    // Get the user that is returned from the service
    const { user, token } = await authenticateUser.execute({
      email,
      password,
    });

    // Apply the methods to transform the class on the User - expose, exclude
    return response.json({ user: classToClass(user), token });
  }
}
