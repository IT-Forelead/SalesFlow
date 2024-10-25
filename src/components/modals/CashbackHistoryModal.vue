<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store'
import ImageIcon from '../../assets/icons/ImageIcon.vue'
import EyeIcon from '../../assets/icons/EyeIcon.vue'
import CancelButton from '../buttons/CancelButton.vue'
import { computed, ref, h, reactive} from 'vue';
import useMoneyFormatter from '../../mixins/currencyFormatter';
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { useCorporateClientsStore } from '../../store/corporateClients.store'
import corporateClientsService from '../../services/corporateClients.service';
import CustomerService from '../../services/customer.service';
import MTable from '../../components/common/MTable.vue'
import { useCustomerStore } from '../../store/customer.store';
import { useOrderStore } from '../../store/order.store';
import OrderService from '../../services/order.service';
import { useDropdownStore } from '../../store/dropdown.store'
import FunnelIcon from '@/assets/icons/FunnelIcon.vue'
import { onClickOutside } from '@vueuse/core'
import { cleanObjectEmptyFields } from '../../mixins/utils'

const renderKey = computed(() => customerStore.renderkey)
const { t } = useI18n()
const corporateClientsStore = useCorporateClientsStore()
const customerStore = useCustomerStore()
const cashbackHistories = computed(() => customerStore.customerHistories)
const filterByDropdown = ref(null)

onClickOutside(filterByDropdown, () => {
  if (useDropdownStore().isOpenFilterBy) {
    useDropdownStore().toggleFilterBy()
  }
})

const selectedClient = computed(() => {
  return corporateClientsStore.selectedClient
})

const filterByOption = ref(t('all'))

const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center' }, 
      [row.original.type == 'CREDIT' ?
        h('span', { class: 'text-red-500'}, `${parseInt(row.id, 10) + 1}`) : [row.original.type == 'DEBIT' ? h('span', { class: 'text-green-500'}, `${parseInt(row.id, 10) + 1}`) :  `${parseInt(row.id, 10) + 1}`]]),
  },
  {
    header: t('type'),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center' }, 
      [row.original.type == 'CREDIT' ?
        h('span', { class: 'text-red-500'}, t('credit')) : [row.original.type == 'DEBIT' ? h('span', { class: 'text-green-500'}, t('debit')) : `${row.original.type}`]]),
  },
  {
    header: t('quantity'),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center' }, 
      [row.original.type == 'CREDIT' ?
        h('span', { class: 'text-red-500'}, `${useMoneyFormatter(row.original.amount)}`) : [row.original.type == 'DEBIT' ? h('span', { class: 'text-green-500'}, `${useMoneyFormatter(row.original.amount)}`) : `${useMoneyFormatter(row.original.amount)}`]]),
  },
  {
    header: t('createdAt'),
    cell: ({ row }) =>
      h('div', { class: 'flex items-center' }, 
      [row.original.type == 'CREDIT' ?
        h('span', { class: 'text-red-500'}, moment(row.original.createdAt).format('DD/MM/YYYY H:mm')) : [row.original.type == 'DEBIT' ? h('span', { class: 'text-green-500'}, moment(row.original.createdAt).format('DD/MM/YYYY H:mm')) : moment(row.original.createdAt).format('DD/MM/YYYY H:mm')]]),
  },
]

const closeModal = () => {
  useModalStore().closeCashbackHistoryModal()
  filterByOption.value = t('all')
}

const getBalanceHistoriesByFilter = (filter) => {
  useDropdownStore().toggleFilterBy()
  CustomerService.getCustomerHistoriesByFilter(
    cleanObjectEmptyFields({
      customerId: useCustomerStore().setCustomerHistories(data),
      type: filter,
    }),
  ).then((res) => {
    customerStore.setCustomerHistories(res.data)
    customerStore.renderkey += 1
  })
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCashbackHistoryModal" v-if="useModalStore().isOpenCashbackHistoryModal" @close=closeModal>
    <template v-slot:header>
      {{ $t('cashbackHistories') }}
    </template>
    <template v-slot:body>
      <div class="flex justify-end w-full" ref="filterByDropdown">
          <div @click="useDropdownStore().toggleFilterBy()"
            class="flex justify-end w-min  border-none select-none text-gray-500 bg-slate-100 rounded-full p-2 px-5 items-center hover:bg-gray-200 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 text-gray-400" />
            <span>{{ filterByOption || $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenFilterBy"
            class="absolute bg-slate-50 shadow-md rounded-xl w-52 p-3 z-20 top-[130px] right-0 space-y-3">
            <ul>
              <li @click="getBalanceHistoriesByFilter(); filterByOption = $t('all')"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('all') }}
              </li>
              <li @click="getBalanceHistoriesByFilter('DEBIT'); filterByOption = $t('debit')"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('debit') }}
              </li>
              <li @click="getBalanceHistoriesByFilter('CREDIT'); filterByOption = $t('credit')"
                class="px-2 py-1 text-sm hover:bg-slate-100 rounded cursor-pointer">
                {{ $t('credit') }}
              </li>
            </ul>
          </div>
        </div>
      <MTable :data="cashbackHistories" :columns="columns" :key="renderKey" />

    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>

<style scoped></style>