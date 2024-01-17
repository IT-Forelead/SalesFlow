<script setup>
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import CancelButton from '../buttons/CancelButton.vue'
import CreateUserButton from '../buttons/CreateUserButton.vue'
import SaveButton from '../buttons/SaveButton.vue'

const closeModal = () => {
  useModalStore().closeCreateUserModal()
}

</script>

<template>
  <div>
    <CreateUserButton @click="useModalStore().openCreateUserModal()" />
    <CModal
      :is-open="useModalStore().isCreateUserModalOpen"
      v-if="useModalStore().isCreateUserModalOpen"
      @close=closeModal
    >
      <template v-slot:header>
        Foydalanuvchi qo'shish
      </template>
      <template v-slot:body>

      </template>
      <template v-slot:footer>
        <SaveButton/>
        <CancelButton @click="closeModal"/>
      </template>
    </CModal>
  </div>
</template>

<style scoped>

</style>