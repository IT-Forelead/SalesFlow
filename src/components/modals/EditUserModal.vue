<script setup>
import PhPencilLine from '../../assets/icons/EditIcon.vue'
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'

const closeModal = () => {
  useModalStore().closeEditUserModal()
}
</script>

<template>
  <div>
    <button
      type="button"
      @click="useModalStore().openEditUserModal()"
    >
      <PhPencilLine class="w-6 h-6 text-blue-600 hover:scale-105" />
    </button>
    <CModal
      :is-open="useModalStore().isEditUserModalOpen"
      v-if="useModalStore().isEditUserModalOpen"
      @close=closeModal
    >
      <template v-slot:header>
        Foydalanuvchini tahrirlash
      </template>
      <template v-slot:body>
        <div class="flex p-4 md:p-5">

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