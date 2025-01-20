<script setup>
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import moment from 'moment'
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue'
import { toast } from 'vue-sonner'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../store/auth.store.js'
import AuthService from '../../services/auth.service.js'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'

const { t } = useI18n()
const AuthStore = useAuthStore()
const isLoading = ref(false)
const selectedIPBan = computed(() => {
    return AuthStore.selectedIPBan
})

const closeModal = () => {
  useModalStore().closeDeleteIPBanModal()
}

const deleteIPBan = () => {
  isLoading.value = true
  console.log(selectedIPBan.value);
  AuthService.deleteIPBan(selectedIPBan.value)
    .then(() => {
      toast.success(t('ipBanDeletedSuccessfully'))
      AuthService.getIPBans()
        .then((res) => {
          useAuthStore().clearStore()
          useAuthStore().setIPBans(res)
          useAuthStore().renderkey += 1
        })
        isLoading.value = false
        closeModal()
    })
    .catch((err) => {
      toast.error(t('errorWhileDeletingIPBan'))
      console.log(err)
      isLoading.value = false
    })
    .finally(() => {
      useAuthStore().clearStore()
      isLoading.value = false
    })
}
</script>

<template>
    <CModal :is-open="useModalStore().isOpenDeleteIPBanModal" v-if="useModalStore().isOpenDeleteIPBanModal"
        @close="closeModal()">
        <template v-slot:header>
            {{ $t('deleteIPBan') }}
        </template>
        <template v-slot:body>
            <div class="space-y-16">
                
                <div class="flex items-center justify-center">
                    <div class="py-8 border border-red-300 rounded-2xl w-full md:w-2/3 max-w-md md:max-w-lg">
                        <div class="flex flex-col items-center space-y-4">
                            <WarningCircleBoldIcon class="text-slate-400 dark:text-white w-14 h-14" />
                            <h3 class="mb-5 text-lg md:text-xl text-center font-normal dark:text-white text-slate-500">
                                {{ $t('areYouSureYouWantToDeleteThisInformation')}}
                            </h3>
                          <div class="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
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

                            <button v-else @click="deleteIPBan"
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

<style scoped></style>