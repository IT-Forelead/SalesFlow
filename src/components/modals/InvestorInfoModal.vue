<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store'
import EyeIcon from '../../assets/icons/EyeIcon.vue'
import CancelButton from '../buttons/CancelButton.vue'
import { computed, ref, h, reactive} from 'vue';
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import MTable from '../../components/common/MTable.vue'
import { useInvestStore } from '../../store/invest.store';
import InvestService from '../../services/invest.service';
import { useDropdownStore } from '../../store/dropdown.store'
import { onClickOutside } from '@vueuse/core'

const renderKey = computed(() => investStore.renderkey)
const { t } = useI18n()
const investStore = useInvestStore()
// const investorStore = useInvestorStore()
const invests = computed(() => investStore.invests)
const filterByDropdown = ref(null)
const capitalize = (word) => {
  const [firstLetter, ...rest] = word.split('');
  const upperCaseLetter = firstLetter.toUpperCase();
  if (firstLetter === upperCaseLetter) {
    return;
  }
  return firstLetter.toUpperCase() + rest.join('');
}

onClickOutside(filterByDropdown, () => {
  if (useDropdownStore().isOpenFilterBy) {
    useDropdownStore().toggleFilterBy()
  }
})

const columns = [
{
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorKey: 'amount',
    header: t('amount'),
  },
  {
    accessorKey: 'rate',
    header: t('ratePercent'),
  },
  {
    accessorKey: 'status',
    accessorFn: row => capitalize(row.status),
    header: t('status'),
  },
  {
    accessorKey: 'activatedAt',
    header: t('activatedAt'),
  },
  {
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: t('createdAt'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', { onClick: () => { openInvestDaily(row.original) } }, [
        h(EyeIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
    
    ]),
    enableSorting: false,
  },
]

const closeModal = () => {
  useModalStore().closeInvestorInfoModal()
}
  
const openInvestDaily = (data) => {
  InvestService.getInvestDailyByFilters({
    investId: data.id,
    investorId: data.investorId,
    startDate: data.startDate,
    endDate: data.endDate,
    minAmount: data.minAmount,
    maxAmount: data.maxAmount,
    limit: data.limit,
    page: data.page
  }).then((res) => {
    useInvestStore().setInvestDaily(res.data)
    useModalStore().openInvestDailyModal()
  })
}

// const getInvestsByFilter = (filter) => {
//   useDropdownStore().toggleFilterBy()
//   InvestService.getInvestsByFilter(
//     cleanObjectEmptyFields({
//       investorId: useInvestStore().selectedInvest.investorId,
//     }),
//   ).then((res) => {
//     investStore.setInvests(res.data)
//     investStore.renderkey += 1
//   })
// }
</script>

<template>
  <CModal :is-open="useModalStore().isOpenInvestorInfoModal" v-if="useModalStore().isOpenInvestorInfoModal" @close=closeModal>
    <template v-slot:header>
      {{ $t('invests') }}
    </template>
    <template v-slot:body>
      <MTable :data="invests" :columns="columns" :key="renderKey" />
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>

<style scoped></style>