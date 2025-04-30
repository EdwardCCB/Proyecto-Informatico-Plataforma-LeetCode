import cors from 'cors'

const allowedOrigins = [
  'https://gocode-70010.web.app',
  'http://localhost:5173'
]

export const corsOptions = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      return callback(null, true)
    } else {
      return callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
})