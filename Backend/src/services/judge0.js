import axios from 'axios'

const JUDGE0_BASE_URL = 'https://judge0-ce.p.rapidapi.com'

// Función para crear instancia con la key ya cargada
const createJudge0API = () => {
  const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY
  console.log('RAPIDAPI_KEY (dentro de función):', RAPIDAPI_KEY) // debug

  return axios.create({
    baseURL: JUDGE0_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
      'X-RapidAPI-Key': RAPIDAPI_KEY,
    },
  })
}

// Enviar código a Judge0 y esperar resultado
export const submitCode = async (source_code, language_id, stdin = '') => {
  const api = createJudge0API()

  try {
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
  } catch (err) {
    console.error('Error al enviar código a Judge0:', err.response?.data || err)
    throw err
  }
}

export const getSubmissionResult = async (token) => {
  const api = createJudge0API()

  try {
    const { data } = await api.get(`/submissions/${token}`, {
      params: {
        base64_encoded: 'false',
        fields: '*',
      }
    })
    return data
  } catch (err) {
    console.error('Error al obtener resultado de Judge0:', err.response?.data || err)
    throw err
  }
}