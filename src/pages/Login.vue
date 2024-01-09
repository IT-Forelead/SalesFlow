<script setup>
</script>

<template>
  <main class="flex items-center h-screen overflow-hidden bg-gray-50 dark:bg-[#0D1117]">
    <div class="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
      <router-link to="/">
        <div class="flex items-center justify-center space-x-2">
          <img src="/images/it-forelead.png" alt="logo" class="w-12" />
          <div class="font-bold leading-none text-2xl text-gray-900 dark:text-white whitespace-nowrap">
            IT Forelead
          </div>
        </div>
      </router-link>
      <div class="relative mt-12 sm:mt-16 z-[1]">
        <svg viewBox="0 0 1090 1090" aria-hidden="true" fill="none" preserveAspectRatio="none" width="1090" height="1090"
          class="absolute -top-7 left-1/2 -z-10 h-[788px] -translate-x-1/2 stroke-gray-300/30 dark:stroke-gray-600/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-top-9 sm:h-auto">
          <circle cx="545" cy="545" r="544.5"></circle>
          <circle cx="545" cy="545" r="480.5"></circle>
          <circle cx="545" cy="545" r="416.5"></circle>
          <circle cx="545" cy="545" r="352.5"></circle>
        </svg>
        <h1 class="text-center text-2xl font-medium tracking-tight text-gray-900 dark:text-[#e6edf3]">
          Sign in to account
        </h1>
        <p class="mt-3 text-center text-lg text-gray-600 dark:text-[#e6edf3]">
          Don’t have an account?
          <router-link to="/sign-up" class="text-blue-500">Sign up</router-link>
          for a free trial.
        </p>
      </div>
      <div
        class="-mx-4 z-[2] mt-10 flex-auto bg-white dark:bg-[#161B22] px-4 py-10 shadow-2xl shadow-gray-900/10 dark:shadow-gray-500/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24 rounded-xl">
        <div class="space-y-6">
          <div>
            <label for="login" class="mb-2 block text-base font-semibold text-gray-900 dark:text-[#e6edf3]">
              Email address
            </label>
            <input type="email" id="login"
              class="border appearance-none text-sm rounded-lg block w-full p-2.5  bg-white dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your login">
          </div>
          <div>
            <label for="password" class="mb-2 block text-base font-semibold text-gray-900 dark:text-[#e6edf3]">
              Password
            </label>
            <input type="password" id="password"
              class="border appearance-none text-sm rounded-lg block w-full p-2.5 bg-white dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your password">
          </div>
        </div>
        <button class="inline-flex items-center justify-center rounded-lg p-2.5 text-base font-semibold bg-blue-500 text-white hover:bg-blue-600 mt-8 w-full cursor-pointer"
          type="submit">
          Sign in to account
        </button>
      </div>
    </div>
  </main>
</template>