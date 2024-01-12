<script setup>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
</script>
<template>
  <div class="bg-slate-100 flex h-screen overflow-hidden">
    <Sidebar />
    <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar />
      <div class="px-4 sm:px-6 lg:px-8 py-8 lg:py-2 w-full max-w-9xl mx-auto">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>
