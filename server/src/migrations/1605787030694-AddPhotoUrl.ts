import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddPhotoUrl1605787030694 implements MigrationInterface {

    public async up(runner: QueryRunner): Promise<void> {
        await runner.addColumn("user", new TableColumn({name: "photoUrl", type: "varchar", default: "''"}));
        await runner.query(`UPDATE "user" SET "photoUrl" = 'https://avatars.dicebear.com/api/human/' || id || '.svg'`);
    }

    public async down(runner: QueryRunner): Promise<void> {
        await runner.dropColumn("user", "photoUrl");
    }

}
