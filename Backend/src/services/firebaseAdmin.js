import admin from 'firebase-admin'
import dotenv from 'dotenv'
import fs from 'fs'

dotenv.config()

// Si usas archivo local
const serviceAccount = JSON.parse(fs.readFileSync('../firebase-service-account.json', 'utf-8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin