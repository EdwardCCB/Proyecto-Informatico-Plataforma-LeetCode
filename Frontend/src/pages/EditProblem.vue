<template>
    <div class="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
  
      <main class="flex-grow max-w-3xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Editar problema</h1>
  
        <form @submit.prevent="updateProblem" class="bg-white p-6 rounded-lg shadow-md space-y-4" v-if="loaded">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">ID (no editable)</label>
            <input v-model="id" type="text" disabled class="w-full p-2 border rounded-md bg-gray-200" />
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
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripción larga (Markdown)</label>
            <textarea v-model="description" rows="8" required class="w-full p-2 border rounded-md" />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Dificultad</label>
            <select v-model="difficulty" required class="w-full p-2 border rounded-md">
              <option>Fácil</option>
              <option>Medio</option>
              <option>Difícil</option>
            </select>
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Temas (separados por comas)</label>
            <input v-model="topics" type="text" class="w-full p-2 border rounded-md" />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Salida esperada 1</label>
            <textarea v-model="expectedOutput1" rows="2" class="w-full p-2 border rounded-md" />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Salida esperada 2</label>
            <textarea v-model="expectedOutput2" rows="2" class="w-full p-2 border rounded-md" />
          </div>
  
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Salida esperada 3</label>
            <textarea v-model="expectedOutput3" rows="2" class="w-full p-2 border rounded-md" />
          </div>
  
          <div class="text-center">
            <button type="submit" class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition">
              Guardar cambios
            </button>
          </div>
        </form>
  
        <p v-else class="text-center text-gray-600">Cargando problema...</p>
      </main>
  
      <Footer />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { doc, getDoc, updateDoc } from 'firebase/firestore'
  import { db } from '../utils/firebase'
  
  const route = useRoute()
  const router = useRouter()
  
  const id = ref('')
  const title = ref('')
  const shortDescription = ref('')
  const description = ref('')
  const difficulty = ref('')
  const topics = ref('')
  const expectedOutput1 = ref('')
  const expectedOutput2 = ref('')
  const expectedOutput3 = ref('')
  const loaded = ref(false)
  
  onMounted(async () => {
    const problemId = route.params.id
    const problemRef = doc(db, 'problems', problemId)
    const docSnap = await getDoc(problemRef)
  
    if (docSnap.exists()) {
      const data = docSnap.data()
      id.value = data.id
      title.value = data.title
      shortDescription.value = data.shortDescription
      description.value = data.description
      difficulty.value = data.difficulty
      topics.value = (data.topics || []).join(', ')
      expectedOutput1.value = data.expectedOutput1 || ''
      expectedOutput2.value = data.expectedOutput2 || ''
      expectedOutput3.value = data.expectedOutput3 || ''
      loaded.value = true
    } else {
      alert('Problema no encontrado.')
      router.push('/Problems')
    }
  })
  
  async function updateProblem() {
    try {
      const problemRef = doc(db, 'problems', id.value)
      await updateDoc(problemRef, {
        title: title.value,
        shortDescription: shortDescription.value,
        description: description.value,
        difficulty: difficulty.value,
        topics: topics.value ? topics.value.split(',').map(t => t.trim()) : [],
        expectedOutput1: expectedOutput1.value,
        expectedOutput2: expectedOutput2.value,
        expectedOutput3: expectedOutput3.value,
      })
  
      alert('Problema actualizado correctamente.')
      router.push('/Problems')
    } catch (err) {
      console.error('Error actualizando problema:', err.message)
      alert('Ocurrió un error al actualizar.')
    }
  }
  </script>  