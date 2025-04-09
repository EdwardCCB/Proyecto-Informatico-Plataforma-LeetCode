<template>
  <footer class="bg-white border-t border-gray-200 mt-12">
    <div class="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div class="text-center md:text-left">
          <p class="text-sm text-gray-500">&copy; {{ new Date().getFullYear() }} Plataforma LeetCode UAO. Todos los derechos reservados.</p>
        </div>
        <div class="mt-4 md:mt-0 flex justify-center space-x-6 text-sm text-gray-500">
          <RouterLink to="/" class="hover:text-gray-900">Inicio</RouterLink>
          <RouterLink to="/problems" class="hover:text-gray-900">Problemas</RouterLink>
          <RouterLink to="/login" class="hover:text-gray-900">Iniciar sesión</RouterLink>
          <RouterLink to="/register" class="hover:text-gray-900">Registrarse</RouterLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>