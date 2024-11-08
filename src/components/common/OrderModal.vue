<script setup>
import PhX from '../../assets/icons/XIcon.vue'
import { onMounted, onUnmounted, ref, watch } from 'vue'

const emit = defineEmits(['close'])
const close = () => {
  isClosing.value = true
  setTimeout(() => {
    emit('close')
    isClosing.value = false
  }, 300)
}

const props = defineProps({
  isOpen: Boolean,
  style: String,
  zIndex: Number,
})

const whenPressEsc = (event) => {
  if (event.key === 'Escape') {
    close()
  }
}

const isClosing = ref(false)

const handleBackgroundClick = (event) => {
  if (event.target === event.currentTarget && props.isOpen) {
    close()
  }
}

onMounted(() => {
  window.addEventListener('keydown', whenPressEsc)
})

onUnmounted(() => {
  window.removeEventListener('keydown', whenPressEsc)
})

watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <div v-if="isOpen || isClosing" @click="handleBackgroundClick"
    class="fixed top-0 right-0 bottom-0 left-0 z-40 backdrop-blur-[2px] bg-gray-900/70 flex justify-end"></div>
  <div
    :class="[{ 'slide-in-right': isOpen && !isClosing, 'slide-out-right': isClosing }, 'z-50 dark:bg-slate-800 bg-white fixed right-0  md:rounded-l-2xl shadow-xl min-h-screen md:w-[900px] w-full']"
    :style="{ zIndex: props.zIndex }">
    <!-- Modal content -->
    <!-- Modal header -->
    <div class="w-full flex items-center justify-between md:justify-start p-3 md:p-3 border-b rounded-t">
      <div class="md:pr-4 order-last md:order-none">
        <button @click="close" type="button"
          class="text-slate-400 dark:text-white bg-transparent hover:bg-red-100 transition duration-100 hover:text-red-500 rounded-full w-8 h-8 ms-auto inline-flex justify-center items-center">
          <PhX class="w-5 h-5" />
        </button>
      </div>
      <h3 class="text-xl font-bold text-slate-900 dark:text-white order-first md:order-none">
        <slot name="header">
          This is the default title!
        </slot>
      </h3>
    </div>
    <!-- Modal body -->
    <div class="px-3 py-4 md:p-5 h-full w-full">
      <slot name="body">
        <!-- Your body content goes here -->
      </slot>
    </div>
    <!-- Modal footer -->
    <div
      class="md:absolute w-full md:bottom-0 lg:bottom-6 flex items-center justify-start px-3 py-4 md:p-3 rounded-b border-t border-gray-200">
      <slot name="footer">
        <!-- Your footer content goes here -->
      </slot>
    </div>
  </div>
</template>

<style scoped>
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

.slide-in-right {
  animation: slideInRight 0.3s ease-in-out;
}

.slide-out-right {
  animation: slideOutRight 0.3s ease-in-out;
}
</style>
