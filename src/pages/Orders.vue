<script setup>
import { ref } from '@vue/reactivity'
import { h } from 'vue'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import DeleteProductModal from '../components/modals/DeleteProductModal.vue'
import EditProductModal from '../components/modals/EditProductModal.vue'
import OrderInfoModal from '../components/modals/OrderInfoModal.vue'
import ProductService from '../services/product.service'

const globalSearchFromTable = ref('')
const products = ref([])
const isLoading = ref(false)

const columns = [
    {
        accessorKey: 'id',
        header: 'N',
        enableSorting: false,
        cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    },
    {
        accessorKey: 'name',
        header: 'Nomi',
    },
    {
        accessorFn: row => `${row.value} ${row.type}`,
        header: "O'lchov turi",
    },
    {
        accessorKey: 'barcode',
        header: 'Barcode',
    },
    {
        accessorKey: 'actions',
        header: 'Amallar',
        cell: ({ row }) => h('button', { class: 'flex space-x-2' }, [
            h(OrderInfoModal, { id: row.original.id }),
            h(EditProductModal, { id: row.original.id }),
            h(DeleteProductModal, { id: row.original.id }),
        ]),
        enableSorting: false,
    },
]

const getProducts = () => {
    isLoading.value = true
    ProductService.getProducts({})
        .then((res) => {
            products.value = res
        }).finally(() => {
            isLoading.value = false
        })
}

getProducts()
</script>

<template>
    <div class="p-8">
        <div class="text-slate-900 text-2xl md:text-3xl font-semibold mb-6">
            Sotuvlar
        </div>
        <div class="flex items-center justify-between my-2">
            <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon class="w-5 h-5 text-slate-400" />
                </div>
                <input type="search" v-model="globalSearchFromTable"
                    class="bg-slate-100 border-none text-slate-900 text-base md:text-lg rounded-full block pl-10 py-2 placeholder-slate-400"
                    placeholder="Search everything...">
            </div>
        </div>
        <div v-if="isLoading" class="flex items-center justify-center h-20">
            <Spinners270RingIcon class="w-6 h-6 text-gray-500 animate-spin" />
        </div>
        <CTable v-else :data="products" :columns="columns" :filter="globalSearchFromTable" />
    </div>
</template>