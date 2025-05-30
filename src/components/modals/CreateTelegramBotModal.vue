<script setup>
import CModal from '../common/CModal.vue'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { useI18n } from 'vue-i18n'
import TelegramBotsService from '../../services/telegramBots.service.js'
import { useTelegramBot } from '../../store/telegramBots.store.js'

const { t } = useI18n()

const isLoading = ref(false)
const submitData = reactive({
  type: '',
  token: '',
  chatId: undefined,
  description: '',
})

const clearSubmitData = () => {
  submitData.type = ''
  submitData.token = ''
  submitData.chatId = undefined
  submitData.description = ''
}

const closeModal = () => {
  useModalStore().closeCreateTelegramBotModal()
  clearSubmitData()
}

const createTelegramBot = () => {
  if (!submitData.type) {
    toast.warning(t('plsSelectBotType'))
  } else if (!submitData.token) {
    toast.warning(t('plsEnterBotToken'))
  } else {
    isLoading.value = true
    TelegramBotsService.createBot({
      type: submitData.type,
      token: submitData.token,
      chatId: submitData.chatId,
      description: submitData.description,
    }).then(() => {
      toast.success(t('botSuccessfullyAdded'))
      TelegramBotsService.getTelegramBots()
        .then((res) => {
          useTelegramBot().clearStore()
          useTelegramBot().setBots(res)
        })
      isLoading.value = false
      closeModal()
    }).catch(() => {
      toast.error(t('errorWhileCreatingBot'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateTelegramBotModal" v-if="useModalStore().isOpenCreateTelegramBotModal"
          @close="closeModal">
    <template v-slot:header>
      {{ $t('addBot') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="type" class="text-base dark:text-white font-medium">
              {{ $t('botType') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="type" v-model="submitData.type"
                    class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5">
              <option value="" disabled>{{ t('plsSelectBotType') }}</option>
              <option value="admin">Admin</option>
              <option value="agent">Agent</option>
              <option value="status">Status</option>
              <option value="info">Info</option>
            </select>
          </div>
          <div class="flex-1">
            <label for="chatId" class="text-base dark:text-white font-medium">
              {{ $t('chatId') }}
            </label>
            <input id="chatId" type="text" v-model="submitData.chatId"
                   class="bg-slate-100 border-none text-slate-900 dark:bg-slate-700 dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
                   :placeholder="t('enterChatId')" />
          </div>
        </div>
        <div class="flex-1">
          <label for="token" class="text-base dark:text-white font-medium">
            {{ $t('token') }}
            <span class="text-red-500 mr-2">*</span>
          </label>
          <input id="token" type="text" v-model="submitData.token"
                 class="bg-slate-100 border-none text-slate-900 dark:bg-slate-700 dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
                 :placeholder="t('enterBotToken')" />
        </div>
        <div class="flex-1">
          <label for="description" class="text-base dark:text-white font-medium">
            {{ $t('description') }}
          </label>
          <textarea id="description" type="text" v-model="submitData.description"
                 class="bg-slate-100 border-none text-slate-900 dark:bg-slate-700 dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
                 :placeholder="t('enterDescription')" />
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading"
              class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="createTelegramBot()" type="button"
              class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>
