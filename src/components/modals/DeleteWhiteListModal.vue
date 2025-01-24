<script setup>
import { ref, computed } from 'vue';
import { useModalStore } from '../../store/modal.store.js';
import CModal from '../common/CModal.vue';
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue';
import { toast } from 'vue-sonner';
import { useI18n } from 'vue-i18n';
import Spinners270RingIcon from '@/assets/icons/Spinners270RingIcon.vue';
import { useWhiteListStore } from '../../store/whiteList.store.js';
import WhiteListService from '../../services/whiteList.service.js';


const { t } = useI18n();

const modalStore = useModalStore();
const whiteListStore = useWhiteListStore();
const isLoading = ref(false);
const selectedWhiteList = computed(() => whiteListStore.selectedWhiteList);

const closeModal = () => {
  modalStore.closeDeleteWhiteListModal();
  whiteListStore.setSelectedWhiteList({});
};

const deleteWhiteList = () => {
  isLoading.value = true
  
  WhiteListService.deleteWhiteList(selectedWhiteList.value.id)
  
    .then(() => {
      toast.success(t('clientDeletedSuccessfully'))
      WhiteListService.getWhiteList()
        .then((res) => {
          whiteListStore.clearStore()
          whiteListStore.setWhiteList(res.data)
          whiteListStore.renderkey +=1
        })
        .catch((err) => {
          toast.error(err.message)
        })
      isLoading.value = false
      closeModal()
    }).catch(() => {
      console.log('bbbbbbbbbbb')

      toast.error(t('errorWhileDeletingAgent'))
      isLoading.value = false
      closeModal()
    })
  }

</script>

<template>
  <CModal :is-open="modalStore.isOpenDeleteWhiteListModal" v-if="modalStore.isOpenDeleteWhiteListModal" @close="closeModal()">
    <template v-slot:header>
      {{ $t('deleteWhiteList') }}
    </template>
    <template v-slot:body>
      <div class="space-y-16">
        <div class="space-y-2">
          <div class="bg-slate-100 dark:text-white dark:bg-slate-700 px-3 py-2 text-lg font-medium rounded-xl">
            {{ $t('ipAddress') }}
          </div>
          <ul class="divide-y divide-slate-100">
            <li class="flex items-center dark:text-white justify-between py-2 px-3">
              <div class="text-base">
                {{ $t('nameWhiteList') }}
              </div>
              <div class="text-base font-medium">
                {{ selectedWhiteList?.ipAddress }}
              </div>
            </li>
          </ul>
        </div>
        <div class="flex items-center justify-center">
          <div class="py-8 border border-red-300 rounded-2xl w-full md:w-2/3 max-w-md md:max-w-lg">
            <div class="flex flex-col items-center space-y-4">
              <WarningCircleBoldIcon class="text-slate-400 dark:text-white w-14 h-14" />
              <h3 class="mb-5 text-lg md:text-xl text-center font-normal dark:text-white text-slate-500">
                {{ $t('areYouSureYouWantToDeleteThisInformation') }}
              </h3>
              <div class="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                <button type="button" @click="closeModal()" class="w-full md:w-auto py-2 px-4 rounded-xl text-gray-900 text-base font-medium bg-slate-50 cursor-pointer hover:bg-slate-200 border md:flex-1">
                  {{ $t('no') }}
                </button>
                <button v-if="isLoading"
                  class="inline-flex items-center justify-center w-full md:w-auto py-2 px-4 rounded-xl text-white text-base font-medium bg-red-600 cursor-pointer hover:bg-red-700">
                  <Spinners270RingIcon
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
                  {{ $t('yesOfCourse') }}
                </button>

                <button v-else @click="deleteWhiteList()"
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