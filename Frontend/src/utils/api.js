export async function runCode({ sourceCode, languageId, stdin, token }) {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; // Esto obtiene la URL del backend desde el .env

  const response = await fetch(`${BACKEND_URL}/api/execute`, {
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
  });

  const data = await response.json();
  return data;
}