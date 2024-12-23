<script setup>
import { vMaska } from 'maska'
import { reactive, ref } from 'vue'
import { toast } from 'vue-sonner'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { cleanObjectEmptyFields } from '../../mixins/utils'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import { useI18n } from 'vue-i18n'
import { useCategoryStore } from '../../store/category.store.js'
import CategoryService from '../../services/category.service.js'

const { t } = useI18n()

const isLoading = ref(false)

const submitForm = reactive({
  name: '',
  
})

const clearForm = () => {
  submitForm.name = ''
}

const closeModal = () => {
  useModalStore().closeCreateCategoryModal()
  clearForm()
}

const createCategory = () => {
  if (!submitForm.name) {
    toast.warning(t('plsEnterFullName'))
  } else {
    isLoading.value = true
    CategoryService.createCategory(
      cleanObjectEmptyFields({
        name: submitForm.name,

      }),
    ).then(() => {
      toast.success(t('agentAddedSuccessfully'))
      isLoading.value = false
      CategoryService.getCategories()
        .then((res) => {
          useCategoryStore().clearStore()
          useCategoryStore().setCategories(res)
          useCategoryStore().renderkey += 1
        })
    }).catch(() => {
      toast.error(t('errorWhileCreatingAgent'))
      isLoading.value = false
    })
    closeModal()
  }
}

</script>
<template>
  <CModal :is-open="useModalStore().isOpenCreateCategoryModal" v-if="useModalStore().isOpenCreateCategoryModal"
            @close=closeModal>
      <template v-slot:header>
        {{ $t('CreateCategory') }}
      </template>
      <template v-slot:body>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="firstname" class="text-base dark:text-white font-medium">
                {{ $t('nameCategory') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="firstname" type="text" v-model="submitForm.name"
                     class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                     :placeholder="t('enterNameCategory')">
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
        <button v-else @click="createCategory()" type="button"
                class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
          {{ $t('create') }}
        </button>
      </template>
  </CModal>
</template>

<style scoped></style>