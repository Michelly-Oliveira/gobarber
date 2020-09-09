import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from 'typeorm';

export class AlterProviderFieldToProviderId1593282368157
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Delete the column we want to change
    await queryRunner.dropColumn('appointments', 'provider');

    // Create a column with the changes
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider_id',
        type: 'uuid',
        // Allow the id to be null so that if the user(provider) is deleted the history of appointments from other users(clients) continues to exist, the clients won't lose that part of their log history
        isNullable: true,
      }),
    );

    // Create a reference on the table appointments of the provider id on the users table
    await queryRunner.createForeignKey(
      'appointments',
      new TableForeignKey({
        name: 'AppointmentProvider',
        // name of the column(s) that will receive the reference
        columnNames: ['provider_id'],
        // name of the column(s) that will be referenced
        referencedColumnNames: ['id'],
        // table that contains the column that will be referenced
        referencedTableName: 'users',
        // what to do if that id(user) is deleted: set the id value to null
        onDelete: 'SET NULL',
        // what to do if the id changes: update all references
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert what was done on the method up on reverse order: if we delete the provider_id column first we can't delete the foreignKey
    await queryRunner.dropForeignKey('appointments', 'AppointmentProvider');

    await queryRunner.dropColumn('appointments', 'provider_id');

    // Recreate the column without those changes
    await queryRunner.addColumn(
      'appointments',
      new TableColumn({
        name: 'provider',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }
}
