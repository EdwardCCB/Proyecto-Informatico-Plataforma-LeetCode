<template>
    <div class="min-h-screen bg-gray-100">
      <Navbar />
  
      <main class="max-w-3xl mx-auto p-6">
        <div class="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
          <img
            v-if="user?.photoURL"
            :src="user.photoURL"
            alt="avatar"
            class="w-24 h-24 rounded-full object-cover mb-4"
          />
          <UserCircleIcon v-else class="w-24 h-24 text-gray-400 mb-4" />
  
          <h2 class="text-2xl font-semibold text-gray-800">
            {{ user?.displayName || 'Sin nombre' }}
          </h2>
          <!-- <p class="text-gray-600">{{ user?.email }}</p> -->
          <p class="text-sm text-gray-500 mt-2">
            Proveedor: {{ user?.providerData[0]?.providerId || 'N/A' }}
          </p>
          <p class="text-sm text-gray-500">
            Cuenta creada: {{ createdAtFormatted }}
          </p>
        </div>
  
        <div class="mt-8 bg-white rounded-lg shadow-md p-6">
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
    if (!user.value?.metadata?.creationTime) return 'Desconocida'
    return new Date(user.value.metadata.creationTime).toLocaleDateString('es-ES', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  })
  
  // Simulación de progreso (esto deberías obtenerlo de la base de datos en el futuro)
  const totalProblems = ref(20) // ejemplo fijo
  const solvedProblems = ref([])
  
  onMounted(() => {
    // Simula problemas resueltos (cargar desde backend más adelante)
    solvedProblems.value = ['1', '3', '7'] // ids de problemas resueltos
  })
  
  const progressPercent = computed(() => {
    if (!totalProblems.value) return 0
    return Math.round((solvedProblems.value.length / totalProblems.value) * 100)
  })
  </script>  