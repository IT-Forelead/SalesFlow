<script setup>
</script>

<template>
  <div class="flex items-center justify-center h-screen">
    <div class="px-4 lg:py-12">
      <div class="lg:gap-4 lg:flex">
        <div class="flex flex-col items-center justify-center md:py-24 lg:py-32">
          <h1 class="font-bold text-blue-600 text-9xl">404</h1>
          <p class="mb-2 text-2xl font-bold text-center text-gray-800 dark:text-gray-300 md:text-3xl">
            <span class="text-red-500">{{$t('sorry')}}!</span> {{$t('notFound')}}
          </p>
          <router-link to="/"
            class="px-6 py-2 mt-6 text-sm font-semibold text-blue-800 transition bg-blue-100 rounded hover:text-white hover:bg-indigo-500">{{$t('returnToHomePage')}}</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
