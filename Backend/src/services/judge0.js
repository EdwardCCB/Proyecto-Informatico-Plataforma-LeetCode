import axios from 'axios'

const JUDGE0_BASE_URL = 'https://judge0-ce.p.rapidapi.com'

// Lista de claves
const RAPIDAPI_KEYS = [
  process.env.RAPIDAPI_KEY,
  process.env.RAPIDAPI_KEY2,
  process.env.RAPIDAPI_KEY3
]

// Función para crear instancia con una clave específica
const createJudge0API = (key) => {
  return axios.create({
    baseURL: JUDGE0_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': key,
    },
  })
}

// Intenta una solicitud con varias claves hasta que alguna funcione
const tryWithKeys = async (requestFn) => {
  for (const key of RAPIDAPI_KEYS) {
    const api = createJudge0API(key)
    try {
      return await requestFn(api)
    } catch (err) {
      const status = err?.response?.status
      if (status === 429 || status === 403) {
        console.warn(`Clave ${key.slice(0, 5)}... falló con código ${status}, probando siguiente...`)
        continue
      }
      throw err // Otro error diferente, no intentar con otra clave
    }
  }
  throw new Error('Todas las claves RapidAPI han fallado')
}

// Enviar código
export const submitCode = async (source_code, language_id, stdin = '') => {
  return await tryWithKeys(async (api) => {
    const { data } = await api.post('/submissions', {
      source_code,
      language_id,
      stdin,
    }, {
      params: {
        base64_encoded: 'false',
        wait: 'true',
      }
    })
    return data
  })
}

// Obtener resultado
export const getSubmissionResult = async (token) => {
  return await tryWithKeys(async (api) => {
    const { data } = await api.get(`/submissions/${token}`, {
      params: {
        base64_encoded: 'false',
        fields: '*',
      }
    })
    return data
  })
}
