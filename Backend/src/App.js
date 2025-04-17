import express from 'express'
import { submitCode, getSubmissionResult } from './services/judge0.js'
import { verifyFirebaseToken } from './middleware/firebaseAuth.js'

const app = express()
app.use(express.json())

app.get('/api/protected', verifyFirebaseToken, (req, res) => {
  res.json({ message: `Hola ${req.user.email}` })
})

app.listen(4000, () => console.log('Servidor corriendo en puerto 4000'))

// Enviar código
app.post('/api/submit', verifyFirebaseToken, async (req, res) => {
  const { source_code, language_id, stdin } = req.body
  try {
    const token = await submitCode(source_code, language_id, stdin)
    res.json({ token })
  } catch {
    res.status(500).json({ error: 'Error al enviar código' })
  }
})

// Obtener resultado
app.get('/api/result/:token', verifyFirebaseToken, async (req, res) => {
  try {
    const result = await getSubmissionResult(req.params.token)
    res.json(result)
  } catch {
    res.status(500).json({ error: 'Error al obtener resultado' })
  }
})
