<script setup>
import { cleanObjectEmptyFields } from '../../mixins/utils'
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useRoute, useRouter } from 'vue-router'
import { useModalStore } from '../../store/modal.store'
import { useProductStore } from '../../store/product.store'
import { useBarcodeStore } from '../../store/barcode.store'
import { useUpcomingProductStore } from '../../store/upcomingProduct.store'
import CancelButton from '../buttons/CancelButton.vue'
import SearchIcon from '../../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import TrashIcon from '../../assets/icons/TrashIcon.vue'
import UpcomingProductService from '../../services/upcomingProduct.service'
import ProductService from '../../services/product.service'
import { computed, reactive, ref, watch } from 'vue'
import ImageIcon from '../../assets/icons/ImageIcon.vue'
import { useI18n } from 'vue-i18n'
import AgentService from '../../services/agent.service'
import { useAgentStore } from '../../store/agent.store'
import SelectOptionAgent from '../inputs/SelectOptionAgent.vue'
import { useDropdownStore } from '../../store/dropdown.store'
import ScrollPanel from 'primevue/scrollpanel'
import { useProductHistoryStore } from '../../store/productHistory.store'
import OverlayPanel from 'primevue/overlaypanel'
import PhUserPlus from '../../assets/icons/PlusCircleIcon.vue'
import Calendar from 'primevue/calendar'
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

const decodedBarcode = computed(() => {
  return barcodeStore.decodedBarcode
})

const pageSize = 50

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const onSearchFocus = ref(null)
const isLoading = ref(false)
const isLoadingAgent = ref(false)
const isSearching = ref(false)
const searchProduct = ref('')
const productBarcode = ref({})
const productBarcodes = ref([])

const selectedProducts = ref([])

const submitData = reactive({
  productIds: [],
  expectedTime: '',
  paymentType: '',
  price: 0,
  agentId: '',
  quantity: 0,
})

const clearSubmitData = () => {
  selectedProducts.value = []
  dropdownStore.setSelectOptionAgent('')
  submitData.productIds = []
  submitData.paymentType = ''
  submitData.expectedTime = ''
  submitData.price = 0
  submitData.quantity = 0
}

const closeModal = () => {
  useModalStore().closeCreateUpcomingProductModal()
  clearSubmitData()
  productBarcodes.value = []
}

const createUpcomingProduct = () => {
  if (!submitData.productIds.length == 0) {
    toast.warning(t('plsSelectProducts'))
  } else if (!submitData.paymentType) {
    toast.warning(t('plsSelectPaymentStatus'))
  } else if (!submitData.expectedTime) {
    toast.warning("expectedTime ni tanlang")
  } else if (submitData.price <= 0) {
    toast.warning(t('plsEnterPrice'))
  } else {
    isLoading.value = true
    UpcomingProductService.createUpcomingProduct({
      products: selectedProducts.value.map(el => {
        return {
          productId: el.id,
          quantity: el.quantity,
        }
      }),
      price: submitData.price,
      expectedTime: submitData.expectedTime,
      agentId: selectedAgent.value?.id,
      paymentType: submitData.paymentType,
    }).then(() => {
      toast.success(t('upcomingProductCreatedSuccessfully'))
      UpcomingProductService.getUpcomingProducts({ limit: pageSize, page: currentPage2.value })
        .then((res) => {
          useUpcomingProductStore().clearStore()
          useUpcomingProductStore().setTotal(res.total)
          useUpcomingProductStore().setUpcomingProducts(res.data)
        })
      closeModal()
      isLoading.value = false
    }).catch(() => {
      toast.error(t('errorWhileCreatingUpcomingProduct'))
      setTimeout(() => {
        isLoading.value = false
      }, 3000)
    })
  }
}

const removeProduct = (product) => {
  selectedProducts.value = selectedProducts.value.filter((p) => p.id !== product.id)
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

watch(() => useModalStore().isOpenCreateUpcomingProductModal, data => {
  if (data) getAgents()
}, { deep: true })

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

const whenPressEnter = (e) => {
  if (e.keyCode === 13) searchProducts()
}

const searchProducts = () => {
  if (!searchProduct.value) {
    toast.error(t('plsEnterProductNameOrBarcode'))
  } else {
    isSearching.value = true
    ProductService.getProducts({
      name: searchProduct.value,
    }).then((res) => {
      if (res.data.length === 0) {
        toast.info(t('thereIsNoSuchBarcodeProduct'))
        // clearSubmitData()
        submitData.barcode = searchProduct.value
      } else if (res.length === 1) {
        useBarcodeStore().setDecodedBarcode('')
        productBarcode.value = res.data[0]
      } else {
        useBarcodeStore().setDecodedBarcode('')
        productBarcodes.value = res.data
      }
      isSearching.value = false
      searchProduct.value = ''
    }).catch(() => {
      toast.error(t('errorGettingProduct'))
      setTimeout(() => {
        isSearching.value = false
      }, 3000)
    })
  }
}

watch(
  () => decodedBarcode.value,
  (data) => {
    if (data && router?.currentRoute?.value?.path === '/products') {
      searchProduct.value = data
      searchProducts()
    }
  },
  { deep: true },
)

const selectProduct = (data) => {
  selectedProducts.value.push({
    id: data?.id,
    name: data?.name,
    quantity: submitData.quantity,
    packaging: data?.packaging,
  })
  productBarcodes.value = []
}

const openCreateProductModal = () => {
  if (!useModalStore().isOpenCreateProductModal) {
    useModalStore().openCreateProductModal()
    useModalStore().closeCreateUpcomingProductModal()
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
      <div class="flex space-x-1 space-y-2 md:space-y-0 md:flex-row flex-col mb-6 justify-between">
        <div class="relative w-full md:w-[calc(100%-13rem)]">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon class="w-5 h-5 text-slate-400 dark:text-white" />
          </div>
          <input type="search" v-model="searchProduct" ref="onSearchFocus" v-on:keypress="whenPressEnter($event)"
                 class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full h-12 pl-10 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                 :placeholder="t('searchByProductNameOrBarcode')">
          <div class="absolute inset-y-0 right-0 flex items-center space-x-2">
            <button type="button" @click="searchProducts()"
                    class="px-4 bg-[#0167F3] text-white rounded-lg text-base h-full md:text-lg cursor-pointer">
              {{ $t('search') }}
            </button>
          </div>
        </div>
        <button type="button" @click="openCreateProductModal"
                class="px-4 bg-[#0167F3] text-white rounded-lg text-base md:text-lg py-2 cursor-pointer">
          {{ $t('addProduct') }}
        </button>
        <div v-if="productBarcodes.length > 0" class="absolute top-36 px-4 left-0 bg-transparent w-full space-y-2 z-[2000]">
          <ScrollPanel style="height: 600px;">
            <div v-for="(product, idx) in productBarcodes" :key="idx" @click="selectProduct(product)"
              class="flex items-center justify-between bg-white dark:bg-slate-800 border shadow-sm rounded-xl px-3 py-2 w-full cursor-pointer hover:bg-slate-100">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center bg-slate-200 w-10 h-10 rounded-lg">
                  <ImageIcon class="text-gray-500 dark:text-zinc-300 w-8 h-8" />
                </div>
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-base font-medium text-gray-500 dark:text-zinc-300">
                    {{ product?.saleType }}
                  </div>
                </div>
              </div>
              <div class="text-base font-semibold text-gray-800">
                {{ product?.barcode }}
              </div>
            </div>
          </ScrollPanel>
        </div>
      </div>

        <div v-if="selectedProducts.length" class="overflow-y-auto overflow-x-auto h-96">
          <h4 class="text-slate-900 dark:text-white text-xl font-semibold">
            {{ $t('products') }}
          </h4>
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
            <tr>
              <th class="rounded-l-xl px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase">
                {{ $t('image') }}
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase">
                {{ $t('product') }}
              </th>
              <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase">
                {{ $t('quantity') }}
              </th>
              <th class="px-6 py-3 rounded-r-xl text-right text-xs font-medium text-gray-500 dark:text-zinc-300 uppercase">
                {{ $t('actions') }}
              </th>
            </tr>
            </thead>
            <tbody class="bg-white dark:bg-slate-800 divide-y divide-gray-200">
            <tr v-for="(product, idx) in selectedProducts" :key="idx">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10">
                    <ImageIcon class="text-gray-500 dark:text-zinc-300 w-8 h-8" />
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm font-medium text-gray-900 dark:text-zinc-200">
                  {{ product?.name + ' - ' + product?.packaging }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <input type="number" v-model="product.quantity" class="w-24 bg-slate-100 border-none text-slate-900 dark:bg-slate-700 dark:text-white rounded-lg text-base md:text-lg block h-10">
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <TrashIcon @click="removeProduct(product)" class="w-6 h-6 text-rose-500 cursor-pointer transform hover:scale-105" />
              </td>
            </tr>
            </tbody>
          </table>
        </div>


      <div class="space-y-2 md:space-y-4">
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1 space-y-1">
            <label for="price" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('fullPrice') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <money3 v-model.number="submitData.price" v-bind="moneyConf" id="price"
              class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
            </money3>
          </div>
          <div class="flex-1 space-y-1">
            <label for="default-type" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('paymentType') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="default-type" v-model="submitData.paymentType"
              class="bg-slate-100 border-none text-slate-900 dark:bg-slate-700 dark:text-white rounded-lg text-base md:text-lg block w-full h-11">
              <option value="" selected>{{ $t('selectType') }}</option>
              <option value="cash">{{ $t('cash') }}</option>
              <option value="terminal">{{ $t('terminal') }}</option>
              <option value="bank_transfer">{{ $t('bankTransfer') }}</option>
            </select>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
          <div class="flex-1 space-y-1 items-center">
            <label for="agents" class="text-base dark:text-white md:text-lg font-medium">
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
                      <label for="agent-fullName" class="text-base dark:text-white font-medium">
                        {{ $t('fullName') }}
                        <span class="text-red-500 mr-2">*</span>
                      </label>
                      <input id="agent-fullName" type="text" v-model="submitAgentForm.fullName"
                        class="bg-slate-100 placeholder:line-clamp-2 border-none text-slate-900 dark:bg-slate-700 dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
                        :placeholder="t('enterFullName')">
                    </div>
                    <div class="flex-1">
                      <label for="phone" class="text-base dark:text-white font-medium">
                        {{ $t('phone') }}
                        <span class="text-red-500 mr-2">*</span>
                      </label>
                      <input id="phone" type="text" v-model="submitAgentForm.phone" v-maska
                        data-maska="+998(##) ###-##-##"
                        class="bg-slate-100 border-none text-slate-900 dark:bg-slate-700 dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
                        placeholder="+998(00) 000-00-00">
                    </div>
                    <div class="flex-1">
                      <label for="company" class="text-base dark:text-white font-medium">
                        {{ $t('company') }}
                        <span class="text-red-500 mr-2">*</span>
                      </label>
                      <input id="company" type="text" v-model="submitAgentForm.company"
                        class="bg-slate-100 border-none text-slate-900 dark:bg-slate-700 dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
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
            <label for="price" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('arrivalTime') }}
            </label>
            <Calendar class="w-full bg-slate-100 rounded-lg" input-class="bg-slate-100 border-none rounded-lg"
              v-model="submitData.expectedTime" :date-format="'dd/mm/yy'" :placeholder="t('enterExpectedTime')" />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
        {{ $t('create') }}
      </button>
      <button v-else @click="createUpcomingProduct()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>