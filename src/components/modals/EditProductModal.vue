<script setup>
import PhPencilLine from '../../assets/icons/EditIcon.vue'
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'

const closeModal = () => {
  useModalStore().closeEditProductModal()
}
</script>

<template>
  <div>
    <button
      type="button"
      @click="useModalStore().openEditProductModal()"
    >
      <PhPencilLine class="w-6 h-6 text-blue-600 hover:scale-105" />
    </button>
    <CModal
      v-if="useModalStore().isEditProductModalOpen"
      @close=closeModal
    >
      <template v-slot:header>
        Mahsulotni tahrirlash
      </template>
      <template v-slot:body>
        <div class="absolute mt-20 p-4 md:p-5">

        </div>
      </template>
      <template v-slot:footer>
        <CancelButton @click="closeModal"/>
      </template>
    </CModal>
  </div>
</template>

<style scoped>

</style>