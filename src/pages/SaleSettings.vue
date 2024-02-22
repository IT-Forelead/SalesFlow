<script setup>
import Spinners270RingIconVue from '..//assets/icons/Spinners270RingIcon.vue'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const isLoading = ref(false)
const submitData = reactive({
  boundarySale: 0,
  
})

const clearSubmitData = () => {
  submitData.boundarySale = 0
}


const createSaleSettings = () => {
  if (submitData.boundarySale == 0) {
    toast.error("Chegirmani kiriting!")
  } else {
    toast.success("Chegirma yaratildi")
  }
}


</script>

<template>
  <div class="p-8">
    <div class="text-slate-900 text-3xl font-semibold mb-24">Sotuv sozlama</div>
    <div class="flex flex-col p-10 rounded-3xl">
     
      <div class="flex relative items-center space-x-4">
        <div class="flex-1 spaceSearchIcon-y-1">
            <label for="price" class="text-base md:text-lg font-medium">
              Boundary sale
            </label>
            <money3  v-bind="moneyConf" id="price" v-model="submitData.boundarySale"
              class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
            </money3>
          </div>
        <div class="flex-1">
          <button @click="createSaleSettings" class="text-white text-base flex items-center rounded-xl px-4 py-2.5 bg-blue-500 hover:bg-blue-600 absolute bottom-0">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
