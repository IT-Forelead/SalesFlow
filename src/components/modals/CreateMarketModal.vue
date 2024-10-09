<script setup>
import CModal from '../common/CModal.vue'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import { useMarketStore } from '../../store/market.store'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import MarketService from '../../services/market.service'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isLoading = ref(false)
const submitData = reactive({
  name: '',
  address: '',
})

const clearSubmitData = () => {
  submitData.name = ''
  submitData.address = ''
}

const closeModal = () => {
  useModalStore().closeCreateMarketModal()
  clearSubmitData()
}

const createMarket = () => {
  if (!submitData.name) {
    toast.warning(t('plsEnterStoreName'))
  } else if (!submitData.address) {
    toast.warning(t('plsEnterStoreAddress'))
  } else {
    isLoading.value = true
    MarketService.createMarket({
      name: submitData.name,
      address: submitData.address,
    }).then(() => {
      toast.success(t('storeSuccessfullyAdded'))
      MarketService.getMarkets()
        .then((res) => {
          useMarketStore().clearStore()
          useMarketStore().setMarkets(res)
        })
      isLoading.value = false
      closeModal()
    }).catch((err) => {
      toast.error(t('errorWhileCreatingStore'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateMarketModal" v-if="useModalStore().isOpenCreateMarketModal"
    @close="closeModal">
    <template v-slot:header>
      {{ $t('addShop') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base font-medium">
              {{ $t('shopName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.name"
              class="bg-slate-100 border-none dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterStoreName')" />
          </div>
          <div class="flex-1">
            <label for="name" class="text-base font-medium">
              {{ $t('shopAddress') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.address"
              class="bg-slate-100 border-none dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterStoreAddress')" />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="bSearchIconutton"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:dark:text-white fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="createMarket()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>