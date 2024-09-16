<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store'
import CancelButton from '../buttons/CancelButton.vue'
import { computed, ref, h, reactive} from 'vue';
import { useI18n } from 'vue-i18n'
import { useInvestStore } from '../../store/invest.store'
import MTable from '../../components/common/MTable.vue'
import { useDropdownStore } from '../../store/dropdown.store'
import { onClickOutside } from '@vueuse/core'

const investDailyIncome = computed(() => investStore.investDaily)
const renderKey = computed(() => investStore.renderkey)
const { t } = useI18n()
const investStore = useInvestStore()
const filterByDropdown = ref(null)

onClickOutside(filterByDropdown, () => {
  if (useDropdownStore().isOpenFilterBy) {
    useDropdownStore().toggleFilterBy()
  }
})

// const selectedInvest = computed(() => {
//   return investStore.selectedInvest
// })

const filterByOption = ref(t('all'))

const columns = [
{
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'date',
    header: t('date'),
  },
  {
    accessorKey: 'amount',
    header: t('amount'),
  },
]

const closeModal = () => {
  useModalStore().closeInvestDailyModal()
  filterByOption.value = t('all')
}

// const getInvestDailyByFilters = (filter) => {
//   console.log( 'useInvestStore().selectedInvest.investId')
//   console.log( useInvestStore().selectedInvest.investId)
  
//   InvestService.getInvestDailyByFilters(
//     cleanObjectEmptyFields({
//       investId: useInvestStore().selectedInvest.investId,
//     }),
//   ).then((res) => {
//     console.log(res);
    
//     investStore.setInvestDaily(res.data)
//     investStore.renderkey += 1
//   })
// }
// getInvestDailyByFilters({})

</script>

<template>
  <CModal :is-open="useModalStore().isOpenInvestDailyModal" v-if="useModalStore().isOpenInvestDailyModal" @close=closeModal>
    <template v-slot:header>
      {{ $t('investDailyIncome') }}
    </template>
    <template v-slot:body>
      <MTable :data="investDailyIncome" :columns="columns" :key="renderKey" />
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>

<style scoped></style>