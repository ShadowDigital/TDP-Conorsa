import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCostesHistoricos1715000000000 implements MigrationInterface {
    name = 'AddCostesHistoricos1715000000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('producto_fabricado', [
            new TableColumn({
                name: 'coste_teorico',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            }),
            new TableColumn({
                name: 'coste_real',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
            })
        ]);

        await queryRunner.addColumn('material_usado', new TableColumn({
            name: 'coste_unitario',
            type: 'decimal',
            precision: 10,
            scale: 2,
            default: 0,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('material_usado', 'coste_unitario');
        await queryRunner.dropColumn('producto_fabricado', 'coste_real');
        await queryRunner.dropColumn('producto_fabricado', 'coste_teorico');
    }
}
