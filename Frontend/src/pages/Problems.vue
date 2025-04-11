<script setup>
import { ref, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProblemCard from '../components/ProblemsCard.vue'

const problems = ref([])
const visibleProblems = ref([])
const showAll = ref(false)

onMounted(async () => {
  const response = await fetch('/src/data/problems.json')
  const data = await response.json()
  problems.value = data
  visibleProblems.value = data.slice(0, 12)
})

function handleShowAll() {
  visibleProblems.value = problems.value
  showAll.value = true
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Navbar />

    <main class="flex-grow max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Lista de problemas</h1>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProblemCard
          v-for="problem in visibleProblems"
          :key="problem.id"
          :id="problem.id"
          :title="problem.title"
          :description="problem.description"
          :difficulty="problem.difficulty"
        />
      </div>

      <!-- Botón "Ver más" -->
      <div v-if="!showAll && problems.length > 12" class="mt-8 text-center">
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