import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddCosteToMaterial1779090693000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'material',
            new TableColumn({
                name: 'coste',
                type: 'decimal',
                precision: 10,
                scale: 2,
                default: 0,
                isNullable: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('material', 'coste');
    }
}