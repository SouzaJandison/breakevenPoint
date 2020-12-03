import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class createPointTable1607017333349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(new Table({
      name: 'point',
      columns: [
        {
          name: 'id',
          type: 'integer',
          unsigned: true,
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment'
        },
        {
          name: 'description',
          type: 'varchar'
        },
        {
          name: 'cost',
          type: 'integer'
        },
        {
          name: 'variableCost',
          type: 'integer'
        },
        {
          name: 'fixedCost',
          type: 'integer'
        },
        {
          name: 'margin',
          type: 'integer'
        },
        {
          name: 'breakevenPoint',
          type: 'integer'
        },
        {
          name: 'id_user',
          type: 'varchar'
        },
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('point');
  }
}
