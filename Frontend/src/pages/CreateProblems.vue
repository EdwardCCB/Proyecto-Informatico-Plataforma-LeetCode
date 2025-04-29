<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <Navbar />

    <main class="flex-grow max-w-3xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Crear nuevo problema</h1>

      <form @submit.prevent="createProblem" class="bg-white p-6 rounded-lg shadow-md space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ID del problema (ej: two-sum)</label>
          <input v-model="id" type="text" required class="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
          <input v-model="title" type="text" required class="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción corta</label>
          <input v-model="shortDescription" type="text" required class="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Descripción larga (en Markdown)</label>
          <textarea v-model="description" rows="8" required class="w-full p-2 border rounded-md"></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
          <select v-model="difficulty" required class="w-full p-2 border rounded-md">
            <option disabled value="">Selecciona dificultad</option>
            <option>Fácil</option>
            <option>Medio</option>
            <option>Difícil</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Temas (separados por comas)</label>
          <input v-model="topics" type="text" placeholder="arrays, matemáticas, recursión" class="w-full p-2 border rounded-md" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Salida esperada (expectedOutput)</label>
          <textarea v-model="expectedOutput" rows="4" required class="w-full p-2 border rounded-md" />
        </div>

        <div class="text-center">
          <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition">
            Guardar problema
          </button>
        </div>
      </form>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../utils/firebase'

const title = ref('')
const shortDescription = ref('')
const description = ref('')
const difficulty = ref('')
const topics = ref('')
const expectedOutput = ref('')
const id = ref('')

const router = useRouter()

async function createProblem() {
  if (!id.value || !title.value || !shortDescription.value || !description.value || !expectedOutput.value) {
    alert('Por favor completa todos los campos obligatorios.')
    return
  }

  try {
    const newProblem = {
      id: id.value,
      title: title.value,
      shortDescription: shortDescription.value,
      description: description.value,
      difficulty: difficulty.value,
      topics: topics.value ? topics.value.split(',').map(t => t.trim()) : [],
      expectedOutput: expectedOutput.value,
      createdAt: serverTimestamp(),
    }

    const problemRef = doc(db, 'problems', id.value)
    await setDoc(problemRef, newProblem)

    alert('Problema creado correctamente.')
    router.push('/Problems')
  } catch (err) {
    console.error('Error creando problema:', err.message)
    alert('Error creando el problema.')
  }
}
</script>