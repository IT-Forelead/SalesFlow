<script setup>
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'

import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useWhiteListStore } from '../../store/whiteList.store.js'
import WhiteListService from '../../services/whiteList.service.js'

const whiteListStore = useWhiteListStore()
const { t } = useI18n()
const isLoading = ref(false)
const selectedWhiteList = computed(() => {
  return whiteListStore.selectedWhiteList
})

const submitData = reactive({
  id: '',
  ipAddress: '',
  isActive: ''
})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.ipAddress = ''
  submitData.isActive = ''
}

const closeModal = () => {
  useModalStore().closeEditWhiteListModal()
  useWhiteListStore().setSelectedWhiteList({})
  clearSubmitData()
}

const updateWhiteList = () => {
  if (!submitData.ipAddress) {
    toast.warning(t('plsEnterWhiteList'))
  } else {
    isLoading.value = true

    WhiteListService.updateWhiteList({
      id: submitData.id,
      ipAddress: submitData.ipAddress,
      isActive: submitData.isActive
    }).then((res) => {

      toast.success(t('whiteListEditedSuccessfully'))
      WhiteListService.getWhiteList()
        .then((res) => {
          whiteListStore.clearStore()
          whiteListStore.setWhiteList(res)
          whiteListStore.renderkey += 1
        })
        .catch((err) => {
          toast.error(err.message)
        })
      isLoading.value = false
      closeModal()
    }).catch(() => {
      toast.error(t('errorWhileEditingWhiteList'))
      isLoading.value = false
      closeModal()
    })
  }
}

watch(
  () => selectedWhiteList.value,
  (data) => {
    if (data && useModalStore().isOpenEditWhiteListModal) {
      submitData.id = data.id;
      submitData.ipAddress = data.ipAddress;
      submitData.isActive = data.isActive;
    }
  },
  { deep: true }
)

</script>
<template>
  <CModal :is-open="useModalStore().isOpenEditWhiteListModal" v-if="useModalStore().isOpenEditWhiteListModal"
    @close="closeModal">
    <template v-slot:header>
      {{ $t('editWhitelist') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="firstname" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('nameWhiteList') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="firstname" type="text" v-model="submitData.ipAddress"
              class="bg-slate-100 border-none text-slate-900 dark:text-white dark:bg-slate-700 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterWhiteListName')" />
          </div>
          <div class="flex items-center space-x-4">
            <div @click="handleIsActive"
              class="flex p-3 space-x-4 items-center border rounded-xl hover:bg-blue-100 dark:bg-slate-700 dark:hover:bg-slate-700 dark:text-slate-100 cursor-pointer w-full">
              <input type="checkbox" id="isActive" v-model="submitData.isActive" class="rounded" />
              <label class="w-fit cursor-pointer" id="isActive">{{ $t('isActive') }}</label>
            </div>

            <div class="flex p-4 space-x-4 items-center w-full">
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="button"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('save') }}
      </button>
      <button v-else @click="updateWhiteList()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('save') }}
      </button>
    </template>
  </CModal>
</template>
