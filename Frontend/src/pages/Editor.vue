<template>
  <div class="min-h-screen flex flex-col">
    <Navbar />

    <div class="flex flex-grow overflow-hidden">
      <!-- Sección de descripción -->
      <div class="w-1/2 p-4 overflow-y-auto bg-gray-50 border-r border-gray-300">
        <h1 class="text-2xl font-bold mb-4">{{ problem.title }}</h1>
        <p class="text-gray-700 whitespace-pre-line">{{ problem.description }}</p>
      </div>

      <!-- Sección del editor -->
      <div class="w-1/2 flex flex-col">
        <div class="flex-grow overflow-hidden">
          <CodeEditor v-model="code" language="cpp" />
        </div>

        <!-- Resultado de ejecución -->
        <div class="bg-white text-black p-2 h-40 overflow-y-auto">
          <p class="text-green-400 font-mono">Testcase:</p>
          <pre>{{ output }}</pre>
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

// Simular carga del problema (deberías conectar con backend o archivo)
const problems = [
  { id: '1', title: 'Two Sum', description: 'Given an array of integers...', code: '// write code here' },
  // otros problemas...
]

const route = useRoute()
const problem = ref({})
const code = ref('')
const output = ref('')

onMounted(() => {
  const found = problems.find(p => p.id === route.params.id)
  if (found) {
    problem.value = found
    code.value = found.code
  }
})
</script>