<template>
  <div class="min-h-screen flex flex-col bg-gray-100">
    <Navbar />

    <main class="flex-grow max-w-5xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">Panel de Administración</h1>

      <div v-if="!isAdmin" class="text-center text-red-500">
        No tienes permisos para ver esta página.
      </div>

      <div v-else>
        <table class="min-w-full bg-white rounded-md overflow-hidden shadow-md">
          <thead class="bg-gray-200 text-gray-700">
            <tr>
              <th class="px-4 py-2">Nombre</th>
              <th class="px-4 py-2">Email</th>
              <th class="px-4 py-2">Rol</th>
              <th class="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id" class="border-b">
              <td class="px-4 py-2">{{ user.displayName || 'Sin nombre' }}</td>
              <td class="px-4 py-2">{{ user.email }}</td>
              <td class="px-4 py-2">{{ user.role }}</td>
              <td class="px-4 py-2 flex gap-2 items-center">
                <button
                  v-if="user.role !== 'admin'"
                  @click="makeAdmin(user.id)"
                  class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500 transition"
                >
                  Hacer Admin
                </button>
                <span v-else class="text-green-700 font-semibold">Admin</span>
                <button
                  @click="deleteUser(user.id)"
                  class="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-500 transition ml-auto"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
import { ref, computed, watch } from 'vue'
import { getFirestore, collection, doc, updateDoc, onSnapshot } from 'firebase/firestore'
import { useAuth } from '../composables/useAuth'
import { useRouter } from 'vue-router'

const db = getFirestore()
const { user: currentUser } = useAuth()
const users = ref([])
const loadingUsers = ref(true)
const router = useRouter()

// Escuchar cambios de usuarios
onSnapshot(collection(db, 'users'), (snapshot) => {
  users.value = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }))
  loadingUsers.value = false
})

// Computamos si el usuario es admin
const isAdmin = computed(() => {
  if (!currentUser.value || loadingUsers.value) return false
  const foundUser = users.value.find(u => u.id === currentUser.value.uid)
  return foundUser?.role === 'admin'
})

// Redireccionar si no es admin (opcional)
watch(isAdmin, (newVal) => {
  if (!newVal && !loadingUsers.value) {
    console.warn('Acceso denegado, no eres admin.')
    // router.push('/')  // Descomenta si quieres redirigir automáticamente
  }
})

async function makeAdmin(userId) {
  try {
    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, { role: 'admin' })
    alert('Rol actualizado a admin')
  } catch (err) {
    console.error('Error actualizando rol:', err.message)
    alert('No se pudo actualizar el rol.')
  }
}

async function deleteUser(userId) {
  if (!confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

  try {
    await fetch(`http://localhost:4000/api/users/${userId}`, {
      method: 'DELETE',
    })
    alert('Usuario eliminado correctamente')
  } catch (err) {
    console.error('Error eliminando usuario:', err.message)
    alert('No se pudo eliminar el usuario.')
  }
}
</script>