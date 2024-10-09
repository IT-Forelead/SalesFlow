<script setup>
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  isLoading: Boolean
})
</script>
<template>
  <button type="button"
    class="text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-xl text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
    <Spinners270RingIcon v-if="props.isLoading"
      class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:dark:text-white fill-gray-600 dark:fill-gray-300" />
    {{ $t('save') }}
  </button>
</template>
<script setup>
</script>