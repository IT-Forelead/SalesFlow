<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue-sonner'
import EyeIcon from '../assets/icons/EyeIcon.vue'
import EyeSlashIcon from '../assets/icons/EyeSlashIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import AuthService from '../services/auth.service'
import decodeJwt from '../mixins/utils'
import { useAuthStore } from '../store/auth.store'
import { useI18n } from 'vue-i18n'
import { parseJwt } from '../mixins/utils.js'

const { t } = useI18n()

const isLoading = ref(false)
const hidePassword = ref(true)
const router = useRouter()

const submitData = reactive({
  login: '',
  password: '',
})

const togglePassword = () => (hidePassword.value = !hidePassword.value)

const getRole = (privileges) => {
  switch (true) {
    case
      privileges.includes('create_barcode') &&
      privileges.includes('create_market') &&
      privileges.includes('create_user') &&
      privileges.includes('dashboard') &&
      privileges.includes('update_barcode') &&
      privileges.includes('view_barcodes') &&
      privileges.includes('view_histories') &&
      privileges.includes('view_markets') &&
      privileges.includes('view_orders') &&
      privileges.includes('view_products') &&
      privileges.includes('view_users'):
      return t('admin')
    case
    privileges.includes('create_agent') &&
    privileges.includes('create_history') &&
    privileges.includes('create_order') &&
    privileges.includes('create_product') &&
    privileges.includes('delete_product') &&
    privileges.includes('create_user') &&
    privileges.includes('dashboard') &&
    privileges.includes('find_barcode') &&
    privileges.includes('find_order') &&
    privileges.includes('update_agent') &&
    privileges.includes('update_product') &&
    privileges.includes('update_settings') &&
    privileges.includes('view_agents') &&
    privileges.includes('view_histories') &&
    privileges.includes('view_markets') &&
    privileges.includes('view_orders') &&
    privileges.includes('view_products') &&
    privileges.includes('view_settings') &&
    privileges.includes('view_users'):
      return t('manager')
    case
      privileges.includes('create_history') &&
      privileges.includes('create_order') &&
      privileges.includes('create_product') &&
      privileges.includes('dashboard') &&
      privileges.includes('find_barcode') &&
      privileges.includes('find_order') &&
      privileges.includes('update_product') &&
      privileges.includes('update_settings') &&
      privileges.includes('view_agents') &&
      privileges.includes('view_orders') &&
      privileges.includes('view_products') &&
      privileges.includes('view_settings'):
      return t('cashier')
    default:
      return t('user')
  }
}

const login = () => {
  localStorage.removeItem('session')
  if (!submitData.login) {
    toast.error(t('pleaseEnterYourLogin'))
  } else if (!submitData.password) {
    toast.error(t('pleaseEnterYourPassword'))
  } else {
    isLoading.value = true
    AuthService.login({
      login: submitData.login,
      password: submitData.password,
    }).then((res) => {
      if (res) {
        useAuthStore().setToken(res?.accessToken)
        useAuthStore().setUser(decodeJwt(res?.accessToken))
        isLoading.value = false
        if (localStorage.getItem('session')) {
          setTimeout(() => {
            if (getRole(useAuthStore().user?.privileges) === t('cashier')) {
              router.push('/sales')
            } else {
              router.push('/dashboard')
            }
          }, 100)
        }
      }
    }).catch((err) => {
      toast.error(t('loginOrPasswordIncorrect'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}

onMounted(() => {
  if (localStorage.getItem('session')) {
    if (getRole(parseJwt()?.privileges) === t('cashier')) {
      router.push('/sales')
    } else {
      router.push('/dashboard')
    }
  }
})
</script>

<template>
  <main class="flex items-center h-screen overflow-hidden bg-gray-50 dark:bg-[#0D1117]">
    <div class="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6">
      <router-link to="/">
        <div class="flex items-center justify-center space-x-2">
          <img src="/images/it-forelead.png" alt="logo" class="w-12" />
          <div class="font-bold leading-none text-2xl text-gray-900 dark:text-zinc-200 whitespace-nowrap">
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
        <h1 class="text-center text-2xl font-medium tracking-tight text-gray-900 dark:text-zinc-200">
          {{ $t('signinToSystem') }}
        </h1>
        <p class="mt-3 text-center text-lg text-gray-600 dark:text-white">
          Don’t have an account?
          <router-link to="/sign-up" class="text-blue-500">Sign up</router-link>
          for a free trial.
        </p>
      </div>
      <div
        class="-mx-2 z-[2] mt-10 flex-auto bg-white dark:bg-slate-800 px-4 py-10 shadow-2xl shadow-gray-900/10 dark:shadow-gray-500/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24 rounded-3xl">
        <div class="space-y-6">
          <div>
            <label for="login" class="mb-2 block text-base font-semibold dark:text-zinc-200">
              {{ $t('login') }}
            </label>
            <input v-model="submitData.login" type="text" id="login"
              class="border appearance-none text-sm rounded-lg block w-full p-2.5  bg-white dark:bg-slate-800 border-gray-200 dark:border-[#30363D] placeholder-gray-400 text-gray-900 dark:text-zinc-200 focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
              :placeholder="$t('enterYourLogin')" @keyup.enter="login()">
          </div>
          <div>
            <label for="password" class="mb-2 block text-base font-semibold text-gray-900 dark:text-zinc-200">
              {{ $t('password') }}
            </label>
            <div class="relative">
              <input v-model="submitData.password" id="password" :type="hidePassword ? 'password' : 'text'"
                class="border appearance-none text-sm rounded-lg block w-full p-2.5 bg-white dark:bg-slate-800 border-gray-200 dark:border-[#30363D] placeholder-gray-400 text-gray-900 dark:text-zinc-200 focus:outline-none  focus:ring-blue-500 focus:border-blue-500"
                :placeholder="$t('enterYourPassword')" @keyup.enter="login()">
              <EyeIcon v-if="hidePassword" @click="togglePassword()"
                class="text-gray-500 dark:text-zinc-300 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
              <EyeSlashIcon v-else @click="togglePassword()"
                class="text-gray-500 dark:text-zinc-300 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </div>
        <button v-if="isLoading"
          class="inline-flex items-center justify-center rounded-lg p-2.5 text-base font-semibold bg-blue-600 text-white mt-8 w-full cursor-default"
          type="submit">
          <Spinners270RingIcon
            class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
          <span>
            {{ $t('signin') }}
          </span>
        </button>
        <button v-else @click="login()"
          class="inline-flex items-center justify-center rounded-lg p-2.5 text-base font-semibold bg-blue-500 text-white hover:bg-blue-600 mt-8 w-full cursor-pointer"
          type="submit">
          {{ $t('signin') }}
        </button>
      </div>
    </div>
  </main>
</template>