import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCantidadToProductoMateriales1714911000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'producto_materiales',
      new TableColumn({
        name: 'cantidad',
        type: 'decimal',
        precision: 10,
        scale: 2,
        default: 1,
        isNullable: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('producto_materiales', 'cantidad');
  }
}
