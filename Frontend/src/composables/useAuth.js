import { ref, onMounted } from 'vue'
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'

const user = ref(null)

export function useAuth() {
  const auth = getAuth()

  onMounted(() => {
    onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const docRef = doc(db, 'users', firebaseUser.uid)
          const docSnap = await getDoc(docRef)

          if (docSnap.exists()) {
            user.value = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              ...docSnap.data(), // Añade displayName, createdAt, role, solvedProblems, etc.
            }
          } else {
            console.warn('No existe perfil en Firestore')
            user.value = firebaseUser
          }
        } catch (error) {
          console.error('Error al cargar perfil Firestore:', error)
          user.value = firebaseUser
        }
      } else {
        user.value = null
      }
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
