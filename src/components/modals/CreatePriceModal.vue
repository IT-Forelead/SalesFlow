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
import PriceService from '../../services/price.service.js'
import ProductService from '../../services/product.service.js'
import { usePriceStore } from '../../store/price.store.js'
import ImageIcon from '../../assets/icons/ImageIcon.vue'

const { t } = useI18n()
const isLoading = ref(false)
const selectedImage = ref('')
const submitForm = reactive({
  company: '',
  description: '',
  image: null,
  assetId: null,
  // upcomingProductId: '',
})

const clearForm = () => {
  submitForm.company = ''
  submitForm.description = ''
  submitForm.image = null
  submitForm.assetId = null
  // submitForm.upcomingProductId = ''
}

const closeModal = () => {
  useModalStore().closeCreatePriceModal()
  clearForm()
}

const createPrice = () => {
  PriceService.createPrice(
    cleanObjectEmptyFields({
      company: submitForm.company,
      description: submitForm.description,
      assetId: submitForm.assetId,
    }),
  ).then(() => {
    toast.success(t('priceAddedSuccessfully'))
    isLoading.value = false
    PriceService.getPrices()
      .then((res) => {
        const sortedPrices = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        usePriceStore().clearStore()
        usePriceStore().setTotal(res.total)
        usePriceStore().setPrices(sortedPrices)
        usePriceStore().renderkey += 1
      })
  }).catch(() => {
    toast.error(t('errorWhileCreatingPrice'))
    isLoading.value = false
  })
  closeModal()
}


const createPriceForm = () => {
  if (!submitForm.company) {
    toast.warning(t('plsEnterCompany'))
  } else if (!submitForm.image) {
    toast.warning(t('enterImage'))
  } else {
    isLoading.value = true
    const formData = new FormData()
    if (submitForm.image) {
      formData.append('image', submitForm.image)
      ProductService.uploadImage(formData)
        .then((res) => {
          submitForm.assetId = res
          createPrice()
        })
        .catch((err) => {
          toast.error(t('thereWasAnErrorUploadingThePhoto'))
          isLoading.value = false
        })

    } else {
      createPrice()
    }

  }
}



function getImage(e) {
  if (e.target.files[0].type.includes('image')) {
    submitForm.image = e.target.files[0]
    selectedImage.value = URL.createObjectURL(submitForm.image)
  } else toast.warning(t('youCanOnlyUploadPicture'))
}

</script>
<template>
  <CModal :is-open="useModalStore().isOpenCreatePriceModal" v-if="useModalStore().isOpenCreatePriceModal"
    @close=closeModal>
    <template v-slot:header>
      {{ $t('createPrice') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex flex-col p-5 mb-12">
          <label v-if="!submitForm.image" for="dropzone-file"
            class="relative flex items-center justify-center w-28 h-28 max-w-lg p-6 mx-auto text-center border-2 border-blue-400 border-dashed rounded-lg cursor-pointer bg-slate-100">
            <ImageIcon class="w-12 h-12 text-blue-700" />
            <input id="dropzone-file" type="file" class="hidden" name="image" @change="getImage" />
            <span
              class="absolute mx-auto mt-3 text-lg font-semibold tracking-wide text-blue-500 -bottom-10 whitespace-nowrap">
              {{ $t('uploadPhoto') }}
            </span>
          </label>
          <label v-else for="dropzone-file"
            class="relative flex items-center justify-center w-28 h-28 dark:text-white max-w-lg mx-auto text-center border-2 rounded-lg cursor-pointer">
            <img :src="selectedImage" class="object-cover w-28 h-28 rounded-lg" alt="#" />
            <input id="dropzone-file" type="file" class="hidden" name="image" @change="getImage" />
            <span
              class="absolute mx-auto mt-3 text-lg font-semibold tracking-wide text-blue-500 -bottom-10 whitespace-nowrap">
              {{ $t('uploadAnotherPhoto') }}
            </span>
          </label>
        </div>
        <div class="flex items-center space-x-4">

          <div class="flex-1">
            <label for="company" class="text-base dark:text-white font-medium">
              {{ $t('company') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="company" type="text" v-model="submitForm.company"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterCompany')">
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="description" class="text-base dark:text-white font-medium">
              {{ $t('description') }}
            </label>
            <input id="description" type="text" v-model="submitForm.description"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterDescription')">
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
      <button v-else @click="createPriceForm()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('create') }}
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>