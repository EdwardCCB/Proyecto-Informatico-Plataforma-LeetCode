<template>
  <div
    class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer relative"
    @click="handleClick"
  >
    <!-- Botón eliminar -->
    <button
      v-if="isDeleteMode"
      @click.stop="handleDelete"
      class="absolute top-2 right-2 bg-red-600 hover:bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow"
      title="Eliminar problema"
    >
      ✖
    </button>

    <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
    <p class="text-sm text-gray-600 mt-2">{{ shortDescription }}</p>
    <span class="inline-block mt-4 px-3 py-1 text-xs font-medium rounded-full" :class="difficultyColor">
      {{ difficulty }}
    </span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { isUserLoggedIn } from '../utils/auth'

const props = defineProps({
  id: String,
  title: String,
  shortDescription: String,
  difficulty: String,
  isDeleteMode: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['delete'])

const router = useRouter()

const difficultyColor = computed(() => {
  return {
    Fácil: 'bg-green-100 text-green-700',
    Medio: 'bg-yellow-100 text-yellow-700',
    Difícil: 'bg-red-100 text-red-700',
  }[props.difficulty] || 'bg-gray-100 text-gray-700'
})

function handleClick() {
  if (props.isDeleteMode) return // No navegar si estamos en modo eliminar
  if (isUserLoggedIn()) {
    router.push(`/editor/${props.id}`)
  } else {
    router.push('/login')
  }
}

function handleDelete() {
  emit('delete', props.id)
}
</script>