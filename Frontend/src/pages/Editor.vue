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

  try {
    const res = await fetch(`${BACKEND_URL}/api/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        source_code: code.value,
        language_id: selectedLanguageId.value,
        stdin: '',
      }),
    })

    const data = await res.json()

    if (data.stderr) {
      output.value = `Error: ${data.stderr}`
    } else if (data.stdout) {
      output.value = data.stdout.trim()

      if (problem.value.expectedOutput && data.stdout.trim() === problem.value.expectedOutput.trim()) {
        resultStatus.value = 'success'
        await markProblemAsSolved()
      } else {
        resultStatus.value = 'fail'
      }
    } else if (data.compile_output) {
      output.value = `Compilación fallida: ${data.compile_output}`
    } else {
      output.value = 'Código ejecutado sin salida.'
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
  output.value = ''
  error.value = ''
  resultStatus.value = null
}
</script>