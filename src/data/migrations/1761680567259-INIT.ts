import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1761680567259 implements MigrationInterface {
  name = 'Initial1761680567259';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "o_auth_account" ("id" SERIAL NOT NULL, "provider" character varying(255) NOT NULL, "providerAccountId" character varying(255) NOT NULL, "userId" integer, CONSTRAINT "PK_c6d5ec585a70cc98562375fafc7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "lastName" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "password" character varying(255), "birthDate" date, "avatar" character varying(100), "isOAuthUser" boolean NOT NULL DEFAULT false, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_role" ("role" character varying(100) NOT NULL, CONSTRAINT "PK_30ddd91a212a9d03669bc1dee74" PRIMARY KEY ("role"))`
    );
    await queryRunner.query(
      `CREATE TABLE "review" ("id" SERIAL NOT NULL, "userId" integer NOT NULL, "vinylId" integer NOT NULL, "rating" integer NOT NULL, "comment" character varying(500), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f905d1bb20a4dce197cc53e193a" UNIQUE ("userId", "vinylId"), CONSTRAINT "PK_2e4299a343a81574217255c00ca" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "author" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, CONSTRAINT "PK_5a0e79799d372fe56f2f3fa6871" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "vinyl" ("id" SERIAL NOT NULL, "name" character varying(100) NOT NULL, "description" character varying(5000) NOT NULL, "image" character varying(255), "price" numeric(10,2) NOT NULL DEFAULT '0', "inStock" integer NOT NULL DEFAULT '0', "ratingAvg" numeric(10,2), "ratingCount" integer, "discogId" integer, "ratingDiscogAvg" numeric(10,2), "ratingDiscogCount" integer, "releaseDate" date, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "outOfStockAt" TIMESTAMP, CONSTRAINT "UQ_2fdb1a1027d921a4b6a13cee6db" UNIQUE ("discogId"), CONSTRAINT "PK_a35da8699c1edabf461555e8737" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "genre" ("name" character varying NOT NULL, CONSTRAINT "PK_dd8cd9e50dd049656e4be1f7e8c" PRIMARY KEY ("name"))`
    );
    await queryRunner.query(
      `CREATE TABLE "style" ("name" character varying NOT NULL, CONSTRAINT "PK_94e29b400febaa2e72ab6fbdf59" PRIMARY KEY ("name"))`
    );
    await queryRunner.query(
      `CREATE TABLE "order_item" ("orderId" integer NOT NULL, "vinylId" integer NOT NULL, "price" numeric(10,2) NOT NULL DEFAULT '0', "quantity" integer NOT NULL DEFAULT '1', "vinylName" character varying(100) NOT NULL, "sumPrice" numeric(10,2) NOT NULL DEFAULT '0', CONSTRAINT "PK_bb923cd191780d56af75e034b36" PRIMARY KEY ("orderId", "vinylId"))`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('pending', 'completed', 'failed')`
    );
    await queryRunner.query(
      `CREATE TABLE "order" ("id" SERIAL NOT NULL, "totalItemCount" integer NOT NULL, "orderTotal" numeric(10,2) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "status" "public"."order_status_enum" NOT NULL DEFAULT 'pending', "userId" integer NOT NULL, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "revoked_token" ("jti" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "expiresAt" TIMESTAMP, CONSTRAINT "PK_51805a32c382d2841b953c16880" PRIMARY KEY ("jti"))`
    );
    await queryRunner.query(
      `CREATE TABLE "user_roles_user_role" ("userId" integer NOT NULL, "userRoleRole" character varying(100) NOT NULL, CONSTRAINT "PK_5792f9ea298c0d6cdf57d4541f6" PRIMARY KEY ("userId", "userRoleRole"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_dc94447a3cabad70eb2c96f5e1" ON "user_roles_user_role" ("userId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b9b183ed03dd777a31a4a61f7e" ON "user_roles_user_role" ("userRoleRole") `
    );
    await queryRunner.query(
      `CREATE TABLE "author_vinyls_vinyl" ("authorId" integer NOT NULL, "vinylId" integer NOT NULL, CONSTRAINT "PK_90b100a41a64efde13a8b89d3d3" PRIMARY KEY ("authorId", "vinylId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_740e866ca457e0e3b50cfee5c7" ON "author_vinyls_vinyl" ("authorId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_5634f063ce3f1c1550276b38d5" ON "author_vinyls_vinyl" ("vinylId") `
    );
    await queryRunner.query(
      `CREATE TABLE "vinyl_authors_author" ("vinylId" integer NOT NULL, "authorId" integer NOT NULL, CONSTRAINT "PK_511b861722f5f7849f7f054f9d1" PRIMARY KEY ("vinylId", "authorId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d7e72765383790f56dd28ff27e" ON "vinyl_authors_author" ("vinylId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_275f9f87ff1207f0faa615c045" ON "vinyl_authors_author" ("authorId") `
    );
    await queryRunner.query(
      `CREATE TABLE "vinyl_styles_style" ("vinylId" integer NOT NULL, "styleName" character varying NOT NULL, CONSTRAINT "PK_b02fdc4bcf81d8822222a140d22" PRIMARY KEY ("vinylId", "styleName"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fcffb399a82d65d4bdd8f81328" ON "vinyl_styles_style" ("vinylId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7bf902cdb5ef94c680c5373d91" ON "vinyl_styles_style" ("styleName") `
    );
    await queryRunner.query(
      `CREATE TABLE "vinyl_genres_genre" ("vinylId" integer NOT NULL, "genreName" character varying NOT NULL, CONSTRAINT "PK_1569c968efb6b3977ad422b9310" PRIMARY KEY ("vinylId", "genreName"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_d43630645d5be269424f3b74c5" ON "vinyl_genres_genre" ("vinylId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6ffdc3aa2eb0afa4333382602a" ON "vinyl_genres_genre" ("genreName") `
    );
    await queryRunner.query(
      `ALTER TABLE "o_auth_account" ADD CONSTRAINT "FK_12d0d6928e2fc57edef813fb7c0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_1337f93918c70837d3cea105d39" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "review" ADD CONSTRAINT "FK_01a98f7acabc7f7ba6d9025bb85" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_4bb1038907f06587bdfc71e1a7b" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" ADD CONSTRAINT "FK_dc94447a3cabad70eb2c96f5e1d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" ADD CONSTRAINT "FK_b9b183ed03dd777a31a4a61f7ee" FOREIGN KEY ("userRoleRole") REFERENCES "user_role"("role") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "author_vinyls_vinyl" ADD CONSTRAINT "FK_740e866ca457e0e3b50cfee5c7b" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "author_vinyls_vinyl" ADD CONSTRAINT "FK_5634f063ce3f1c1550276b38d5a" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_authors_author" ADD CONSTRAINT "FK_d7e72765383790f56dd28ff27e2" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_authors_author" ADD CONSTRAINT "FK_275f9f87ff1207f0faa615c0457" FOREIGN KEY ("authorId") REFERENCES "author"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_styles_style" ADD CONSTRAINT "FK_fcffb399a82d65d4bdd8f81328a" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_styles_style" ADD CONSTRAINT "FK_7bf902cdb5ef94c680c5373d918" FOREIGN KEY ("styleName") REFERENCES "style"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_genres_genre" ADD CONSTRAINT "FK_d43630645d5be269424f3b74c5e" FOREIGN KEY ("vinylId") REFERENCES "vinyl"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_genres_genre" ADD CONSTRAINT "FK_6ffdc3aa2eb0afa4333382602a2" FOREIGN KEY ("genreName") REFERENCES "genre"("name") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vinyl_genres_genre" DROP CONSTRAINT "FK_6ffdc3aa2eb0afa4333382602a2"`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_genres_genre" DROP CONSTRAINT "FK_d43630645d5be269424f3b74c5e"`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_styles_style" DROP CONSTRAINT "FK_7bf902cdb5ef94c680c5373d918"`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_styles_style" DROP CONSTRAINT "FK_fcffb399a82d65d4bdd8f81328a"`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_authors_author" DROP CONSTRAINT "FK_275f9f87ff1207f0faa615c0457"`
    );
    await queryRunner.query(
      `ALTER TABLE "vinyl_authors_author" DROP CONSTRAINT "FK_d7e72765383790f56dd28ff27e2"`
    );
    await queryRunner.query(
      `ALTER TABLE "author_vinyls_vinyl" DROP CONSTRAINT "FK_5634f063ce3f1c1550276b38d5a"`
    );
    await queryRunner.query(
      `ALTER TABLE "author_vinyls_vinyl" DROP CONSTRAINT "FK_740e866ca457e0e3b50cfee5c7b"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" DROP CONSTRAINT "FK_b9b183ed03dd777a31a4a61f7ee"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_roles_user_role" DROP CONSTRAINT "FK_dc94447a3cabad70eb2c96f5e1d"`
    );
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84"`);
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_4bb1038907f06587bdfc71e1a7b"`
    );
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0"`
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_01a98f7acabc7f7ba6d9025bb85"`
    );
    await queryRunner.query(
      `ALTER TABLE "review" DROP CONSTRAINT "FK_1337f93918c70837d3cea105d39"`
    );
    await queryRunner.query(
      `ALTER TABLE "o_auth_account" DROP CONSTRAINT "FK_12d0d6928e2fc57edef813fb7c0"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_6ffdc3aa2eb0afa4333382602a"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d43630645d5be269424f3b74c5"`);
    await queryRunner.query(`DROP TABLE "vinyl_genres_genre"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_7bf902cdb5ef94c680c5373d91"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fcffb399a82d65d4bdd8f81328"`);
    await queryRunner.query(`DROP TABLE "vinyl_styles_style"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_275f9f87ff1207f0faa615c045"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_d7e72765383790f56dd28ff27e"`);
    await queryRunner.query(`DROP TABLE "vinyl_authors_author"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_5634f063ce3f1c1550276b38d5"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_740e866ca457e0e3b50cfee5c7"`);
    await queryRunner.query(`DROP TABLE "author_vinyls_vinyl"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_b9b183ed03dd777a31a4a61f7e"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_dc94447a3cabad70eb2c96f5e1"`);
    await queryRunner.query(`DROP TABLE "user_roles_user_role"`);
    await queryRunner.query(`DROP TABLE "revoked_token"`);
    await queryRunner.query(`DROP TABLE "order"`);
    await queryRunner.query(`DROP TYPE "public"."order_status_enum"`);
    await queryRunner.query(`DROP TABLE "order_item"`);
    await queryRunner.query(`DROP TABLE "style"`);
    await queryRunner.query(`DROP TABLE "genre"`);
    await queryRunner.query(`DROP TABLE "vinyl"`);
    await queryRunner.query(`DROP TABLE "author"`);
    await queryRunner.query(`DROP TABLE "review"`);
    await queryRunner.query(`DROP TABLE "user_role"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "o_auth_account"`);
  }
}
