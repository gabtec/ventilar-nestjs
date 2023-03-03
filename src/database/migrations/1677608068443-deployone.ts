import { MigrationInterface, QueryRunner } from 'typeorm';

export class deployone1677608068443 implements MigrationInterface {
  name = 'deployone1677608068443';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "t_ventilators" ("id" SERIAL NOT NULL, "brand" character varying NOT NULL, "model" character varying NOT NULL, "serial" character varying NOT NULL, "image" character varying, "category" character varying(4) NOT NULL, "is_free" boolean NOT NULL DEFAULT true, "park_id" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5151ad9b964ba81234a6cc4d9a7" UNIQUE ("serial"), CONSTRAINT "PK_6e09e4482737f0d2a4087eac5bd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "t_wards" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "institution" character varying NOT NULL, "is_park" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5f068469d9c2c474ebf53700143" UNIQUE ("name"), CONSTRAINT "PK_d3910bff3ae7da327c10c7c161f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "t_users" ("id" SERIAL NOT NULL, "mec" integer NOT NULL, "name" character varying NOT NULL, "role" character varying NOT NULL DEFAULT 'consumer', "password_hash" character varying NOT NULL, "refresh_token" character varying, "workplace_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e6e96929d5458970a196ab3145c" UNIQUE ("mec"), CONSTRAINT "PK_45e27b946b7f8cd527fd4fbe658" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_e6e96929d5458970a196ab3145" ON "t_users" ("mec") `,
    );
    await queryRunner.query(
      `CREATE TABLE "t_orders" ("id" SERIAL NOT NULL, "order_type" character varying NOT NULL, "patient_name" character varying NOT NULL, "patient_bed" integer NOT NULL, "status" character varying(12) NOT NULL DEFAULT 'PENDING', "is_closed" boolean NOT NULL DEFAULT false, "obs" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "from_id" integer, "to_id" integer, "ventilator_id" integer, "requested_by_id" integer, "dispatched_by_id" integer, "delivered_by_id" integer, "received_by_id" integer, CONSTRAINT "PK_f11934191df798e6a4a452b02eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_ventilators" ADD CONSTRAINT "FK_0564c8577aa8a9361dfb1804076" FOREIGN KEY ("park_id") REFERENCES "t_wards"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_users" ADD CONSTRAINT "FK_8929d41910d08d7e2128a4a5ba8" FOREIGN KEY ("workplace_id") REFERENCES "t_wards"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" ADD CONSTRAINT "FK_12f6fdf9f0b88cb602229b671d1" FOREIGN KEY ("from_id") REFERENCES "t_wards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" ADD CONSTRAINT "FK_e2312d9b90a9f57dfef51a321fd" FOREIGN KEY ("to_id") REFERENCES "t_wards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" ADD CONSTRAINT "FK_72006fc5153e48d315178d58615" FOREIGN KEY ("ventilator_id") REFERENCES "t_ventilators"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" ADD CONSTRAINT "FK_8cb149624cb40c4cf0d9b12940a" FOREIGN KEY ("requested_by_id") REFERENCES "t_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" ADD CONSTRAINT "FK_07fc7763da77ae038fe75011464" FOREIGN KEY ("dispatched_by_id") REFERENCES "t_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" ADD CONSTRAINT "FK_e767e35ccac59320ce9a86ec333" FOREIGN KEY ("delivered_by_id") REFERENCES "t_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" ADD CONSTRAINT "FK_8ebf0baabce8f1cd68fb529f0e1" FOREIGN KEY ("received_by_id") REFERENCES "t_users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "t_orders" DROP CONSTRAINT "FK_8ebf0baabce8f1cd68fb529f0e1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" DROP CONSTRAINT "FK_e767e35ccac59320ce9a86ec333"`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" DROP CONSTRAINT "FK_07fc7763da77ae038fe75011464"`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" DROP CONSTRAINT "FK_8cb149624cb40c4cf0d9b12940a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" DROP CONSTRAINT "FK_72006fc5153e48d315178d58615"`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" DROP CONSTRAINT "FK_e2312d9b90a9f57dfef51a321fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_orders" DROP CONSTRAINT "FK_12f6fdf9f0b88cb602229b671d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_users" DROP CONSTRAINT "FK_8929d41910d08d7e2128a4a5ba8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "t_ventilators" DROP CONSTRAINT "FK_0564c8577aa8a9361dfb1804076"`,
    );
    await queryRunner.query(`DROP TABLE "t_orders"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_e6e96929d5458970a196ab3145"`,
    );
    await queryRunner.query(`DROP TABLE "t_users"`);
    await queryRunner.query(`DROP TABLE "t_wards"`);
    await queryRunner.query(`DROP TABLE "t_ventilators"`);
  }
}
