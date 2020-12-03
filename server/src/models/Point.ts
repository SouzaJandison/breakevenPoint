import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('point')
class Point {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  description: string;
  
  @Column()
  cost: number;

  @Column()
  variableCost: number;

  @Column()
  fixedCost: number;

  @Column()
  margin: number;
  
  @Column()
  breakevenPoint: number;
  
  @Column()
  id_user: string;
}

export { Point }