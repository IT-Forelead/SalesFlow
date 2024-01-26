<script setup>
import { ref } from 'vue'
import { h } from 'vue'
import moment from 'moment'
import SearchIcon from '../assets/icons/SearchIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import CTable from '../components/common/CTable.vue'
import OrderService from '../services/order.service'
import useMoneyFormatter from '../mixins/currencyFormatter.js'
import EyeIcon from '../assets/icons/EyeIcon.vue'
import { useModalStore } from '../store/modal.store'
import { useOrderStore } from '../store/order.store'

const globalSearchFromTable = ref('')
const orders = ref([])
const isLoading = ref(false)

const columns = [
    {
        accessorKey: 'id',
        header: 'N',
        enableSorting: false,
        cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
    },
    {
        accessorKey: 'caisher',
        header: 'Kassir',
    },
    {
        accessorKey: 'createdAt',
        header: 'Vaqti',
        accessorFn: row => moment(row.createdAt).format('DD/MM/YYYY H:mm'),
    },
    {
        accessorKey: 'initialPrice',
        header: 'Mahsulotlar',
        cell: ({ row }) =>
            h('div', { class: 'space-y-1' }, [
                h('div', { class: 'flex items-center space-x-1' }, [
                    h('div', { class: 'text-sm text-gray-500' }, 'Soni: '),
                    h('div', { class: 'text-base text-gray-900' }, row.original.items.length + " ta"),
                ]),
                h('div', { class: 'flex items-center space-x-1' }, [
                    h('div', { class: 'text-sm text-gray-500' }, 'Narxi: '),
                    h('div', { class: 'text-base text-gray-900' }, useMoneyFormatter(row.original.initialPrice)),
                ]),
            ]),
    },
    {
        accessorKey: 'discountPercent',
        header: 'Chegirma',
        cell: ({ row }) =>
            h('div', [
                (row.original.discountPercent) ?
                    h('div', { class: 'space-y-1' }, [
                        h('div', { class: 'flex items-center space-x-1' }, [
                            h('div', { class: 'text-sm text-gray-500' }, 'Foizi: '),
                            h('div', { class: 'text-base text-gray-900' }, row.original.discountPercent + "%"),
                        ]),
                        h('div', { class: 'flex items-center space-x-1' }, [
                            h('div', { class: 'text-sm text-gray-500' }, 'Miqdori: '),
                            h('div', { class: 'text-base text-gray-900' }, useMoneyFormatter(row.original.discountPrice)),
                        ]),
                    ])
                    : h('span', '-')
            ]),
    },
    {
        accessorKey: 'paymentReceived',
        header: 'Narxi',
        cell: ({ row }) =>
            h('div', { class: 'space-y-1' }, [
                h('div', { class: 'flex items-center space-x-1' }, [
                    h('div', { class: 'text-sm text-gray-500' }, 'Umumiy: '),
                    h('div', { class: 'text-base text-gray-900' }, useMoneyFormatter(row.original.totalPrice)),
                ]),
                h('div', { class: 'flex items-center space-x-1' }, [
                    h('div', { class: 'text-sm text-gray-500' }, 'Qabul qilindi: '),
                    h('div', { class: 'text-base text-gray-900' }, useMoneyFormatter(row.original.paymentReceived)),
                ]),
            ]),
    },
    {
        accessorKey: 'actions',
        header: 'Amallar',
        cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
            h('button', { onClick: () => {openOrderinfo(row.original)} }, [
                h(EyeIcon, {class: 'w-6 h-6 text-blue-600 hover:scale-105'})
            ]),
        ]),
        enableSorting: false,
    },
]

const openOrderinfo = (data) => {
    useModalStore().openOrderInfoModal()
    useOrderStore().setSelectedOrder(data)
}

const getOrders = () => {
    isLoading.value = true
    OrderService.getOrders()
        .then((res) => {
            orders.value = res
        }).finally(() => {
            isLoading.value = false
        })
}

getOrders()
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
        <CTable v-else :data="orders" :columns="columns" :filter="globalSearchFromTable" />
    </div>
</template>
