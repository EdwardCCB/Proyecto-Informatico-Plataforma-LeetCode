import { ref, watch } from 'vue'
import { doc, getDoc } from 'firebase/firestore'
import { getFirestore } from 'firebase/firestore'
import { useAuth } from './useAuth'

const solvedProblems = ref([])

export function useSolvedProblems() {
  const { user } = useAuth()
  const db = getFirestore()

  async function fetchSolved() {
    if (!user.value) return
    const docRef = doc(db, 'users', user.value.uid)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      solvedProblems.value = docSnap.data().solvedProblems || []
    }
  }

  watch(user, async (newUser) => {
    if (newUser) await fetchSolved()
  }, { immediate: true })

  return { solvedProblems, fetchSolved }
}