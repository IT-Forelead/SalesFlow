<script setup>
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import { useProductStore } from '../../store/product.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import ProductService from '../../services/product.service.js'
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()
const productStore = useProductStore()

const isLoading = ref(false)

const selectedProduct = computed(() => {
  return productStore.selectedProduct
})

const currentPage = computed(() => {
  return productStore.currentPage
})



const submitData = reactive({
  id: '',
  name: '',

})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.name = ''

}

const closeModal = () => {
  useModalStore().closeeditCategoryModal()
  useProductStore().setSelectedProduct({})
  clearSubmitData()
}

const updateCategory = () => {
  ProductService.updateCategory({
    id: submitData.id,
    name: submitData.name,

  }).then(() => {
    toast.success(t('productEditedSuccessfully'))
    ProductService.getProducts({ limit: 30, page: currentPage.value, name: route.query.search })
      .then((res) => {
        productStore.clearStore()
        productStore.setProducts(res.data)
      })
      .catch((err) => {
        toast.error(err.message)
      })
    isLoading.value = false
    closeModal()
  }).catch((err) => {
    console.log(err);
    if (err.response.data.includes("already exist")) {
      toast.error(t('thisProductNameAlreadyExist'))
    } else {
      toast.error(t('errorWhileEditingProduct'))
    }
    isLoading.value = false
  })
}

const editCategory = () => {
  if (!submitData.name) {
    toast.warning(t('plsEnterProductName'))
  }  else {
    isLoading.value = true
    const formData = new FormData()
    if (submitData.image) {
      formData.append('image', submitData.image)
      ProductService.uploadImage(formData)
        .then((res) => {
          submitData.assetId = res
          updateCategory()
        })
        .catch((err) => {
         
          isLoading.value = false
        })
    } else updateCategory()
  }
}


watch(
  () => selectedProduct.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
      submitData.name = data?.name
    }
  },
  { deep: true }
)

</script>
<template>
  <CModal :is-open="useModalStore().isOpeneditCategoryModal" v-if="useModalStore().isOpeneditCategoryModal"
    @close="closeModal">
    <template v-slot:header>
      {{ $t('editCategory') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="name" class="text-base dark:text-white md:text-lg font-medium">
              {{ $t('productName') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="name" type="text" v-model="submitData.name"
              class="bg-slate-100 border-none text-slate-900 dark:text-white dark:bg-slate-700 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterProductName')" />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button v-if="isLoading" type="button"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        {{ $t('save') }}
      </button>
      <button v-else @click="editCategory()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('save') }}
      </button>
    </template>
  </CModal>
</template>
