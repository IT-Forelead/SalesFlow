<script setup>
import { reactive, ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import { useRoute } from 'vue-router'
// import { useSaleStore } from '../store/sale.store'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import OrderService from '../services/order.service'
// import SaleService from '../services/sale.service'

const route = useRoute()
const orderId = route.params.orderId
//const orderId = "f5ab3819-c5ff-4645-a9ef-aa1455d22165"


console.log(orderId)

const isLoading = ref(false)
const isOrderExistsAndNotUsed = ref(false)
const isOrderNotExists = ref(false)
const isOrderAlreadyUsed = ref(false)
const errorText = ref("")

onMounted(() => {
  isOrderNotExists.value = false
  isOrderAlreadyUsed.value = false
  errorText.value = ""
  OrderService.getOrders()
    .then((res) => {
      if (res[0].id != orderId) {
        isOrderNotExists.value = true
      } else if (!res[0].isUsed) {
        isOrderAlreadyUsed.value = true
      } else {
        isOrderExistsAndNotUsed.value = true
      }
   })

});


const submitData = reactive({
  fullname: '',
  phone: '',
})

const clearSubmitData = () => {
  submitData.fullname = ''
  submitData.phone = ''
}

const createSale = () => {
  if (!submitData.fullname) {
    toast.error('Famliya va ismini kiriting!')
  } else if (!submitData.phone) {
    toast.error('Telefon raqamni kiriting!')
  } else {
    isLoading.value = true
    // SaleService.createSale({
    //   fullname: submitData.fullname,
    //   phone: submitData.phone,
    // }).then(() => {
    toast.success("Chegirma qo'shildi!")
    //   SaleService.getSales()
    //     .then((res) => {
    //       useSaleStore().clearStore()
    //       useSaleStore().setSales(res)
    //     })
    isLoading.value = false
    clearSubmitData()
    // }).catch((err) => {
    //   toast.error("Chegirma yaratishda xatolik yuz berdi!")
    //   setTimeout(() => {
    //     isLoading.value = false
    //   }, 3000)
    // })
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
                <span class="text-red-500">{{$t('sorry')}}!</span> {{$t('notFound')}}
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
    <div class="mx-auto flex w-full max-w-2xl flex-col px-4 sm:px-6" v-if="isOrderExistsAndNotUsed">
      <div class="relative mt-12 sm:mt-16 z-[1]">
        <svg viewBox="0 0 1090 1090" aria-hidden="true" fill="none" preserveAspectRatio="none" width="1090" height="1090" class="absolute -top-7 left-1/2 -z-10 h-[788px] -translate-x-1/2 stroke-gray-300/30 dark:stroke-gray-600/30 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:-top-9 sm:h-auto">

        </svg>
        <div class="mt-3 text-center text-lg text-gray-600 dark:text-[#e6edf3]">
          <div  class="font-bold text-lg">Customer info</div>
      </div>
      </div>
      <div class="-mx-2 z-[2] mt-10 flex-auto bg-white dark:bg-[#161B22] px-4 py-10 shadow-2xl shadow-gray-900/10 dark:shadow-gray-500/10 sm:mx-0 sm:flex-none sm:rounded-5xl sm:p-24 rounded-3xl">
        <div class="space-y-6">
          <div>
            <label for="fullname" class="mb-2 block text-base font-semibold text-gray-900 dark:text-[#e6edf3]">
              Familiya Ism
            </label>
            <input v-model="submitData.fullname" type="text" id="fullname" class="border appearance-none text-sm rounded-lg block w-full p-2.5 bg-white dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder='Familiya yoki Ismini kiriting' />
          </div>
          <div>
            <label for="phone" class="mb-2 block text-base font-semibold text-gray-900 dark:text-[#e6edf3]">
              Telefon raqam
            </label>
            <div class="relative">
              <input v-model="submitData.phone" id="phone" class="border appearance-none text-sm rounded-lg block w-full p-2.5 bg-white dark:bg-[#0D1117] border-gray-200 dark:border-[#30363D] placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder='Telefon raqamni qiriting' />
              
            </div>
          </div>
        </div>
        <button v-if="isLoading" class="inline-flex items-center justify-center rounded-lg p-2.5 text-base font-semibold bg-blue-600 text-white mt-8 w-full cursor-default" type="submit">
          <Spinners270RingIcon class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
          <span>
            Yaratish
          </span>
        </button>
        <button v-else @click="createSale()" class="inline-flex items-center justify-center rounded-lg p-2.5 text-base font-semibold bg-blue-500 text-white hover:bg-blue-600 mt-8 w-full cursor-pointer" type="submit">
          Yaratish
        </button>
      </div>
    </div>
  </main>
</template>
