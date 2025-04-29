<template>
  <header class="bg-white">
    <nav class="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
      <div class="flex lg:flex-1">
        <RouterLink to="/" class="-m-1.5 p-1.5">
          <span class="sr-only">Go Code</span>
          <img class="h-8 w-auto" src="../assets/Logo_Name_Redux.png" alt="" />
        </RouterLink>
      </div>
      <div class="flex lg:hidden">
        <button type="button" class="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = true">
          <span class="sr-only">Open main menu</span>
          <Bars3Icon class="size-6" aria-hidden="true" />
        </button>
      </div>

      <PopoverGroup class="hidden lg:flex lg:gap-x-6 items-center">
        <template v-if="!isEditor">
          <RouterLink to="/Home" class="text-sm font-semibold text-gray-900">Home</RouterLink>
          <RouterLink to="/Problems" class="text-sm font-semibold text-gray-900">Problems</RouterLink>
          <RouterLink v-if="!isEditor && isAdmin" to="/admin" class="text-sm font-semibold text-gray-900">Admin</RouterLink>
        </template>
        <template v-else>
          <button @click="handleRun" class="text-sm font-semibold text-white bg-green-600 px-4 py-1 rounded-md shadow hover:bg-green-500 transition">Run</button>
          <!--<button @click="handleSubmit" class="text-sm font-semibold text-white bg-green-600 px-4 py-1 rounded-md shadow hover:bg-green-500 transition">Submit</button> -->
          <!--<button @click="handleReset" class="text-sm font-semibold text-white bg-gray-600 px-4 py-1 rounded-md shadow hover:bg-gray-500 transition">Reset</button> -->
        </template>
      </PopoverGroup>

      <div class="hidden lg:flex lg:flex-1 lg:justify-end space-x-4">
        <template v-if="user">
          <Menu as="div" class="relative inline-block text-left">
            <MenuButton class="flex items-center gap-2 text-sm text-gray-700 focus:outline-none">
              <img v-if="user.photoURL" :src="user.photoURL" alt="avatar" class="w-6 h-6 rounded-full object-cover" />
              <UserCircleIcon v-else class="w-6 h-6 text-gray-500" />
              <span class="hidden md:inline">{{ user.displayName || user.email }}</span>
            </MenuButton>

            <transition
              enter-active-class="transition ease-out duration-100"
              enter-from-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-from-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <MenuItems class="absolute right-0 mt-2 w-48 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black/5 focus:outline-none z-50">
                <div class="py-1">
                  <MenuItem>
                    <RouterLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mi perfil</RouterLink>
                  </MenuItem>
                  <MenuItem>
                    <button @click="handleLogout" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50">Cerrar sesión</button>
                  </MenuItem>
                </div>
              </MenuItems>
            </transition>
          </Menu>
        </template>
        <template v-else>
          <RouterLink to="/login" class="text-sm font-semibold text-gray-900">Log in</RouterLink>
          <RouterLink to="/register" class="text-sm font-semibold text-white bg-green-600 px-4 py-1 rounded-md shadow hover:bg-green-500 transition">Sign in</RouterLink>
        </template>
      </div>
    </nav>

    <Dialog class="lg:hidden" @close="mobileMenuOpen = false" :open="mobileMenuOpen">
      <div class="fixed inset-0 z-10" />
      <DialogPanel class="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div class="flex items-center justify-between">
          <a href="#" class="-m-1.5 p-1.5">
            <span class="sr-only">Your Company</span>
            <img class="h-7 w-auto" src="../assets/Logo_Name_Redux.png" alt="" />
          </a>
          <button type="button" class="-m-2.5 rounded-md p-2.5 text-gray-700" @click="mobileMenuOpen = false">
            <span class="sr-only">Close menu</span>
            <XMarkIcon class="size-6" aria-hidden="true" />
          </button>
        </div>
        <div class="mt-6 flow-root">
          <div class="-my-6 divide-y divide-gray-500/10">
            <div class="space-y-2 py-6">
              <RouterLink to="/Home" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50" v-if="!isEditor">Home</RouterLink>
              <RouterLink to="/Problems" class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50" v-if="!isEditor">Problems</RouterLink>
              <RouterLink to="/admin"class="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50" v-if="!isEditor && isAdmin">Admin</RouterLink>
              <template v-if="isEditor">
                <button @click="handleRun" class="w-full text-left block rounded-lg px-3 py-2 text-base font-semibold text-white bg-green-600 hover:bg-green-500 transition">Run</button>
                <!--<button @click="handleSubmit" class="w-full text-left block rounded-lg px-3 py-2 text-base font-semibold text-white bg-green-600 hover:bg-green-500 transition">Submit</button>-->
                <!--<button @click="handleReset" class="w-full text-left block rounded-lg px-3 py-2 text-base font-semibold text-white bg-gray-600 hover:bg-gray-500 transition">Reset</button>-->
              </template>
            </div>
            <div class="py-6">
              <template v-if="user">
                <button @click="handleLogout" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-white bg-red-600 hover:bg-red-500 transition">Logout</button>
              </template>
              <template v-else>
                <RouterLink to="/login" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50">Log in</RouterLink>
                <RouterLink to="/register" class="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50">Sign in</RouterLink>
              </template>
            </div>
          </div>
        </div>
      </DialogPanel>
    </Dialog>
  </header>
</template>

<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from 'vue'
import {
  Dialog,
  DialogPanel,
  Popover,
  PopoverGroup,
  Menu,
  MenuButton,
  MenuItems,
  MenuItem
} from '@headlessui/vue'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import { UserCircleIcon } from '@heroicons/vue/20/solid'
import { useAuth } from '../composables/useAuth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'

const mobileMenuOpen = ref(false)
const route = useRoute()
const router = useRouter()
const isEditor = computed(() => route.path.startsWith('/editor'))
const { user, logout } = useAuth()

const isAdmin = ref(false)

const emit = defineEmits(['run', 'submit', 'reset'])
const handleRun = () => {
  emit('run')
}
const handleSubmit = () => {
  emit('submit')
}
const handleReset = () => {
  emit('reset')
}
const handleLogout = async () => {
  await logout()
  router.push('/')
}

// Verificar si el usuario actual es admin
onMounted(async () => {
  if (user.value) {
    const db = getFirestore()
    const userDoc = await getDoc(doc(db, 'users', user.value.uid))
    if (userDoc.exists() && userDoc.data().role === 'admin') {
      isAdmin.value = true
    }
  }
})
</script>