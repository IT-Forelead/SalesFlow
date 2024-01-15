<script setup>
import PhTrash from '../../assets/icons/TrashIcon.vue'
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import PhWarningCircleBold from '../../assets/icons/WarningCircleBoldIcon.vue'
import CancelButton from '../buttons/CancelButton.vue'
import DeleteButton from '../buttons/DeleteButton.vue'

const closeModal = () => {
  useModalStore().closeDeleteProductModal()
}

</script>

<template>
  <div>
    <button
      type="button"
      @click="useModalStore().openDeleteProductModal()"
    >
      <PhTrash class="flex w-6 h-6 text-red-600 cursor-pointer hover:scale-105" />
    </button>
    <CModal
      v-if="useModalStore().isDeleteProductModalOpen"
      @close=closeModal
    >
      <template v-slot:header>
        Mahsulot o'chirish
      </template>
      <template v-slot:body>
        <div class="absolute w-full top-1/3 p-2 md:p-5">
          <PhWarningCircleBold class="mx-auto mb-4 text-slate-400 w-14 h-14" />
          <h3 class="mb-5 text-lg font-normal text-slate-500">Haqiqatdan ushbu mahsulotni o'chirishni <br> xohlaysizmi?</h3>
        </div>
      </template>
      <template v-slot:footer>
        <DeleteButton />
        <CancelButton @click="closeModal" />
      </template>
    </CModal>
  </div>
</template>

<style scoped>

</style>