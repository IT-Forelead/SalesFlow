<script setup>
import CModal from '../common/CModal.vue'
import { toast } from 'vue-sonner'
import { useModalStore } from '../../store/modal.store'
import { useProductStore } from '../../store/product.store'
import CancelButton from '../buttons/CancelButton.vue'
import SearchIcon from '../../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import ProductService from '../../services/product.service'
import { reactive, ref } from 'vue';

const moneyConf = {
    thousands: ' ',
    suffix: ' UZS',
    precision: 0,
}

const isLoading = ref(false)

const submitData = reactive({
    name: '',
    barcode: '',
    defaultType: 0.0,
    defaultValue: '',
    price: 0,
    quantity: 0,
})

const clearSubmitData = () => {
    submitData.name = ''
    submitData.barcode = ''
    submitData.defaultType = ''
    submitData.defaultValue = ''
    submitData.price = 0
    submitData.quantity = 0
}

const closeModal = () => {
    useModalStore().closeCreateProductModal()
    clearSubmitData()
}

const createProduct = () => {
    if (!submitData.name) {
        toast.error('Mahsulot nomini kiriting!')
    } else if (!submitData.barcode) {
        toast.error('Mahsulot shtrix kodini kiriting!')
    } else if (!submitData.defaultValue) {
        toast.error('Mahsulot standart qiym0.0atini kiriting!')
    } else if (!submitData.defaultType) {
        toast.error('Mahsulot o\'lchov turini kiriting!')
    } else if (submitData.price == 0) {
        toast.error("Mahsulot narxini kiriting!")
    } else {
        isLoading.value = true
        ProductService.createProduct({
            name: submitData.name,
            barcode: submitData.barcode,
            defaultType: submitData.defaultType,
            defaultValue: submitData.defaultValue,
            price: submitData.price,
            quantity: submitData.quantity,
        }).then(() => {
            toast.success("Mahsulot muoffaqiyatli qo'shildi!")
            ProductService.getProducts({})
                .then((res) => {
                    useProductStore().clearStore()
                    useProductStore().setProducts(res)
                })
            isLoading.value = false
            closeModal()
        }).catch((err) => {
            toast.error("Mahsulot yaratishda xatolik yuz berdi!")
            setTimeout(() => {
                isLoading.value = false
            }, 3000)
        })
    }
}
</script>

<template>
    <CModal :is-open="useModalStore().isOpenCreateProductModal" v-if="useModalStore().isOpenCreateProductModal"
        @close=closeModal>
        <template v-slot:header>
            Mahsulot yaratish
        </template>
        <template v-slot:body>
            <div class="relative mb-8">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon class="w-5 h-5 text-slate-400" />
                </div>
                <input type="search"
                    class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-12 pl-10 placeholder-slate-400"
                    placeholder="Mahsulotni shtrix kodi bo'yicha izlash...">
                <button type="button" class="absolute inset-y-0 right-0 px-4 bg-[#0167F3] text-white rounded-lg">
                    Izlash
                </button>
            </div>
            <div class="space-y-4">
                <div class="flex items-center space-x-4">
                    <div class="flex-1">
                        <label for="name" class="text-base font-medium">
                            Mahsulot nomi
                            <span class="text-red-500 mr-2">*</span>
                        </label>
                        <input id="name" type="text" v-model="submitData.name"
                            class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                            placeholder="Mahsulot nomini kiriting">
                    </div>
                    <div class="flex-1">
                        <label for="barcode" class="text-base font-medium">
                            Shtrix kodi
                        </label>
                        <input id="barcode" type="text" v-model="submitData.barcode"
                            class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                            placeholder="Shtrix kodini kiriting">
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex-1 space-y-1">
                        <label for="default-value" class="text-base font-medium">
                            Standart qiymati
                            <span class="text-red-500 mr-2">*</span>
                        </label>
                        <input id="default-value" type="text" v-model="submitData.defaultValue"
                            class="bg-slate-100 border-none text-slate-900 rounded-lg w-full h-11 placeholder-slate-400"
                            placeholder="Standart qiymatini kiriting">
                    </div>
                    <div class="flex-1 space-y-1">
                        <label for="default-type" class="text-base font-medium">
                            Standart turi
                            <span class="text-red-500 mr-2">*</span>
                        </label>
                        <select id="default-type" v-model="submitData.defaultType"
                            class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
                            <option selected>Turini tanlang</option>
                            <option value="amount">dona</option>
                            <option value="kg">kilogramm</option>
                            <option value="g">gramm</option>
                            <option value="litre">litr</option>
                        </select>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex-1 spaceSearchIcon-y-1">
                        <label for="price" class="text-base font-medium">
                            Narxi
                            <span class="text-red-500 mr-2">*</span>
                        </label>
                        <money3 v-model.number="submitData.price" v-bind="moneyConf" id="price"
                            class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
                        </money3>
                    </div>
                    <div class="flex-1">
                    </div>
                </div>
            </div>
        </template>
        <template v-slot:footer>
            <CancelButton @click="closeModal" />
            <button v-if="isLoading" type="bSearchIconutton"
                class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
                <Spinners270RingIcon
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
                Yaratish
            </button>
            <button v-else @click="createProduct()" type="button"
                class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
                Yaratish
            </button>
        </template>
    </CModal>
</template>

<style scoped></style>