<script setup>
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'

import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useCategoryStore } from '../../store/category.store.js'
import CategoryService from '../../services/category.service.js'

const categoryStore = useCategoryStore()
const { t } = useI18n()
const route = useRoute()


const isLoading = ref(false)

const selectedCategory = computed(() => {
  return categoryStore.selectedCategory
})

const currentPage = computed(() => {
  return categoryStore.currentPage
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
  useModalStore().closeEditCategoryModal()
  useCategoryStore().setSelectedCategory({})
  clearSubmitData()
}

const updateCategory = () => {
  CategoryService.updateCategory({
    id: submitData.id,
    name: submitData.name,

  }).then(() => {
    toast.success(t('productEditedSuccessfully'))
    CategoryService.getCategories({ limit: 30, page: currentPage.value, name: route.query.search })
      .then((res) => {
        categoryStore.clearStore()
        categoryStore.setCategories(res.data)
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
      CategoryService.uploadImage(formData)
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
  () => selectedCategory.value,
  (data) => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAA");
    if (data && useModalStore().isOpenEditCategoryModal) {
      submitData.id = data?.id;
      submitData.name = data?.name;
      console.log("OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
    }
  },
  { deep: true }
)

</script>
<template>
  <CModal :is-open="useModalStore().isOpenEditCategoryModal" v-if="useModalStore().isOpenEditCategoryModal"
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
