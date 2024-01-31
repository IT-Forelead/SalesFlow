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

const productStore = useProductStore()

const selectedProduct = computed(() => {
  return productStore.selectedProduct
})

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const closeModal = () => {
  useModalStore().closeEditProductModal()
  useProductStore().setSelectedProduct({})
}

const editProduct = () => {
  if (!selectedProduct.value.name) {
    toast.error('Mahsulot nomini kiriting!')
  } else if (!selectedProduct.value.barcode) {
    toast.error('Mahsulot shtrix kodini kiriting!')
  } else if (!selectedProduct.value.packaging) {
    toast.error('Mahsulot standart qiym0.0atini kiriting!')
  } else if (!selectedProduct.value.saleType) {
    toast.error("Mahsulot o'lchov turini kiriting!")
  } else if (selectedProduct.value.price == 0) {
    toast.error('Mahsulot narxini kiriting!')
  } else {
    toast.success('Mahsulot muoffaqiyatli taxrirlandi!')
    closeModal()
  }
}
</script>

<template>
  <CModal :is-open="useModalStore().isOpenEditProductModal" v-if="useModalStore().isOpenEditProductModal" @close="closeModal">
    <template v-slot:header> Mahsulotni tahrirlash </template>
    <template v-slot:body>
      <div class="p-4 md:p-5 grid grid-cols-2 grid-rows-3 gap-4">
        <div class="flex flex-col">
          <label for="name" class="text-left text-base font-medium">
            Mahsulot nomi
            <span class="text-red-500 mr-2">*</span>
          </label>
          <input id="name" type="text" v-model="selectedProduct.name" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Mahsulot nomini kiriting" />
        </div>
        <div class="flex flex-col">
          <label for="name" class="text-left text-base font-medium"> Shtrix kodi </label>
          <input id="barcode" type="text" v-model="selectedProduct.barcode" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Shtrix kodini kiriting" />
        </div>
        <div class="flex flex-col">
          <label for="name" class="text-left text-base font-medium">
            Qadoqi
            <span class="text-red-500 mr-2">*</span>
          </label>
          <input id="default-value" type="text" v-model="selectedProduct.packaging" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400" placeholder="Qadoqini kiriting" />
        </div>
        <div class="flex flex-col">
          <label for="name" class="text-left text-base font-medium">
            Sotuv turi
            <span class="text-red-500 mr-2">*</span>
          </label>
          <select id="default-type" v-model="selectedProduct.saleType" class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
            <option selected>Turini tanlang</option>
            <option value="amount">dona</option>
            <option value="kg">kilogramm</option>
            <option value="g">gramm</option>
            <option value="litre">litr</option>
          </select>
        </div>
        <div class="flex flex-col">
          <label for="name" class="text-left text-base font-medium">
            Narxi
            <span class="text-red-500 mr-2">*</span>
          </label>
          <money3 v-bind="moneyConf" v-model.number="selectedProduct.price" id="price" class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg"> </money3>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button type="button" class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10" @click="editProduct()">Saqlash</button>
    </template>
  </CModal>
</template>

<style scoped></style>
