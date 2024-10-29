<script setup>
import { reactive, ref, onMounted } from 'vue'
import { vMaska } from 'maska'
import { toast } from 'vue-sonner'
import { useRoute } from 'vue-router'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import OrderService from '../services/order.service'
import CustomerService from '../services/customer.service'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const phoneRegex = /\+998[1-9][\d]{8}/;

const route = useRoute()
const orderId = ref(route.params.orderId)

const isLoading = ref(false)
const isOrderExists = ref(false)
const isOrderNotExists = ref(false)
const isOrderAlreadyUsed = ref(false)


onMounted(() => {
  isOrderExists.value = false
  OrderService.isOrderExists(orderId.value).then((isExists) => {
    if (isExists) {
      isOrderExists.value = true
    } else {
      isOrderNotExists.value = true
    }
  }).catch((err) => {
    isOrderNotExists.value = true
  })
})

const submitData = reactive({
  fullName: '',
  phone: '',
})

const clearSubmitData = () => {
  submitData.fullName = ''
  submitData.phone = ''
}

const createSale = () => {
  isOrderAlreadyUsed.value = false
  if (!submitData.fullName) {
    toast.warning(t('enterFullName'))
  } else if (!submitData.phone) {
    toast.warning(t('enterPhone'))
  } else if (submitData.phone && !phoneRegex.test(submitData.phone.replace(/([() -])/g, ''))) {
    toast.warning(t('plsEnterValidPhoneNumber'))
  } else {
    isLoading.value = true
    CustomerService.createCustomer({
      orderId: orderId.value,
      fullName: submitData.fullName,
      phone: submitData.phone.replace(/([() -])/g, ''),
    })
      .then(() => {
        toast.success(t('customerAddedSuccessfully'))
        isLoading.value = false
        clearSubmitData()
      })
      .catch((err) => {
        if (err.response.data.includes('exist')) {
          isOrderExists.value = false
          isOrderAlreadyUsed.value = true
        }
        setTimeout(() => {
          isLoading.value = false
        }, 3000)
      })
  }
}
</script>

<template>
  <main class="flex items-center h-screen overflow-hidden bg-gray-50 dark:bg-[#0D1117]">
    <div class="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6" v-if="isOrderNotExists">
      <div class="flex items-center justify-center h-screen">
        <div class="px-4 lg:py-12">
          <div class="lg:gap-4 lg:flex">
            <div class="flex flex-col items-center justify-center md:py-24 lg:py-32">
              <h1 class="font-bold text-blue-600 text-9xl">404</h1>
              <p class="mb-2 text-2xl font-bold text-center text-gray-800 dark:text-gray-300 md:text-3xl">
                <span class="text-red-500">{{ $t('sorry') }}!</span> {{ $t('notFound') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6" v-if="isOrderAlreadyUsed">
      <div class="flex items-center justify-center h-screen">
        <div class="px-4 lg:py-12">
          <div class="lg:gap-4 lg:flex">
            <div class="flex flex-col items-center justify-center md:py-24 lg:py-32">
              <h1 class="font-bold text-blue-600 text-3xl">This order already added!</h1>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6" v-if="isOrderExists ">
      <div class="relative mt-12 sm:mt-16 z-[1]">
        <svg viewBox="0 0 1090 1090" aria-hidden="true" fill="none" preserveAspectRatio="none" width="1090" height="1090" class="absolute -top-7 left-1/2 -z-10 h-[788px] -translate-x-1/2 stroke-gray-300/30 dark:stroke-gray-600/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-top-9 sm:h-auto"></svg>
        <div class="mt-3 text-center text-lg text-gray-600 dark:text-white dark:text-[#e6edf3]">
        </div>
      </div>
      <div class="-mx-2 z-[2] mt-10 flex-auto bg-white dark:bg-slate-600 dark:bg-[#161B22] px-4 py-10 shadow-2xl shadow-gray-900/10 dark:shadow-gray-500/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24 rounded-3xl">
        <div class="space-y-6">
          <div>
            <label for="fullName" class="mb-2 block text-base font-semibold dark:text-zinc-200 dark:text-[#e6edf3]"> {{ $t('fullName')}} </label>
            <input v-model="submitData.fullName" type="text" id="fullName" class="border appearance-none text-sm rounded-lg block w-full p-2.5 dark:bg-slate-600 dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] placeholder-gray-400 dark:text-zinc-200 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" :placeholder="t('enterFullName')" />
          </div>
          <div>
            <label for="phone" class="mb-2 block text-base font-semibold dark:text-zinc-200 dark:text-[#e6edf3]"> {{ $t('phone')}}</label>
            <div class="relative">
              <input v-model="submitData.phone" id="phone" v-maska data-maska="+998(##) ###-##-##" class="border appearance-none text-sm rounded-lg block w-full p-2.5 dark:bg-slate-600 dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] placeholder-gray-400 dark:text-zinc-200 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="+998(00) 000-00-00" />
            </div>
          </div>
        </div>
        <button v-if="isLoading" class="inline-flex items-center justify-center rounded-lg p-2.5 text-base font-semibold bg-blue-600 text-white mt-8 w-full cursor-default" type="submit">
          <Spinners270RingIcon class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
          <span> {{ $t('create') }} </span>
        </button>
        <button v-else @click="createSale()" class="inline-flex items-center justify-center rounded-lg p-2.5 text-base font-semibold bg-blue-500 text-white hover:bg-blue-600 mt-8 w-full cursor-pointer" type="submit">{{ $t('create') }}</button>
      </div>
    </div>
  </main>
</template>
