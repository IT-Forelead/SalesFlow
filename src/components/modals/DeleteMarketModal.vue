<script setup>
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue'
import CancelButton from '../buttons/CancelButton.vue'
import DeleteButton from '../buttons/DeleteButton.vue'
import { useMarketStore } from '../../store/market.store'
import { computed } from 'vue'

const marketStore = useMarketStore()

const selectedMarket = computed(() => {
  return marketStore.selectedMarket
})

const closeModal = () => {
    useModalStore().closeDeleteMarketModal()
}

</script>

<template>
    <CModal :is-open="useModalStore().isOpenDeleteMarketModal" v-if="useModalStore().isOpenDeleteMarketModal"
        @close=closeModal>
        <template v-slot:header>
            Do'konni o'chirish
        </template>
        <template v-slot:body>
            <div class="space-y-4">
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
                                {{ selectedMarket?.createdAt }}
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="py-8 border border-red-300 rounded-2xl">
                    <div class="flex flex-col items-center">
                        <WarningCircleBoldIcon class="mx-auto mb-4 text-slate-400 w-14 h-14" />
                        <h3 class="mb-5 text-lg font-normal text-slate-500">
                            Haqiqatdan ushbu mahsulotni o'chirishni <br>
                            xohlaysizmi?
                        </h3>
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <DeleteButton />
            <CancelButton @click="closeModal" />
        </template>
    </CModal>
</template>

<style scoped></style>