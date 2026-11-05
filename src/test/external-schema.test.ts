// @vitest-environment node
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

const sql = readFileSync(new URL("../../db/schema.sql", import.meta.url), "utf8");
const tarotSql = readFileSync(new URL("../../db/tarot.sql", import.meta.url), "utf8");
const alice = "00000000-0000-4000-8000-000000000001";
const bob = "00000000-0000-4000-8000-000000000002";
let db: PGlite;

describe("external backend schema", () => {
  beforeAll(async () => {
    db = new PGlite();
    await db.exec(`
      create role anon; create role authenticated; create role service_role bypassrls;
      create schema auth;
      create table auth.users (id uuid primary key, raw_user_meta_data jsonb default '{}');
      create function auth.uid() returns uuid language sql stable as
        $$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
      grant usage on schema auth to anon, authenticated, service_role;
      insert into auth.users values ('${alice}', '{"display_name":"Alice","avatar_url":"https://example.org/alice.jpg"}');
    `);
    await db.exec(sql);
  }, 30000);

  afterAll(async () => { await db?.close(); });

  it("backfills the existing account's display name and avatar", async () => {
    const result = await db.query("select display_name, avatar_url from public.profiles where id = $1", [alice]);
    expect(result.rows).toEqual([{ display_name: "Alice", avatar_url: "https://example.org/alice.jpg" }]);
  });

  it("automatically creates a basic profile for a new signup", async () => {
    await db.query("insert into auth.users (id, raw_user_meta_data) values ($1, $2)", [bob, { full_name: "Bob" }]);
    const result = await db.query("select display_name, avatar_url from public.profiles where id = $1", [bob]);
    expect(result.rows).toEqual([{ display_name: "Bob", avatar_url: null }]);
  });

  it("can be run again without losing profiles or duplicating the deck", async () => {
    await db.exec(sql);
    const result = await db.query<{ profiles: number; cards: number }>("select (select count(*)::int from public.profiles) profiles, (select count(*)::int from public.cards) cards");
    expect(result.rows).toEqual([{ profiles: 2, cards: 36 }]);
  });

  it("lets a signed-in user read and update only their own profile", async () => {
    await db.exec(`set role authenticated; set request.jwt.claim.sub = '${alice}';`);
    try {
      expect((await db.query("select id from public.profiles")).rows).toEqual([{ id: alice }]);
      expect((await db.query("update public.profiles set display_name = 'Not Bob' where id = $1 returning id", [bob])).rows).toEqual([]);
      expect((await db.query("update public.profiles set display_name = 'Alice Updated' where id = $1 returning display_name", [alice])).rows).toEqual([{ display_name: "Alice Updated" }]);
    } finally { await db.exec("reset role;"); }
  });

  it("blocks anonymous access to profiles", async () => {
    await db.exec("set role anon;");
    try { await expect(db.query("select * from public.profiles")).rejects.toThrow(/permission denied/); }
    finally { await db.exec("reset role;"); }
  });

  it("adds 78 tarot records with exact order and preserves all oracle cards on rerun", async () => {
    await db.exec(tarotSql);
    await db.exec(tarotSql);
    expect((await db.query("select deck, count(*)::int as count from public.cards group by deck order by deck")).rows)
      .toEqual([{ deck: "oracle", count: 36 }, { deck: "tarot", count: 78 }]);
    expect((await db.query("select name, sort_order, numeral from public.cards where deck = 'tarot' order by sort_order limit 1")).rows)
      .toEqual([{ name: "The Fool", sort_order: 0, numeral: "0" }]);
  });
});