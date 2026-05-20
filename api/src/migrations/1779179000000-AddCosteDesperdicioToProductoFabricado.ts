import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCosteDesperdicioToProductoFabricado1779179000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'producto_fabricado',
            new TableColumn({
                name: 'coste_desperdicio',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
                isNullable: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('producto_fabricado', 'coste_desperdicio');
    }
}
