<script setup>
import MonacoEditor from 'monaco-editor-vue3'
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: String,
  language: {
    type: String,
    default: 'cpp',
  }
})

const emit = defineEmits(['update:modelValue'])
const code = ref(props.modelValue || '')

// Emitir cambios al padre cuando el usuario escribe
watch(code, (newValue) => {
  emit('update:modelValue', newValue)
})

// Actualizar el editor si el padre cambia el valor
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== code.value) {
      code.value = newValue
    }
  }
)
</script>

<template>
  <MonacoEditor
    v-model:value="code"
    :language="language"
    theme="vs-white"
    class="h-full w-full"
  />
</template>