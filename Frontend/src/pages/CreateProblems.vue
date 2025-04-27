<template>
    <div class="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />
  
      <main class="flex-grow max-w-3xl mx-auto px-4 py-8">
        <h1 class="text-3xl font-bold text-gray-800 mb-6">Crear nuevo problema</h1>
  
        <form @submit.prevent="handleSubmit" class="bg-white p-6 rounded-lg shadow-md space-y-4">
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
  import Navbar from '../components/Navbar.vue'
  import Footer from '../components/Footer.vue'
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'
  import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore'
  import { auth } from '../utils/firebase'
  
  const router = useRouter()
  const db = getFirestore()
  
  const title = ref('')
  const shortDescription = ref('')
  const description = ref('')
  const difficulty = ref('')
  
  async function handleSubmit() {
    try {
      const user = auth.currentUser
      if (!user) {
        alert('Debes iniciar sesión.')
        return
      }
  
      await addDoc(collection(db, 'problems'), {
        title: title.value,
        shortDescription: shortDescription.value,
        description: description.value,
        difficulty: difficulty.value,
        createdAt: serverTimestamp(),
      })
  
      alert('Problema creado exitosamente!')
      router.push('/Problems')
    } catch (error) {
      console.error('Error creando problema:', error)
      alert('No se pudo crear el problema.')
    }
  }
  </script>  