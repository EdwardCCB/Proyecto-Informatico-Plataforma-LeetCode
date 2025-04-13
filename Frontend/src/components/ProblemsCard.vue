<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer"
    @click="handleClick"
  >
    <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
    <p class="text-sm text-gray-600 mt-2">{{ description }}</p>
    <span class="inline-block mt-4 px-3 py-1 text-xs font-medium rounded-full" :class="difficultyColor">
      {{ difficulty }}
    </span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'

// Agregamos solo esto:
import { isUserLoggedIn } from '../utils/auth'

const props = defineProps({
  id: String,
  title: String,
  description: String,
  difficulty: String,
})

const router = useRouter()

const difficultyColor = computed(() => {
  return {
    Fácil: 'bg-green-100 text-green-700',
    Medio: 'bg-yellow-100 text-yellow-700',
    Difícil: 'bg-red-100 text-red-700',
  }[props.difficulty] || 'bg-gray-100 text-gray-700'
})

function handleClick() {
  if (isUserLoggedIn()) {
    router.push(`/editor/${props.id}`)
  } else {
    router.push('/login')
  }
}
</script>