import { MigrationInterface, QueryRunner, TableColumn, Table } from 'typeorm';

export default class AddAvatarFieldToUsers1593431809724
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create new column for the avatar on the table users
    // Null by default so it doesn't have problems with the data that already exists on the database
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'avatar',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'avatar');
  }
}
