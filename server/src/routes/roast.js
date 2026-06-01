import { Router } from 'express'
import { fetchProfileData } from '../services/github.js'
import { generateRoast } from '../services/ai.js'

const router = Router()

const VALID_STYLES = ['friendly', 'corporate', 'brutal']

router.get('/:username', async (req, res) => {
  const { username } = req.params
  const style = VALID_STYLES.includes(req.query.style) ? req.query.style : 'brutal'
  try {
    const profileData = await fetchProfileData(username)
    const roastData = await generateRoast(profileData, style)
    res.json({
      user: profileData.user,
      repos: profileData.repos,
      topLanguages: profileData.topLanguages,
      ...roastData,
    })
  } catch (err) {
    const status = err.response?.status || 500
    const message =
      status === 404
        ? 'GitHub user not found'
        : err.message || 'Failed to analyze profile'
    res.status(status).json({ error: message })
  }
})

export default router
