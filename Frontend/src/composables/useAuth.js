import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'

const user = ref(null)

export function useAuth() {
  const auth = getAuth()

  onMounted(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
    })
  })

  const isAuthenticated = () => user.value !== null
  const getUser = () => user.value

  const logout = async () => {
    await signOut(auth)
    user.value = null
    localStorage.removeItem('user')
  }

  return {
    user,
    isAuthenticated,
    getUser,
    logout
  }
}