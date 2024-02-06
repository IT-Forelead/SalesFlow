<script setup>
import moment from 'moment'
import { computed, onMounted, ref } from 'vue';
import StoreIcon from '../assets/icons/StoreIcon.vue'
import TotalProductIcon from '../assets/icons/TotalProductIcon.vue'
import useMoneyFormatter from '../mixins/currencyFormatter';
import ImageIcon from '../assets/icons/ImageIcon.vue';
import OrderService from '../services/order.service'
import { useOrderStore } from '../store/order.store'

const orderStore = useOrderStore()
const isLoading = ref(false)

const ordersStat = computed(() => {
    return orderStore.ordersStat
})

// Expenses Chart
const salesChartSeries = computed(() => [
    {
        name: 'Sotilgan',
        data: ordersStat.value?.map((item) => item.soldPrice),
    }, {
        name: 'Sotib olingan',
        data: ordersStat.value?.map((item) => item.purchasePrice),
    }
])

const salesChartChartOptions = {
    legend: {
        labels: {
            colors: ['#8e8da4']
        },
    },
    chart: {
        height: 350,
        type: 'area',
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        categories: ordersStat.value?.map((item) => item.date),
        type: 'date',
        labels: {
            style: {
                fontSize: '12px',
                colors: '#8e8da4',
            },
            formatter: function (val) {
                return moment(val).format('D-MMMM')
            },
        },
        tooltip: {
            enabled: true,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
    },
    yaxis: {
        tickAmount: 6,
        floating: false,
        labels: {
            show: true,
            formatter: function (val) {
                return useMoneyFormatter(val)
            },
            style: {
                colors: '#8e8da4',
            },
            offsetY: 0,
            offsetX: 0,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: true,
        },
    },
    fill: {
        opacity: 0.5,
    },
    tooltip: {
        fixed: {
            enabled: false,
            position: 'topRight',
        },
    },
    grid: {
        yaxis: {
            lines: {
                offsetX: -30,
            },
        },
        padding: {
            left: 20,
        },
    },
}

onMounted(() => {
    OrderService.getOrdersStat()
        .then((res) => {
            useOrderStore().clearStore()
            useOrderStore().setOrdersStat(res)
        })
})

</script>

<template>
    <div class="p-8 space-y-6">
        <div class="flex space-x-4">
            <div class="flex-1">
                <div class="rounded-3xl bg-slate-50 p-5 space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <div class="text-xl font-semibold">Eng ko'p sotilgan mahsulotlar</div>
                            <div class="text-base text-gray-600">So'ngi bir haftalik statistika</div>
                        </div>
                        <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
                            <StoreIcon class="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div class="flex items-center justify-between py-1.5">
                            <div class="flex items-center space-x-3">
                                <div class="bg-blue-600 w-4 h-4 rounded rotate-45"></div>
                                <div>
                                    <div class="text-base font-semibold text-gray-800">
                                        Coca cola - ПЭТ бутылка 1,5 л.
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        Narxi:
                                        <span class="text-gray-900">
                                            {{ useMoneyFormatter(13000) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-2xl font-bold">110</div>
                        </div>
                        <div class="flex items-center justify-between py-1.5">
                            <div class="flex items-center space-x-3">
                                <div class="bg-blue-600 w-4 h-4 rounded rotate-45"></div>
                                <div>
                                    <div class="text-base font-semibold text-gray-800">
                                        Jacobs Monarch 300g
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        Narxi:
                                        <span class="text-gray-900">
                                            {{ useMoneyFormatter(13000) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-2xl font-bold">72</div>
                        </div>
                        <div class="flex items-center justify-between py-1.5">
                            <div class="flex items-center space-x-3">
                                <div class="bg-blue-600 w-4 h-4 rounded rotate-45"></div>
                                <div>
                                    <div class="text-base font-semibold text-gray-800">
                                        Frima 500g
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        Narxi:
                                        <span class="text-gray-900">
                                            {{ useMoneyFormatter(13000) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-2xl font-bold">61</div>
                        </div>
                        <div class="flex items-center justify-between py-1.5">
                            <div class="flex items-center space-x-3">
                                <div class="bg-blue-600 w-4 h-4 rounded rotate-45"></div>
                                <div>
                                    <div class="text-base font-semibold text-gray-800">
                                        Five Cвежая мята
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        Narxi:
                                        <span class="text-gray-900">
                                            {{ useMoneyFormatter(13000) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-2xl font-bold">57</div>
                        </div>
                        <div class="flex items-center justify-between py-1.5">
                            <div class="flex items-center space-x-3">
                                <div class="bg-blue-600 w-4 h-4 rounded rotate-45"></div>
                                <div>
                                    <div class="text-base font-semibold text-gray-800">
                                        Five Cвежая мята
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        Narxi:
                                        <span class="text-gray-900">
                                            {{ useMoneyFormatter(13000) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-2xl font-bold">57</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-1 flex flex-col space-y-4">
                <div class="flex-auto w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <div class="text-base text-gray-600">Do'kondagi ishchilar soni</div>
                            <div class="text-2xl font-semibold">3 ta</div>
                        </div>
                        <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
                            <StoreIcon class="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div class="flex-auto w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <div class="text-base text-gray-600">Do'kondagi barcha mahsulotlar soni</div>
                            <div class="text-2xl font-semibold">17 456 ta</div>
                        </div>
                        <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
                            <StoreIcon class="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div class="flex-auto w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <div class="text-base text-gray-600">Do'kondagi barcha mahsulotlar soni</div>
                            <div class="text-2xl font-semibold">784,534,546 UZS</div>
                        </div>
                        <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
                            <StoreIcon class="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex space-x-4">
            <div class="flex-1 bg-slate-50 rounded-3xl p-5">
                <div class="flex items-center justify-between px-2">
                    <div>
                        <div class="text-base font-bold text-gray-800">
                            Sotuvlar statistikasi
                        </div>
                        <div class="text-sm text-gray-600">
                            Sotuvlar statistikasi
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-xl bg-blue-100 p-2">
                        <StoreIcon class="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <apexchart type="area" height="320" :options="salesChartChartOptions" :series="salesChartSeries">
                </apexchart>
            </div>
            <div class="flex-1 bg-slate-50 rounded-3xl p-5">
                <div class="flex items-center justify-between px-2">
                    <div>
                        <div class="text-base font-bold text-gray-800">
                            Kassirlar statistikasi
                        </div>
                        <div class="text-sm text-gray-600">
                            Sotuvlar statistikasi
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-xl bg-blue-100 p-2">
                        <StoreIcon class="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <apexchart type="area" height="320" :options="salesChartChartOptions" :series="salesChartSeries">
                </apexchart>
            </div>
        </div>
    </div>
</template>