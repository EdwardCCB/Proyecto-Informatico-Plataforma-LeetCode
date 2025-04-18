export async function runCode({ sourceCode, languageId, stdin, token }) {
    const response = await fetch('http://localhost:4000/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // token de Firebase del usuario autenticado
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin || '',
      }),
    })
  
    const data = await response.json()
    return data
  }  