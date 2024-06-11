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
import ProductService from '../../services/product.service'
import { computed, reactive, ref, watch, watchEffect } from 'vue'
import { isBarcode } from '../../mixins/barcodeFormatter'
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

const decodedBarcode = computed(() => {
  return barcodeStore.decodedBarcode
})

const agents = computed(() => {
  return agentStore.agents
})

const selectedAgent = computed(() => {
  return dropdownStore.selectOptionAgent
})

const selectedProductHistory = computed(() => {
  return productHistoryStore.selectedProductHistory
})

const pageSize = 50
const percentage = ref(0)

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const onSearchFocus = ref(null)
const isLoading = ref(false)
const isLoadingAgent = ref(false)
const isSearching = ref(false)
const searchProductBarcode = ref('')
const productBarcode = ref({})
const productBarcodes = ref([])

const submitData = reactive({
  name: '',
  barcode: '',
  packaging: '',
  saleType: '',
  price: 0,
  toLend: false,
  quantity: 0,
  purchasePrice: 0,
  boxPrice: 0,
  productionDate: '',
  expirationDate: '',
})

const clearSubmitData = () => {
  dropdownStore.setSelectOptionAgent('')
  submitData.name = ''
  submitData.barcode = ''
  submitData.packaging = ''
  submitData.saleType = ''
  submitData.price = 0
  submitData.purchasePrice = 0
  submitData.boxPrice = 0
  submitData.productionDate = ''
  submitData.expirationDate = ''
  submitData.toLend = false
  submitData.quantity = 0
}

const closeModal = () => {
  useModalStore().closeCreateProductModal()
  useProductHistoryStore().setSelectedProductHistory('')
  clearSubmitData()
  productBarcodes.value = []
}

const createProduct = () => {
  if (!submitData.name) {
    toast.warning(t('plsEnterProductName'))
  } else if (submitData.barcode && !isBarcode(submitData.barcode)) {
    toast.warning(t('barcodeIsInvalid'))
  } else if (!submitData.packaging) {
    toast.warning(t('plsEnterProductPackaging'))
  } else if (!submitData.saleType) {
    toast.warning(t('plsSelectSaleType'))
  } else if (submitData.quantity <= 0) {
    toast.warning(t('plsEnterProductQuantity'))
  } else if (!selectedAgent.value?.id) {
    toast.warning(t('plsSelectAgent'))
  } else if (submitData.price <= 0) {
    toast.warning(t('plsEnterProductPrice'))
  } else {
    isLoading.value = true
    ProductService.createProduct(
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
      ProductService.getProducts({ limit: pageSize, page: currentPage1.value })
        .then((res) => {
          useProductStore().clearStore()
          useProductStore().total = res.total
          useProductStore().setProducts(res.data)
        })
      ProductService.getProductsDetails({ limit: pageSize, page: currentPage2.value, name: route.query.search })
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

const searchProductBarcodes = () => {
  if (!searchProductBarcode.value) {
    toast.error(t('plsEnterProductNameOrBarcode'))
  } else {
    isSearching.value = true
    ProductService.searchProductBarcodeByParams({
      search: searchProductBarcode.value,
    }).then((res) => {
      if (res.length === 0) {
        toast.info(t('thereIsNoSuchBarcodeProduct'))
        clearSubmitData()
        submitData.barcode = searchProductBarcode.value
      } else if (res.length === 1) {
        useBarcodeStore().setDecodedBarcode('')
        productBarcode.value = res[0]
      } else {
        useBarcodeStore().setDecodedBarcode('')
        productBarcodes.value = res
      }
      isSearching.value = false
      searchProductBarcode.value = ''
    }).catch(() => {
      toast.error(t('errorGettingProduct'))
      setTimeout(() => {
        isSearching.value = false
      }, 3000)
    })
  }
}

const selectedProductBarcode = (product) => {
  productBarcode.value = product
  productBarcodes.value = []
}

const whenPressEnter = (e) => {
  if (e.keyCode === 13) searchProductBarcodes()
}


watchEffect(() => {
  if (onSearchFocus.value) onSearchFocus.value.focus()
})

watch(
  () => productBarcode.value,
  (data) => {
    if (data) {
      submitData.barcode = data?.barcode
      submitData.name = data?.trademark
      submitData.packaging = data?.packaging
      submitData.saleType = data?.saleType
    }
  },
  { deep: true },
)

watch(
  () => decodedBarcode.value,
  (data) => {
    if (data && router?.currentRoute?.value?.path === '/products') {
      searchProductBarcode.value = data
      searchProductBarcodes()
    }
  },
  { deep: true },
)

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

watch(
  () => selectedProductHistory.value,
  (data) => {
    if (data) {
      // findAndSelectAgent(data?.agentId)
      // dropdownStore.setSelectOptionAgent(agents.value.filter(a => a?.id === data?.agentId)[0])
      submitData.name = data?.name
      // submitData.barcode = data?.barcode
      submitData.packaging = data?.packaging
      submitData.saleType = data?.saleType
      submitData.price = data?.price
      submitData.quantity = data?.quantity
      submitData.toLend = data?.toLend
      submitData.purchasePrice = data?.purchasePrice
      submitData.productionDate = data?.productionDate
      submitData.expirationDate = data?.expirationDate
    }
  },
  { deep: true },
)

const getSaleSettings = () => {
  SettingsService.getSettings().then((res) => {
    percentage.value = res.percentage
  }).catch(() => {
    toast.error($t('errorWhileGettingSaleSettings'))
  })
}

watch([() => submitData.purchasePrice, () => submitData.boxPrice, () => !useModalStore().isOpenCreateProductModal], data => {
  if (data) getSaleSettings()
})

watch([() => percentage.value, () => submitData.purchasePrice], (data) => {
  if (data) {
    let salePrice = Math.round(submitData.purchasePrice + (submitData.purchasePrice * percentage.value) / 100)
    const hundredths = salePrice % 1000
    if (hundredths < 500 && hundredths > 1) {
      salePrice = Math.floor(salePrice / 1000) * 1000 + 500
    } else if (hundredths > 500 && hundredths < 1000) {
      salePrice = Math.floor(salePrice / 1000) * 1000 + 1000
    }
    submitData.price = Math.round(salePrice)
  }
})

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
  <CModal :is-open="useModalStore().isOpenCreateProductModal" v-if="useModalStore().isOpenCreateProductModal"
          @close=closeModal>
    <template v-slot:header>
      {{ $t('createProduct') }}
    </template>
    <template v-slot:body>
      <div class="relative mb-8">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon class="w-5 h-5 text-slate-400" />
        </div>
        <input type="search" v-model="searchProductBarcode" ref="onSearchFocus" v-on:keypress="whenPressEnter($event)"
               class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-12 pl-10 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
               :placeholder="t('searchByProductNameOrBarcode')">
        <div class="absolute inset-y-0 right-0 flex items-center space-x-2">
          <div @click="useModalStore().openCameraScannerModal()"
               class="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-white cursor-pointer">
            <BarcodeIcon class="w-6 h-6 text-slate-900" />
          </div>
          <button type="button" @click="searchProductBarcodes()"
                  class="px-4 bg-[#0167F3] text-white rounded-lg text-base h-full md:text-lg cursor-pointer">
            {{ $t('search') }}
          </button>
        </div>
        <div v-if="productBarcodes.length > 0" class="absolute top-16 left-0 bg-transparent w-full space-y-2 z-[2000]">
          <ScrollPanel style="height: 600px;">
            <div v-for="(product, idx) in productBarcodes" :key="idx" @click="selectedProductBarcode(product)"
                 class="flex items-center justify-between bg-white border shadow-sm rounded-xl px-3 py-2 w-full cursor-pointer hover:bg-slate-100">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center bg-slate-200 w-10 h-10 rounded-lg">
                  <ImageIcon class="text-gray-500 w-8 h-8" />
                </div>
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ product?.trademark + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-base font-medium text-gray-500">
                    {{ product?.type_code }}
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
        <div class="space-y-2 md:space-y-4">
          <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div class="flex-1">
              <label for="name" class="text-base md:text-lg font-medium">
                {{ $t('productName') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="name" type="text" v-model="submitData.name"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                     :placeholder="t('enterProductName')">
            </div>
            <div class="flex-1">
              <label for="barcode" class="text-base md:text-lg font-medium">
                {{ $t('barcode') }}
              </label>
              <input id="barcode" type="text" v-model="submitData.barcode"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                     :placeholder="t('enterProductBarcode')">
            </div>
          </div>
          <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div class="flex-1 space-y-1">
              <label for="default-value" class="text-base md:text-lg font-medium">
                {{ $t('packaging') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="default-value" type="text" v-model="submitData.packaging"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                     :placeholder="t('enterProductPackaging')">
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
              <label for="boxPrice" class="text-base md:text-lg font-medium">
                {{ $t('fullPrice') }}
              </label>
              <money3 v-model.number="submitData.boxPrice" v-bind="moneyConf" id="boxPrice"
                      class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
              </money3>
            </div>
          </div>
          <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div class="flex-1 space-y-1">
              <label for="purchasePrice" class="text-base md:text-lg font-medium">
                {{ $t('purchasePrice') }}
              </label>
              <money3 v-model.number="submitData.purchasePrice" v-bind="moneyConf" id="purchasePrice"
                      class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
              </money3>
            </div>
            <div class="flex-1 spaceSearchIcon-y-1">
              <label for="price" class="text-base md:text-lg font-medium">
                {{ $t('price') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <money3 v-model.number="submitData.price" v-bind="moneyConf" id="price"
                      class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
              </money3>
            </div>
          </div>
          <div class="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div class="flex-1 space-y-1">
              <label for="quantity" class="text-base md:text-lg font-medium">
                {{ $t('productionDate') }}
              </label>
              <input id="quantity" type="date" v-model="submitData.productionDate"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                     :placeholder="t('enterProductQuantity')">
            </div>
            <div class="flex-1 spaceSearchIcon-y-1">
              <label for="price" class="text-base md:text-lg font-medium">
                {{ $t('expirationDate') }}
              </label>
              <input id="quantity" type="date" v-model="submitData.expirationDate"
                     class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400 placeholder:text-sm md:placeholder:text-lg"
                     :placeholder="t('enterProductQuantity')">
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
                      <button v-else
                              class="bg-green-500 hover:bg-green-700 text-white font-bold py-1.5 px-3 rounded-md"
                              @click="createAgent">
                        {{ $t('create') }}
                      </button>
                    </div>
                  </OverlayPanel>
                </div>
              </div>
            </div>
            <div class="flex-1 space-y-1 md:pb-0 pb-12">
              <label for="toLend" class="text-base md:text-lg font-medium">
                {{ $t('toLend') }}
              </label>
              <div class="flex items-center px-4 border border-gray-200 bg-slate-50 rounded-lg mt-2 lg:mt-0 md:mt-0">
                <input v-model="submitData.toLend" id="toLend" type="checkbox"
                       class="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2 mr-2">
                <label for="toLend" class="py-2 text-base font-medium">{{ $t('toLend') }}</label>
              </div>
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