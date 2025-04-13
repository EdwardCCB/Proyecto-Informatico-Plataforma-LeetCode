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

watch(code, (newValue) => {
  emit('update:modelValue', newValue)
})
</script>

<template>
  <MonacoEditor
    v-model:value="code"
    :language="language"
    theme="vs-white"
    class="h-full w-full"
  />
</template>