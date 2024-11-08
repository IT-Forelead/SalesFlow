<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store'
import CancelButton from '../buttons/CancelButton.vue'
import { computed, ref, h, reactive} from 'vue';
import { useI18n } from 'vue-i18n'
import { useAgentStore } from '../../store/agent.store'
import MTable from '../../components/common/MTable.vue'
import { useDropdownStore } from '../../store/dropdown.store'
import { onClickOutside } from '@vueuse/core'
import useMoneyFormatter from '../../mixins/currencyFormatter';

const agentsProducts = computed(() => agentStore.agentsProducts)
const renderKey = computed(() => agentStore.renderkey)
const { t } = useI18n()
const agentStore = useAgentStore()
const filterByDropdown = ref(null)
const filterByOption = ref(t('all'))

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
    accessorKey: 'asset',
    header: t('image'),
    enableSorting: false,
    cell: ({ row }) =>
      h('div', { class: 'w-8 h-8 flex items-center overflow-hidden border dark:border-slate-600 border-gray-300' },
        [row.original.asset ?
          h(Image, { src: `${row.original.asset.url}`, alt: '#', preview: '' }) : h('span')]),
  },
  {
    accessorKey: 'name',
    header: t('name'),
  },
  {
    accessorKey: 'purchasePrice',
    header: t('purchasePrice'),
    cell: ({ row }) => useMoneyFormatter(row.original.purchasePrice),
  },
]

const closeModal = () => {
  useModalStore().closeAgentInfoModal()
  filterByOption.value = t('all')
}

</script>

<template>
  <CModal :is-open="useModalStore().isOpenAgentInfoModal" v-if="useModalStore().isOpenAgentInfoModal" @close=closeModal>
    <template v-slot:header>
      {{ $t('agentProducts') }}
    </template>
    <template v-slot:body>
      <MTable :data="agentsProducts" :columns="columns" :key="renderKey" />
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>

<style scoped></style>