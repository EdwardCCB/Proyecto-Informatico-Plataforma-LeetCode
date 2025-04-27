<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProblemCard from '../components/ProblemsCard.vue'
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { useAuth } from '../composables/useAuth'

const problems = ref([])
const selectedDifficulty = ref('Todos')
const showAll = ref(false)
const isDeleteMode = ref(false) // modo eliminar
const { user } = useAuth()

// Conexión a Firestore
const db = getFirestore()

// Cargar problemas
onMounted(async () => {
  const res = await getDocs(collection(db, 'problems'))
  problems.value = res.docs.map(doc => ({ id: doc.id, ...doc.data() }))
})

const filters = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Fácil', value: 'Fácil' },
  { label: 'Medio', value: 'Medio' },
  { label: 'Difícil', value: 'Difícil' }
]

const filteredProblems = computed(() => {
  const filtered = selectedDifficulty.value === 'Todos'
    ? problems.value
    : problems.value.filter(p => p.difficulty === selectedDifficulty.value)

  return showAll.value ? filtered : filtered.slice(0, 12)
})

function changeDifficulty(value) {
  selectedDifficulty.value = value
  showAll.value = false
}

function handleShowAll() {
  showAll.value = true
}

const isAdmin = computed(() => {
  return user.value?.role === 'admin'
})

// 👉 Eliminar problema
async function deleteProblem(problemId) {
  if (!confirm('¿Estás seguro de que quieres eliminar este problema?')) return

  try {
    await deleteDoc(doc(db, 'problems', problemId))
    problems.value = problems.value.filter(p => p.id !== problemId)
    alert('Problema eliminado exitosamente')
  } catch (error) {
    console.error('Error al eliminar problema:', error)
    alert('Error eliminando el problema')
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Navbar />

    <main class="flex-grow max-w-5xl mx-auto px-4 py-8">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Lista de problemas</h1>

        <div class="flex items-center gap-2" v-if="isAdmin">
          <button
            @click="$router.push('/CreateProblems')"
            class="bg-green-600 hover:bg-green-500 text-white text-xl w-10 h-10 rounded-full flex items-center justify-center shadow transition"
            title="Agregar problema"
          >
            +
          </button>

          <button
            @click="isDeleteMode = !isDeleteMode"
            class="bg-red-600 hover:bg-red-500 text-white text-xl w-10 h-10 rounded-full flex items-center justify-center shadow transition"
            :title="isDeleteMode ? 'Cancelar eliminar' : 'Eliminar problemas'"
          >
            -
          </button>
        </div>
      </div>

      <!-- Filtro -->
      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="changeDifficulty(filter.value)"
          :class="[ selectedDifficulty.value === filter.value
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100',
            'px-4 py-2 rounded-md border text-sm font-medium transition']"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Lista -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProblemCard
          v-for="problem in filteredProblems"
          :key="problem.id"
          :id="problem.id"
          :title="problem.title"
          :shortDescription="problem.shortDescription"
          :difficulty="problem.difficulty"
          :isDeleteMode="isDeleteMode"
          @delete="deleteProblem"
        />
      </div>

      <!-- Ver más -->
      <div v-if="!showAll && filteredProblems.length >= 12" class="mt-8 text-center">
        <button
          @click="handleShowAll"
          class="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-500 transition"
        >
          Ver más
        </button>
      </div>
    </main>

    <Footer />
  </div>
</template>