<script setup>
import PhPencilLine from '../../assets/icons/EditIcon.vue'
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import { useProductStore } from '../../store/product.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import ProductService from '../../services/product.service.js'
import { computed, reactive, ref, toRefs, watch } from 'vue'

const isLoading = ref(false)
const productStore = useProductStore()

const selectedProduct = computed(() => {
  return productStore.selectedProduct
})

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const submitData = reactive({
  id: '',
  name: '',
  barcode: 0,
  packaging: '',
    price: 0,
  saleType: 0,
})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.name = ''
  submitData.barcode = 0
  submitData.packaging = ''
    submitData.price = 0
  submitData.saleType = 0
}

const closeModal = () => {
  useModalStore().closeEditProductModal()
  useProductStore().setSelectedProduct({})
  clearSubmitData()
}

const editProduct = () => {
  if (!submitData.value.name) {
    toast.error('Mahsulot nomini kiriting!')
  } else if (!submitData.value.barcode == 0) {
    toast.error('Mahsulot shtrix kodini kiriting!')
  } else if (!submitData.value.packaging) {
    toast.error('Mahsulot standart qiymatini kiriting!')
    } else if (submitData.value.price == 0) {
    toast.error('Mahsulot narxini kiriting!')
  } else if (submitData.value.saleType == 0) {
    toast.error('Mahsulot sotuv turini kiriting!')
  } else {
    toast.success('Mahsulot muoffaqiyatli taxrirlandi!')
    closeModal()
  }
}

watch(
  () => selectedProduct.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
      submitData.name = data?.name
      submitData.barcode = data?.barcode
      submitData.packaging = data?.packaging
      submitData.price = data?.price
      submitData.saleType = data?.saleType
    }
  }
)
</script>

<template>
  <CModal :is-open="useModalStore().isOpenEditProductModal" v-if="useModalStore().isOpenEditProductModal" @close="closeModal">
    <template v-slot:header> Mahsulotni tahrirlash </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base font-medium">
              Mahsulot nomi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.name" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Mahsulot nomini kiriting" />
          </div>
          <div class="flex-1">
            <label for="barcode" class="text-base font-medium">
              Shtrix kodi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="barcode" type="text" v-model="submitData.barcode" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Shtrix kodini kiriting" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="packaging" class="text-base font-medium">
              Qadoqi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="packaging" type="text" v-model="submitData.packaging" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Qadoqi haqidama'lumot kiriting" />
          </div>
          <div class="flex-1">
            <label for="default-type" class="text-base font-medium">
              Sotuv turi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="default-type" v-model="submitData.saleType" class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
              <option value="" selected>Turini tanlang</option>
              <option value="amount">Donali</option>
              <option value="g">Gramli</option>
              <option value="litre">Litrli</option>
            </select>
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="price" class="text-base font-medium">
              Narxi
              <span class="text-red-500 mr-2">*</span>
            </label>
            <money3 v-model.number="submitData.price" v-bind="moneyConf" id="price" class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg"> </money3>
          </div>
          <div class="flex-1"></div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="bSearchIconutton"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        Saqlash
      </button>
      <button v-else @click="editProduct()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        Saqlash
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>
