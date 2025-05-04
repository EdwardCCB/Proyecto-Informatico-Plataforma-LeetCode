import express from 'express'
import admin from 'firebase-admin'
import dotenv from 'dotenv'
import { submitCode } from './services/judge0.js'
import { corsOptions } from './middleware/cors.js'

dotenv.config()

const app = express()

// Middleware
app.use(corsOptions)  // Usamos el middleware de CORS configurado previamente
app.options(/.*/, corsOptions)  // Preflight para todas las rutas
app.use(express.json())  // Parsear el cuerpo de las solicitudes como JSON

// Inicializar Firebase Admin desde variable de entorno
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

// Ruta para ejecutar código con Judge0
app.post('/api/execute', async (req, res) => {
  const { source_code, language_id, ...rest } = req.body

  const results = []
  let i = 1
  let allPassed = true  // Variable para verificar si todas las pruebas pasaron

  while (true) {
    const inputKey = `input${i}`
    const expectedKey = `expectedOutput${i}`

    if (!(inputKey in rest) || !(expectedKey in rest)) break

    const stdin = Array.isArray(rest[inputKey])
      ? rest[inputKey].join(' ')
      : String(rest[inputKey])

    const expected = String(rest[expectedKey]).trim()

    try {
      const result = await submitCode(source_code, language_id, stdin)
      const actual = result.stdout?.trim() || result.stderr || result.compile_output || ''

      const passed = actual === expected

      results.push({
        testCase: i,
        input: stdin,
        expectedOutput: expected,
        actualOutput: actual,
        passed,
      })

      // Si alguna prueba falla, marcamos allPassed como false
      if (!passed) {
        allPassed = false
      }

    } catch (err) {
      results.push({
        testCase: i,
        input: stdin,
        expectedOutput: expected,
        actualOutput: null,
        passed: false,
        error: err.message,
      })
      allPassed = false  // Si hay un error, las pruebas no han pasado
    }

    i++
  }

  res.json({
    results,
    passed: allPassed,  // Enviamos el estado general de si todas las pruebas pasaron
  })
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

// Usamos la variable de entorno PORT si está definida, sino usamos 4000 para desarrollo
const PORT = process.env.PORT || 4000

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`)
})