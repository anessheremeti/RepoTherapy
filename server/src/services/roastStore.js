import { randomBytes } from 'crypto'
import db from '../db.js'

// URL-safe random ID — 11 chars gives ~4.7 * 10^19 combinations
const generateId = () => randomBytes(8).toString('base64url').slice(0, 11)

export function saveRoast({ username, style, githubData, aiData }) {
  const id = generateId()
  db.prepare(`
    INSERT INTO roasts (id, username, style, github_data, ai_data)
    VALUES (?, ?, ?, ?, ?)
  `).run(
    id,
    username.toLowerCase(),
    style,
    JSON.stringify(githubData),
    JSON.stringify(aiData),
  )
  return id
}

export function getRoastById(id) {
  const row = db.prepare('SELECT * FROM roasts WHERE id = ?').get(id)
  if (!row) return null
  db.prepare('UPDATE roasts SET view_count = view_count + 1 WHERE id = ?').run(id)
  return deserialize(row)
}

function deserialize(row) {
  return {
    id: row.id,
    username: row.username,
    style: row.style,
    createdAt: row.created_at,
    viewCount: row.view_count,
    ...JSON.parse(row.github_data),
    ...JSON.parse(row.ai_data),
  }
}
