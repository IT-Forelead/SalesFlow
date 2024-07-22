<script setup>
import PhPencilIcon from '../assets/icons/EditIcon.vue'
// import PhTelegramLogo from '../assets/icons/TelegramIcon.vue'
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
import PhTelegramLogo from '../assets/icons/Telegram2Icon.vue'
import LetterIcon from '../assets/icons/LetterIcon.vue'
import Dialog from 'primevue/dialog';
import Button from 'primevue/button'


const { t } = useI18n()

const agentStore = useAgentStore()
const globalSearchFromTable = ref('')
const isLoading = ref(false)
const renderkey = ref(0)
const newMessageContent = ref('')

const agents = computed(() => {
  //renderkey.value += 1
  return agentStore.agents
})

const messages = ref([
      {
        body: 'Welcome to the chat, I\'m Bob!',
        author: 'bob'
      },
      {
        body: 'Thank you Bob',
        author: 'you'
      },
      {
        body: 'You\'re most welcome',
        author: 'bob'
      }
]
)


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
      h('button', { visible: true, onClick: () => { sendMessage(row.original.id) } }, [
        h(LetterIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
      h('button', { visible: false, onClick: () => { openTelegramChat(row.original.id) } }, [
        h(PhTelegramLogo, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      ]),
      // h('button', { onClick: () => { openChatWithAgent(row.original) } }, [
      //   h(PhChatCircleBold, { class: 'w-6 h-6 text-blue-600 hover:scale-105' })
      // ]),
      // h('button', { onClick: () => { openDeleteUserModal(row.original) } }, [
      //   h(PhTrash, { class: 'w-6 h-6 text-red-600 hover:scale-105' })
      // ]),
    ]),
    enableSorting: false,
  },
]

const visible = ref(false);

const openTelegramChat = (data) => {
  useAgentStore().setSelectedAgent(data)
  visible.value = true
}

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

const sendChatMessage = async () => {
  messages.value.push({ author: "you", body: newMessageContent.value });
  newMessageContent.value = ""
  await AgentService.sendChatMessage({ id: id, content: newMessageContent.value })
    .then(() => {
      toast.success(t('messageSentSuccessfully'))
    })
    .catch(() => {
      toast.error(t('messageSentFailed'))
    })
}

</script>

<template>
  <div class="p-4 md:p-8">
   <Dialog v-model:visible="visible" modal :style="{ width: '40rem' }" :closable="false">
    <template #header>
        <div class="inline-flex items-center justify-center  h-5">
            
            <!-- <span class="font-bold whitespace-nowrap">Tom</span> -->
            <button @click="visible=false">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="w-12 h-12 my-1 text-blue-500 ml-2"
    >
      <path
        class="text-blue-500 fill-current"
        d="M9.41 11H17a1 1 0 0 1 0 2H9.41l2.3 2.3a1 1 0 1 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.42 1.4L9.4 11z"
      />
    </svg>
  </button>
  <div class="my-3 text-black-100 font-bold text-lg tracking-wide"></div>
  
  
        </div>
    </template>


    <!-- <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 p-5">


<div
  class="fixed w-full bg-green-400 h-16 pt-2 text-white flex justify-between shadow-md"
  style="top:0px; overscroll-behavior: none;"
>
  
  <a href="#">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      class="w-12 h-12 my-1 text-green-100 ml-2"
    >
      <path
        class="text-green-100 fill-current"
        d="M9.41 11H17a1 1 0 0 1 0 2H9.41l2.3 2.3a1 1 0 1 1-1.42 1.4l-4-4a1 1 0 0 1 0-1.4l4-4a1 1 0 0 1 1.42 1.4L9.4 11z"
      />
    </svg>
  </a>
  <div class="my-3 text-green-100 font-bold text-lg tracking-wide">@rallipi</div>
  
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    class="icon-dots-vertical w-8 h-8 mt-2 mr-2"
  >
    <path
      class="text-green-100 fill-current"
      fill-rule="evenodd"
      d="M12 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 7a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
    />
  </svg>
</div>


<div class="mt-20 mb-16">


  <div class="clearfix">
    <div
      class="bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg"
    >this is a basic mobile chat layout, build with tailwind css</div>
  </div>

  
  <div class="clearfix">
    <div
      class="bg-gray-300 w-3/4 mx-4 my-2 p-2 rounded-lg clearfix"
    >It will be used for a full tutorial about building a chat app with vue, tailwind and firebase.</div>
  </div>

  
  <div class="clearfix">
    <div
      class="bg-green-300 float-right w-3/4 mx-4 my-2 p-2 rounded-lg clearfix"
    >check my twitter to see when it will be released.</div>
  </div>
</div>
</div>


<div class="fixed w-full flex justify-between bg-green-100" style="bottom: 0px;">
<textarea
  class="flex-grow m-2 py-2 px-4 mr-1 rounded-full border border-gray-300 bg-gray-200 resize-none"
  rows="1"
  placeholder="Message..."
  style="outline: none;"
></textarea>
<button class="m-2" style="outline: none;">
  <svg
    class="svg-inline--fa text-green-400 fa-paper-plane fa-w-16 w-12 h-12 py-2 mr-2"
    aria-hidden="true"
    focusable="false"
    data-prefix="fas"
    data-icon="paper-plane"
    role="img"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <path
      fill="currentColor"
      d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"
    />
  </svg>
</button>
</div> -->

<div class="flex flex-col items-center justify-center h-[75vh] bg-gray-100 text-gray-800 p-5">
  <div class="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden">
		<div class="flex flex-col flex-grow h-0 p-4 overflow-auto">
			
      <!-- <section ref="chatArea" class="chat-area"> -->
    <div v-for="message in messages" :key="message">
      <div v-if="message.author === 'you'" class="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
				<div>
					<div class="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
						<p class="text-sm">{{ message.body }}</p>
					</div>
					<span class="text-xs text-gray-500 leading-none">2 min ago</span>
				</div>
			
			</div>
      <div v-else class="flex w-full mt-2 space-x-3 max-w-xs">
				
				<div>
					<div class="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
						<p class="text-sm">{{ message.body }}</p>
					</div>
					<span class="text-xs text-gray-500 leading-none">2 min ago</span>
				</div>
			</div>
      
    </div>
  <!-- </section> -->
		</div>
		
		<div class="bg-gray-300 p-4">
			<input class="flex items-center h-10 w-full rounded px-3 text-sm" type="text" placeholder="Type your message…" v-model="newMessageContent" v-on:keyup.enter="sendChatMessage">
		</div>
	</div>
</div>
	<!-- Component End  -->










</Dialog>
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
