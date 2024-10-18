<script setup>
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import moment from 'moment'
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue'
import { toast } from 'vue-sonner'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useCorporateClientsStore } from '../../store/corporateClients.store.js'
import CorporateClientsService from '../../services/corporateClients.service.js'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'

const { t } = useI18n()

const CorporateClientsStore = useCorporateClientsStore()
const isLoading = ref(false)
const selectedCorporateClient = computed(() => {
    return CorporateClientsStore.selectedClient
})

const closeModal = () => {
    useModalStore().closeDeleteCorporateClientModal()
}

const deleteCorporateClient = () => {
  isLoading.value = true
  console.log(selectedCorporateClient.value.id);
  CorporateClientsService.deleteCorporateClient(selectedCorporateClient.value.id)
    .then(() => {
      toast.success(t('clientDeletedSuccessfully'))
      CorporateClientsService.getCorporateClients(30,1)
        .then((res) => {
          useCorporateClientsStore().clearStore()
          useCorporateClientsStore().setCorporateClients(res)
          useCorporateClientsStore().renderkey += 1
          
        })
        isLoading.value = false
        closeModal()
      
    })
    .catch((err) => {
      toast.error(t('errorWhileDeletingClient'))
      console.log(err)
      isLoading.value = false
    })
    .finally(() => {
      useCorporateClientsStore().clearStore()
      isLoading.value = false
    })
}
</script>

<template>
    <CModal :is-open="useModalStore().isOpenDeleteCorporateClientModal" v-if="useModalStore().isOpenDeleteCorporateClientModal"
        @close="closeModal()">
        <template v-slot:header>
            {{ $t('deleteClient') }}
        </template>
        <template v-slot:body>
            <div class="space-y-16">
                <div class="space-y-2">
                    <div class="bg-slate-100 px-3 py-2 text-lg font-medium rounded-xl">
                        {{ $t('clientInformation') }}
                    </div>
                    <ul class="divide-y divide-slate-100">
                        <li class="flex items-center dark:text-white justify-between py-2 px-3">
                            <div class="text-base">
                                {{ $t('fullName') }}
                            </div>
                            <div class="text-base font-medium">
                                {{ selectedCorporateClient?.customerName }}
                            </div>
                        </li>
                        <li class="flex items-center dark:text-white justify-between py-2 px-3">
                            <div class="text-base">
                                {{ $t('balance') }}
                            </div>
                            <div class="text-base font-medium">
                              {{ selectedCorporateClient?.balance + ' UZS'}} 
                            </div>
                        </li>
                        <li class="flex items-center dark:text-white justify-between py-2 px-3">
                            <div class="text-base">
                                {{ $t('createdAt') }}
                            </div>
                            <div class="text-base font-medium">
                                {{ moment(selectedCorporateClient?.createdAt).format('DD/MM/YYYY H:mm') }}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="flex items-center justify-center">
                    <div class="py-8 border border-red-300 rounded-2xl w-full md:w-2/3 max-w-md md:max-w-lg">
                        <div class="flex flex-col items-center space-y-4">
                            <WarningCircleBoldIcon class="dark:text-white w-14 h-14" />
                            <h3 class="mb-5 text-lg md:text-xl text-center font-normal text-slate-500">
                                {{ $t('areYouSureYouWantToDeleteThisInformation')}}
                            </h3>
                          <div class="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                            <button type="button" @click="closeModal()"
                                    class="w-full md:w-auto py-2 px-4 rounded-xl text-base font-medium bg-slate-50 cursor-pointer hover:bg-slate-200 border md:flex-1">
                                    {{ $t('no') }}
                            </button>

                            <button v-if="isLoading"
                                    class="inline-flex items-center justify-center w-full md:w-auto py-2 px-4 rounded-xl text-white text-base font-medium bg-red-600 cursor-pointer hover:bg-red-700">
                              <Spinners270RingIcon
                                class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
                              {{ $t('yesOfCourse') }}
                            </button>

                            <button v-else @click="deleteCorporateClient"
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