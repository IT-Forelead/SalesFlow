<script setup>
    import CModal from '../common/CModal.vue'
    import { useModalStore } from '../../store/modal.store.js'
    import CancelButton from '../buttons/CancelButton.vue'

    const closeModal = () => {
        useModalStore().closeCreateMarketModal()
    }
</script>

<template>
    <CModal :is-open="useModalStore().isOpenCreateMarketModal" v-if="useModalStore().isOpenCreateMarketModal"
        @close=closeModal>
        <template v-slot:header>
            Do'kon yaratish
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