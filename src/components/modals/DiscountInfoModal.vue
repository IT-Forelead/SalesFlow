<script setup>
import { useModalStore } from '../../store/modal.store'
import Dialog from 'primevue/dialog'
</script>

<template>
  <Dialog
    dismissableMask   modal v-model:visible="useModalStore().isOpenDiscountInfoModal" :style="{ width: '40%' }" pt:root:class="!border-0" pt:mask:class="backdrop-blur-sm">
    <template #container>
      <div class="flex flex-col px-8 py-8 gap-6 bg-white " style="border-radius: 12px;">
        Tabriklaymiz siz --% foizli chegirmaga ega bo'ldingiz.
      </div>
    </template>
  </Dialog>
</template>

<style scoped></style>