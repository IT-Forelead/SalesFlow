<script setup>
import { computed, h, onMounted, reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import SettingsService from '../services/settings.service'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import { Money3 } from 'v-money3'
import { useI18n } from 'vue-i18n'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import { useTelegramBot } from '../store/telegramBots.store.js'
import TelegramBotsService from '../services/telegramBots.service.js'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import { useModalStore } from '../store/modal.store.js'
import Vauchers from '../components/vaucher/HolidayDiscount.vue'
import EditIcon from '../assets/icons/EditIcon.vue'
import TrashIcon from '../assets/icons/TrashIcon.vue'
import { useProductStore } from '../store/product.store.js'

const { t } = useI18n()
const isLoading = ref(false)
const isLoadingPercent = ref(false)
const isLoadingMinimalPrice = ref(false)
const isLoadingHolidayDiscount = ref(false)
const isLoadingBots = ref(false)
const globalSearchFromTable = ref('')
const renderKey = ref(0)

const botStore = useTelegramBot()
const telegramBots = computed(() => {
  renderKey.value += 1
  return botStore.bots
})

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const submitData = reactive({
  boundaryPrice: 0,
  percentage: null,
  minimalPrice: null,

})

const statusBot = (active) => {
  if (active) {
    return {
      text: t('inactive'),
      class: 'bg-red-500 rounded-lg text-white',
    }
  } else {
    return {
      text: t('active'),
      class: 'bg-green-500 rounded-lg text-white',
    }
  }
}

const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    enableSorting: false,
  },
  { accessorKey: 'type', header: t('type') },
  { accessorKey: 'description', header: t('description') },
  {
    accessorKey: 'active',
    header: t('status'),
    cell: ({ row }) => {
      const status = statusBot(row.active)
      return h('span', { class: `px-2 py-1 rounded ${status.class}` }, status.text)
    },
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', {
        onClick: () => {
          openEditTelegramBotModal(row.original)
        },
      }, [
        h(EditIcon, { class: 'w-6 h-6 text-blue-600 hover:scale-105' }),
      ]),
      h('button', {
        onClick: () => {
          openDeleteTelegramBotModal(row.original)
        },
      }, [
        h(TrashIcon, { class: 'w-6 h-6 text-red-600 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]


const openEditTelegramBotModal = (data) => {
  useModalStore().openEditTelegramBotModal()
  useTelegramBot().setSelectedBot(data)
}

const openDeleteTelegramBotModal = (data) => {
  useModalStore().openDeleteTelegramBotModal()
  useTelegramBot().setSelectedBot(data)
}


const getBots = () => {
  isLoadingBots.value = true
  TelegramBotsService.getTelegramBots()
    .then((res) => {
      useTelegramBot().clearStore()
      useTelegramBot().setBots(res)
    }).finally(() => {
    isLoadingBots.value = false
  })
}

getBots()

onMounted(() => {
  SettingsService.getSettings().then((res) => {
    isLoading.value = true
    if (res) {
      submitData.boundaryPrice = res.boundaryPrice
      submitData.percentage = res.percentage
      submitData.minimalPrice = res.minimalPrice
    }
  }).catch(() => {
    toast.error($t('errorWhileGettingSaleSettings'))
  })
});

const createBoundaryPrice = () => {
  if (submitData.boundaryPrice < 0) {
    toast.error("Chegirmani kiriting!")
  } else {
    isLoadingMinimalPrice.value = true
    SettingsService.updateSettings({
      boundaryPrice: submitData.boundaryPrice,
    }).then(() => {
      isLoadingMinimalPrice.value = false
      toast.success("Chegirma yaratildi!")
    }).catch(() => {
      isLoadingMinimalPrice.value = false
      toast.error("Chegirma yaratishda xatolik yuz berdi!")
    })
  }
}

const createPercentageSettings = () => {
  if (submitData.percentage < 0 || submitData.percentage > 100) {
    toast.error("Foizni to'g'ri kiriting!")
  } else {
    isLoadingPercent.value = true
    SettingsService.updateSettings({
      percentage: submitData.percentage,
    }).then(() => {
      isLoadingPercent.value = false
      toast.success("Foiz qo'shildi!")
    }).catch(() => {
      isLoadingPercent.value = false
      toast.error("Foiz qo'shishda xatolik yuz berdi!")
    })
  }
}

const createMinimalPriceSettings = () => {
  if (submitData.minimalPrice < 0) {
    toast.error("Minimal narx qo'shish kiriting!")
  } else {
    isLoadingHolidayDiscount.value = true
    SettingsService.updateSettings({
      minimalPrice: submitData.minimalPrice,
    }).then(() => {
      isLoadingHolidayDiscount.value = false
      toast.success("Minimal narx qo'shildi!")
    }).catch(() => {
      isLoadingHolidayDiscount.value = false
      toast.error("Minimal narx qo'shishda xatolik yuz berdi!")
    })
  }
}
</script>

<template>
  <div class="p-8">
    <div class="text-slate-900 text-3xl font-semibold mb-4">Sotuv sozlama</div>
    <TabView class="tabview-custom">
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <span class="font-bold white-space-nowrap">Mahsulotlarga foiz qo'shish</span>
          </div>
        </template>
        <div class="flex flex-col rounded-3xl">
          <div class="flex relative items-center space-x-4">
            <div class="flex-1 space-y-1">
              <label for="percentage" class="text-base md:text-lg font-medium">
                {{ $t('percentage')}}
              </label>
              <input type="number" id="percentage" v-model="submitData.percentage" :placeholder="$t('enterPercentage')"
                     class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg" />
            </div>
            <div class="flex-1">
              <button v-if="isLoadingPercent" class="text-white text-base flex items-center rounded-xl px-4 py-2.5 bg-blue-500 hover:bg-blue-600 absolute bottom-0">
                <Spinners270RingIcon
                  class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
                {{ $t('save')}}
              </button>
              <div v-else class="flex-1">
                <button @click="createPercentageSettings" class="text-white text-base flex items-center rounded-xl px-4 py-2.5 bg-blue-500 hover:bg-blue-600 absolute bottom-0">{{ $t('save')}}</button>
              </div>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <span class="font-bold white-space-nowrap">Minimal narx qo'shish</span>
          </div>
        </template>
        <div class="flex flex-col space-y-4">
          <div class="flex w-full items-center space-x-4" v-if="isLoading">
              <label for="price" class="text-base w-96 md:text-lg font-medium">
                {{ $t('boundaryPrice')}}
              </label>
              <money3 v-bind="moneyConf" id="price" v-model="submitData.boundaryPrice"
                       class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
              </money3>
              <div class="flex-1">
                <button @click="createBoundaryPrice" class="text-white text-base flex items-center rounded-xl px-4 py-2.5 bg-blue-500 hover:bg-blue-600">
                  <Spinners270RingIcon v-if="isLoadingMinimalPrice"
                                       class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
                  {{ $t('save')}}</button>
              </div>
          </div>

          <div class="flex w-full items-center space-x-4" v-if="isLoading">
            <label for="price" class="text-base w-96 md:text-lg font-medium">
              {{ $t('minimalPriceForHolidayDiscount')}}
            </label>
            <money3 v-bind="moneyConf" id="price" v-model="submitData.minimalPrice"
                    class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
            </money3>
            <div class="flex-1">
              <button @click="createMinimalPriceSettings" class="text-white text-base flex items-center rounded-xl px-4 py-2.5 bg-blue-500 hover:bg-blue-600">
                <Spinners270RingIcon v-if="isLoadingHolidayDiscount"
                  class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
                {{ $t('save')}}</button>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <span class="font-bold white-space-nowrap">Telegram bot</span>
          </div>
        </template>
        <div class="p-2">
          <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
            {{ $t('telegramBots') }}
          </div>
          <div class="flex flex-col md:flex-row items-center justify-between">
            <div class="relative w-full md:w-auto my-2 md:mb-0 order-2 md:order-1">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon class="w-5 h-5 text-slate-400" />
              </div>
              <input type="search" v-model="globalSearchFromTable"
                     class="bg-slate-100 border-none w-full text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
                     placeholder="Search everything...">
            </div>
            <div class="w-full md:w-auto order-1 md:order-2">
              <button @click="useModalStore().openCreateTelegramBotModal()" class="w-full md:w-auto py-2 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
                {{ $t('addBot') }}
              </button>
            </div>
          </div>
          <div v-if="isLoadingBots" class="flex items-center justify-center h-20">
            <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
          </div>
          <CTable v-else :data="telegramBots" :key="renderKey" :columns="columns" :filter="globalSearchFromTable" />
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <span class="font-bold white-space-nowrap">{{ $t('holidayDiscounts') }}</span>
          </div>
        </template>
        <div class="p-2">
          <Vauchers />
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<style>
.tabview-custom .p-tabview-nav li.p-highlight a {
  color: #3b82f6 !important;
  border-bottom: solid #3b82f6 !important;
}
</style>
