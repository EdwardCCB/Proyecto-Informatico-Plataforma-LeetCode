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
        <!-- Selector de lenguaje -->
        <div class="bg-white p-2 border-b border-gray-200">
          <label class="block text-sm font-medium text-gray-700 mb-1">Lenguaje</label>
          <select v-model="selectedLanguageId" class="p-2 border rounded bg-white text-black w-full">
            <option v-for="lang in languages" :key="lang.id" :value="lang.id">
              {{ lang.name }}
            </option>
          </select>
        </div>

        <!-- Editor -->
        <div class="flex-grow overflow-hidden">
          <CodeEditor v-model="code" :language="editorLanguage" />
        </div>

        <!-- Resultado de ejecución -->
        <div class="bg-white text-black p-2 h-40 overflow-y-auto">
          <p class="text-green-400 font-mono mb-1">Testcase:</p>
          <pre>{{ output }}</pre>
          <div v-if="error" class="text-red-500 mt-2">{{ error }}</div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getAuth } from 'firebase/auth'
import { marked } from 'marked'

// Lenguajes soportados por Judge0 y su nombre para el editor
const languages = [
  { id: 54, name: 'C++ (GCC 9.2.0)', editorLang: 'cpp' },
  { id: 62, name: 'Java (OpenJDK 13)', editorLang: 'java' },
  { id: 71, name: 'Python (3.8.1)', editorLang: 'python' },
  { id: 63, name: 'JavaScript (Node.js 12.14.0)', editorLang: 'javascript' },
]

const languageSnippets = {
  54: `#include <iostream>
using namespace std;

int main() {
    // Escribe tu código aquí
    return 0;
}`,
  62: `public class Main {
    public static void main(String[] args) {
        // Escribe tu código aquí
    }
}`,
  71: `def main():
    # Escribe tu código aquí
    pass

if __name__ == "__main__":
    main()`,
  63: `function main() {
    // Escribe tu código aquí
}

main();`,
}

const selectedLanguageId = ref(54)
const code = ref('')
const output = ref('')
const error = ref('')
const loading = ref(false)

const editorLanguage = computed(() => {
  const lang = languages.find(l => l.id === selectedLanguageId.value)
  return lang ? lang.editorLang : 'cpp'
})

import problemsData from '../data/problems.json'

const route = useRoute()
const problem = ref({})

const renderedDescription = computed(() => {
  return marked.parse(problem.value.description || '')
})

onMounted(() => {
  const found = problemsData.find(p => p.id === route.params.id)
  if (found) {
    problem.value = found
    code.value = languageSnippets[selectedLanguageId.value] || found.code || ''
  }
})

async function handleRun() {
  error.value = ''
  output.value = ''
  loading.value = true

  const user = getAuth().currentUser
  if (!user) {
    error.value = 'Debes iniciar sesión para ejecutar código.'
    loading.value = false
    return
  }

  const token = await user.getIdToken()

  try {
    const res = await fetch('http://localhost:4000/api/execute', {
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
      output.value = data.stdout
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

function handleSubmit() {
  console.log('Submit clicked')
}

function handleReset() {
  code.value = problem.value.code || ''
  output.value = ''
  error.value = ''
}
</script>