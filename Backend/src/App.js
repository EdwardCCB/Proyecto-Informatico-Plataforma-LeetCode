import express from 'express'
import cors from 'cors'
import admin from 'firebase-admin'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { submitCode } from './services/judge0.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors()) // permite CORS desde cualquier origen
app.use(express.json()) // permite leer JSON en req.body

// Inicializar Firebase Admin
const serviceAccountPath = path.resolve('src/firebase-service-account.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

// Ruta principal para ejecutar código con Judge0
app.post('/api/execute', async (req, res) => {
  const { source_code, language_id, stdin } = req.body

  try {
    const result = await submitCode(source_code, language_id, stdin)
    res.json(result)
  } catch (error) {
    console.error('Error ejecutando código:', error)
    res.status(500).json({ error: 'Error al ejecutar código' })
  }
})

// Iniciar servidor
app.listen(4000, () => {
  console.log('Servidor corriendo en puerto 4000')
})