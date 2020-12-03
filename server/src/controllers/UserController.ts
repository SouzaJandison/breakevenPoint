import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../models/User';
import { schemaUserCreate } from '../validations/userValidation';
import { userView } from '../views/userView';

class UserController {
  async index(req: Request, res: Response) {
    const id = req.headers.authorization;
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { id } });
    
    if(!user) return res.sendStatus(401).json({ message: 'Unauthorized access' });

    return res.json({ message: 'Ok' });
  }

  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const userRepository = getRepository(User);

    const data = {
      name,
      email,
      password
    };

    await schemaUserCreate.validate(data, {
      abortEarly: false
    });

    const userExist = await userRepository.findOne({ where: { email } });
    if(userExist) {
      return res.status(409).json({ message: 'E-mail already registered' });
    };

    const user = userRepository.create(data);
    await userRepository.save(user);

    return res.status(201).json(userView.render(user));
  }
}

export default new UserController();