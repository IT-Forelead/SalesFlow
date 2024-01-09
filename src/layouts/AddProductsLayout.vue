<script setup>
import Sidebar from '../components/Sidebar.vue'
import Navbar from '../components/Navbar.vue'
</script>
<template>
  <div class="bg-gray-100 min-h-screen w-full">
    <Sidebar />
    <div class="flex-1 ml-80">
      <Navbar />
      <div class="text-gray-900">
        <router-view v-slot="{ Component }">
          <component :is="Component" />
        </router-view>
      </div>
    </div>
  </div>
</template>
