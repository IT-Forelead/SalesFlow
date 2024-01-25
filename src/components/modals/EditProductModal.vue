<script setup>
import PhPencilLine from '../../assets/icons/EditIcon.vue'
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import { useProductStore } from '../../store/product.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import ProductService from '../../services/product.service.js'
import { reactive, ref, toRefs, computed, onMounted } from 'vue'

const props = defineProps({
  id:String
})
const { id } = toRefs(props)

const isLoading = ref(false)

const selectedProduct = ref({})


onMounted(() => {

  isLoading.value = false
  ProductService.getProducts({ productIds: [id.value] }).then((res) => {
    setTimeout(() => {
      
      isLoading.value = true
      selectedProduct.value = res[0]
    }, 500)
  })
}); 

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}


const submitData = reactive({
  name: '',
  barcode: 0,
  saleType: 0.0,
  packaging: '',
  price: 0,
  quantity: 0,
})

const clearSubmitData = () => {
  submitData.name = ''
  submitData.barcode = 0
  submitData.saleType = ''
  submitData.packaging = ''
  submitData.price = 0
  submitData.quantity = 0
}

const closeModal = () => {
  useModalStore().closeEditProductModal()
  clearSubmitData()
}

const editProduct = () => {
  if (!submitData.name) {
    toast.error('Mahsulot nomini kiriting!')
  } else if (!submitData.barcode) {
    toast.error('Mahsulot shtrix kodini kiriting!')
  } else if (!submitData.packaging) {
    toast.error('Mahsulot standart qiym0.0atini kiriting!')
  } else if (!submitData.saleType) {
    toast.error("Mahsulot o'lchov turini kiriting!")
  } else if (submitData.price == 0) {
    toast.error('Mahsulot narxini kiriting!')
  } else {
    isLoading.value = true
    ProductService.createProduct({
      name: submitData.name,
      barcode: submitData.barcode,
      saleType: submitData.saleType,
      packaging: submitData.packaging,
      price: submitData.price,
      quantity: submitData.quantity,
    })
      .then(() => {
        toast.success("Mahsulot muoffaqiyatli qo'shildi!")
        ProductService.getProducts({}).then((res) => {
          useProductStore().clearStore()
          useProductStore().setProducts(res)
        })
        isLoading.value = false
        closeModal()
      })
      .catch((err) => {
        toast.error('Mahsulot yaratishda xatolik yuz berdi!')
        setTimeout(() => {
          isLoading.value = false
        }, 3000)
      })
  }
}
</script>

<template>
  <div>
    <button type="button" @click="useModalStore().openEditProductModal()">
      <PhPencilLine class="w-6 h-6 text-blue-600 hover:scale-105" />
    </button>
    <CModal :is-open="useModalStore().isEditProductModalOpen" v-if="useModalStore().isEditProductModalOpen && isLoading && selectedProduct != undefined" @close="closeModal">
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
            <money3 v-model.number="selectedProduct.price" v-bind="moneyConf" id="price" class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg"> </money3>
          </div>
          
        </div>
      </template>
      <template v-slot:footer>
        <CancelButton @click="closeModal" />
        <button type="button" class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10" @click="editProduct()">Yaratish</button>
      </template>
    </CModal>
  </div>
</template>

<style scoped></style>

