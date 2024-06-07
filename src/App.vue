<script setup>
import { Toaster } from 'vue-sonner'
import { useRouter } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const defaultLayout = 'login'
const { currentRoute } = useRouter()
const layout = computed(() => `${currentRoute.value.meta.layout || defaultLayout}-layout`)
</script>

<template>
  <Toaster position="top-center" richColors closeButton />
  <component :is="layout">
    <router-view />
  </component>
</template>

<style scoped></style>
