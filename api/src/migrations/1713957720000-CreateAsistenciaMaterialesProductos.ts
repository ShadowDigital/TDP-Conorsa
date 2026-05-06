import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class CreateAsistenciaMaterialesProductos1713957720000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Tabla Asistencia
    if (!(await queryRunner.hasTable('asistencia'))) {
      await queryRunner.createTable(
        new Table({
          name: 'asistencia',
          columns: [
            { name: 'id', type: 'varchar', length: '36', isPrimary: true },
            { name: 'userId', type: 'varchar', length: '36', isNullable: false },
            { name: 'tipo', type: 'enum', enum: ['inicio_jornada', 'pausa', 'fin_pausa', 'fin_jornada'], isNullable: false },
            { name: 'motivo_pausa', type: 'varchar', length: '255', isNullable: true },
            { name: 'fecha_hora', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
          ],
        }),
        true
      );

      await queryRunner.createForeignKey(
        'asistencia',
        new TableForeignKey({
          columnNames: ['userId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'user',
          onDelete: 'CASCADE',
        })
      );
    }

    // 2. Tabla Material
    if (!(await queryRunner.hasTable('material'))) {
      await queryRunner.createTable(
        new Table({
          name: 'material',
          columns: [
            { name: 'id', type: 'varchar', length: '36', isPrimary: true },
            { name: 'codigo', type: 'varchar', length: '50', isUnique: true, isNullable: false },
            { name: 'nombre', type: 'varchar', length: '255', isNullable: false },
            { name: 'descripcion', type: 'text', isNullable: true },
            { name: 'unidad', type: 'varchar', length: '20', isNullable: false },
          ],
        }),
        true
      );
    }

    // 3. Tabla Producto
    if (!(await queryRunner.hasTable('producto'))) {
      await queryRunner.createTable(
        new Table({
          name: 'producto',
          columns: [
            { name: 'id', type: 'varchar', length: '36', isPrimary: true },
            { name: 'codigo', type: 'varchar', length: '50', isUnique: true, isNullable: false },
            { name: 'nombre', type: 'varchar', length: '255', isNullable: false },
            { name: 'descripcion', type: 'text', isNullable: true },
            { name: 'unidad', type: 'varchar', length: '20', isNullable: false },
          ],
        }),
        true
      );
    }

    // 4. Tabla Intermedia Producto - Materiales (ManyToMany)
    if (!(await queryRunner.hasTable('producto_materiales'))) {
      await queryRunner.createTable(
        new Table({
          name: 'producto_materiales',
          columns: [
            { name: 'productoId', type: 'varchar', length: '36', isPrimary: true },
            { name: 'materialId', type: 'varchar', length: '36', isPrimary: true },
          ],
        }),
        true
      );

      await queryRunner.createForeignKey(
        'producto_materiales',
        new TableForeignKey({
          columnNames: ['productoId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'producto',
          onDelete: 'CASCADE',
        })
      );

      await queryRunner.createForeignKey(
        'producto_materiales',
        new TableForeignKey({
          columnNames: ['materialId'],
          referencedColumnNames: ['id'],
          referencedTableName: 'material',
          onDelete: 'CASCADE',
        })
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('producto_materiales');
    await queryRunner.dropTable('producto');
    await queryRunner.dropTable('material');
    await queryRunner.dropTable('asistencia');
  }
}
