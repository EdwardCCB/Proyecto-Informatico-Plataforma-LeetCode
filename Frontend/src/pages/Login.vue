<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Navbar />

    <main class="flex-grow flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Iniciar sesión</h2>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input
              type="email"
              v-model="email"
              required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              v-model="password"
              required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 transition"
          >
            Iniciar sesión
          </button>
        </form>

        <div class="mt-6">
          <p class="text-center text-sm text-gray-500 mb-3">O inicia sesión con:</p>
          <div class="flex justify-center gap-4">
            <button @click="signInWithGoogle" class="bg-white border px-4 py-2 rounded-md shadow hover:bg-gray-50">
              Google
            </button>
            <button @click="signInWithGitHub" class="bg-white border px-4 py-2 rounded-md shadow hover:bg-gray-50">
              GitHub
            </button>
          </div>
        </div>

        <p class="text-center text-sm text-gray-500 mt-6">
          ¿No tienes cuenta?
          <RouterLink to="/register" class="text-green-600 hover:underline">Regístrate</RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

const email = ref('')
const password = ref('')

function handleLogin() {
  // Aquí irá la lógica de login con Firebase Auth
  alert(`Iniciando sesión con: ${email.value}`)
}

function signInWithGoogle() {
  alert('Autenticación con Google')
}

function signInWithGitHub() {
  alert('Autenticación con GitHub')
}
</script>