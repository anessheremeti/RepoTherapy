import { Router } from 'express'
import { fetchProfileData } from '../services/github.js'
import { generateRoast } from '../services/ai.js'
import { saveRoast, getRoastById } from '../services/roastStore.js'

const router = Router()

const VALID_STYLES = ['friendly', 'corporate', 'brutal']
// GitHub usernames: alphanumeric + hyphens, 1-39 chars
const USERNAME_RE = /^[a-zA-Z0-9-]{1,39}$/

// POST /api/roast/generate — generate, persist, return with id
router.post('/generate', async (req, res) => {
  const { username, style: rawStyle } = req.body

  if (!username || !USERNAME_RE.test(username)) {
    return res.status(400).json({ error: 'Invalid GitHub username' })
  }

  const style = VALID_STYLES.includes(rawStyle) ? rawStyle : 'brutal'

  try {
    const profileData = await fetchProfileData(username)
    const aiData = await generateRoast(profileData, style)

    const id = saveRoast({
      username,
      style,
      githubData: {
        user: profileData.user,
        repos: profileData.repos,
        topLanguages: profileData.topLanguages,
      },
      aiData,
    })

    res.status(201).json({
      id,
      user: profileData.user,
      repos: profileData.repos,
      topLanguages: profileData.topLanguages,
      ...aiData,
    })
  } catch (err) {
    const status = err.response?.status || 500
    const message = status === 404
      ? 'GitHub user not found'
      : err.message || 'Failed to analyze profile'
    res.status(status).json({ error: message })
  }
})

// GET /api/roast/:id — retrieve an existing roast by its permanent id
router.get('/:id', (req, res) => {
  const roast = getRoastById(req.params.id)
  if (!roast) return res.status(404).json({ error: 'Roast not found' })
  res.json(roast)
})

export default router
