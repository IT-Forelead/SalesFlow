<script setup>
import { cleanObjectEmptyFields } from '../../mixins/utils'
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import { useUpcomingProductStore } from '../../store/upcomingProduct.store'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import UpcomingProductService from '../../services/upcomingProduct.service'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const upcomingProductStore = useUpcomingProductStore()

const selectedUpcomingProduct = computed(() => {
  return upcomingProductStore.selectedUpcomingProduct
})

const pageSize = 50
const isLoading = ref(false)

const currentPage = computed(() => {
  return upcomingProductStore.currentPage
})

const submitData = reactive({
  status: '',
  paymentStatus: '',
})

const clearSubmitData = () => {
  useUpcomingProductStore().setSelectedUpcomingProduct({})
  submitData.paymentStatus = ''
  submitData.status = ''
}

const closeModal = () => {
  useModalStore().closeEditUpcomingProductStatusModal()
  clearSubmitData()
}

const editUpcomingProductStatus = () => {
  if (!submitData.paymentStatus) {
    toast.warning(t('plsSelectPaymentStatus'))
  } else if (!submitData.status) {
    toast.warning(t('plsSelectStatus'))
  } else if (!selectedUpcomingProduct.value.id) {
    toast.warning(t('selectedUpcomingProductIsNotAvailable'))
  } else {
    isLoading.value = true
    UpcomingProductService.updateUpcomingProduct(
      cleanObjectEmptyFields({
        id: selectedUpcomingProduct.value.id,
        paymentStatus: submitData.paymentStatus,
        status: submitData.status,
      })
    ).then((res) => {
      toast.success(t('upcomingProductEditedSuccessfully'))
      UpcomingProductService.getUpcomingProducts({ limit: pageSize, page: currentPage.value })
        .then((res) => {
          useUpcomingProductStore().clearStore()
          useUpcomingProductStore().setTotal(res.total)
          useUpcomingProductStore().setUpcomingProducts(res.data)
        })
      closeModal()
      isLoading.value = false
    }).catch((err) => {
      toast.error(t('errorWhileEditingUpcomingProduct'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}

watch(
  () => selectedUpcomingProduct.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
      submitData.paymentStatus = data?.paymentStatus
      submitData.status = data?.status
    }
  },
  { deep: true }
)
</script>

<template>
  <CModal :is-open="useModalStore().isOpenEditUpcomingProductStatusModal"
    v-if="useModalStore().isOpenEditUpcomingProductStatusModal" @close="closeModal()">
    <template v-slot:header>
      {{ $t('editUpcomingProduct') }}
    </template>
    <template v-slot:body>
      <div class="space-y-2 md:space-y-4">
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1 space-y-1">
            <label for="price" class="text-base md:text-lg font-medium">
              {{ $t('paymentStatus') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="default-type" v-model="submitData.paymentStatus"
              class="bg-slate-100 border-none text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
              <option value="" selected>{{ $t('selectStatus') }}</option>
              <option value="paid">{{ $t('paid') }}</option>
              <option value="unpaid">{{ $t('unpaid') }}</option>
            </select>
          </div>
          <div class="flex-1 space-y-1">
            <label for="default-type" class="text-base md:text-lg font-medium">
              {{ $t('status') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="default-type" v-model="submitData.status"
              class="bg-slate-100 border-none text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
              <option value="" selected>{{ $t('selectStatus') }}</option>
              <option value="requested">{{ $t('requested') }}</option>
              <option value="ordered">{{ $t('ordered') }}</option>
              <option value="delivered">{{ $t('delivered') }}</option>
              <option value="cancelled">{{ $t('cancelled') }}</option>
            </select>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('save') }}
      </button>
      <button v-else @click="editUpcomingProductStatus()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('save') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>