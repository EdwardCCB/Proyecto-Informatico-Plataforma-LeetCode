<template>
  <div
    class="rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer relative"
    :class="cardClasses"
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

    <!-- Botón editar -->
    <button
      v-if="isDeleteMode"
      @click.stop="handleEdit"
      class="absolute top-2 left-2 bg-blue-600 hover:bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center shadow"
      title="Editar problema"
    >
      ✎
    </button>

    <h3 class="text-xl font-semibold text-gray-800">{{ title }}</h3>
    <p class="text-sm text-gray-600 mt-2">{{ shortDescription }}</p>
    <span
      class="inline-block mt-4 px-3 py-1 text-xs font-medium rounded-full"
      :class="difficultyColor"
    >
      {{ difficulty }}
    </span>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useSolvedProblems } from '../composables/useSolvedProblems'

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

const emit = defineEmits(['delete', 'edit'])
const router = useRouter()
const { solvedProblems } = useSolvedProblems()

const cardClasses = computed(() => {
  return solvedProblems.value.includes(props.id) ? 'bg-green-100' : 'bg-white'
})

const difficultyColor = computed(() => {
  return {
    Fácil: 'bg-green-200 text-green-800',
    Medio: 'bg-yellow-200 text-yellow-800',
    Difícil: 'bg-red-200 text-red-800',
  }[props.difficulty] || 'bg-gray-100 text-gray-700'
})

function handleClick() {
  if (props.isDeleteMode) return
  router.push(`/editor/${props.id}`)
}

function handleDelete() {
  emit('delete', props.id)
}

function handleEdit() {
  emit('edit', props.id)
}
</script>