<script setup>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
</script>
<template>
  <div class=" bg-white dark:bg-slate-600 flex h-screen overflow-hidden">
    <Sidebar />
    <div class="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
      <Navbar />
      <div class="w-full max-w-9xl mx-auto">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>
