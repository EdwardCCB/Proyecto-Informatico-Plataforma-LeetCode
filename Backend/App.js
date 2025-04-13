import express from 'express'
import { verifyFirebaseToken } from './middleware/firebaseAuth.js'

const app = express()
app.use(express.json())

app.get('/api/protected', verifyFirebaseToken, (req, res) => {
  res.json({ message: `Hola ${req.user.email}` })
})

app.listen(4000, () => console.log('Servidor corriendo en puerto 4000'))