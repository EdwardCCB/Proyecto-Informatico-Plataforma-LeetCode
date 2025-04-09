<script setup>
import Navbar from '../components/Navbar.vue'
import Footer from '../components/Footer.vue'
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <Navbar />

    <!-- Contenido principal que crece -->
    <main class="flex-grow p-4">
      <h1 class="text-2xl font-bold">Problems Page</h1>
    </main>

    <Footer />
  </div>
</template>