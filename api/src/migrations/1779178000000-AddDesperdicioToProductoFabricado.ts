import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddDesperdicioToProductoFabricado1779178000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'producto_fabricado',
            new TableColumn({
                name: 'desperdicio',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
                isNullable: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('producto_fabricado', 'desperdicio');
    }
}
