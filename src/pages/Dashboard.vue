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
import { useProductStore } from '../store/product.store'
import CaretDoubleLeftIcon from '@/assets/icons/CaretDoubleLeftIcon.vue'
import CaretLeftIcon from '@/assets/icons/CaretLeftIcon.vue'
import CaretRightIcon from '@/assets/icons/CaretRightIcon.vue'
import CaretDoubleRightIcon from '@/assets/icons/CaretDoubleRightIcon.vue'
import CashbackService from '../services/cashback.service'
import {
  roundFloatToTwoDecimal,
} from '../mixins/utils';

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
const allDates = ref([])
const allDate = ref([])

const pageWorstSell = ref(1)
const pageSell = ref(1)
const pageProfit = ref(1)
const pageRevenue = ref(1)
const pageSize = 5
const varietyDropdown = ref(null)
const monthDropdown = ref(null)
const predictDropdown = ref(null)
const monthStats = ref([])
const varietyStats = ref([])
const predictStats = ref([])
const corporateStats = ref([])
const corporateDropdown = ref(null)

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
const profitChartOptions = computed(() => {
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
        colors: ['#4A90E2'],
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
          colors: '#4A90E2',
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
const salesChartOptions = computed(() => {
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
        colors: ['#4A90E2'],
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
          colors: '#4A90E2',
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
const salesAreaChartOptions = computed(() => {
  return {
    legend: {
      labels: {
        colors: ['#8e8da4'],
      },
    },
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
          colors: '#4a90e2',
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
          colors: '#4a90e2',
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

const turnoverStatsAreaChartOptions = computed(() => {
  return {
    legend: {
      labels: {
        colors: 'rgb(128, 128, 128)',
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
          fontSize: '13px',
          colors: '#4A90E2',
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
          fontSize: '12px',
          colors: '#4A90E2',
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
    legend: {
      show: true,
      labels: {
        colors: 'rgb(128, 128, 128)',
        useSeriesColors: false,
      },
    },
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
          fontSize: '14px',
          colors: '#4A90E2',
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
          fontSize: '12px',
          colors: '#4A90E2',
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
        colors: ['#4A90E2'],
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
          colors: '#4A90E2',
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

const filterVarietyData = reactive({
  startDate: '',
  endDate: '',
  interval: 0,
  intervalType: "",
})

const cleanFilterVarietyData = () => {
  filterVarietyData.startDate = ''
  filterVarietyData.endDate = ''
  filterVarietyData.interval = 0
  filterVarietyData.intervalType = ""
}


const filterCorporateData = reactive({
  from: '',
  to: '',
  intervalType: "",
})

const cleanFilterCorporateData = () => {
  filterCorporateData.startDate = ''
  filterCorporateData.endDate = ''
  filterCorporateData.intervalType = ""
}

onClickOutside(predictDropdown, () => {
  if (useDropdownStore().isOpenPredictFilterBy) {
    useDropdownStore().togglePredictFilterBy()
  }
})
onClickOutside(varietyDropdown, () => {
  if (useDropdownStore().isOpenVarietyFilterBy) {
    useDropdownStore().toggleVarietyFilterBy()
    console.log(useDropdownStore().isOpenVarietyFilterBy)
  }
})
onClickOutside(monthDropdown, () => {
  if (useDropdownStore().isOpenMonthFilterBy) {
    useDropdownStore().toggleMonthFilterBy()
  }
})

const predictStatsChartSeries = computed(() => [
  {
    name: 'Kirim',
    data: predictStats.value?.map((item) => item.income).reverse(),
  },
  {
    name: 'Foyda',
    data: predictStats.value?.map((item) => item.profit).reverse(),
  },
])

const predictCountStatsChartSeries = computed(() => [
  {
    name: `Kirim o'sishi`,
    data: predictStats.value?.map((item) => item.incomeGrowth).reverse(),
  },
  {
    name: `Foyda o'sishi`,
    data: predictStats.value?.map((item) => item.profitGrowth).reverse(),
  },
])

const predictStatsAreaChartOptions = computed(() => {
  return {
    legend: {
      labels: {
        colors: 'rgb(128, 128, 128)',
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
      categories: predictStats.value?.map((item) => item.month).reverse(),
      type: 'date',
      labels: {
        style: {
          fontSize: '12px',
          colors: '#4a90e2',
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
          colors: '#4a90e2',
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

const predictCountStatsAreaChartOptions = computed(() => {
  return {
    legend: {
      labels: {
        colors: 'rgb(128, 128, 128)',
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
      categories: predictStats.value?.map((item) => item.month).reverse(),
      type: 'date',
      labels: {
        style: {
          fontSize: '12px',
          colors: '#4a90e2',
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
      max: 100,
      labels: {
        show: true,
        formatter: function (val) {
          return val.toFixed(0) + ' %';
        },
        style: {
          colors: '#4a90e2',
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

const submitVarietyStatsFilterData = () => {
  if (!filterVarietyData.startDate) {
    toast.warning(t('plsEnterStartDate'))
  } else if (!filterVarietyData.endDate) {
    toast.warning(t('plsEnterEndDate'))
  } else if (!filterVarietyData.interval) {
    toast.warning(t('plsSelectInterval'))
  } else if (!filterVarietyData.intervalType) {
    toast.warning(t('plsSelectIntervalType'))
  } else {
    isLoading.value = true
    ProductService.getVarietyStats({
      startDate: filterVarietyData.startDate,
      endDate: filterVarietyData.endDate,
      interval: filterVarietyData.interval,
      intervalType: filterVarietyData.intervalType,
    }).then((res) => {
      varietyStats.value = res
      isLoading.value = false
      if (useDropdownStore().isOpenVarietyFilterBy) {
        useDropdownStore().toggleVarietyFilterBy()
      }
    }).catch(() => {
      isLoading.value = false
    })
  }
}

const submitCorporateStatsFilterData = () => {
  if (!filterCorporateData.from) {
    toast.warning(t('plsEnterStartDate'))
  } else if (!filterCorporateData.to) {
    toast.warning(t('plsEnterEndDate'))
  } else if (!filterCorporateData.intervalType) {
    toast.warning(t('plsSelectIntervalType'))
  } else {
    isLoading.value = true
    OrderService.getCorporateClientsStats({
      from: filterCorporateData.from,
      to: filterCorporateData.to,
      intervalType: filterCorporateData.intervalType,
    }).then((res) => {
      corporateStats.value = res
      isLoading.value = false
      if (useDropdownStore().isOpenCorporateFilterBy) {
        useDropdownStore().toggleCorporateFilterBy()
      }
    }).catch(() => {
      isLoading.value = false
    })
  }
}

const varietyStatsChartSeries = computed(() => {
  return varietyStats.value.map((item) =>
  ({
    name: item.productType,
    data: item.data.map((i) => {
      return i.productTypeCount
    })
  })
  );
})

const varietyStatsAreaChartOptions = computed(() => {
  return {
    legend: {
      labels: {
        colors: 'rgb(128, 128, 128)',
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
      categories: allDate.value,
      type: 'date',
      labels: {
        style: {
          fontSize: '12px',
          colors: '#4a90e2',
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
      floating: false,
      labels: {
        show: true,
        formatter: function (val) {
          return (val);
        },
        style: {
          colors: '#4a90e2',
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

const groupByKey = (list, key) => list.reduce((acc, item) => {
  if (item.id === key) {
    return acc + item.income;
  }
  return acc;
}, 0);

const corporateStatsChartSeries = computed(() => {
  return corporateStats.value?.map((item) =>
  ({
    name: item.fullName,
    data: corporateStats.value?.map((item) => item.income)
  })
  );
})

const corporateStatsAreaChartOptions = computed(() => {
  const allDatesValid = allDates.value.every(date => moment(date, 'YYYY-MM-DD', true).isValid());
  if (!allDatesValid) {
    console.error('Some dates in allDates are invalid.');
  }

  return {
    legend: {
      labels: {
        colors: 'rgb(128, 128, 128)',
      },
    },
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
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: allDates.value,
      type: 'date',
      labels: {
        style: {
          fontSize: '12px',
          colors: '#4a90e2',
        },
        formatter: function (val) {
          const formattedDate = moment(val);
          return formattedDate.isValid() ? formattedDate.format('D-MMM') : 'Invalid Date'; // Обработка некорректных дат
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
          colors: '#4a90e2',
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

const monthStatsChartSeries = computed(() => [
  {
    name: 'Kirim',
    data: monthStats.value?.map((item) => item.income).reverse(),
  },
  {
    name: 'Foyda',
    data: monthStats.value?.map((item) => item.profit).reverse(),
  },
])

const monthStatsAreaChartOptions = computed(() => {
  return {
    legend: {
      labels: {
        colors: 'rgb(128, 128, 128)',
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
      categories: monthStats.value?.map((item) => item.month).reverse(),
      type: 'date',
      labels: {
        style: {
          fontSize: '12px',
          colors: '#4a90e2',
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
          colors: '#4a90e2',
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

const unprofitableDropdown = ref(null)
const unprofitableStats = ref([])


const filterUnprofitableData = reactive({
  intervalType: useProductStore().intervalType,
  limit: useProductStore().limit
})

const cleanFilterUnprofitableData = () => {
  filterUnprofitableData.intervalType = ""
  filterUnprofitableData.limit = 0
}

onClickOutside(unprofitableDropdown, () => {
  if (useDropdownStore().isOpenUnprofitableFilterBy) {
    useDropdownStore().toggleUnprofitableFilterBy()
    console.log(useDropdownStore().isOpenUnprofitableFilterBy)
  }
})

onClickOutside(corporateDropdown, () => {
  if (useDropdownStore().isOpenCorporateFilterBy) {
    useDropdownStore().toggleCorporateFilterBy()
    console.log(useDropdownStore().isOpenCorporateFilterBy)
  }
})

const submitUnprofitableStatsFilterData = () => {
  if (!filterUnprofitableData.intervalType) {
    toast.warning(t('plsSelectIntervalType'))
  } else if (!filterUnprofitableData.limit) {
    toast.warning(t('plsSelectLimit'))
  } else {
    isLoading.value = true
    ProductService.getUnprofitableStat({
      intervalType: filterUnprofitableData.intervalType,
      limit: filterUnprofitableData.limit,
    }).then((res) => {
      unprofitableStats.value = res
      isLoading.value = false
      if (useDropdownStore().isOpenUnprofitableFilterBy) {
        useDropdownStore().toggleUnprofitableFilterBy()
      }
    }).catch(() => {
      isLoading.value = false
    })
  }
}

onClickOutside(unprofitableDropdown, () => {
  if (useDropdownStore().isOpenUnprofitableFilterBy) {
    useDropdownStore().toggleUnprofitableFilterBy()
    console.log(useDropdownStore().isOpenUnprofitableFilterBy)
  }
})


onClickOutside(unprofitableDropdown, () => {
  if (useDropdownStore().isOpenUnprofitableFilterBy) {
    useDropdownStore().toggleUnprofitableFilterBy()
    console.log(useDropdownStore().isOpenUnprofitableFilterBy)
  }
})



const unprofitableStatsChartSeries = computed(() => [
  {
    name: 'Kirim',
    data: unprofitableStats.value?.map((item) => item.deficit * -1).reverse(),
  },
])

const unprofitableStatsAreaChartOptions = computed(() => {
  return {
    legend: {
      labels: {
        colors: 'rgb(128, 128, 128)',
      },
    },
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
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: unprofitableStats.value?.map((item) => item.productName).reverse(),
      type: 'date',
      labels: {
        style: {
          fontSize: '12px',
          colors: '#4a90e2',
        },
        formatter: function (val) {
          return (val)
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
          colors: '#4a90e2',
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
      colors: '#ff0000'
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

onMounted(() => {
  OrderService.getCashierStats()
    .then((res) => {
      cashiersStat.value = res
    })
  OrderService.getPredictStats(pageSize)
    .then((res) => {
      predictStats.value = res
    })
  OrderService.getMonthStats(pageSize)
    .then((res) => {
      monthStats.value = res
    })
  OrderService.getCorporateClientsStats({
    from: moment().subtract(90, 'days').startOf('day').format().toString().slice(0, 10),
    to: moment().startOf('day').format().toString().slice(0, 10),
    intervalType: "month",
    limit: 20,
  }).then((res) => {
    corporateStats.value = res
    var aa = res?.flatMap((item) => item.date)
    var bb = new Set(aa)
    allDates.value = Array.from(bb).sort((aa, bb) => // {
      moment(aa).toDate() - moment(bb).toDate()
      // }
    )

  })
  ProductService.getUnprofitableStat({
    limit: 20,
    intervalType: "month"
  }).then((res) => {
    unprofitableStats.value = res
  })

  ProductService.getVarietyStats({
    startDate: moment().subtract(90, 'days').startOf('day').format().toString().slice(0, 10),
    endDate: moment().startOf('day').format().toString().slice(0, 10),
    interval: 1,
    intervalType: "month"
  }).then((res) => {
    varietyStats.value = res
    var a = res?.flatMap((item) => item.data.map((i) => i.day))
    var b = new Set(a)
    allDate.value = Array.from(b).sort((a, b) => // {
      moment(a).toDate() - moment(b).toDate()
      // }
    )

  })
  ProductService.getRecommendStats({
    intervalType: useProductStore().intervalType,
    limit: useProductStore().limit
  }).then((res) => {
    // console.log(res)
    recommendStats.value = res
  })
  OrderService.getTurnoverStats({
    from: moment().subtract(60, 'days').startOf('day').format().toString().slice(0, 10),
    to: moment().startOf('day').format().toString().slice(0, 10),
  }).then((res) => {
    turnoverStats.value = res
  })
  OrderService.getHourlySales()
    .then((res) => {
      const hours = Array.from({ length: 18 }, (_, i) => i + 7);
      const revenueByHour = res.reduce((acc, item) => {
        acc[item.hour] = item.revenue;
        return acc;
      }, {});
      const completeHourlySales = hours.map(hour => ({
        hour: hour === 24 ? '0' : hour.toString(),
        revenue: revenueByHour[hour] || 0
      }));
      hourlySales.value = completeHourlySales;
    })
    .catch(error => {
      console.error(error);
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
  getSoldProductPrice()
  getOrdersStatsFinal()
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

const recommendDropdown = ref(null)
const recommendStats = ref([])


const filterRecommendData = reactive({
  intervalType: useProductStore().intervalType,
  limit: useProductStore().limit
})

const cleanFilterRecommendData = () => {
  filterRecommendData.intervalType = ""
  filterRecommendData.limit = 0
}

onClickOutside(recommendDropdown, () => {
  if (useDropdownStore().isOpenRecommendFilterBy) {
    useDropdownStore().toggleRecommendFilterBy()
    console.log(useDropdownStore().isOpenRecommendFilterBy)
  }
})

const submitRecommendStatsFilterData = () => {
  if (!filterRecommendData.intervalType) {
    toast.warning(t('plsSelectIntervalType'))
  } else if (!filterRecommendData.limit) {
    toast.warning(t('plsSelectLimit'))
  } else {
    isLoading.value = true
    ProductService.getRecommendStats({
      intervalType: filterRecommendData.intervalType,
      limit: filterRecommendData.limit,
    }).then((res) => {
      recommendStats.value = res
      isLoading.value = false
      if (useDropdownStore().isOpenRecommendFilterBy) {
        useDropdownStore().toggleRecommendFilterBy()
      }
    }).catch(() => {
      isLoading.value = false
    })
  }
}

onClickOutside(recommendDropdown, () => {
  if (useDropdownStore().isOpenRecommendFilterBy) {
    useDropdownStore().toggleRecommendFilterBy()
    console.log(useDropdownStore().isOpenRecommendFilterBy)
  }
})

onClickOutside(recommendDropdown, () => {
  if (useDropdownStore().isOpenRecommendFilterBy) {
    useDropdownStore().toggleRecommendFilterBy()
    console.log(useDropdownStore().isOpenRecommendFilterBy)
  }
})

const recommendStatsChartSeries = computed(() => [
  {
    name: 'Total profit',
    data: recommendStats.value?.map((item) => item.totalProfit),
  },
  {
    name: 'Total revenue',
    data: recommendStats.value?.map((item) => item.totalRevenue),
  },
]);

const recommendStatsAreaChartOptions = computed(() => {
  return {
    legend: {
      labels: {
        colors: 'rgb(128, 128, 128)',
      },
    },
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
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
    },
    xaxis: {
      categories: recommendStats.value?.map((item) => item.productName),
      type: 'date',
      labels: {
        style: {
          fontSize: '12px',
          colors: '#4a90e2',
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
      floating: false,
      labels: {
        show: true,
        formatter: function (val) {
          return useMoneyFormatter(val);
        },
        style: {
          colors: '#4a90e2',
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
    tooltip: {
      enabled: true,
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const data = recommendStats.value[dataPointIndex];
        if (seriesIndex === 0) {
          return `
            
              <div class="text-xs bg-slate-200 p-2">${data.productName}</div>
            <div class="text-xs p-2">  <span>Total profit:</span> <span class="font-semibold"> ${useMoneyFormatter(data.totalProfit)}</span>
              </br>
              <span>Total orders:</span> <span class="font-semibold"> ${(data.totalOrders)}</span>
            </div>
          `;
        } else if (seriesIndex === 1) {
          return `
           
              <div class="text-xs bg-slate-200 p-2">${data.productName}</div>
            <div class="text-xs p-2">  <span>Total revenue:</span> <span class="font-semibold"> ${useMoneyFormatter(data.totalRevenue)}</span>
              </br>
              <span>Sales ratio:</span> <span class="font-semibold"> ${(data.salesRatio)}</span>
            </div>
          `;
        }
      },
    },
  };
});
</script>

<template>
  <div class="p-4 md:p-8 space-y-6">
    <div class="flex-1">
      <div class="flex md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0">
        <div class="p-5 rounded-3xl bg-slate-100  dark:bg-slate-900 w-7/12">
          <div>
            <div class="text-base font-bold text-slate-800 dark:text-slate-200">
              {{ $t('hourlyStat') }}
            </div>
            <div class="text-sm text-gray-600 dark:text-white">
              <span>{{ ' ' + $t('hourly') }}</span>
              <span class="lowercase">{{ $t('beginStatText') }} </span>
              <span class="font-bold">{{ '10 ' + $t('days') }}</span>
              {{ $t('endStatText') }}
            </div>
          </div>
          <div>
            <apexchart type="area" height="320" :options="hourlySaleChartOptions" :series="hourlySaleChartSeries">
            </apexchart>
          </div>
        </div>
        <div class="p-5 rounded-3xl bg-slate-100  dark:bg-slate-900 w-5/12">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
            <div>
              <div class="text-base font-bold text-slate-800 dark:text-slate-200">
                {{ $t('cashbackStat') }}
              </div>
              <div class="text-sm dark:text-white text-gray-600">
                {{ $t('beginStatText') }}
                <span class="font-bold">{{ 10 + $t('days') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div class="flex items-center justify-center rounded-xl dark:bg-slate-800 bg-blue-100 p-2">
              <ChartBarIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
            </div>
          </div>
          <apexchart type="bar" height="320" :options="cashbackSaleChartOptions" :series="cashbackRedeemsChartSeries">
          </apexchart>
        </div>
      </div>
    </div>
    <div
      class="flex w-full justify-between flex-col md:flex-row space-x-0 md:space-x-4 space-y-2  dark:text-white md:space-y-0 h-auto overflow-y-auto">
      <div class="p-5 flex flex-1 rounded-3xl bg-slate-100 dark:bg-slate-900 h-[650px] flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-base md:text-xl font-semibold">
                {{ $t('bestRevenueProducts') }}
              </div>
              <div class="text-sm md:text-base text-gray-600 dark:text-white">
                {{ $t('beginStatText') }}
                <span class="font-bold">{{ 10 + $t('days') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-3">
              <ShoppingCartIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="(product, idx) in bestRevenueProductStats" :key="idx"
              class="flex items-center justify-between py-1.5">
              <div class="flex items-center space-x-3">
                <div
                  class="flex items-center justify-center bg-blue-100 dark:bg-slate-800 min-w-6 max-w-full h-6 rounded-lg">
                  <span class="text-base dark:text-blue-400 text-blue-600">
                    {{ (pageRevenue - 1) * pageSize + idx + 1 }}
                  </span>
                </div>
                <div>
                  <div class="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-sm dark:text-white text-gray-600">
                    {{ $t('price') }}:
                    <span class="dark:text-zinc-200 text-gray-900">
                      {{ useMoneyFormatter(product?.price) }}
                    </span>
                  </div>
                  <div class="text-sm dark:text-white text-gray-600">
                    {{ $t('totalPrice') }}:
                    <span class="dark:text-white text-blue-700 font-semibold">
                      {{ useMoneyFormatter(product?.totalPrice) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-xl md:text-2xl font-medium">
                {{ roundFloatToTwoDecimal(product?.amount) }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-min flex items-center justify-center ">
          <div class="flex items-center space-x-2">
            <button :disabled="pageRevenue === 1" @click="goToRevenuePage(1)"
              class="flex items-center justify-center px-3 py-2 text-base font-medium dark:text-white text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleLeftIcon class="w-5 h-5" />
            </button>
            <button @click="prevRevenuePage" :disabled="pageRevenue === 1"
              class="flex items-center justify-center px-3 py-2 text-base font-medium dark:text-white text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretLeftIcon class="w-5 h-5" />
            </button>
            <div class="flex items-center space-x-2">
              <button v-for="pageRevenueNumber in displayedRevenuePageNumbers" :key="pageRevenueNumber"
                @click="goToRevenuePage(pageRevenueNumber)" :class="{
                  'bg-blue-600 text-white': pageRevenueNumber === pageRevenue,
                  'hover:bg-blue-200': pageRevenueNumber !== pageRevenue,
                }"
                class="px-3 py-2 select-none rounded-lg dark:text-white text-slate-900 text-center text-base font-medium transition-all">
                {{ pageRevenueNumber }}
              </button>
            </div>
            <button @click="nextRevenuePage" :disabled="pageRevenue === totalRevenuePages"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center dark:text-white text-slate-900 rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretRightIcon class="w-5 h-5" />
            </button>
            <button :disabled="pageRevenue === totalRevenuePages" @click="goToRevenuePage(totalRevenuePages)"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div class="p-5 flex flex-1 rounded-3xl bg-slate-100 dark:bg-slate-900 h-[650px] flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-base md:text-xl font-semibold">
                {{ $t('bestProfitProducts') }}
              </div>
              <div class="text-sm md:text-base text-gray-600 dark:text-white">
                {{ $t('beginStatText') }}
                <span class="font-bold">{{ 10 + $t('days') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-3">
              <ShoppingCartIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="(product, idx) in bestProfitProductStats" :key="idx"
              class="flex items-center justify-between py-1.5">
              <div class="flex items-center space-x-3">
                <div
                  class="flex items-center justify-center bg-blue-100 dark:bg-slate-800 min-w-6 max-w-full h-6 rounded-lg">
                  <span class="text-base dark:text-blue-400 text-blue-600">
                    {{ (pageProfit - 1) * pageSize + idx + 1 }}
                  </span>
                </div>
                <div>
                  <div class="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-white">
                    {{ $t('price') }}:
                    <span class="text-gray-900 dark:text-zinc-200">
                      {{ useMoneyFormatter(product?.price) }}
                    </span>
                  </div>
                  <div class="text-sm dark:text-white text-gray-600">
                    {{ $t('totalPrice') }}:
                    <span class="text-blue-700 dark:text-white font-semibold">
                      {{ useMoneyFormatter(product?.totalPrice) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-xl md:text-2xl font-medium">
                {{ roundFloatToTwoDecimal(product?.amount) }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-min flex items-center justify-center ">
          <div class="flex items-center space-x-2">
            <button :disabled="pageProfit === 1" @click="goToProfitPage(1)"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleLeftIcon class="w-5 h-5" />
            </button>
            <button @click="prevProfitPage" :disabled="pageProfit === 1"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretLeftIcon class="w-5 h-5" />
            </button>
            <div class="flex items-center space-x-2">
              <button v-for="pageProfitNumber in displayedProfitPageNumbers" :key="pageProfitNumber"
                @click="goToProfitPage(pageProfitNumber)" :class="{
                  'bg-blue-600 text-white': pageProfitNumber === pageProfit,
                  'hover:bg-blue-200': pageProfitNumber !== pageProfit,
                }"
                class="px-3 py-2 select-none rounded-lg text-slate-900 dark:text-white text-center text-base font-medium transition-all">
                {{ pageProfitNumber }}
              </button>
            </div>
            <button @click="nextProfitPage" :disabled="pageProfit === totalProfitPages"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretRightIcon class="w-5 h-5" />
            </button>
            <button :disabled="pageProfit === totalProfitPages" @click="goToProfitPage(totalProfitPages)"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div class="p-5 flex flex-1 rounded-3xl bg-slate-100 dark:bg-slate-900 h-[650px] flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-base md:text-xl font-semibold">
                {{ $t('bestSellingProducts') }}
              </div>
              <div class="text-sm md:text-base text-gray-600 dark:text-white">
                {{ $t('beginStatText') }}
                <span class="font-bold">{{ 10 + $t('days') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-3">
              <ShoppingCartIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="(product, idx) in bestSellerProductStats" :key="idx"
              class="flex items-center justify-between py-1.5">
              <div class="flex items-center space-x-3">
                <div
                  class="flex items-center justify-center bg-blue-100 dark:bg-slate-800 min-w-6 max-w-full h-6 rounded-lg">
                  <span class="text-base dark:text-blue-400 text-blue-600">
                    {{ (pageSell - 1) * pageSize + idx + 1 }}
                  </span>
                </div>
                <div>
                  <div class="text-base font-semibold text-slate-800 dark:text-slate-200">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-white">
                    {{ $t('price') }}:
                    <span class="text-gray-900 dark:text-zinc-200">
                      {{ useMoneyFormatter(product?.price) }}
                    </span>
                  </div>
                  <div class="text-sm dark:text-whit text-gray-600 dark:text-white">
                    {{ $t('totalPrice') }}:
                    <span class="text-gray-900 dark:text-white font-semibold">
                      {{ useMoneyFormatter(product?.totalPrice) }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="text-xl md:text-2xl font-bold text-blue-700 dark:text-blue-500">
                {{ roundFloatToTwoDecimal(product?.amount) }}
              </div>
            </div>
          </div>
        </div>
        <div class="w-min flex items-center justify-center ">
          <div class="flex items-center space-x-2">
            <button :disabled="pageSell === 1" @click="goToSellPage(1)"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleLeftIcon class="w-5 h-5" />
            </button>
            <button @click="prevSellPage" :disabled="pageSell === 1"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretLeftIcon class="w-5 h-5" />
            </button>
            <div class="flex items-center space-x-2">
              <button v-for="pageSellNumber in displayedSellPageNumbers" :key="pageSellNumber"
                @click="goToSellPage(pageSellNumber)" :class="{
                  'bg-blue-600 text-white': pageSellNumber === pageSell,
                  'hover:bg-blue-200': pageSellNumber !== pageSell,
                }"
                class="px-3 py-2 select-none rounded-lg text-slate-900 dark:text-white text-center text-base font-medium transition-all">
                {{ pageSellNumber }}
              </button>
            </div>
            <button @click="nextSellPage" :disabled="pageSell === totalSellPages"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretRightIcon class="w-5 h-5" />
            </button>
            <button :disabled="pageSell === totalSellPages" @click="goToSellPage(totalSellPages)"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div class="p-5 flex flex-1 rounded-3xl bg-slate-100 dark:bg-slate-900 h-[650px] flex-col justify-between">
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div class="space-y-0.5">
              <div class="text-base md:text-xl font-semibold">
                {{ $t('worstSellingProducts') }}
              </div>
              <div class="text-sm md:text-base text-gray-600 dark:text-white">
                {{ $t('beginStatText') }}
                <span class="font-bold lowercase">{{ $t('worstSellingProducts') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-3">
              <ShoppingCartIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
            </div>
          </div>
          <div class="divide-y divide-gray-100">
            <div v-for="(product, idx) in worstSellerProductStats" :key="idx"
              class="flex items-center justify-between py-1.5">
              <div class="flex items-center space-x-3">
                <div
                  class="flex items-center justify-center bg-blue-100 dark:bg-slate-800 min-w-6 max-w-full h-6 rounded-lg">
                  <span class="text-base dark:text-blue-400 text-blue-600">
                    {{ (pageWorstSell - 1) * pageSize + idx + 1 }}
                  </span>
                </div>
                <div>
                  <div class="text-base font-semibold whitespace-normal text-slate-800 dark:text-slate-200">
                    {{ product?.name + ' - ' + product?.packaging }}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-white">
                    {{ $t('barcode') }}:
                    <span class="text-gray-900 dark:text-zinc-200">
                      {{ (product?.barcode) }}
                    </span>
                  </div>
                  <div class="text-sm dark:text-white text-gray-600">
                    {{ $t('lastDays') }}:
                    <span class="text-red-700 dark:text-red-400 font-semibold">
                      {{ (product?.daysSinceLastSale) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="w-min flex items-center justify-center ">
          <div class="flex items-center space-x-2">
            <button :disabled="pageWorstSell === 1" @click="goToWorstSellPage(1)"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleLeftIcon class="w-5 h-5" />
            </button>
            <button @click="prevWorstSellPage" :disabled="pageWorstSell === 1"
              class="flex items-center justify-center px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretLeftIcon class="w-5 h-5" />
            </button>
            <div class="flex items-center space-x-2">
              <button v-for="pageWorstSellNumber in displayedWorstSellPageNumbers" :key="pageWorstSellNumber"
                @click="goToWorstSellPage(pageWorstSellNumber)" :class="{
                  'bg-blue-600 text-white': pageWorstSellNumber === pageWorstSell,
                  'hover:bg-blue-200': pageWorstSellNumber !== pageWorstSell,
                }"
                class="px-3 py-2 select-none rounded-lg text-slate-900 dark:text-white text-center text-base font-medium transition-all">
                {{ pageWorstSellNumber }}
              </button>
            </div>
            <button @click="nextWorstSellPage" :disabled="pageWorstSell === totalWorstSellPages"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-center text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretRightIcon class="w-5 h-5" />
            </button>
            <button :disabled="pageWorstSell === totalWorstSellPages" @click="goToWorstSellPage(totalWorstSellPages)"
              class="flex items-center gap-2 px-3 py-2 text-base font-medium text-slate-900 dark:text-white rounded-lg select-none hover:bg-blue-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
              type="button">
              <CaretDoubleRightIcon class="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1">
      <div class="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0">
        <div class="w-1/2 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
            <div>
              <div class="text-base font-bold text-slate-800 dark:text-slate-200">
                {{ $t('profitStatistics') }}
              </div>
              <div v-if="salesChartFilterData === 6" class="text-sm text-gray-600 dark:text-white">
                {{ $t('beginStatText') }}
                <span class="font-bold lowercase">{{ $t('week') }}</span>
                {{ $t('endStatText') }}
              </div>
              <div v-else class="text-sm text-gray-600 dark:text-white">
                {{ $t('beginStatText') }}
                <span class="font-bold lowercase">{{ $t('monthly') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div>
              <select v-model="salesChartFilterData"
                class="bg-blue-100 dark:bg-slate-900 border-none text-slate-900 dark:text-white rounded-lg text-base md:text-lg block w-full h-11">
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
            <apexchart type="bar" height="320" :options="profitChartOptions" :series="profitChartSeries">
            </apexchart>
          </div>
          <div v-else>
            <apexchart type="bar" height="320" :options="salesAreaChartOptions" :series="profitChartSeries">
            </apexchart>
          </div>
        </div>
        <div class="w-1/2 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
            <div>
              <div class="text-base font-bold text-slate-800 dark:text-slate-200">
                {{ $t('salesStatistics') }}
              </div>
              <div class="text-sm text-gray-600 dark:text-white">
                {{ $t('beginStatText') }}
                <span class="font-bold">{{ 7 + $t('days') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
            <div class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-2">
              <ChartBarIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
            </div>
          </div>
          <apexchart type="bar" height="320" :options="salesChartOptions" :series="salesChartSeries">
          </apexchart>
        </div>
      </div>
    </div>
    <div class="flex-1 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
        <div>
          <div class="text-base font-bold text-slate-800 dark:text-slate-200">
            {{ $t('inputAndOutputCostStatistics') }}
          </div>
          <div class="text-sm text-gray-600 dark:text-white">
            {{ $t('beginStatText') }}
            <span class="font-bold">{{ 60 + $t('days') }}</span>
            {{ $t('endStatText') }}
          </div>
        </div>
        <div class="relative" ref="dropdown">
          <div @click="useDropdownStore().toggleFilterBy()"
            class="border-none select-none text-gray-900 bg-white dark:text-zinc-200 dark:bg-slate-800 shadow rounded-lg w-full p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 dark:text-zinc-50 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenFilterBy"
            class="absolute dark:bg-slate-800 bg-white shadow rounded-xl p-3 z-20 top-12 right-0 space-y-3">
            <div class="flex items-center space-x-1">
              <label for="" class="dark:text-white">
                {{ $t('from') }}
                <input v-model="filterData.startDate" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
              </label>
              <ArrowDownIcon class="-rotate-90 text-gray-600 dark:text-white mt-6" />
              <label for="" class="dark:text-white">
                {{ $t('to') }}
                <input v-model="filterData.endDate" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <div @click="cleanFilterData()"
                class="basis-1/3 w-full bg-slate-100 hover:bg-slate-300 cursor-pointer select-none py-3 rounded-lg flex items-center justify-center">
                <span>{{ $t('cleaning') }}</span>
              </div>
              <div class="basis-2/3">
                <div v-if="isLoading"
                  class="w-full bg-blue-600 py-3 select-none text-white rounded-lg flex items-center justify-center">
                  <Spinners270RingIcon
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-white fill-gray-600 dark:fill-gray-300" />
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
      <apexchart type="area" height="320" :options="turnoverStatsAreaChartOptions" :series="turnoverStatsChartSeries">
      </apexchart>
    </div>
    <div class="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0">
      <div class="flex-1 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
        <div class="flex items-center justify-between px-2">
          <div>
            <div class="text-base font-bold text-slate-800 dark:text-slate-200">
              {{ $t('cashierStatistics') }}
            </div>
            <div class="text-sm text-gray-600 dark:text-white">
              {{ $t('beginStatText') }}
              <span class="font-bold">{{ 10 + $t('days') }}</span>
              {{ $t('endStatText') }}
            </div>
          </div>
          <div class="flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-2">
            <ChartDonutIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
          </div>
        </div>
        <apexchart type="donut" height="320" :options="caishersChartOptions" :series="caishersChartSeries">
        </apexchart>
      </div>
      <!-- <div class="flex-1"></div> -->
      <div class="flex-1 flex flex-col space-y-4">
        <div class="flex flex-col md:flex-row md:items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0">
          <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-100 dark:bg-slate-900 p-5">
            <div
              class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0 md:space-y-2">
              <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-3">
                <StoreIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
              </div>
              <div>
                <div class="text-base text-gray-600 dark:text-white">
                  {{ $t('productTypes') }}
                </div>
                <div class="text-xl md:text-2xl dark:text-white font-semibold">
                  {{ productStats?.typeCount }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-100 dark:bg-slate-900 p-5">
            <div
              class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0  md:space-y-2">
              <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-3">
                <StoreIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
              </div>
              <div>
                <div class="text-base text-gray-600 dark:text-white">
                  {{ $t('numberOfProducts') }}
                </div>
                <div class="text-xl md:text-2xl dark:text-white font-semibold">
                  {{ productStats?.quantity }}
                </div>
              </div>
            </div>
          </div>
          <div class="flex-1 w-full h-full space-y-4 rounded-3xl bg-slate-100 dark:bg-slate-900 p-5">
            <div
              class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0 md:space-y-2">
              <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-3">
                <DollarIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
              </div>
              <div>
                <div class="text-base text-gray-600 dark:text-white">
                  {{ $t('totalProductPrice') }}
                </div>
                <div class="text-xl md:text-2xl dark:text-white font-semibold">
                  {{ useMoneyFormatter(productStats.sum) }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-col md:flex-row md:items-center space-x-0 md:space-x-4 space-y-2 md:space-y-0">
          <div v-for="(product, idx) in soldProductPrice" :key="idx"
            class="flex-1 w-full space-y-4 rounded-3xl bg-slate-100 dark:bg-slate-900 p-5">
            <div
              class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0 md:space-y-2">
              <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-3">
                <DollarIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
              </div>
              <div>
                <div v-if="product?.period === 'current_month'" class="text-base text-gray-600 dark:text-white">
                  {{ $t('currentMonthsSales') }}
                </div>
                <div v-else class="text-base text-gray-600 dark:text-white">
                  {{ $t('previousMonthsSales') }}
                </div>
                <div class="text-xl md:text-2xl dark:text-white font-semibold">
                  {{ useMoneyFormatter(product?.total) }}
                </div>
              </div>
            </div>
          </div>

          <div class="flex-1 w-full h-full space-y-4 rounded-3xl bg-slate-100 dark:bg-slate-900 p-5">
            <div
              class="flex flex-row md:flex-col items-center md:items-start space-x-4 md:space-x-0 space-y-0 md:space-y-2">
              <div class="inline-flex items-center justify-center rounded-xl bg-blue-100 dark:bg-slate-800 p-3">
                <UsersIcon class="w-8 h-8 dark:text-blue-400 text-blue-600" />
              </div>
              <div>
                <div class="text-base text-gray-600 dark:text-white">
                  {{ $t('numberOfEmployees') }}
                </div>
                <div class="text-xl md:text-2xl dark:text-white font-semibold">
                  {{ cashiersStat.length }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex-1 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
        <div>
          <div class="text-base font-bold text-slate-800 dark:text-slate-200">
            {{ $t('recommendStat') }}
          </div>
          <div class="text-sm text-gray-600 dark:text-white">
            {{ $t('beginStatText') }}
            <span class="font-bold lowercase">
              {{
                filterRecommendData.intervalType === 'day' ? $t('days') :
                  filterRecommendData.intervalType === 'week' ? $t('week') :
                    filterRecommendData.intervalType === 'month' ? $t('monthly') :
                      filterRecommendData.intervalType === 'year' ? $t('year') :
                        $t('monthly')
              }}
            </span>
            {{ $t('endStatText') }}
          </div>
        </div>
        <div class="relative" ref="recommendDropdown">
          <div @click="useDropdownStore().toggleRecommendFilterBy()"
            class="border-none w-40 select-none text-gray-900 bg-white dark:text-zinc-200 dark:bg-slate-800 shadow rounded-lg p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 dark:text-zinc-50 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenRecommendFilterBy"
            class="absolute dark:bg-slate-800  w-80  bg-white shadow rounded-xl  p-3 z-20 top-12 right-0 space-y-3">
            <div class=" items-center space-x-1">
              <div class="flex">
              </div>
              <div class="flex justify-between space-x-4"><label for="" class="dark:text-white w-1/2">
                  {{ $t('limit') }}
                  <input v-model="filterRecommendData.limit" type="number" min="0"
                    class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
                </label>
                <label for="" class="dark:text-white w-1/2">
                  {{ $t('intervalType') }}
                  <select v-model="filterRecommendData.intervalType"
                    class="bg-blue-100 dark:bg-slate-600 border-none text-slate-900 dark:text-white rounded-lg text-base md:text-lg block w-full h-11">
                    <option value="day">
                      {{ $t('day') }}
                    </option>
                    <option value="week">
                      {{ $t('week') }}
                    </option>
                    <option value="month">
                      {{ $t('month') }}
                    </option>
                    <option value="year">
                      {{ $t('year') }}
                    </option>
                  </select>
                </label>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div @click="cleanFilterRecommendData()"
                class="basis-1/3 w-full bg-slate-100 hover:bg-slate-300 cursor-pointer select-none py-3 rounded-lg flex items-center justify-center">
                <span>{{ $t('cleaning') }}</span>
              </div>
              <div class="basis-2/3">
                <div v-if="isLoading"
                  class="w-full bg-blue-600 py-3 select-none text-white rounded-lg flex items-center justify-center">
                  <Spinners270RingIcon
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin fill-gray-600 dark:fill-gray-300" />
                  <span>{{ $t('loading') }}</span>
                </div>
                <div v-else @click="submitRecommendStatsFilterData()"
                  class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                  <span>{{ $t('filter') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <apexchart type="bar" height="320" :options="recommendStatsAreaChartOptions" :series="recommendStatsChartSeries">
      </apexchart>
    </div>

    <div class="flex-1 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
        <div>
          <div class="text-base font-bold text-slate-800 dark:text-slate-200">
            {{ $t('unprofitableStat') }}
          </div>
          <div class="text-sm text-gray-600 dark:text-white">
            {{ $t('beginStatText') }}
            <span class="font-bold lowercase">
              {{
                filterUnprofitableData.intervalType === 'day' ? $t('days') :
                  filterUnprofitableData.intervalType === 'week' ? $t('week') :
                    filterUnprofitableData.intervalType === 'month' ? $t('monthly') :
                      filterUnprofitableData.intervalType === 'year' ? $t('year') :
                        $t('monthly')
              }}
            </span>
            {{ $t('endStatText') }}
          </div>
        </div>
        <div class="relative" ref="unprofitableDropdown">
          <div @click="useDropdownStore().toggleUnprofitableFilterBy()"
            class="border-none w-40 select-none text-gray-900 bg-white dark:text-zinc-200 dark:bg-slate-800 shadow rounded-lg p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 dark:text-zinc-50 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenUnprofitableFilterBy"
            class="absolute dark:bg-slate-800  w-80  bg-white shadow rounded-xl  p-3 z-20 top-12 right-0 space-y-3">
            <div class=" items-center space-x-1">
              <div class="flex">
              </div>
              <div class="flex justify-between space-x-4"><label for="" class="dark:text-white w-1/2">
                  {{ $t('limit') }}
                  <input v-model="filterUnprofitableData.limit" type="number" min="0"
                    class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
                </label>
                <label for="" class="dark:text-white w-1/2">
                  {{ $t('intervalType') }}
                  <select v-model="filterUnprofitableData.intervalType"
                    class="bg-blue-100 dark:bg-slate-600 border-none text-slate-900 dark:text-white rounded-lg text-base md:text-lg block w-full h-11">
                    <option value="day">
                      {{ $t('day') }}
                    </option>
                    <option value="week">
                      {{ $t('week') }}
                    </option>
                    <option value="month">
                      {{ $t('month') }}
                    </option>
                    <option value="year">
                      {{ $t('year') }}
                    </option>
                  </select>
                </label>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div @click="cleanFilterUnprofitableData()"
                class="basis-1/3 w-full bg-slate-100 hover:bg-slate-300 cursor-pointer select-none py-3 rounded-lg flex items-center justify-center">
                <span>{{ $t('cleaning') }}</span>
              </div>
              <div class="basis-2/3">
                <div v-if="isLoading"
                  class="w-full bg-blue-600 py-3 select-none text-white rounded-lg flex items-center justify-center">
                  <Spinners270RingIcon
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin fill-gray-600 dark:fill-gray-300" />
                  <span>{{ $t('loading') }}</span>
                </div>
                <div v-else @click="submitUnprofitableStatsFilterData()"
                  class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                  <span>{{ $t('filter') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <apexchart type="bar" height="320" :options="unprofitableStatsAreaChartOptions"
        :series="unprofitableStatsChartSeries">
      </apexchart>
    </div>

    <div class="flex-1 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
        <div>
          <div class="text-base font-bold text-slate-800 dark:text-slate-200">
            {{ $t('corporateStatistics') }}
          </div>
          <div class="text-sm text-gray-600 dark:text-white">
            {{ $t('beginStatText') }}
            <span class="font-bold lowercase">{{ $t('monthly') }}</span>
            {{ $t('endStatText') }}
          </div>
        </div>
        <div class="relative" ref="corporateDropdown">
          <div @click="useDropdownStore().toggleCorporateFilterBy()"
            class="border-none w-40 select-none text-gray-900 bg-white dark:text-zinc-200 dark:bg-slate-800 shadow rounded-lg p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 dark:text-zinc-50 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenCorporateFilterBy"
            class="absolute dark:bg-slate-800 w-96 bg-white shadow rounded-xl  p-3 z-20 top-12 right-0 space-y-3">
            <div class=" items-center space-x-1">
              <div class="flex">
                <div class="flex items-center space-x-1">
                  <label for="" class="dark:text-white">
                    {{ $t('from') }}
                    <input v-model="filterCorporateData.from" type="date"
                      class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
                  </label>
                  <ArrowDownIcon class="-rotate-90 text-gray-600 dark:text-white mt-6" />
                  <label for="" class="dark:text-white">
                    {{ $t('to') }}
                    <input v-model="filterCorporateData.to" type="date"
                      class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
                  </label>
                </div>
              </div>
              <div class="flex justify-between space-x-4">
                <label for="" class="dark:text-white w-1/2">
                  {{ $t('intervalType') }}
                  <select v-model="filterCorporateData.intervalType"
                    class="bg-blue-100 dark:bg-slate-600 border-none text-slate-900 dark:text-white rounded-lg text-base md:text-lg block w-full h-11">
                    <option value="day">
                      {{ $t('day') }}
                    </option>
                    <option value="week">
                      {{ $t('week') }}
                    </option>
                    <option value="month">
                      {{ $t('month') }}
                    </option>
                    <option value="year">
                      {{ $t('year') }}
                    </option>
                  </select>
                </label>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div @click="cleanFilterCorporateData()"
                class="basis-1/3 w-full bg-slate-100 hover:bg-slate-300 cursor-pointer select-none py-3 rounded-lg flex items-center justify-center">
                <span>{{ $t('cleaning') }}</span>
              </div>
              <div class="basis-2/3">
                <div v-if="isLoading"
                  class="w-full bg-blue-600 py-3 select-none text-white rounded-lg flex items-center justify-center">
                  <Spinners270RingIcon
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin fill-gray-600 dark:fill-gray-300" />
                  <span>{{ $t('loading') }}</span>
                </div>
                <div v-else @click="submitCorporateStatsFilterData()"
                  class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                  <span>{{ $t('filter') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <apexchart type="area" height="320" :options="corporateStatsAreaChartOptions" :series="corporateStatsChartSeries">
      </apexchart>
    </div>

    <div class="flex-1 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
        <div>
          <div class="text-base font-bold text-slate-800 dark:text-slate-200">
            {{ $t('varietyStat') }}
          </div>
          <div class="text-sm text-gray-600 dark:text-white">
            {{ $t('beginStatText') }}
            <span class="font-bold lowercase">{{ $t('monthly') }}</span>
            {{ $t('endStatText') }}
          </div>
        </div>
        <div class="relative" ref="varietyDropdown">
          <div @click="useDropdownStore().toggleVarietyFilterBy()"
            class="border-none w-40 select-none text-gray-900 bg-white dark:text-zinc-200 dark:bg-slate-800 shadow rounded-lg p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 dark:text-zinc-50 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenVarietyFilterBy"
            class="absolute dark:bg-slate-800 w-96 bg-white shadow rounded-xl  p-3 z-20 top-12 right-0 space-y-3">
            <div class=" items-center space-x-1">
              <div class="flex">
                <div class="flex w-fit items-center space-x-1">
                  <label for="" class="dark:text-white">
                    {{ $t('from') }}
                    <input v-model="filterVarietyData.startDate" type="date"
                      class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
                  </label>
                  <ArrowDownIcon class="-rotate-90 text-gray-600 dark:text-white mt-6" />
                  <label for="" class="dark:text-white">
                    {{ $t('to') }}
                    <input v-model="filterVarietyData.endDate" type="date"
                      class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
                  </label>
                </div>
              </div>
              <div class="flex justify-between space-x-4"><label for="" class="dark:text-white w-1/2">
                  {{ $t('interval') }}
                  <input v-model="filterVarietyData.interval" type="number" min="0"
                    class="border-none text-gray-500 bg-gray-100 rounded-lg     dark:bg-slate-600 dark:text-white w-full" />
                </label>
                <label for="" class="dark:text-white w-1/2">
                  {{ $t('intervalType') }}
                  <select v-model="filterVarietyData.intervalType"
                    class="bg-blue-100 dark:bg-slate-600 border-none text-slate-900 dark:text-white rounded-lg text-base md:text-lg block w-full h-11">
                    <option value="day">
                      {{ $t('day') }}
                    </option>
                    <option value="week">
                      {{ $t('week') }}
                    </option>
                    <option value="month">
                      {{ $t('month') }}
                    </option>
                    <option value="year">
                      {{ $t('year') }}
                    </option>
                  </select>
                </label>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <div @click="cleanFilterVarietyData()"
                class="basis-1/3 w-full bg-slate-100 hover:bg-slate-300 cursor-pointer select-none py-3 rounded-lg flex items-center justify-center">
                <span>{{ $t('cleaning') }}</span>
              </div>
              <div class="basis-2/3">
                <div v-if="isLoading"
                  class="w-full bg-blue-600 py-3 select-none text-white rounded-lg flex items-center justify-center">
                  <Spinners270RingIcon
                    class="mr-2 w-5 h-5 text-gray-200 animate-spin fill-gray-600 dark:fill-gray-300" />
                  <span>{{ $t('loading') }}</span>
                </div>
                <div v-else @click="submitVarietyStatsFilterData()"
                  class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                  <span>{{ $t('filter') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <apexchart type="area" height="320" :options="varietyStatsAreaChartOptions" :series="varietyStatsChartSeries">
      </apexchart>
    </div>

    <div class="flex-1 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
        <div>
          <div class="text-base font-bold text-slate-800 dark:text-slate-200">
            {{ $t('monthlyStatistics') }}
          </div>
          <div class="text-sm text-gray-600 dark:text-white">
            {{ $t('beginStatText') }}
            <span class="font-bold lowercase">{{ $t('monthly') }}</span>
            {{ $t('endStatText') }}
          </div>
        </div>
      </div>
      <apexchart type="area" height="320" :options="monthStatsAreaChartOptions" :series="monthStatsChartSeries">
      </apexchart>
    </div>

    <div class="flex-1">
      <div class="flex flex-col md:flex-row space-x-0 md:space-x-4 space-y-2 md:space-y-0">
        <div class="w-1/2 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
            <div>
              <div class="text-base font-bold text-slate-800 dark:text-slate-200">
                {{ $t('predictStat') }}
              </div>
              <div class="text-sm text-gray-600 dark:text-white">
                {{ $t('predictStatFor') }}
                <span class="font-bold lowercase">{{ '11 ' + $t('monthly') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
          </div>
          <apexchart type="area" height="320" :options="predictStatsAreaChartOptions" :series="predictStatsChartSeries">
          </apexchart>
        </div>
        <div class="w-1/2 bg-slate-100 dark:bg-slate-900 rounded-3xl p-5">
          <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
            <div>
              <div class="text-base font-bold text-slate-800 dark:text-slate-200">
                {{ $t('predictStat') }}
              </div>
              <div class="text-sm text-gray-600 dark:text-white">
                {{ $t('predictStatFor') }}
                <span class="font-bold lowercase">{{ '11 ' + $t('monthly') }}</span>
                {{ $t('endStatText') }}
              </div>
            </div>
          </div>
          <apexchart type="area" height="320" :options="predictCountStatsAreaChartOptions"
            :series="predictCountStatsChartSeries">
          </apexchart>
        </div>
      </div>
    </div>
  </div>
</template>
<!-- <style scoped>
.apexcharts-legend-series {
  background-color: white !important; /* Переопределение встроенного стиля */
}
</style> -->