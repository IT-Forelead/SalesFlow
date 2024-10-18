<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
<template>
  <button
    type="button"
    class="dark:text-slate-200 dark:bg-slate-600 hover:bg-slate-200 hover:dark:bg-slate-500 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 hover:dark:text-white focus:z-10"
  >
    {{ $t('back') }}
  </button>
</template>
