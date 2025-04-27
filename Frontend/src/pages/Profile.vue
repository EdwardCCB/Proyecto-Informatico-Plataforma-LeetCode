<template>
  <div class="min-h-screen bg-gray-100">
    <Navbar />

    <main class="max-w-3xl mx-auto p-6">
      <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
        <template v-if="user">
          <img
            v-if="user.photoURL"
            :src="user.photoURL"
            alt="avatar"
            class="w-24 h-24 rounded-full object-cover mb-4"
          />
          <UserCircleIcon v-else class="w-24 h-24 text-gray-400 mb-4" />

          <h2 class="text-2xl font-semibold text-gray-800">
            {{ user.displayName || 'Sin nombre' }}
          </h2>

          <p class="text-sm text-gray-500 mt-2">
            Proveedor: 
            <span v-if="user?.providerId === 'google.com'">Google</span>
            <span v-else-if="user?.providerId === 'github.com'">GitHub</span>
            <span v-else>Correo</span>
          </p>
          <p class="text-sm text-gray-500">
            Cuenta creada: {{ createdAtFormatted }}
          </p>
        </template>

        <template v-else>
          <p class="text-gray-500">Cargando perfil...</p>
        </template>
      </div>

      <div v-if="user" class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Progreso de problemas resueltos</h3>
        <div class="w-full bg-gray-200 rounded-full h-4">
          <div
            class="bg-green-500 h-4 rounded-full text-xs text-white text-center"
            :style="{ width: progressPercent + '%' }"
          >
            {{ progressPercent }}%
          </div>
        </div>
        <p class="text-sm text-gray-600 mt-2">
          Has resuelto {{ solvedProblems.length }} de {{ totalProblems }} problemas
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import { UserCircleIcon } from '@heroicons/vue/20/solid'
import { useAuth } from '../composables/useAuth'
import { computed, ref, onMounted } from 'vue'

const { user } = useAuth()

const createdAtFormatted = computed(() => {
  if (!user.value?.createdAt) return 'Desconocida'
  const date = user.value.createdAt.toDate ? user.value.createdAt.toDate() : new Date(user.value.createdAt)
  return date.toLocaleDateString('es-ES', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })
})

// Simulación de progreso
const totalProblems = ref(20)
const solvedProblems = ref([])

onMounted(() => {
  solvedProblems.value = ['1', '3', '7']
})

const progressPercent = computed(() => {
  if (!totalProblems.value) return 0
  return Math.round((solvedProblems.value.length / totalProblems.value) * 100)
})
</script>