import express from 'express'
import admin from 'firebase-admin'
import dotenv from 'dotenv'
import { submitCode } from './services/judge0.js'
import { corsOptions } from './middleware/cors.js'

dotenv.config()

const app = express()

// Middleware
app.use(corsOptions)
//app.options('*', corsOptions);  // Permite las solicitudes OPTIONS para todos los recursos
app.use(express.json())

// Inicializar Firebase Admin desde variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

// Ruta para ejecutar código con Judge0
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

// Nueva ruta para eliminar un usuario
app.delete('/api/delete-user/:uid', async (req, res) => {
  const { uid } = req.params

  try {
    await admin.auth().deleteUser(uid)
    console.log(`Usuario ${uid} eliminado correctamente.`)
    res.status(200).json({ message: 'Usuario eliminado correctamente' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    res.status(500).json({ error: 'Error al eliminar usuario' })
  }
})

// Iniciar servidor
const PORT = process.env.PORT || 4000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})