<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue'
import { useModalStore } from '../../store/modal.store.js'
import { useProductStore } from '../../store/product.store.js'
import CModal from '../common/CModal.vue'
import { useHolidayDiscount } from '../../store/holidayDiscount.store.js'
import HolidayDiscountService from '../../services/holidayDiscount.service.js'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'

const { t } = useI18n()
const isLoading = ref(false)

const holidayDiscountStore = useHolidayDiscount()

const selectedDiscount = computed(() => {
  return holidayDiscountStore.selectedHolidayDiscount
})

const closeModal = () => {
  useModalStore().closeDeleteHolidayDiscountModal()
  useProductStore().setSelectedProduct({})
}

const deleteHolidayDiscount = () => {
  isLoading.value = true
  if (!selectedDiscount.value.id) {
    toast.error(t('productNotFound'))
  } else {
    HolidayDiscountService.deleteHolidayDiscount(selectedDiscount.value.id)
      .then(() => {
        toast.success(t('holidayDiscountDeletedSuccessfully'))
        HolidayDiscountService.getHolidayDiscounts()
          .then((res) => {
            useHolidayDiscount().clearStore()
            useHolidayDiscount().setHolidayDiscounts(res)
          })
        isLoading.value = false
        closeModal()
      })
      .catch(() => {
        toast.error(t('errorWhileDeletingHolidayDiscount'))
        isLoading.value = false
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenDeleteHolidayDiscountModal" v-if="useModalStore().isOpenDeleteHolidayDiscountModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('deleteHolidayDiscount') }}
    </template>
    <template v-slot:body>
      <div class="space-y-16">
        <div class="space-y-2">
          <div class="bg-slate-100 px-3 text-center py-2 text-lg font-medium rounded-xl">
            {{ $t('productInformation') }}
          </div>
          <ul class="divide-y divide-slate-100">
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('quantity') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedDiscount?.quantity }} {{ $t('piece') }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('percentage') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedDiscount?.percentage }} %
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('from') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedDiscount?.from }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('to') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedDiscount?.to }}
              </div>
            </li>
            <li class="flex items-center justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('used') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedDiscount?.used }} {{ $t('piece') }}
              </div>
            </li>
          </ul>
        </div>
        <div class="flex items-center justify-center">
          <div class="border border-red-300 rounded-2xl w-full md:w-2/3 max-w-md md:max-w-lg">
            <div class="flex flex-col items-center space-y-4">
              <WarningCircleBoldIcon class="dark:text-white w-14 h-14" />
              <h3 class="mb-5 text-lg md:text-xl text-center font-normal text-slate-500">
                {{ $t('areYouSureYouWantToDeleteThisInformation') }}
              </h3>
              <div
                class="flex py-4 flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <button type="button" @click="closeModal()"
                  class="w-full md:w-auto py-2 px-4 rounded-xl text-gray-900 text-base font-medium bg-slate-50 cursor-pointer hover:bg-slate-200 border md:flex-1">
                  {{ $t('no') }}
                </button>

                <button v-if="isLoading"
                        class="inline-flex items-center justify-center w-full md:w-auto py-2 px-4 rounded-xl text-white text-base font-medium bg-red-600 cursor-pointer hover:bg-red-700">
                  <Spinners270RingIcon
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:dark:text-white fill-gray-600 dark:fill-gray-300" />
                  {{ $t('yesOfCourse') }}
                </button>

                <button v-else @click="deleteHolidayDiscount()"
                  class="w-full md:w-auto py-2 px-4 rounded-xl text-white text-base font-medium bg-red-600 cursor-pointer hover:bg-red-700">
                  {{ $t('yesOfCourse') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </CModal>
</template>