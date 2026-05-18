import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateFabricacionTables1715702983000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Tabla producto_fabricado
    if (!(await queryRunner.hasTable('producto_fabricado'))) {
      await queryRunner.createTable(
        new Table({
          name: 'producto_fabricado',
          columns: [
            { name: 'id', type: 'varchar', length: '36', isPrimary: true },
            { name: 'codigo_producto', type: 'varchar', length: '50', isNullable: false },
            { name: 'nombre_producto', type: 'varchar', length: '255', isNullable: false },
            { name: 'unidad', type: 'varchar', length: '20', isNullable: false },
            { name: 'cantidad', type: 'decimal', precision: 10, scale: 2, isNullable: false },
            { name: 'fecha', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
            { name: 'pedido', type: 'varchar', length: '50', isNullable: false },
          ],
        }),
        true
      );
    }

    // 2. Tabla material_usado
    if (!(await queryRunner.hasTable('material_usado'))) {
      await queryRunner.createTable(
        new Table({
          name: 'material_usado',
          columns: [
            { name: 'id', type: 'varchar', length: '36', isPrimary: true },
            { name: 'producto_fabricado_id', type: 'varchar', length: '36', isNullable: false },
            { name: 'codigo_material', type: 'varchar', length: '50', isNullable: false },
            { name: 'nombre_maaterial', type: 'varchar', length: '255', isNullable: false },
            { name: 'unidades', type: 'varchar', length: '20', isNullable: false },
            { name: 'cantidad', type: 'decimal', precision: 10, scale: 2, isNullable: false },
          ],
        }),
        true
      );

      await queryRunner.createForeignKey(
        'material_usado',
        new TableForeignKey({
          columnNames: ['producto_fabricado_id'],
          referencedColumnNames: ['id'],
          referencedTableName: 'producto_fabricado',
          onDelete: 'CASCADE',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('material_usado');
    if (table) {
      const foreignKey = table.foreignKeys.find(
        (fk) => fk.columnNames.indexOf('producto_fabricado_id') !== -1
      );
      if (foreignKey) await queryRunner.dropForeignKey('material_usado', foreignKey);
    }
    await queryRunner.dropTable('material_usado', true);
    await queryRunner.dropTable('producto_fabricado', true);
  }
}
