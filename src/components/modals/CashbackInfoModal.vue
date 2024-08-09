<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store'

import { useCashbackStore } from '../../store/cashback.store'
import CashbackService from '../../services/cashback.service'
import { computed, onMounted, ref } from 'vue'
import useMoneyFormatter from '../../mixins/currencyFormatter'
import moment from 'moment'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import SettingsService from '../../services/settings.service.js'

const API_URL = import.meta.env.VITE_CHEQUE_API_URL

const { t } = useI18n()

const cashbackStore = useCashbackStore()
const qrCode = ref()

const currentPage = computed(() => {
  return cashbackStore.currentPage
})
const params = computed(() => {
  return cashbackStore.params
})

const selectedCashback = computed(() => {
  return cashbackStore.selectedCashback
})


onMounted(() => {
  SettingsService.getSettings()
    .then((res) => {
      if (res) {
        qrCode.value = res.qrCode
      }
    })
    .catch((err) => {
      console.error('Error fetching settings:', err)
    })
})

const isLoadingPrint = ref(false)
const isRefundLoading = ref(false)

async function printChaque(data) {
  await axios
    .post(API_URL + '/print', data)
    .then(async () => {
      console.log('Chaque printed')
    })
    .catch(() => {
      console.log('Chaque not printed')
    })
}

const closeModal = () => {
  useModalStore().closeCashbackInfoModal()
  useCashbackStore().setSelectedCashback({})
}

const selectedProductIds = ref([])

</script>

<template>
  <CModal :is-open="useModalStore().isOpenCashbackInfoModal" v-if="useModalStore().isOpenCashbackInfoModal"
          @close="closeModal">
    <template v-slot:header>
    //   
    </template>
  </CModal>
</template>

