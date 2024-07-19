<script setup>
import { computed, ref} from 'vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import { useI18n } from 'vue-i18n'
import { useAgentStore } from '../../store/agent.store.js'

const { t } = useI18n()

const isLoading = ref(false)
const agentStore = useAgentStore()

const selectedAgent = computed(() => {
  return agentStore.selectedAgent
})

const closeModal = () => {
  useModalStore().closeChatWithAgentModal()
}
</script>
<template>
  <CModal :is-open="useModalStore().isOpenChatWithAgentModal" v-if="useModalStore().isOpenChatWithAgentModal" @close="closeModal">
    <template v-slot:header>
      {{ $t('chatWithAgent') }}
    </template>
    <template v-slot:body>
      Chat will be available soon
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>
<style scoped></style>
