<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<template>
  <button
    type="button"
    class="dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-200 text-slate-600 hover:dark:bg-slate-900 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl dark:border-slate-600 border border-slate-200 text-sm font-medium px-5 py-2.5 hover:text-slate-900 hover:dark:text-white focus:z-10"
  >
    {{ $t('back') }}
  </button>
</template>
