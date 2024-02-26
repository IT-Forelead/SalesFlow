<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<template>
  <button type="button"
    class="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-xl text-sm inline-flex items-center px-5 py-2.5 text-center me-2">
    {{ $t('yesOfCourse') }}
  </button>
</template>
