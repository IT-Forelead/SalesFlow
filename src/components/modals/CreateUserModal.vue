<script setup>
import EyeIcon from '../../assets/icons/EyeIcon.vue'
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'

const closeModal = () => {
    useModalStore().closeOrderInfoModal()
}
</script>

<template>
    <CModal :is-open="useModalStore().isOpenOrderInfoModal" v-if="useModalStore().isOpenOrderInfoModal" @close=closeModal>
        <template v-slot:header>
            Sotuv tafsilotlari
        </template>
        <template v-slot:body>
            <div class="flex p-4 md:p-5">

            </div>
        </template>
        <template v-slot:footer>
            <CancelButton @click="closeModal" />
        </template>
    </CModal>
</template>

<style scoped></style>