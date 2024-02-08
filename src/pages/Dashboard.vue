<script setup>
import moment from 'moment'
import { computed, onMounted, ref } from 'vue'
import StoreIcon from '../assets/icons/StoreIcon.vue'
import MoneyIcon from '../assets/icons/MoneyIcon.vue'
import useMoneyFormatter from '../mixins/currencyFormatter'
import OrderService from '../services/order.service'
import ProductService from '../services/product.service'
import { shortenNumber } from '../mixins/utils'

const isLoading = ref(false)
const cashiersStat = ref([])
const ordersStat = ref([])
const productStats = ref({})

// Expenses Chart
const salesChartSeries = computed(() => [
    {
        name: 'Kunlik savdo',
        data: ordersStat.value?.map((item) => item.soldPrice),
        // data: [1240000, 13000, 12700, 8900, 930000, 5001],
    }
])

const salesChartChartOptions = computed(() => {
    return {
        chart: {
            type: 'bar',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 5,
                columnWidth: '60%',
                dataLabels: {
                    position: 'top',
                    formatter: function (val) {
                        return shortenNumber(val)
                    },
                },
            },
        },
        dataLabels: {
            enabled: true,
            offsetY: -20,
            style: {
                fontSize: '14px',
                colors: ['#304758'],
            },
            formatter: function (val) {
                return shortenNumber(val)
            },
        },
        legend: {
            show: false,
        },
        xaxis: {
            categories: ordersStat.value?.map((item) => item.date),
            labels: {
                style: {
                    fontSize: '12px',
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
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                formatter: function (val) {
                    return useMoneyFormatter(val)
                }
            },
        },
        grid: {
            show: false,
        },
    }
})

// Caisher Donut Chart
const caishersChartSeries = computed(() => {
    return cashiersStat.value?.map((a) => a?.soldCount)
})

const caishersChartOptions = computed(() => {
    return {
        chart: {
            type: 'donut',
        },
        labels: cashiersStat.value?.map((a) => a?.cashierName),
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }
})

onMounted(() => {
    OrderService.getOrdersStat()
        .then((res) => {
            ordersStat.value = res
        })
    OrderService.getCashierStats()
        .then((res) => {
            cashiersStat.value = res
        })
    ProductService.getProductStats()
        .then((res) => {
            productStats.value = res
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
                <div class="flex items-center space-x-4">
                    <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                        <div class="space-y-2">
                            <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 p-3">
                                <StoreIcon class="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <div class="text-base text-gray-600">
                                    Mahsulot turlari
                                </div>
                                <div class="text-2xl font-semibold">
                                    {{ productStats?.typeCount }} ta
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                        <div class="space-y-2">
                            <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 p-3">
                                <StoreIcon class="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <div class="text-base text-gray-600">
                                    Barcha mahsulotlar soni
                                </div>
                                <div class="text-2xl font-semibold">
                                    {{ productStats?.quantity }} ta
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex items-center space-x-4">
                    <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                        <div class="space-y-2">
                            <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 p-3">
                                <StoreIcon class="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <div class="text-base text-gray-600">
                                    Barcha mahsulotlarning narxi
                                </div>
                                <div class="text-2xl font-semibold">
                                    {{ useMoneyFormatter(productStats?.sum) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                        <div class="space-y-2">
                            <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 p-3">
                                <StoreIcon class="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <div class="text-base text-gray-600">
                                    Xodimlar soni
                                </div>
                                <div class="text-2xl font-semibold">
                                    {{ cashiersStat.length }} ta
                                </div>
                            </div>
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
                            So'ngi yetti kunlik statistika
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-xl bg-blue-100 p-2">
                        <MoneyIcon class="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <apexchart type="bar" height="320" :options="salesChartChartOptions" :series="salesChartSeries">
                </apexchart>
            </div>
            <div class="flex-1 bg-slate-50 rounded-3xl p-5">
                <div class="flex items-center justify-between px-2">
                    <div>
                        <div class="text-base font-bold text-gray-800">
                            Kassirlar statistikasi
                        </div>
                        <div class="text-sm text-gray-600">
                            So'ngi yetti kunlik statistika
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-xl bg-blue-100 p-2">
                        <StoreIcon class="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <apexchart type="donut" height="320" :options="caishersChartOptions" :series="caishersChartSeries">
                </apexchart>
            </div>
        </div>
    </div>
</template>