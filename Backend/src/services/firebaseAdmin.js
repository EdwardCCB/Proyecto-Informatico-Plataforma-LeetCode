import admin from 'firebase-admin'
import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'

dotenv.config()

const serviceAccountPath = path.resolve('src/firebase-service-account.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf-8'))

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
})

export default admin