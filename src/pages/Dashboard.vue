<script setup>
import { onClickOutside } from '@vueuse/core'
import moment from 'moment'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import ArrowDownIcon from '../assets/icons/ArrowDownIcon.vue'
import ChartDonutIcon from '../assets/icons/ChartDonutIcon.vue'
import DollarIcon from '../assets/icons/DollarIcon.vue'
import FunnelIcon from '../assets/icons/FunnelIcon.vue'
import MoneyIcon from '../assets/icons/MoneyIcon.vue'
import ChartBarIcon from '../assets/icons/ChartBarIcon.vue'
import ShoppingCartIcon from '../assets/icons/ShoppingCartIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import StoreIcon from '../assets/icons/StoreIcon.vue'
import UsersIcon from '../assets/icons/UsersIcon.vue'
import useMoneyFormatter from '../mixins/currencyFormatter'
import { shortenNumber } from '../mixins/utils'
import OrderService from '../services/order.service'
import ProductService from '../services/product.service'
import { useDropdownStore } from '../store/dropdown.store'
import CaretDoubleLeftIcon from '@/assets/icons/CaretDoubleLeftIcon.vue'
import CaretLeftIcon from '@/assets/icons/CaretLeftIcon.vue'
import CaretRightIcon from '@/assets/icons/CaretRightIcon.vue'
import CaretDoubleRightIcon from '@/assets/icons/CaretDoubleRightIcon.vue'
import CashbackService from '../services/cashback.service'

const { t } = useI18n()

const dropdown = ref(null)
const isLoading = ref(false)
const salesChartFilterData = ref(6)
const cashiersStat = ref([])
const ordersStat = ref([])
const turnoverStats = ref([])
const productStats = ref({})
const bestSellerProductStats = ref([])
const bestRevenueProductStats = ref([])
const bestProfitProductStats = ref([])
const dailyTrading = t('dailyTrading')
const soldProductPrice = ref(0)
const hourlyTrading = t('hourlyTrading')
const hourlySales = ref([])
const cashbackRedeems = ref([])
const qrTrading = t('qrTrading')
const worstSellerProductStats = ref([])

const filterData = reactive({
  startDate: '',
  endDate: '',
})

const cleanFilterData = () => {
  filterData.startDate = ''
  filterData.endDate = ''
}

onClickOutside(dropdown, () => {
  if (useDropdownStore().isOpenFilterBy) {
    useDropdownStore().toggleFilterBy()
  }
})

const profitChartSeries = computed(() => [
  {
    name: dailyTrading,
    data: ordersStat.value?.map((item) => item.profit),
  },
])

const salesChartSeries = computed(() => [
  {
    name: dailyTrading,
    data: turnoverStats.value?.map((item) => item.orderPrice).slice(-7),
  },
])

const turnoverStatsChartSeries = computed(() => [
  {
    name: "Kirim",
    data: turnoverStats.value?.map((item) => item.orderPrice),
  },
  {
    name: "Chiqim",
    data: turnoverStats.value?.map((item) => item.purchasePrice),
  },
])

// Expenses Bar Chart
const profitChartChartOptions = computed(() => {
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
        },
      },
    },
    grid: {
      show: false,
    },
  }
})

// profit Bar Chart
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
      categories: turnoverStats.value?.map((item) => item.date).slice(-7),
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
        },
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
        colors: ['#8e8da4'],
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
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
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

const turnoverStatsAreaChartChartOptions = computed(() => {
  return {
    legend: {
      labels: {
        colors: ['#8e8da4'],
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
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: turnoverStats.value?.map((item) => item.date),
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

const hourlySaleChartSeries = computed(() => [
  {
    name: hourlyTrading,
    data: hourlySales.value?.map((item) => item.revenue),
  },
])

const cashbackRedeemsChartSeries = computed(() => [
  {
    name: qrTrading,
    data: cashbackRedeems.value?.map((item) => item.redeemed)
  },
])

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
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    }],
  }
})

const hourlySaleChartOptions = computed(() => {
  return {
    legend: {
      labels: {
        colors: ['#8e8da4'],
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
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: hourlySales.value?.map((item) => item.hour),
      type: 'date',
      labels: {
        style: {
          fontSize: '12px',
          colors: '#8e8da4',
        },
        formatter: function (val) {
          return val + ':00'
        }
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

const cashbackSaleChartOptions = computed(() => {
  return {
    chart: {
      height: 350,
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
      categories: cashbackRedeems.value?.map((item) => item.date),
      type: 'date',
      labels: {
        style: {
          fontSize: '12px',
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
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      labels: {
        show: false,
        formatter: function (val) {
          return Number.parseInt(val)
        },
      },
    },
    grid: {
      show: false,
    },
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

const getSoldProductPrice = () => {
  OrderService.getOrdersStatsOverall().then((res) => {
    console.log("aaa" + res);
    soldProductPrice.value = res
  })
}

const submitTurnoverStatsFilterData = () => {
  if (!filterData.startDate) {
    toast.warning(t('plsEnterStartDate'))
  } else if (!filterData.endDate) {
    toast.warning(t('plsEnterEndDate'))
  } else {
    isLoading.value = true
    OrderService.getTurnoverStats({
      from: filterData.startDate,
      to: filterData.endDate,
    }).then((res) => {
      turnoverStats.value = res
      isLoading.value = false
      if (useDropdownStore().isOpenFilterBy) {
        useDropdownStore().toggleFilterBy()
      }
    }).catch(() => {
      isLoading.value = false
    })
  }
}

const pageWorstSell = ref(1)
const pageSell = ref(1)
const pageProfit = ref(1)
const pageRevenue = ref(1)
const pageSize = 5

onMounted(() => {
  getSoldProductPrice()
  getOrdersStatsFinal()
  OrderService.getCashierStats()
    .then((res) => {
      cashiersStat.value = res
    })
  OrderService.getTurnoverStats({
    from: moment().subtract(30, 'days').startOf('day').format().toString().slice(0, 10),
    to: moment().startOf('day').format().toString().slice(0, 10),
  }).then((res) => {
    turnoverStats.value = res
  })
  OrderService.getHourlySales()
    .then((res) => {
      hourlySales.value = res
    })
  CashbackService.getCashbackRedeems()
    .then((res) => {
      cashbackRedeems.value = res
    })
  ProductService.getProductStats()
    .then((res) => {
      productStats.value = res
    })
  getSells()
  getProfits()
  getRevenues()
  getWorstSells()
})

watch(
  () => salesChartFilterData.value,
  (data) => {
    if (data) {
      getOrdersStatsFinal()
    }
  },
  { deep: true },
)

//bestSellerProducts
const totalSell = ref(0)
const totalSellPages = computed(() => Math.ceil(totalSell.value / pageSize))
const displayedSellPageNumbers = computed(() => {
  const numSellPages = Math.min(4, totalSellPages.value)
  const startSellPage = Math.max(1, pageSell.value - Math.floor(numSellPages / 2))
  const endSellPage = Math.min(totalSellPages.value, startSellPage + numSellPages - 1)
  const pages = []
  for (let i = startSellPage; i <= endSellPage; i++) {
    pages.push(i)
  }
  return pages
})
const goToSellPage = (pageSellNumber) => {
  if (pageSellNumber >= 1 && pageSellNumber <= totalSellPages.value) {
    pageSell.value = pageSellNumber
  }
}
const prevSellPage = () => {
  goToSellPage(pageSell.value - 1)
}
const nextSellPage = () => {
  goToSellPage(pageSell.value + 1)
}
const getSells = () => {
  ProductService.getProductsWithMostSales(pageSell.value, pageSize).then((res) => {
    bestSellerProductStats.value = res.data
    totalSell.value = res.total
  })
}
watch(pageSell, () => {
  getSells()
})

//worstSellerProducts
const totalWorstSell = ref(0)
const totalWorstSellPages = computed(() => Math.ceil(totalWorstSell.value / pageSize))
const displayedWorstSellPageNumbers = computed(() => {
  const numWorstSellPages = Math.min(4, totalWorstSellPages.value)
  const startWorstSellPage = Math.max(1, pageWorstSell.value - Math.floor(numWorstSellPages / 2))
  const endWorstSellPage = Math.min(totalWorstSellPages.value, startWorstSellPage + numWorstSellPages - 1)
  const pages = []
  for (let i = startWorstSellPage; i <= endWorstSellPage; i++) {
    pages.push(i)
  }
  return pages
})
const goToWorstSellPage = (pageWorstSellNumber) => {
  if (pageWorstSellNumber >= 1 && pageWorstSellNumber <= totalWorstSellPages.value) {
    pageWorstSell.value = pageWorstSellNumber
  }
}
const prevWorstSellPage = () => {
  goToWorstSellPage(pageWorstSell.value - 1)
}
const nextWorstSellPage = () => {
  goToWorstSellPage(pageWorstSell.value + 1)
}
const getWorstSells = () => {
  ProductService.getProductsWithoutSales(pageWorstSell.value, pageSize).then((res) => {
    worstSellerProductStats.value = res.data
    totalWorstSell.value = res.total
  })
}
watch(pageWorstSell, () => {
  getWorstSells()
})

//bestRevenueProducts
const totalRevenue = ref(0)
const totalRevenuePages = computed(() => Math.ceil(totalRevenue.value / pageSize))
const displayedRevenuePageNumbers = computed(() => {
  const numRevenuePages = Math.min(4, totalRevenuePages.value)
  const startRevenuePage = Math.max(1, pageRevenue.value - Math.floor(numRevenuePages / 2))
  const endRevenuePage = Math.min(totalRevenuePages.value, startRevenuePage + numRevenuePages - 1)
  const pages = []
  for (let i = startRevenuePage; i <= endRevenuePage; i++) {
    pages.push(i)
  }
  return pages
})
const goToRevenuePage = (pageRevenueNumber) => {
  if (pageRevenueNumber >= 1 && pageRevenueNumber <= totalRevenuePages.value) {
    pageRevenue.value = pageRevenueNumber
  }
}
const prevRevenuePage = () => {
  goToRevenuePage(pageRevenue.value - 1)
}
const nextRevenuePage = () => {
  goToRevenuePage(pageRevenue.value + 1)
}
const getRevenues = () => {
  ProductService.getProductsWithMostRevenue(pageRevenue.value, pageSize).then((res) => {
    bestRevenueProductStats.value = res.data
    totalRevenue.value = res.total
  })
}
watch(pageRevenue, () => {
  getRevenues()
})

//bestProfitProducts
const totalProfit = ref(0)
const totalProfitPages = computed(() => Math.ceil(totalProfit.value / pageSize))
const displayedProfitPageNumbers = computed(() => {
  const numProfitPages = Math.min(4, totalProfitPages.value)
  const startProfitPage = Math.max(1, pageProfit.value - Math.floor(numProfitPages / 2))
  const endProfitPage = Math.min(totalProfitPages.value, startProfitPage + numProfitPages - 1)
  const pages = []
  for (let i = startProfitPage; i <= endProfitPage; i++) {
    pages.push(i)
  }
  return pages
})
const goToProfitPage = (pageProfitNumber) => {
  if (pageProfitNumber >= 1 && pageProfitNumber <= totalProfitPages.value) {
    pageProfit.value = pageProfitNumber
  }
}
const prevProfitPage = () => {
  goToProfitPage(pageProfit.value - 1)
}
const nextProfitPage = () => {
  goToProfitPage(pageProfit.value + 1)
}
const getProfits = () => {
  ProductService.getProductsWithMostProfit(pageProfit.value, pageSize).then((res) => {
    bestProfitProductStats.value = res.data
    totalProfit.value = res.total
  })
}
watch(pageProfit, () => {
  getProfits()
})
</script>

<template>
  <div class="p-4 md:p-8 space-y-6">
    <div class="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0">
      <div class="p-5 flex rounded-3xl w-[50vw] bg-slate-50 justify-between">
        <div class="w-[50vw] min-h-[45vh] bg-slate-50 rounded-3xl">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
            <div>
              <div class="text-base font-bold text-gray-800">
                {{ $t('hourlyStat') }}
              </div>
              <div class="text-sm text-gray-600">
                <span>{{ ' ' + $t('hourly') }}</span>
                <span class="lowercase">{{ $t('beginStatText') }} </span>
                <span class="font-bold">{{ '10 ' + $t('days') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
          </div>
          <apexchart type="area" height="320" :options="hourlySaleChartOptions" :series="hourlySaleChartSeries">
          </apexchart>
        </div>
      </div>
      <div class="p-5 rounded-3xl bg-slate-50 w-full">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
            <div>
              <div class="text-base font-bold text-gray-800">
                {{ $t('cashbackStat') }}
              </div>
              <div class="text-sm text-gray-600">
                {{ $t('beginStatText') }}
                <span class="font-bold">{{ 10 + $t('days') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div class="flex items-center justify-center rounded-xl bg-blue-100 p-2">
              <ChartBarIcon class="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <apexchart type="bar" height="320" :options="cashbackSaleChartOptions" :series="cashbackRedeemsChartSeries">
          </apexchart>
        </div>
    </div>
    <div class="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0 overflow-x-auto">
      <div class="p-5 flex rounded-3xl bg-slate-50 min-h-[55vh] w-[25vw] flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-base md:text-xl font-semibold">
                {{ $t('bestRevenueProducts') }}
              </div>
              <div class="text-sm md:text-base text-gray-600">
                {{ $t('beginStatText') }}
                <span class="font-bold">{{ 10 + $t('days') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
              <ShoppingCartIcon class="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="(product, idx) in bestRevenueProductStats" :key="idx"
              class="flex items-center justify-between py-1.5">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center bg-blue-100 w-6 h-6 rounded-lg">
                  <span class="text-base text-blue-600">
                    {{ (pageRevenue - 1) * pageSize + idx + 1 }}
                  </span>
                </div>
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ $t('price') }}:
                    <span class="text-gray-900">
                      {{ useMoneyFormatter(product?.price) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ $t('totalPrice') }}:
                    <span class="text-blue-700 font-medium">
                      {{ useMoneyFormatter(product?.totalPrice) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-xl md:text-2xl font-medium">
                {{ product?.amount }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center ">
          <div class="flex items-center space-x-2">
            <button :disabled="pageRevenue === 1" @click="goToRevenuePage(1)"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleLeftIcon class="w-5 h-5" />
            </button>
            <button @click="prevRevenuePage" :disabled="pageRevenue === 1"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretLeftIcon class="w-5 h-5" />
            </button>
            <div class="flex items-center space-x-2">
              <button v-for="pageRevenueNumber in displayedRevenuePageNumbers" :key="pageRevenueNumber"
                @click="goToRevenuePage(pageRevenueNumber)" :class="{
                  'bg-blue-600 text-white': pageRevenueNumber === pageRevenue,
                  'hover:bg-blue-200': pageRevenueNumber !== pageRevenue,
                }"
                class="px-3 py-2 select-none rounded-lg text-slate-900 text-center text-base font-medium transition-all">
                {{ pageRevenueNumber }}
              </button>
            </div>
            <button @click="nextRevenuePage" :disabled="pageRevenue === totalRevenuePages"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretRightIcon class="w-5 h-5" />
            </button>
            <button :disabled="pageRevenue === totalRevenuePages" @click="goToRevenuePage(totalRevenuePages)"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div class="p-5 flex rounded-3xl bg-slate-50 min-h-[55vh] w-[25vw] flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-base md:text-xl font-semibold">
                {{ $t('bestProfitProducts') }}
              </div>
              <div class="text-sm md:text-base text-gray-600">
                {{ $t('beginStatText') }}
                <span class="font-bold">{{ 10 + $t('days') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
              <ShoppingCartIcon class="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="(product, idx) in bestProfitProductStats" :key="idx"
              class="flex items-center justify-between py-1.5">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center bg-blue-100 w-6 h-6 rounded-lg">
                  <span class="text-base text-blue-600">
                    {{ (pageProfit - 1) * pageSize + idx + 1 }}
                  </span>
                </div>
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ $t('price') }}:
                    <span class="text-gray-900">
                      {{ useMoneyFormatter(product?.price) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ $t('totalPrice') }}:
                    <span class="text-blue-700 font-medium">
                      {{ useMoneyFormatter(product?.totalPrice) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-xl md:text-2xl font-medium">
                {{ product?.amount }}
              </div>
            </div>

          </div>
        </div>
        <div class="flex items-center justify-center ">
          <div class="flex items-center space-x-2">
            <button :disabled="pageProfit === 1" @click="goToProfitPage(1)"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleLeftIcon class="w-5 h-5" />
            </button>
            <button @click="prevProfitPage" :disabled="pageProfit === 1"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretLeftIcon class="w-5 h-5" />
            </button>
            <div class="flex items-center space-x-2">
              <button v-for="pageProfitNumber in displayedProfitPageNumbers" :key="pageProfitNumber"
                @click="goToProfitPage(pageProfitNumber)" :class="{
                  'bg-blue-600 text-white': pageProfitNumber === pageProfit,
                  'hover:bg-blue-200': pageProfitNumber !== pageProfit,
                }"
                class="px-3 py-2 select-none rounded-lg text-slate-900 text-center text-base font-medium transition-all">
                {{ pageProfitNumber }}
              </button>
            </div>
            <button @click="nextProfitPage" :disabled="pageProfit === totalProfitPages"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretRightIcon class="w-5 h-5" />
            </button>
            <button :disabled="pageProfit === totalProfitPages" @click="goToProfitPage(totalProfitPages)"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div class="p-5 flex rounded-3xl bg-slate-50 min-h-[55vh] w-[25vw] flex-col justify-between ">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-base md:text-xl font-semibold">
                {{ $t('bestSellingProducts') }}
              </div>
              <div class="text-sm md:text-base text-gray-600">
                {{ $t('beginStatText') }}
                <span class="font-bold">{{ 10 + $t('days') }}</span>
                {{ $t('endStatText') }}
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
                    {{ (pageSell - 1) * pageSize + idx + 1 }}
                  </span>
                </div>
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ $t('price') }}:
                    <span class="text-gray-900">
                      {{ useMoneyFormatter(product?.price) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ $t('totalPrice') }}:
                    <span class="text-gray-900">
                      {{ useMoneyFormatter(product?.totalPrice) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-xl md:text-2xl font-bold text-blue-700">
                {{ product?.amount }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center ">
          <div class="flex items-center space-x-2">
            <button :disabled="pageSell === 1" @click="goToSellPage(1)"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleLeftIcon class="w-5 h-5" />
            </button>
            <button @click="prevSellPage" :disabled="pageSell === 1"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretLeftIcon class="w-5 h-5" />
            </button>
            <div class="flex items-center space-x-2">
              <button v-for="pageSellNumber in displayedSellPageNumbers" :key="pageSellNumber"
                @click="goToSellPage(pageSellNumber)" :class="{
                  'bg-blue-600 text-white': pageSellNumber === pageSell,
                  'hover:bg-blue-200': pageSellNumber !== pageSell,
                }"
                class="px-3 py-2 select-none rounded-lg text-slate-900 text-center text-base font-medium transition-all">
                {{ pageSellNumber }}
              </button>
            </div>
            <button @click="nextSellPage" :disabled="pageSell === totalSellPages"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretRightIcon class="w-5 h-5" />
            </button>
            <button :disabled="pageSell === totalSellPages" @click="goToSellPage(totalSellPages)"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div class="p-5 flex rounded-3xl bg-slate-50 min-h-[55vh] w-[25vw] flex-col justify-between ">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-base md:text-xl font-semibold">
                {{ $t('worstSellingProducts') }}
              </div>
              <div class="text-sm md:text-base text-gray-600">
                {{ $t('beginStatText') }}
                <span class="font-bold">{{ 10 + $t('days') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
              <ShoppingCartIcon class="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="(product, idx) in worstSellerProductStats" :key="idx"
              class="flex items-center justify-between py-1.5">
              <div class="flex items-center space-x-3">
                <div class="flex items-center justify-center bg-blue-100 w-6 h-6 rounded-lg">
                  <span class="text-base text-blue-600">
                    {{ (pageWorstSell - 1) * pageSize + idx + 1 }}
                  </span>
                </div>
                <div>
                  <div class="text-base font-semibold text-gray-800">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ $t('barcode') }}:
                    <span class="text-gray-900">
                      {{ (product?.barcode) }}
                    </span>
                  </div>
                  <div class="text-sm text-gray-600">
                    {{ $t('lastDays') }}:
                    <span class="text-gray-900">
                      {{ (product?.daysSinceLastSale) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex items-center justify-center ">
          <div class="flex items-center space-x-2">
            <button :disabled="pageWorstSell === 1" @click="goToWorstSellPage(1)"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleLeftIcon class="w-5 h-5" />
            </button>
            <button @click="prevWorstSellPage" :disabled="pageWorstSell === 1"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretLeftIcon class="w-5 h-5" />
            </button>
            <div class="flex items-center space-x-2">
              <button v-for="pageWorstSellNumber in displayedWorstSellPageNumbers" :key="pageWorstSellNumber"
                @click="goToWorstSellPage(pageWorstSellNumber)" :class="{
                  'bg-blue-600 text-white': pageWorstSellNumber === Worst,
                  'hover:bg-blue-200': pageWorstSellNumber !== pageWorstSell,
                }"
                class="px-3 py-2 select-none rounded-lg text-slate-900 text-center text-base font-medium transition-all">
                {{ pageWorstSellNumber }}
              </button>
            </div>
            <button @click="nextWorstSellPage" :disabled="pageWorstSell === totalSellPages"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretRightIcon class="w-5 h-5" />
            </button>
            <button :disabled="pageWorstSell === totalWorstSellPages" @click="goToWorstSellPage(totalWorstSellPages)"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0">
      <div class="flex-1 bg-slate-50 rounded-3xl p-5">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
          <div>
            <div class="text-base font-bold text-gray-800">
              {{ $t('profitStatistics') }}
            </div>
            <div v-if="salesChartFilterData === 6" class="text-sm text-gray-600">
              {{ $t('beginStatText') }}
              <span class="font-bold">{{ 10 + $t('days') }}</span>
              {{ $t('endStatText') }}
            </div>
            <div v-else class="text-sm text-gray-600">
              {{ $t('beginStatText') }}
              <span class="font-bold">{{ 30 + $t('days') }}</span>
              {{ $t('endStatText') }}
            </div>
          </div>
          <div>
            <select v-model="salesChartFilterData"
              class="bg-blue-100 border-none text-slate-900 rounded-lg text-base md:text-lg block w-full h-11">
              <option value="6">
                {{ $t('weeklyStatistics') }}
              </option>
              <option value="30">
                {{ $t('monthlyStatistics') }}
              </option>
            </select>
          </div>
        </div>
        <div v-if="salesChartFilterData === 6">
          <apexchart type="bar" height="320" :options="profitChartChartOptions" :series="profitChartSeries">
          </apexchart>
        </div>
        <div v-else>
          <apexchart type="area" height="320" :options="salesAreaChartChartOptions" :series="profitChartSeries">
          </apexchart>
        </div>
      </div>
      <div class="flex-1 bg-slate-50 rounded-3xl p-5">
        <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
          <div>
            <div class="text-base font-bold text-gray-800">
              {{ $t('salesStatistics') }}
            </div>
            <div class="text-sm text-gray-600">
              {{ $t('beginStatText') }}
              <span class="font-bold">{{ 10 + $t('days') }}</span>
              {{ $t('endStatText') }}
            </div>
          </div>
          <div class="flex items-center justify-center rounded-xl bg-blue-100 p-2">
            <ChartBarIcon class="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <apexchart type="bar" height="320" :options="salesChartChartOptions" :series="salesChartSeries">
        </apexchart>
      </div>
    </div>
    <div class="flex-1 bg-slate-50 rounded-3xl p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
        <div>
          <div class="text-base font-bold text-gray-800">
            {{ $t('inputAndOutputCostStatistics') }}
          </div>
          <div class="text-sm text-gray-600">
            {{ $t('beginStatText') }}
            <span class="font-bold">{{ 30 + $t('days') }}</span>
            {{ $t('endStatText') }}
          </div>
        </div>
        <div class="relative" ref="dropdown">
          <div @click="useDropdownStore().toggleFilterBy()"
            class="border-none select-none text-gray-900 bg-white shadow rounded-lg w-full p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenFilterBy"
            class="absolute bg-white shadow rounded-xl p-3 z-20 top-12 right-0 space-y-3">
            <div class="flex items-center space-x-1">
              <label for="">
                {{ $t('from') }}
                <input v-model="filterData.startDate" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg w-full" />
              </label>
              <ArrowDownIcon class="-rotate-90 text-gray-600 mt-6" />
              <label for="">
                {{ $t('to') }}
                <input v-model="filterData.endDate" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg w-full" />
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <div @click="cleanFilterData()"
                class="basis-1/3 w-full bg-slate-100 hover:bg-slate-300 cursor-pointer select-none py-3 text-gray-900 rounded-lg flex items-center justify-center">
                <span>{{ $t('cleaning') }}</span>
              </div>
              <div class="basis-2/3">
                <div v-if="isLoading"
                  class="w-full bg-blue-600 py-3 select-none text-white rounded-lg flex items-center justify-center">
                  <Spinners270RingIcon
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
                  <span>{{ $t('loading') }}</span>
                </div>
                <div v-else @click="submitTurnoverStatsFilterData()"
                  class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                  <span>{{ $t('filter') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <apexchart type="area" height="320" :options="turnoverStatsAreaChartChartOptions"
        :series="turnoverStatsChartSeries">
      </apexchart>
    </div>
    <div class="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0">
      <div class="flex-1 bg-slate-50 rounded-3xl p-5">
        <div class="flex items-center justify-between px-2">
          <div>
            <div class="text-base font-bold text-gray-800">
              {{ $t('cashierStatistics') }}
            </div>
            <div class="text-sm text-gray-600">
              {{ $t('beginStatText') }}
              <span class="font-bold">{{ 10 + $t('days') }}</span>
              {{ $t('endStatText') }}
            </div>
          </div>
          <div class="flex items-center justify-center rounded-xl bg-blue-100 p-2">
            <ChartDonutIcon class="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <apexchart type="donut" height="320" :options="caishersChartOptions" :series="caishersChartSeries">
        </apexchart>
      </div>
      <!-- <div class="flex-1"></div> -->
      <div class="flex-1 flex flex-col space-y-4">
        <div class="flex flex-col md:flex-row md:items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0">
          <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
            <div
              class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0 md:space-y-2">
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
            <div
              class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0  md:space-y-2">
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
          <div v-for="(product, idx) in soldProductPrice" :key="idx"
            class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
            <div
              class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0 md:space-y-2">
              <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 p-3">
                <DollarIcon class="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <div v-if="product?.period === 'current_month'" class="text-base text-gray-600">
                  {{ $t('currentMonthsSales') }}
                </div>
                <div v-else class="text-base text-gray-600">
                  {{ $t('previousMonthsSales') }}
                </div>
                <div class="text-xl md:text-2xl font-semibold">
                  {{ useMoneyFormatter(product?.total) }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 w-full h-full space-y-4 rounded-3xl bg-slate-50 p-5">
            <div
              class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0 md:space-y-2">
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
  </div>
</template>