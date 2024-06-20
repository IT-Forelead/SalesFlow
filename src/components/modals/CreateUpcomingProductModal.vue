<script setup>
import { cleanObjectEmptyFields } from '../../mixins/utils'
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useRoute, useRouter } from 'vue-router'
import { useModalStore } from '../../store/modal.store'
import { useProductStore } from '../../store/product.store'
import { useBarcodeStore } from '../../store/barcode.store'
import CancelButton from '../buttons/CancelButton.vue'
import SearchIcon from '../../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import BarcodeIcon from '../../assets/icons/BarcodeIcon.vue'
import UpcomingProductService from '../../services/upcomingProduct.service'
import ProductService from '../../services/product.service'
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import ImageIcon from '../../assets/icons/ImageIcon.vue'
import { useI18n } from 'vue-i18n'
import AgentService from '../../services/agent.service.js'
import { useAgentStore } from '../../store/agent.store.js'
import SelectOptionAgent from '../inputs/SelectOptionAgent.vue'
import { useDropdownStore } from '../../store/dropdown.store'
import ScrollPanel from 'primevue/scrollpanel'
import SettingsService from '../../services/settings.service.js'
import { useProductHistoryStore } from '../../store/productHistory.store.js'
import OverlayPanel from 'primevue/overlaypanel'
import PhUserPlus from '../../assets/icons/PlusCircleIcon.vue'
import MultiSelect from 'primevue/multiselect'
import { vMaska } from 'maska'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const barcodeStore = useBarcodeStore()
const agentStore = useAgentStore()
const productStore = useProductStore()
const productHistoryStore = useProductHistoryStore()
const dropdownStore = useDropdownStore()
const isCreateAgentPopup = ref(false)

const currentPage1 = computed(() => {
  return productStore.currentPage
})

const currentPage2 = computed(() => {
  return productHistoryStore.currentPage
})

const products = computed(() => {
  return productStore.products
})

const agents = computed(() => {
  return agentStore.agents
})

const selectedAgent = computed(() => {
  return dropdownStore.selectOptionAgent
})

const pageSize = 50

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const isLoading = ref(false)
const isLoadingAgent = ref(false)
const productBarcodes = ref([])

const selectedCities = ref();
const cities = ref([
    { name: 'New York', code: 'NY' },
    { name: 'Rome', code: 'RM' },
    { name: 'London', code: 'LDN' },
    { name: 'Istanbul', code: 'IST' },
    { name: 'Paris', code: 'PRS' }
]);

const submitData = reactive({
  productIds: [],
  expectedTime: '',
  paymentType: '',
  price: 0,
})

const clearSubmitData = () => {
  dropdownStore.setSelectOptionAgent('')
  submitData.productIds = []
  submitData.paymentType = ''
  submitData.expectedTime = ''
  submitData.price = 0
}

const closeModal = () => {
  useModalStore().closeCreateUpcomingProductModal()
  clearSubmitData()
  productBarcodes.value = []
}

const createProduct = () => {
  if (!submitData.productIds.length == 0) {
    toast.warning("Iltimos Mahsulotlarni tanlang!")
  } else if (!submitData.paymentType) {
    toast.warning("To'lov turini tanlang")
  } else if (!submitData.expectedTime) {
    toast.warning("expectedTime ni tanlang")
  } else if (submitData.price <= 0) {
    toast.warning(t('plsEnterProductPrice'))
  } else {
    isLoading.value = true
    UpcomingProductService.createProduct(
      cleanObjectEmptyFields({
        name: submitData.name,
        barcode: submitData.barcode,
        packaging: submitData.packaging,
        saleType: submitData.saleType,
        price: submitData.price,
        purchasePrice: submitData.purchasePrice,
        expirationDate: submitData.expirationDate,
        productionDate: submitData.productionDate,
        quantity: submitData.quantity,
        toLend: submitData.toLend,
        agentId: selectedAgent.value?.id,
      }),
    ).then(() => {
      toast.success(t('productAddedSuccessfully'))
      UpcomingProductService.getProductsDetails({ limit: pageSize, page: currentPage2.value, name: route.query.search })
        .then((res) => {
          useProductHistoryStore().clearStore()
          useProductHistoryStore().totalHistories = res.total
          useProductHistoryStore().setProductHistories(res.data)
        })
      clearSubmitData()
      isLoading.value = false
    }).catch(() => {
      toast.error(t('errorWhileCreatingProduct'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
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

const getProducts = () => {
  console.log("aaaaaaaaaaaaaaaaaaa");
  ProductService.getProducts({})
    .then((res) => {
      useProductStore().clearStore()
      useProductStore().setProducts(res.data)
    })
}

getProducts()

watch(() => useModalStore().isOpenCreateProductModal, data => {
  if (data) getAgents()
}, { deep: true })

watch([() => submitData.boxPrice, () => submitData.quantity], ([newBoxPrice, newQuantity]) => {
  if (newBoxPrice > 0 && newQuantity > 0) {
    const sum = Math.round(newBoxPrice / newQuantity)
    submitData.purchasePrice = sum
  }
})

const findAndSelectAgent = (agentId) => {
  agents.value.map((agent) => {
    if (agent?.id === agentId) {
      console.log('find: ' + agent?.id)
      dropdownStore.setSelectOptionAgent(agent)
      console.log('select agent: ' + selectedAgent.value?.id)
    }
  })
}

const isOpenAgentCreatePopup = ref()
const toggle = (event) => {
  isOpenAgentCreatePopup.value.toggle(event)
  clearAgentForm()
}

const phoneRegex = /\+998[1-9][\d]{8}/

const submitAgentForm = reactive({
  fullName: '',
  phone: '',
  company: '',
})

const clearAgentForm = () => {
  submitAgentForm.fullName = ''
  submitAgentForm.phone = ''
  submitAgentForm.company = ''
}

const createAgent = () => {
  if (!submitAgentForm.fullName) {
    toast.warning(t('plsEnterFullName'))
  } else if (!submitAgentForm.phone) {
    toast.warning(t('plsEnterPhoneNumber'))
  } else if (submitAgentForm.phone && !phoneRegex.test(submitAgentForm.phone.replace(/([() -])/g, ''))) {
    toast.warning(t('plsEnterValidPhoneNumber'))
  } else if (!submitAgentForm.company) {
    toast.warning(t('plsEnterCompany'))
  } else {
    isLoadingAgent.value = true
    AgentService.createAgent(
      cleanObjectEmptyFields({
        fullName: submitAgentForm.fullName,
        company: submitAgentForm.company,
        phone: submitAgentForm.phone.replace(/([() -])/g, ''),
      }),
    ).then(() => {
      toast.success(t('agentAddedSuccessfully'))
      isLoadingAgent.value = false
      clearAgentForm()
      AgentService.getAgents()
        .then((res) => {
          useAgentStore().clearStore()
          useAgentStore().setAgents(res)
        })
    }).catch(() => {
      toast.error(t('errorWhileCreatingAgent'))
      isLoadingAgent.value = false
      clearAgentForm()
    })
    toggle()
  }
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenCreateUpcomingProductModal"
    v-if="useModalStore().isOpenCreateUpcomingProductModal" @close="closeModal()">
    <template v-slot:header>
      {{ $t('addUpcomingProduct') }}
    </template>
    <template v-slot:body>
      <div class="space-y-2 md:space-y-4">
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base md:text-lg font-medium">
              {{ $t('product') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <MultiSelect v-model="selectedCities" :options="products" filter optionLabel="name"
              placeholder="Mahsulotlarni tanlang" :maxSelectedLabels="3" class="bg-slate-100 w-full" />
          </div>
          <div class="flex-1 space-y-1">
            <label for="default-type" class="text-base md:text-lg font-medium">
              {{ $t('saleType') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="default-type" v-model="submitData.saleType"
              class="bg-slate-100 border-none text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
              <option value="" selected>{{ $t('selectType') }}</option>
              <option value="amount">Donali</option>
              <option value="kg">Kilogrammli</option>
              <option value="g">Gramli</option>
              <option value="litre">Litrli</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1 space-y-1">
            <label for="quantity" class="text-base md:text-lg font-medium">
              {{ $t('quantity') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="quantity" type="number" v-model="submitData.quantity"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductQuantity')">
          </div>
          <div class="flex-1 space-y-1">
            <label for="price" class="text-base md:text-lg font-medium">
              {{ $t('fullPrice') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <money3 v-model.number="submitData.price" v-bind="moneyConf" id="price"
              class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
            </money3>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1 space-y-1 items-center">
            <label for="agents" class="text-base md:text-lg font-medium">
              {{ $t('agents') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <div class="flex space-x-2 space-y-1 items-center flex-row">
              <SelectOptionAgent class="w-96 " :options="agents" />
              <div class="h-full">
                <button type="button" @click="toggle">
                  <PhUserPlus class="w-9 h-full bg-slate-100 text-slate-600 rounded-lg p-2" />
                </button>
                <OverlayPanel ref="isOpenAgentCreatePopup">
                  <div class="flex flex-col space-y-3 w-80 md:w-96">
                    <div class="flex-1">
                      <label for="agent-fullName" class="text-base font-medium">
                        {{ $t('fullName') }}
                        <span class="text-red-500 mr-2">*</span>
                      </label>
                      <input id="agent-fullName" type="text" v-model="submitAgentForm.fullName"
                        class="bg-slate-100 placeholder:line-clamp-2 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                        :placeholder="t('enterFullName')">
                    </div>
                    <div class="flex-1">
                      <label for="phone" class="text-base font-medium">
                        {{ $t('phone') }}
                        <span class="text-red-500 mr-2">*</span>
                      </label>
                      <input id="phone" type="text" v-model="submitAgentForm.phone" v-maska
                        data-maska="+998(##) ###-##-##"
                        class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                        placeholder="+998(00) 000-00-00">
                    </div>
                    <div class="flex-1">
                      <label for="company" class="text-base font-medium">
                        {{ $t('company') }}
                        <span class="text-red-500 mr-2">*</span>
                      </label>
                      <input id="company" type="text" v-model="submitAgentForm.company"
                        class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                        :placeholder="t('enterCompany')">
                    </div>
                  </div>
                  <div class="flex mt-3 items-center justify-end w-full">
                    <button v-if="isLoadingAgent"
                      class="bg-green-500 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded-md">
                      {{ $t('loading') }}
                    </button>
                    <button v-else class="bg-green-500 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded-md"
                      @click="createAgent">
                      {{ $t('create') }}
                    </button>
                  </div>
                </OverlayPanel>
              </div>
            </div>
          </div>
          <div class="flex-1 space-y-1 md:pb-0 pb-12">
            <label for="price" class="text-base md:text-lg font-medium">
              {{ $t('arrivalTime') }}
            </label>
            <input id="quantity" type="date" v-model="submitData.expirationDate"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
              :placeholder="t('enterProductQuantity')">
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="createProduct()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>