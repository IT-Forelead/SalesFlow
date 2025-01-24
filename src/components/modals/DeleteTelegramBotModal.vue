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
import { useTelegramBot } from '../../store/telegramBots.store.js'
import TelegramBotsService from '../../services/telegramBots.service.js'

const { t } = useI18n()
const isLoading = ref(false)

const telegramBot = useTelegramBot()

const selectedBot = computed(() => telegramBot.selectedBot)

const closeModal = () => {
  useModalStore().closeDeleteTelegramBotModal()
  useTelegramBot().setSelectedBot({})
}

const deleteTelegramBot = () => {
  isLoading.value = true
  if (!selectedBot.value.id) {
    toast.error(t('botNotFound'))
  } else {
    TelegramBotsService.deleteBot(selectedBot.value.id)
      .then(() => {
        toast.success(t('telegramBotDeletedSuccessfully'))
        TelegramBotsService.getTelegramBots()
          .then((res) => {
            useTelegramBot().clearStore()
            useTelegramBot().setBots(res)
          })
        isLoading.value = false
        closeModal()
      })
      .catch(() => {
        toast.error(t('errorWhileDeletingTelegramBot'))
        isLoading.value = false
      })
      .finally(() => {
        isLoading.value = false
      })
  }
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenDeleteTelegramBotModal" v-if="useModalStore().isOpenDeleteTelegramBotModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('deleteTelegramBot') }}
    </template>
    <template v-slot:body>
      <div class="space-y-16">
        <div class="space-y-2">
          <div class="bg-slate-100 dark:text-white dark:bg-slate-700 px-3 text-center py-2 text-lg font-medium rounded-xl">
            {{ $t('botInformation') }}
          </div>
          <ul class="divide-y divide-slate-100">
            <li class="flex items-center dark:text-white justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('type') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedBot.type }}
              </div>
            </li>
            <li class="flex items-center dark:text-white justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('status') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedBot?.active ? $t('active') : $t('inactive') }}
              </div>
            </li>
            <li class="flex items-center dark:text-white justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('description') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedBot?.description }}
              </div>
            </li>
          </ul>
        </div>
        <div class="flex items-center justify-center">
          <div class="border border-red-300 rounded-2xl w-full md:w-2/3 max-w-md md:max-w-lg">
            <div class="flex flex-col items-center space-y-4">
              <WarningCircleBoldIcon class="text-slate-400 dark:text-white w-14 h-14" />
              <h3 class="mb-5 text-lg md:text-xl text-center font-normal dark:text-white text-slate-500">
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
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
                  {{ $t('yesOfCourse') }}
                </button>

                <button v-else @click="deleteTelegramBot()"
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