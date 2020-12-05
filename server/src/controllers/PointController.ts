import { Request, Response } from 'express';
import { getRepository } from 'typeorm';

import { Point } from '../models/Point';
import { schemaPointCreate } from '../validations/pointValidation';

class PointController {
  async create(req: Request, res: Response) {
    const { 
      description, 
      cost, 
      variableCost, 
      fixedCost, 
      margin,
      breakevenPoint,
      id_user 
    } = req.body;

    const data = {
      description,
      cost,
      variableCost,
      fixedCost,
      margin,
      breakevenPoint,
      id_user
    }

    await schemaPointCreate.validate(data, {
      abortEarly: false
    })

    const pointRepository = getRepository(Point);

    const point = pointRepository.create(data);
    await pointRepository.save(point);

    return res.status(201).json(point);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const pointRepository = getRepository(Point);
    
    const listPoint = await pointRepository.find({ id_user: id });

    return res.json(listPoint);
  }

  async delete(req: Request, res: Response) {
    const { id } = req.params;
    const id_user = req.headers.authorization;
    
    console.log(id, id_user)
    const pointRepository = getRepository(Point);

    const point = await pointRepository.findOne({ where: { id } });

    if(point?.id_user !== id_user) {
      return res.status(401).json({ error: 'Operation not permitted.' });
    }

    await pointRepository.delete({ id: Number(id) });

    return res.status(204).send();
  }
}

export default new PointController();