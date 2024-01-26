<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import { useOrderStore } from '../../store/order.store';
import { computed } from 'vue';

const selectedOrder = computed(() => {
  return useOrderStore().selectedOrder
})

const closeModal = () => {
  useModalStore().closeOrderInfoModal()
  useOrderStore().setSelectedOrder({})
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenOrderInfoModal" v-if="useModalStore().isOpenOrderInfoModal" @close=closeModal>
    <template v-slot:header>
      Sotuv tafsilotlari
    </template>
    <template v-slot:body>
      <div class="">
        {{ selectedOrder }}
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>

<style scoped></style>