<script setup>
import EyeIcon from '../assets/icons/EyeIcon.vue'
import PhPencilIcon from '../assets/icons/EditIcon.vue'
import { ref } from 'vue'
import moment from 'moment'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import { useModalStore } from '../store/modal.store.js'
import { useI18n } from 'vue-i18n'
import { useAgentStore } from '../store/agent.store.js'
import AgentService from '../services/agent.service.js'
import ProductService from '../services/product.service.js'

const { t } = useI18n()
const agentStore = useAgentStore()
const globalSearchFromTable = ref('')
const isLoading = ref(false)
const products = ref([])
const agents = computed(() => agentStore.agents)
const renderkey = computed(() => agentStore.renderkey)
const columns = [
  {
    accessorKey: 'id',
    header: () => h('div', { class: 'cursor-default' }, t('n')),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  {
    accessorFn: row => `${row.fullName}`,
    header: t('fullName'),
  },
  {
    accessorKey: 'phone',
    header: t('phoneNumber'),
  },
  {
    accessorKey: 'company',
    header: t('company'),
  },
  {
    accessorKey: 'products',
    header: t('products'),
    cell: ({ row }) => {
      const agentProducts = products.value[row.original.id] || [];
      return h('div', { class: 'w-full flex flex-col dark:text-zinc-200' }, [
        agentProducts.slice(0, 3).map((item, index) => {
          const productName = item.name;
          const packagingWords = item.packaging.split(' ');
          const truncatedPackaging = packagingWords.slice(0, 3).join(' ') + (packagingWords.length > 2 ? '...' : '');
          return h('div', { key: index, class: 'flex items-center space-x-1  dark:text-zinc-200' }, [
            h('p', { class: 'text-base text-gray-900  dark:text-zinc-200' }, productName),
            h('p', { class: 'text-sm font-medium text-gray-600  dark:text-zinc-200' }, truncatedPackaging),
          ]);
        }),
      ]);
    },
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
      h('button', { onClick: () => { openEditAgent(row.original) } }, [
        h(PhPencilIcon, { class: 'w-6 h-6 dark:text-blue-400 text-blue-600 hover:scale-105' })
      ]),
      h('button', { onClick: () => { openAgentInfo(row.original) } }, [
        h(EyeIcon, { class: 'w-6 h-6 dark:text-blue-400 text-blue-600 hover:scale-105' })
      ]),
      h('button', { onClick: () => { openOfferProducts(row.original) } }, [
        h(UploadIcon, { class: 'w-6 h-6 dark:text-blue-400 text-blue-600 hover:scale-105' })
      ]),
    ]),
    enableSorting: false,
  },
]

const openEditAgent = (data) => {
  useAgentStore().setSelectedAgent(data)
  useModalStore().openEditAgentModal()
}

const openAgentInfo = (data) => {
  ProductService.getProductsDetails({ agentId: data.id }).then((res) => {
    console.log(res);
    useAgentStore().clearStore()
    useAgentStore().setAgentsProducts(res.data)
    console.log(res.data);
    useModalStore().openAgentInfoModal()
  })
}

const getAgents = async () => {
  isLoading.value = true
  try {
    const res = await AgentService.getAgents()
    useAgentStore().clearStore()
    useAgentStore().setAgents(res)
    useAgentStore().renderkey += 1
    await getProductsDetails(res);
  } finally {
    isLoading.value = false
  }
}

const getProductsDetails = async (agents) => {
  const productRequests = agents.map(agent =>
    ProductService.getProductsDetails({ agentId: agent.id })
      .then(res => { products.value[agent.id] = res.data })
  );
  await Promise.all(productRequests);
}
getAgents()

</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 dark:text-white text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('agents') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
          :placeholder="$t('search')">
      </div>
      <div class="w-full md:w-auto order-1 md:order-2">
        <button @click="useModalStore().openCreateAgentModal()"
          class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          {{ $t('addAgent') }}
        </button>
      </div>
    </div>
    <div v-if="isLoading" class="flex items-center justify-center h-20">
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 dark:text-zinc-300 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="agents" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>