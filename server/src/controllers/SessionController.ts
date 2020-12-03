import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import bcrypt from 'bcrypt';

import { User } from '../models/User';
import { schemaSessionCreate } from '../validations/sessionValidation';
import { userView } from '../views/userView';

class SessionController {
  async create(req: Request, res: Response) {
    const { email, password } = req.body;
    const userRepository = getRepository(User);

    await schemaSessionCreate.validate({ email, password }, {
      abortEarly: false
    });

    const user = await userRepository.findOne({ where: { email } });
    if(!user) {
      return res.status(401).json({ message: 'User not found' });
    };

    const isValidPassword = await bcrypt.compare(password, user.password);
    if(!isValidPassword) {
      return res.status(401).json({ message: 'password is incorrect' });
    };

    return res.json(userView.render(user));
  }
}

export default new SessionController();