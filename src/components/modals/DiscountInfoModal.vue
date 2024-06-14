<script setup>
import { useModalStore } from '../../store/modal.store'
import Dialog from 'primevue/dialog'
import { useHolidayDiscount } from '../../store/holidayDiscount.store.js'
import { computed, ref, watchEffect } from 'vue'
import JSConfetti from 'js-confetti'
import { useI18n } from 'vue-i18n'
import useMoneyFormatter from '../../mixins/currencyFormatter.js'

const { t } = useI18n()
const discountStore = useHolidayDiscount()
const discount = computed(() => {
  return discountStore.discount
})
const totalPrice = computed(() => {
  return discountStore.totalPrice
})
const jsConfetti = new JSConfetti()
const congratulations = new Audio('/audios/congratulations.mp3')
watchEffect(() => {
  if (useModalStore().isOpenDiscountInfoModal) {
    jsConfetti.addConfetti({
      emojis: ['⚡️', '💥', '✨', '🎉', '🎊', '🎁'],
    })
    congratulations.play()
  }
})
const discountPrice = ref(0)
const calculateDiscountPrice = computed(() => {
  if (discount.value) {
    discountPrice.value = Math.round(totalPrice.value - (totalPrice.value * discount.value.percentage) / 100)
  }
  return discountPrice.value
})
</script>

<template>
  <div id="confetti-container" class="confetti-container"></div>
  <Dialog
    dismissableMask
    modal
    v-model:visible="useModalStore().isOpenDiscountInfoModal"
    :style="{ width: '40%' }"
    pt:root:class="!border-0"
  >
    <template #container>
      <div class="flex flex-col px-8 py-8 gap-6 bg-white animate__animated animate__bounceIn"
           style="border-radius: 12px; position: relative;">
        <h1 class="text-2xl font-bold text-center text-green-500">Tabriklaymiz!!!</h1>
        <h1 class="text-2xl font-bold text-center text-green-500">Siz bayram aksiyamiz g'olibiga aylandingiz!</h1>
        <div class="p-4 flex flex-col justify-center items-center" id="pricing">
          <div class="ring-2 ring-green-500 rounded-3xl w-full p-8 xl:p-10">
            <div class="flex items-center justify-between gap-x-4">
              <h3 id="tier-extended" class="text-green-500 text-3xl font-semibold leading-8 uppercase">{{ $t('discount')
                }}</h3>
              <p class="rounded-full bg-green-600/10 px-3 py-6 text-3xl font-semibold leading-5 text-green-600">
                {{ discount.percentage }} %</p>
            </div>
            <p class="mt-6 flex items-center space-x-4">
              <span class="line-through text-2xl font-sans text-gray-500/70">{{ useMoneyFormatter(totalPrice) }}</span>
              <span class="text-5xl font-bold tracking-tight text-gray-900">{{ useMoneyFormatter(calculateDiscountPrice) }}</span>
            </p>
          </div>
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
}

.fireworks-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

@keyframes firework {
  0% {
    transform: scaleY(0);
    opacity: 1;
  }
  80% {
    transform: scaleY(1);
    opacity: 1;
  }
  100% {
    transform: scaleY(0);
    opacity: 0;
  }
}
</style>
