<script setup>
import moment from 'moment'
import { computed, onMounted, ref, watch } from 'vue'
import StoreIcon from '../assets/icons/StoreIcon.vue'
import MoneyIcon from '../assets/icons/MoneyIcon.vue'
import ChartBarIcon from '../assets/icons/ChartBarIcon.vue'
import ChartDonutIcon from '../assets/icons/ChartDonutIcon.vue'
import UsersIcon from '../assets/icons/UsersIcon.vue'
import ShoppingCartIcon from '../assets/icons/ShoppingCartIcon.vue'
import useMoneyFormatter from '../mixins/currencyFormatter'
import OrderService from '../services/order.service'
import ProductService from '../services/product.service'
import { shortenNumber } from '../mixins/utils'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isLoading = ref(false)
const salesChartFilterData = ref(7)
const cashiersStat = ref([])
const ordersStat = ref([])
const productStats = ref({})
const bestSellerProductStats = ref([])
const dailyTrading = t('dailyTrading')

// Expenses Chart Data
const salesChartSeries = computed(() => [
    {
        name: dailyTrading,
        data: ordersStat.value?.map((item) => item.profit),
    }
])

// Expenses Bar Chart
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

// Expenses Area  Chart
const salesAreaChartChartOptions = computed(() => {
    return {
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
                    return moment(val).format('D-MMM')
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

const getOrdersStatsFinal = () => {
    OrderService.getOrdersStatsFinal({
        from: moment().subtract(salesChartFilterData.value, 'days').startOf('day').format().toString().slice(0, 10),
        to: moment().startOf('day').format().toString().slice(0, 10),
    }).then((res) => {
        ordersStat.value = res
    })
}

onMounted(() => {
    getOrdersStatsFinal()
    OrderService.getCashierStats()
        .then((res) => {
            cashiersStat.value = res
        })
    ProductService.getProductStats()
        .then((res) => {
            productStats.value = res
        })
    ProductService.getBestSellerStats({
        limit: 5
    }).then((res) => {
        bestSellerProductStats.value = res
    })
})

watch(
    () => salesChartFilterData.value,
    (data) => {
        if (data) {
            getOrdersStatsFinal()
        }
    },
    { deep: true }
)

</script>

<template>
    <div class="p-4 md:p-8 space-y-6">
        <div class="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0">
            <div class="flex-1">
                <div class="rounded-3xl bg-slate-50 p-5 space-y-4">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <div class="text-base md:text-xl font-semibold">
                                {{ $t('bestSellingProducts') }}
                            </div>
                            <div class="text-sm md:text-base text-gray-600">
                                {{ $t('statisticsForTheLastSevenDays') }}
                            </div>
                        </div>
                        <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
                            <ShoppingCartIcon class="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                    <div class="divide-y divide-gray-100">
                        <div v-for="(product, idx) in bestSellerProductStats" :key="idx"
                            class="flex items-center justify-between py-1.5">
                            <div class="flex items-center space-x-3">
                                <div class="flex items-center justify-center bg-blue-100 w-6 h-6 rounded-lg">
                                    <span class="text-base text-blue-600">
                                        {{ idx + 1 }}
                                    </span>
                                </div>
                                <div>
                                    <div class="text-base font-semibold text-gray-800">
                                        {{ product?.name + " - " + product?.packaging }}
                                    </div>
                                    <div class="text-sm text-gray-600">
                                        {{ $t('price') }}:
                                        <span class="text-gray-900">
                                            {{ useMoneyFormatter(product?.price) }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div class="text-xl md:text-2xl font-bold">
                                {{ product?.soldCount }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="flex-1 flex flex-col space-y-4">
                <div class="flex flex-col md:flex-row md:items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0">
                    <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                        <div class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0 md:space-y-2">
                            <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 p-3">
                                <StoreIcon class="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <div class="text-base text-gray-600">
                                    {{ $t('productTypes') }}
                                </div>
                                <div class="text-xl md:text-2xl font-semibold">
                                    {{ productStats?.typeCount }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                        <div class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0  md:space-y-2">
                            <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 p-3">
                                <StoreIcon class="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <div class="text-base text-gray-600">
                                    {{ $t('numberOfProducts') }}
                                </div>
                                <div class="text-xl md:text-2xl font-semibold">
                                    {{ productStats?.quantity }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="flex flex-col md:flex-row md:items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0">
                    <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                        <div class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0 md:space-y-2">
                            <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 p-3">
                                <MoneyIcon class="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <div class="text-base text-gray-600">
                                    {{ $t('productsPrice') }}
                                </div>
                                <div class="text-xl md:text-2xl font-semibold">
                                    {{ useMoneyFormatter(productStats?.sum) }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                        <div class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0 md:space-y-2">
                            <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 p-3">
                                <UsersIcon class="w-8 h-8 text-blue-600" />
                            </div>
                            <div>
                                <div class="text-base text-gray-600">
                                    {{ $t('numberOfEmployees') }}
                                </div>
                                <div class="text-xl md:text-2xl font-semibold">
                                    {{ cashiersStat.length }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0">
            <div class="flex-1 bg-slate-50 rounded-3xl p-5">
                <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
                    <div>
                        <div class="text-base font-bold text-gray-800">
                            {{ $t('salesStatistics') }}
                        </div>
                        <div v-if="salesChartFilterData == 7" class="text-sm text-gray-600">
                            {{ $t('statisticsForTheLastSevenDays') }}
                        </div>
                        <div v-else class="text-sm text-gray-600">
                            {{ $t('statisticsForTheLastThirtyDays') }}
                        </div>
                    </div>
                    <div>
                        <select v-model="salesChartFilterData"
                            class="bg-blue-100 border-none text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
                            <option value="7">
                                {{ $t('weeklyStatistics') }}
                            </option>
                            <option value="30">
                                {{ $t('monthlyStatistics') }}
                            </option>
                        </select>
                    </div>
                </div>
                <div v-if="salesChartFilterData == 7">
                    <apexchart type="bar" height="320" :options="salesChartChartOptions" :series="salesChartSeries">
                    </apexchart>
                </div>
                <div v-else>
                    <apexchart type="area" height="320" :options="salesAreaChartChartOptions" :series="salesChartSeries">
                    </apexchart>
                </div>
            </div>
            <div class="flex-1 bg-slate-50 rounded-3xl p-5">
                <div class="flex items-center justify-between px-2">
                    <div>
                        <div class="text-base font-bold text-gray-800">
                            {{ $t('cashierStatistics') }}
                        </div>
                        <div class="text-sm text-gray-600">
                            {{ $t('statisticsForTheLastSevenDays') }}
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-xl bg-blue-100 p-2">
                        <ChartDonutIcon class="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <apexchart type="donut" height="320" :options="caishersChartOptions" :series="caishersChartSeries">
                </apexchart>
            </div>
        </div>
    </div>
</template>