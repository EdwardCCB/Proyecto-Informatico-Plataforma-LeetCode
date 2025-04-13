<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProblemCard from '../components/ProblemsCard.vue'

// Datos reactivos
const problems = ref([])
const selectedDifficulty = ref('Todos')
const showAll = ref(false)

// Lista de filtros disponibles
const filters = [
  { label: 'Todos', value: 'Todos' },
  { label: 'Fácil', value: 'Fácil' },
  { label: 'Medio', value: 'Medio' },
  { label: 'Difícil', value: 'Difícil' }
]

// Cargar datos
onMounted(async () => {
  const res = await fetch('/src/data/problems.json')
  problems.value = await res.json()
})

// Computed para aplicar filtro y límite
const filteredProblems = computed(() => {
  const filtered = selectedDifficulty.value === 'Todos'
    ? problems.value
    : problems.value.filter(p => p.difficulty === selectedDifficulty.value)

  return showAll.value ? filtered : filtered.slice(0, 12)
})

// Función para cambiar la dificultad
function changeDifficulty(value) {
  selectedDifficulty.value = value;
  showAll.value = false;
}

// Ver más
function handleShowAll() {
  showAll.value = true;
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Navbar />

    <main class="flex-grow max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Lista de problemas</h1>

      <!-- Filtro de dificultad -->
      <div class="mb-6 flex flex-wrap gap-2">
        <button
          v-for="filter in filters"
          :key="filter.value"
          @click="changeDifficulty(filter.value)"
          :class="[
            'px-4 py-2 rounded-md border text-sm font-medium transition',
            selectedDifficulty.value === filter.value
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
          ]"
        >
          {{ filter.label }}
        </button>
      </div>

      <!-- Lista de problemas -->
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProblemCard
          v-for="problem in filteredProblems"
          :key="problem.id"
          :id="problem.id"
          :title="problem.title"
          :description="problem.description"
          :difficulty="problem.difficulty"
        />
      </div>

      <!-- Botón "Ver más" -->
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
