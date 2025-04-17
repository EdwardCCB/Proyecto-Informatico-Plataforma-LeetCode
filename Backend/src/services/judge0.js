import axios from 'axios'

const JUDGE0_BASE_URL = 'https://judge0-ce.p.rapidapi.com'
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY  // Lo pondremos en el .env

const headers = {
  'Content-Type': 'application/json',
  'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
  'X-RapidAPI-Key': RAPIDAPI_KEY,
}

export const submitCode = async (source_code, language_id, stdin = '') => {
  try {
    const { data } = await axios.post(`${JUDGE0_BASE_URL}/submissions`, {
      source_code,
      language_id,
      stdin,
    }, { headers })

    return data.token
  } catch (err) {
    console.error('Error al enviar código a Judge0:', err)
    throw err
  }
}

export const getSubmissionResult = async (token) => {
  try {
    const { data } = await axios.get(`${JUDGE0_BASE_URL}/submissions/${token}`, {
      headers,
      params: { base64_encoded: 'false', fields: '*' },
    })
    return data
  } catch (err) {
    console.error('Error al obtener resultado:', err)
    throw err
  }
}