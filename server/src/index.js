import express from 'express'
import cors from 'cors'
import roastRouter from './routes/roast.js'

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000' }))
app.use(express.json())

app.use('/api/roast', roastRouter)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
