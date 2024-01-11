<script setup>
import PhX from '../../assets/icons/XIcon.vue'

const emit = defineEmits(['close'])
const close = () => {
  emit('close')
}
</script>

<template>
  <div
    class="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-full max-h-screen md:inset-0 md:h-full">
    <div class="fixed top-0 right-0 bottom-0 left-0 bg-black opacity-5" @click="close"></div>
    <div class="relative p-4 w-full h-full max-w-4xl md:h-auto left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <!-- Modal content -->
      <div class="relative bg-white rounded-2xl shadow">
        <!-- Modal header -->
        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
          <h3 class="text-xl font-bold text-slate-900">
            <slot name="header">
              This is the default title!
            </slot>
          </h3>
          <button
            @click="close"
            type="button"
            class="text-slate-400 bg-transparent hover:bg-red-100 transition duration-150 hover:text-red-500 rounded-full w-8 h-8 ms-auto inline-flex justify-center items-center"
          >
            <PhX class="w-5 h-5"/>
          </button>
        </div>
        <!-- Modal body -->
        <div class="p-4 md:p-5 space-y-4">
          <slot name="body">
            This is the default body!
          </slot>
        </div>
        <!-- Modal footer -->
        <div class="flex items-center justify-end p-4 md:p-5 border-t border-gray-200 rounded-b">
          <slot name="footer">
          </slot>
<!--          <button-->
<!--            @click="close"-->
<!--            type="button"-->
<!--            class="ms-3 text-slate-600 bg-white hover:bg-slate-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900 focus:z-10"-->
<!--          >-->
<!--            Close-->
<!--          </button>-->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>