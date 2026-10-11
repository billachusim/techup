// Stand-in for supabase-js: an in-memory database with just the query
// builder calls the payment functions use (select/insert/update/delete,
// eq filters, maybeSingle) and auth.getUser.
type Row = Record<string, unknown>;

export interface FakeDb {
  tables: Record<string, Row[]>;
  /** Access token -> signed-in user id. */
  users: Record<string, string>;
  /** Tables whose inserts fail, to test error paths. */
  failInsert?: Set<string>;
}

let db: FakeDb = { tables: {}, users: {} };

export function useFakeDb(next: FakeDb) {
  db = next;
}

class Query implements PromiseLike<{ data: unknown; error: unknown }> {
  private op: "select" | "insert" | "update" | "delete" = "select";
  private filters: [string, unknown][] = [];
  private payload: Row | null = null;

  constructor(private table: string) {}

  private rows() {
    return (db.tables[this.table] ??= []);
  }
  private matches(row: Row) {
    return this.filters.every(([col, val]) => row[col] === val);
  }

  select() {
    return this;
  }
  insert(row: Row) {
    this.op = "insert";
    this.payload = row;
    return this;
  }
  update(patch: Row) {
    this.op = "update";
    this.payload = patch;
    return this;
  }
  delete() {
    this.op = "delete";
    return this;
  }
  eq(col: string, val: unknown) {
    this.filters.push([col, val]);
    return this;
  }
  maybeSingle() {
    const found = this.rows().filter((r) => this.matches(r));
    return Promise.resolve({ data: found[0] ?? null, error: null });
  }

  private run() {
    const rows = this.rows();
    if (this.op === "insert") {
      if (db.failInsert?.has(this.table)) return { data: null, error: { message: "insert failed" } };
      rows.push({ id: `row-${rows.length + 1}`, ...this.payload });
      return { data: null, error: null };
    }
    if (this.op === "update") {
      rows.filter((r) => this.matches(r)).forEach((r) => Object.assign(r, this.payload));
      return { data: null, error: null };
    }
    if (this.op === "delete") {
      db.tables[this.table] = rows.filter((r) => !this.matches(r));
      return { data: null, error: null };
    }
    return { data: rows.filter((r) => this.matches(r)), error: null };
  }

  then<A, B>(
    onfulfilled?: ((value: { data: unknown; error: unknown }) => A | PromiseLike<A>) | null,
    onrejected?: ((reason: unknown) => B | PromiseLike<B>) | null,
  ) {
    return Promise.resolve(this.run()).then(onfulfilled, onrejected);
  }
}

export function createClient() {
  return {
    from: (table: string) => new Query(table),
    auth: {
      getUser: async (token: string) => {
        const id = db.users[token];
        return { data: { user: id ? { id } : null }, error: null };
      },
    },
  };
}

export type SupabaseClient = ReturnType<typeof createClient>;
