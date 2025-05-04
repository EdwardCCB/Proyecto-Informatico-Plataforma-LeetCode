<template>
  <div class="min-h-screen flex flex-col">
    <Navbar @run="handleRun" @submit="handleSubmit" @reset="handleReset" />

    <div class="flex flex-grow overflow-hidden">
      <!-- Sección de descripción -->
      <div class="w-1/2 p-4 overflow-y-auto bg-gray-50 border-r border-gray-300">
        <h1 class="text-2xl font-bold mb-2">{{ problem.title }}</h1>
        <div
          class="text-sm text-gray-800 leading-relaxed space-y-4
                 [&>h1]:text-xl [&>h2]:text-lg [&>h3]:text-base font-semibold
                 [&>code]:bg-gray-100 [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded
                 [&>pre]:bg-gray-100 [&>pre]:p-3 [&>pre]:rounded-md [&>pre]:text-sm [&>pre]:overflow-x-auto
                 [&>ul]:list-disc [&>ul]:pl-6 [&>ol]:list-decimal"
          v-html="renderedDescription"
        ></div>
      </div>

      <!-- Sección del editor -->
      <div class="w-1/2 flex flex-col">
        <div class="bg-white p-2 border-b border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-1">Lenguaje</label>
          <select v-model="selectedLanguageId" class="p-2 border rounded bg-white text-black w-full">
            <option v-for="lang in languages" :key="lang.id" :value="lang.id">
              {{ lang.name }}
            </option>
          </select>
        </div>

        <div class="flex-grow overflow-hidden">
          <CodeEditor v-model="code" :language="editorLanguage" />
        </div>

        <div class="bg-white text-black p-2 h-40 overflow-y-auto">
          <p class="text-green-400 font-mono mb-1">Testcase:</p>
          <pre>{{ output }}</pre>
          <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
          <div v-if="resultStatus === 'success'" class="text-green-600 font-semibold">✅ Tu solución es correcta</div>
          <div v-else-if="resultStatus === 'fail'" class="text-red-600 font-semibold">❌ La salida no es la esperada</div>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import CodeEditor from '../components/CodeEditor.vue'
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { marked } from 'marked'
import { useSolvedProblems } from '../composables/useSolvedProblems'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

const languages = [
  { id: 54, name: 'C++ (GCC 9.2.0)', editorLang: 'cpp' },
  { id: 62, name: 'Java (OpenJDK 13)', editorLang: 'java' },
  { id: 71, name: 'Python (3.8.1)', editorLang: 'python' },
  { id: 63, name: 'JavaScript (Node.js 12.14.0)', editorLang: 'javascript' },
]

const languageSnippets = {
  54: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Escribe tu código aquí\n    return 0;\n}`,
  62: `public class Main {\n    public static void main(String[] args) {\n        // Escribe tu código aquí\n    }\n}`,
  71: `def main():\n    # Escribe tu código aquí\n    pass\n\nif __name__ == "__main__":\n    main()`,
  63: `function main() {\n    // Escribe tu código aquí\n}\n\nmain();`,
}

const selectedLanguageId = ref(54)
const code = ref('')
const output = ref('')
const error = ref('')
const loading = ref(false)
const resultStatus = ref(null)

const editorLanguage = computed(() => {
  const lang = languages.find(l => l.id === selectedLanguageId.value)
  return lang ? lang.editorLang : 'cpp'
})

const route = useRoute()
const problem = ref({})
const { solvedProblems } = useSolvedProblems()

const renderedDescription = computed(() => {
  return marked.parse(problem.value.description || '')
})

onMounted(async () => {
  const problemId = route.params.id
  const docRef = doc(db, 'problems', problemId)

  try {
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      problem.value = docSnap.data()
      code.value = languageSnippets[selectedLanguageId.value] || ''
    } else {
      error.value = 'Problema no encontrado.'
    }
  } catch (err) {
    console.error('Error cargando problema:', err.message)
    error.value = 'Error al cargar problema.'
  }
})

// Este watch actualiza el editor al cambiar el lenguaje
watch(selectedLanguageId, (newLangId) => {
  code.value = languageSnippets[newLangId] || ''
})

async function handleRun() {
  error.value = ''
  output.value = ''
  loading.value = true
  resultStatus.value = null

  const user = getAuth().currentUser
  if (!user) {
    error.value = 'Debes iniciar sesión para ejecutar código.'
    loading.value = false
    return
  }

  const token = await user.getIdToken()
  const testCases = []

  // Recoger todos los pares input / expectedOutput (input1, expectedOutput1, etc.)
  for (let i = 1; i <= 10; i++) {
    const input = problem.value[`input${i}`]
    const expected = problem.value[`expectedOutput${i}`]
    if (input && expected) {
      testCases.push({ input, expected })
    }
  }

  // Si no hay testCases, usar el default (por compatibilidad)
  if (testCases.length === 0 && problem.value.expectedOutput) {
    testCases.push({
      input: '',
      expected: problem.value.expectedOutput
    })
  }

  try {
    let allPassed = true
    let results = []

    for (const { input, expected } of testCases) {
      const res = await fetch(`${BACKEND_URL}/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          source_code: code.value,
          language_id: selectedLanguageId.value,
          stdin: input,
        }),
      })

      const data = await res.json()

      if (data.stderr || data.compile_output) {
        allPassed = false
        results.push(`❌ Entrada: ${input}\n${data.stderr || data.compile_output}`)
        break
      }

      const actualOutput = data.stdout.trim()
      const expectedTrimmed = expected.trim()

      // Verificar si la salida real coincide con la salida esperada
      if (actualOutput !== expectedTrimmed) {
        allPassed = false
        results.push(`❌ Entrada: ${input}\nEsperado: ${expectedTrimmed}\nObtenido: ${actualOutput}`)
        break
      }

      results.push(`✅ Entrada: ${input}\nSalida correcta`)
    }

    // Aquí, asegúrate de solo mostrar el número de pares como salida
    output.value = results.join('\n\n')

    // El estado de éxito o fracaso se basa en si todos los casos pasaron
    resultStatus.value = allPassed ? 'success' : 'fail'

    if (allPassed) {
      await markProblemAsSolved()
    }

  } catch (err) {
    error.value = 'Error ejecutando el código.'
    console.error(err)
  } finally {
    loading.value = false
  }
}

async function markProblemAsSolved() {
  const user = getAuth().currentUser
  if (!user) return

  try {
    const userRef = doc(db, 'users', user.uid)
    await updateDoc(userRef, {
      solvedProblems: arrayUnion(problem.value.id)
    })

    if (!solvedProblems.value.includes(problem.value.id)) {
      solvedProblems.value.push(problem.value.id)
    }

    console.log('Problema marcado como resuelto.')
  } catch (err) {
    console.error('Error al marcar problema como resuelto:', err.message)
  }
}

function handleSubmit() {
  console.log('Submit clicked')
}

function handleReset() {
  code.value = languageSnippets[selectedLanguageId.value] || ''
}
</script>