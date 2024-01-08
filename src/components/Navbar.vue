<script setup>
import SearchIcon from '../assets/icons/SearchIcon.vue'
import { ref } from 'vue'
import PhGear from '../assets/icons/SettingsIcon.vue'
import PhClockClockwise from '../assets/icons/ClockwiseIcon.vue'



// Define a ref to track the mobile menu state
const isMobileMenuOpen = ref(false);

// Function to toggle the mobile menu
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>

<template>
  <div class="flex items-center justify-between z-10 h-12 px-6 py-4 text-black bg-white sticky-top md:h-24">
    <div class="w-full flex flex-wrap items-center justify-between mx-auto p-4">
        <div class="text-slate-700 text-3xl font-semibold">
        Overview
        </div>
        <div class="flex">
          <div class="relative mr-3 md:mr-0 hidden md:block">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon class="w-5 h-5 text-slate-400"/>
            </div>
            <input type="search"
                   class="bg-slate-100 border-none text-slate-400 text-lg rounded-full block w-full pl-10 p-2 placeholder-slate-400"
                   placeholder="Search for something...">
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped></style>
