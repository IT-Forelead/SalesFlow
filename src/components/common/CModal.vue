<script setup>
import PhX from '../../assets/icons/XIcon.vue'

const emit = defineEmits(['close'])
const close = () => {
  emit('close')
}
const props = defineProps({
  isOpen:Boolean
})
</script>

<template>
  <div class="fixed top-0 right-0 bottom-0 bg-gray-800/25 left-0 z-50 backdrop-blur-sm"></div>
  <div  :class="[isOpen ? 'slide-in-right' : '' ]" class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full h-full cursor-default">
    <div class="absolute w-full max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl right-0 top-1/2 -translate-y-1/2 mx-auto">
      <!-- Modal content -->
      <div
        class="relative bg-white md:rounded-l-2xl shadow-xl min-h-screen w-full md:w-auto ">
        <!-- Modal header -->
        <div class="w-full flex items-center p-4 md:p-5  border-b rounded-t">
          <div class="pr-4">
            <button
              @click="close"
              type="button"
              class="text-slate-400 bg-transparent hover:bg-red-100 transition duration-100 hover:text-red-500 rounded-full w-8 h-8 ms-auto inline-flex justify-center items-center"
            >
              <PhX class="w-5 h-5"/>
            </button>
          </div>
          <h3 class="text-xl font-bold text-slate-900">
            <slot name="header">
              This is the default title!
            </slot>
          </h3>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5 w-full">
          <slot name="body">
            <!-- Your body content goes here -->
          </slot>
        </div>
        <!-- Modal footer -->
        <div class="absolute bottom-0 w-full flex items-center justify-start p-4 md:p-5 rounded-b border-t border-gray-200">
          <slot name="footer">
            <!-- Your footer content goes here -->
          </slot>
        </div>
      </div>
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
.slide-in-right {
  animation: slideInRight 0.3s ease-in-out;
}

</style>