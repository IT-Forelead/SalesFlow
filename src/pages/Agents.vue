<script setup>
import PhPencilIcon from '../assets/icons/EditIcon.vue'
import PhTelegramLogo from '../assets/icons/TelegramIcon.vue'
import PhChatCircleBold from '../assets/icons/ChatIcon.vue'
import PhTrash from '../assets/icons/TrashIcon.vue'
import { ref } from 'vue'
import moment from 'moment'
import { toast } from 'vue-sonner'
import { computed, h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import UserService from '../services/user.service'
import { useUserStore } from '../store/user.store.js'
import { useModalStore } from '../store/modal.store.js'
import { useI18n } from 'vue-i18n'
import { useAgentStore } from '../store/agent.store.js'
import AgentService from '../services/agent.service.js'

const { t } = useI18n()

const agentStore = useAgentStore()
const globalSearchFromTable = ref('')
const isLoading = ref(false)
const renderkey = ref(0)

const agents = computed(() => {
  renderkey.value += 1
  return agentStore.agents
})


const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
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
    accessorKey: 'createdAt',
    accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    header: t('createdAt'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', { onClick: () => { openEditAgent(row.original) } }, [
        h(PhPencilIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
      h('button', { onClick: () => { sendMessage(row.original.id) } }, [
        h(PhTelegramLogo, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
      h('button', { onClick: () => { openChatWithAgent(row.original) } }, [
        h(PhChatCircleBold, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
      // h('button', { onClick: () => { openDeleteUserModal(row.original) } }, [
      //   h(PhTrash, { class: 'w-6 h-6 text-red-600 hover:scale-105' })
      // ]),
    ]),
    enableSorting: false,
  },
]

const openEditAgent = (data) => {
  useAgentStore().setSelectedAgent(data)
  useModalStore().openEditAgentModal()
}

const openChatWithAgent = (data) => {
  useAgentStore().setSelectedAgent(data)
  useModalStore().openChatWithAgentModal()
}

// const openDeleteUserModal = (data) => {
//   useModalStore().openDeleteUserModal()
//   useUserStore().setSelectedUser(data)
// }

const sendMessage = async (id) => {
  console.log(id)
  await AgentService.sendMessage(id)
    .then(() => {
      toast.success(t('messageSentSuccessfully'))
    })
    .catch(() => {
      toast.error(t('messageSentFailed'))
    })
}

const getAgents = () => {
  isLoading.value = true
  AgentService.getAgents()
    .then((res) => {
      useAgentStore().clearStore()
      useAgentStore().setAgents(res)
    }).finally(() => {
      isLoading.value = false
    })
}

getAgents()

</script>

<template>
  <div class="p-4 md:p-8">
    <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
      {{ $t('agents') }}
    </div>
    <div class="flex flex-col md:flex-row items-center justify-between">
      <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="globalSearchFromTable"
          class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
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
      <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
    </div>
    <CTable :key="renderkey" v-else :data="agents" :columns="columns" :filter="globalSearchFromTable" />
  </div>
</template>
