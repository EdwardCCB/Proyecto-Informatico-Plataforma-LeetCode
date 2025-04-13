<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Navbar />

    <main class="flex-grow flex items-center justify-center px-4">
      <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 class="text-2xl font-bold text-center text-gray-800 mb-6">Crear cuenta</h2>

        <form @submit.prevent="handleRegister" class="space-y-4">
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

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar contraseña</label>
            <input
              type="password"
              v-model="confirmPassword"
              required
              class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <button
            type="submit"
            class="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-500 transition"
          >
            Registrarse
          </button>
        </form>

        <div class="mt-6">
          <p class="text-center text-sm text-gray-500 mb-3">O regístrate con:</p>
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
          ¿Ya tienes cuenta?
          <RouterLink to="/login" class="text-green-600 hover:underline">Inicia sesión</RouterLink>
        </p>
      </div>
    </main>
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import { ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth'
import { auth } from '../utils/firebase'

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const router = useRouter()

// Registro con email y contraseña
async function handleRegister() {
  if (password.value !== confirmPassword.value) {
    alert('Las contraseñas no coinciden')
    return
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    const user = userCredential.user
    const idToken = await user.getIdToken()

    localStorage.setItem('user', 'true')
    router.push('/')
  } catch (err) {
    console.error('Error al registrar:', err.message)
    alert(err.message)
  }
}

// Registro con Google
async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const idToken = await user.getIdToken()

    localStorage.setItem('user', 'true')
    router.push('/')
  } catch (err) {
    console.error('Error con Google:', err.message)
    alert('No se pudo registrar con Google')
  }
}

// Registro con GitHub
async function signInWithGitHub() {
  try {
    const provider = new GithubAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    const idToken = await user.getIdToken()

    localStorage.setItem('user', 'true')
    router.push('/')
  } catch (err) {
    console.error('Error con GitHub:', err.message)
    alert('No se pudo registrar con GitHub')
  }
}
</script>