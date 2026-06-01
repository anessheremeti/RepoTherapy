import Database from 'better-sqlite3'
import { existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../data')
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })

const db = new Database(join(DATA_DIR, 'roasts.db'))

// WAL mode: concurrent reads don't block writes
db.pragma('journal_mode = WAL')
db.pragma('synchronous = NORMAL')

db.exec(`
  CREATE TABLE IF NOT EXISTS roasts (
    id          TEXT    PRIMARY KEY,
    username    TEXT    NOT NULL,
    style       TEXT    NOT NULL,
    github_data TEXT    NOT NULL,
    ai_data     TEXT    NOT NULL,
    created_at  INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
    view_count  INTEGER NOT NULL DEFAULT 0
  );

  CREATE INDEX IF NOT EXISTS idx_roasts_lookup
    ON roasts (username, style, created_at DESC);
`)

export default db
