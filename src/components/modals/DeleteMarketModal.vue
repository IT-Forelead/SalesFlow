<script setup>
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import moment from 'moment'
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue'
import { useMarketStore } from '../../store/market.store'
import { computed } from 'vue'

const marketStore = useMarketStore()

const selectedMarket = computed(() => {
    return marketStore.selectedMarket
})

const closeModal = () => {
    useModalStore().closeDeleteMarketModal()
    useMarketStore().setSelectedMarket({})
}
</script>

<template>
    <CModal :is-open="useModalStore().isOpenDeleteMarketModal" v-if="useModalStore().isOpenDeleteMarketModal"
        @close="closeModal()">
        <template v-slot:header>
            Do'konni o'chirish
        </template>
        <template v-slot:body>
            <div class="space-y-16">
                <div class="space-y-2">
                    <div class="bg-slate-100 px-3 py-2 text-lg font-medium rounded-xl">
                        Do'kon ma'lumotlari
                    </div>
                    <ul class="divide-y divide-slate-100">
                        <li class="flex items-center justify-between py-2 px-3">
                            <div class="text-base">
                                Nomi
                            </div>
                            <div class="text-base font-medium">
                                {{ selectedMarket?.name }}
                            </div>
                        </li>
                        <li class="flex items-center justify-between py-2 px-3">
                            <div class="text-base">
                                Manzili
                            </div>
                            <div class="text-base font-medium">
                                {{ selectedMarket?.address }}
                            </div>
                        </li>
                        <li class="flex items-center justify-between py-2 px-3">
                            <div class="text-base">
                                Yaratilgan vaqti
                            </div>
                            <div class="text-base font-medium">
                                {{ moment(selectedMarket?.createdAt).format('DD/MM/YYYY H:mm') }}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="flex items-center justify-center">
                    <div class="py-8 border border-red-300 rounded-2xl w-full md:w-2/3 max-w-md md:max-w-lg">
                        <div class="flex flex-col items-center space-y-4">
                            <WarningCircleBoldIcon class="text-slate-400 w-14 h-14" />
                            <h3 class="mb-5 text-lg md:text-xl text-center font-normal text-slate-500">
                                Haqiqatdan ushbu do'konni o'chirmoqchimisiz?
                            </h3>
                          <div class="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                            <button type="button" @click="closeModal()"
                                    class="w-full md:w-auto py-2 px-4 rounded-xl text-gray-900 text-base font-medium bg-slate-50 cursor-pointer hover:bg-slate-200 border md:flex-1">
                              Yo'q
                            </button>
                            <button
                              class="w-full md:w-auto py-2 px-4 rounded-xl text-white text-base font-medium bg-red-600 cursor-pointer hover:bg-red-700">
                              Ha, albatta
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