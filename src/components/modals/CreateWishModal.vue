<script setup>
import { vMaska } from 'maska'
import { reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import EyeIcon from '../../assets/icons/EyeIcon.vue'
import EyeSlashIcon from '../../assets/icons/EyeSlashIcon.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { cleanObjectEmptyFields } from '../../mixins/utils'
// import MarketService from '../../services/market.service.js'
import WishService from '../../services/wish.service.js'
import { useModalStore } from '../../store/modal.store.js'
import { useWishStore } from '../../store/wish.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isLoading = ref(false)
//const markets = ref([])

// const getMarkets = () => {
//   MarketService.getMarkets()
//     .then((res) => {
//       markets.value = res
//     })
// }

const submitForm = reactive({
  name: '',
})

const clearForm = () => {
  submitForm.name = ''
}

const closeModal = () => {
  useModalStore().closeCreateWishModal()
  clearForm()
}

const createWish = () => {
  if (!submitForm.name) {
    toast.warning(t('plsEnterWish'))
  
  } else {
    isLoading.value = true
    console.log(submitForm.name)
    WishService.createWish(
      cleanObjectEmptyFields({
        name: submitForm.name,
      })
    ).then(() => {
      toast.success(t('wishSuccessfullyAdded'))
      isLoading.value = false
      WishService.getWishes()
        .then((res) => {
          useWishStore().clearStore()
          useWishStore().setWishes(res.data)
          useWishStore().renderkey += 1
        })
    }).catch((err) => {
      toast.error(t('errorWhileCreatingWish'))
      isLoading.value = false
    })
    closeModal()
  }
}

// watch(
//   () => useModalStore().isOpenCreateWishModal,
//   (data) => {
//     if (data) {
//       getMarkets()
//     }
//   },
//   { deep: true }
// )
</script>
<template>
  <CModal :is-open="useModalStore().isOpenCreateWishModal" v-if="useModalStore().isOpenCreateWishModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('createWish') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base font-medium">
              {{ $t('name') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitForm.name"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterFirstname')">
          </div>
          
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="bSearchIconutton"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="createWish()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>
<style scoped></style>