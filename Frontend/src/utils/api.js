export async function runCode({ sourceCode, languageId, stdin, token }) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  try {
    const response = await fetch(`${BACKEND_URL}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin || '',
      }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en la petición:', error);
    return { error: 'Hubo un problema con la conexión al servidor.' };
  }
}