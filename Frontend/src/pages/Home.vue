<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import ProblemCard from '../components/ProblemsCard.vue'
import { ref, onMounted } from 'vue'

const problems = ref([])

onMounted(async () => {
  const response = await fetch('/src/data/problems.json')
  const data = await response.json()
  problems.value = getRandomProblems(data, 3)
})

// Función para obtener N problemas aleatorios
function getRandomProblems(array, count) {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Navbar />

    <main class="flex-grow max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Bienvenido a la plataforma</h1>

      <h2 class="text-xl font-semibold text-gray-700 mb-4">Problemas recomendados</h2>

      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <ProblemCard
          v-for="problem in problems"
          :key="problem.id"
          :id="problem.id"
          :title="problem.title"
          :shortDescription="problem.shortDescription"
          :difficulty="problem.difficulty"
        />
      </div>
    </main>

    <Footer />
  </div>
</template>