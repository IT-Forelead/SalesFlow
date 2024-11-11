<script setup>
import { onClickOutside } from '@vueuse/core'
import moment from 'moment'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import ArrowDownIcon from '../assets/icons/ArrowDownIcon.vue'
import FunnelIcon from '../assets/icons/FunnelIcon.vue'
import Spinners270RingIcon from '../assets/icons/Spinners270RingIcon.vue'
import useMoneyFormatter from '../mixins/currencyFormatter'
import OrderService from '../services/order.service'
import ProductService from '../services/product.service'
import { useDropdownStore } from '../store/dropdown.store'
import CashbackService from '../services/cashback.service'

const { t } = useI18n()
const turnoverStats = ref([])
const bestSellerProductStats = ref([])
const bestRevenueProductStats = ref([])
const bestProfitProductStats = ref([])
const dailyTrading = t('dailyTrading')
const qrTrading = t('qrTrading')
const worstSellerProductStats = ref([])

const dropdown = ref(null)
const isLoading = ref(false)
const salesChartFilterData = ref(6)
const cashiersStat = ref([])
const ordersStat = ref([])
const productStats = ref({})
const hourlyTrading = t('dailyTrading')
const soldProductPrice = ref(0)
const hourlySales = ref([])
const cashbackRedeems = ref([])

const monthStats = ref([])
const varietyStats = ref([])
const predictStats = ref([])

const filterVarietyData = reactive({
  startDate: '',
  endDate: '',
})

const cleanFilterVarietyData = () => {
  filterVarietyData.startDate = ''
  filterVarietyData.endDate = ''
}

const filterMonthData = reactive({
  startDate: '',
  endDate: '',
})

const cleanFilterMonthData = () => {
  filterMonthData.startDate = ''
  filterMonthData.endDate = ''
}

const filterPredictData = reactive({
  startDate: '',
  endDate: '',
})

const cleanFilterPredictData = () => {
  filterPredictData.startDate = ''
  filterPredictData.endDate = ''
}

onClickOutside(dropdown, () => {
  if (useDropdownStore().isOpenPredictFilterBy) {
    useDropdownStore().togglePredictFilterBy()
  } else if (useDropdownStore().isOpenVarietyFilterBy) {
    useDropdownStore().toggleVarietyFilterBy()
  } else if (useDropdownStore().isOpenMonthFilterBy) {
    useDropdownStore().toggleMonthFilterBy()
  }
})

const submitPredictStatsFilterData = () => {
  if (!filterPredictData.startDate) {
    toast.warning(t('plsEnterStartDate'))
  } else if (!filterPredictData.endDate) {
    toast.warning(t('plsEnterEndDate'))
  } else {
    isLoading.value = true
    OrderService.getPredictStats(pageSize).then((res) => {
      predictStats.value = res
      isLoading.value = false
      if (useDropdownStore().isOpenPredictFilterBy) {
        useDropdownStore().togglePredictFilterBy()
      }
    }).catch(() => {
      isLoading.value = false
    })
  }
}

const predictStatsChartSeries = computed(() => [
  {
    name: 'profitGrowth',
    data: predictStats.value?.map((item) => item.profitGrowth),
  },
  {
    name: 'incomeGrowth',
    data: predictStats.value?.map((item) => item.incomeGrowth),
  },
])

const predictStatsAreaChartOptions = computed(() => {
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
      categories: predictStats.value?.map((item) => item.month),
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

const submitVarietyStatsFilterData = () => {
  if (!filterVarietyData.startDate) {
    toast.warning(t('plsEnterStartDate'))
  } else if (!filterVarietyData.endDate) {
    toast.warning(t('plsEnterEndDate'))
  } else {
    isLoading.value = true
    ProductService.getVarietyStats({
      startDate: '2024-07-21',
      endDate: '2024-09-21',
      interval: 1,
      intervalType: 'day'
    }).then((res) => {
      varietyStats.value = res
    }).catch(() => {
      isLoading.value = false
    })
  }
}

const varietyStatsChartSeries = computed(() => [
  {
    name: 'kirim',
    data: varietyStats.value?.map((item) => item.productTypeCount),
  },
])

const varietyStatsAreaChartOptions = computed(() => {
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
      categories: varietyStats.value?.map((item) => item.day),
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

const submitMonthStatsFilterData = () => {
  if (!filterMonthData.startDate) {
    toast.warning(t('plsEnterStartDate'))
  } else if (!filterMonthData.endDate) {
    toast.warning(t('plsEnterEndDate'))
  } else {
    isLoading.value = true
    OrderService.getMonthStats(pageSize).then((res) => {
      monthStats.value = res
      isLoading.value = false
      if (useDropdownStore().isOpenMonthFilterBy) {
        useDropdownStore().toggleMonthFilterBy()
      }
    }).catch(() => {
      isLoading.value = false
    })
  }
}

const monthStatsChartSeries = computed(() => [
  {
    name: 'income',
    data: monthStats.value?.map((item) => item.income),
  },
])

const monthStatsAreaChartOptions = computed(() => {
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
      categories: monthStats.value?.map((item) => item.month),
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

  OrderService.getPredictStats(pageSize).then((res) => {
    predictStats.value = res
  })
  OrderService.getMonthStats(pageSize).then((res) => {
    monthStats.value = res
  })
  ProductService.getVarietyStats(pageSize).then((res) => {
    varietyStats.value = res
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
    });
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
    <div class="flex-1 bg-slate-50 rounded-3xl p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
        <div>
          <div class="text-base font-bold text-gray-800">
            {{ $t('variety') }}
          </div>

        </div>
        <div class="relative" ref="dropdown">
          <div @click="useDropdownStore().toggleVarietyFilterBy()"
            class="border-none select-none text-gray-900 bg-white shadow rounded-lg w-full p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenVarietyFilterBy"
            class="absolute bg-white shadow rounded-xl p-3 z-20 top-12 right-0 space-y-3">
            <div class="flex items-center space-x-1">
              <label for="">
                {{ $t('from') }}
                <input v-model="filterVarietyData.startDate" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg w-full" />
              </label>
              <ArrowDownIcon class="-rotate-90 text-gray-600 mt-6" />
              <label for="">
                {{ $t('to') }}
                <input v-model="filterVarietyData.endDate" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg w-full" />
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <div @click="cleanFilterVarietyData()"
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

    <div class="flex-1 bg-slate-50 rounded-3xl p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
        <div>
          <div class="text-base font-bold text-gray-800">
            {{ $t('predict') }}
          </div>
        </div>
        <div class="relative" ref="dropdown">
          <div @click="useDropdownStore().togglePredictFilterBy()"
            class="border-none select-none text-gray-900 bg-white shadow rounded-lg w-full p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenPredictFilterBy"
            class="absolute bg-white shadow rounded-xl p-3 z-20 top-12 right-0 space-y-3">
            <div class="flex items-center space-x-1">
              <label for="">
                {{ $t('from') }}
                <input v-model="filterPredictData.startDate" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg w-full" />
              </label>
              <ArrowDownIcon class="-rotate-90 text-gray-600 mt-6" />
              <label for="">
                {{ $t('to') }}
                <input v-model="filterPredictData.endDate" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg w-full" />
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <div @click="cleanFilterPredictData()"
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
                <div v-else @click="submitPredictStatsFilterData()"
                  class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                  <span>{{ $t('filter') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <apexchart type="area" height="320" :options="predictStatsAreaChartOptions" :series="predictStatsChartSeries">
      </apexchart>
    </div>

    <div class="flex-1 bg-slate-50 rounded-3xl p-5">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between px-2 space-y-3 md:space-y-0">
        <div>
          <div class="text-base font-bold text-gray-800">
            {{ $t('month') }}
          </div>

        </div>
        <div class="relative" ref="dropdown">
          <div @click="useDropdownStore().toggleMonthFilterBy()"
            class="border-none select-none text-gray-900 bg-white shadow rounded-lg w-full p-2 px-5 flex items-center hover:bg-gray-100 cursor-pointer space-x-1">
            <FunnelIcon class="w-5 h-5 text-gray-400" />
            <span>{{ $t('filter') }}</span>
          </div>
          <div v-if="useDropdownStore().isOpenMonthFilterBy"
            class="absolute bg-white shadow rounded-xl p-3 z-20 top-12 right-0 space-y-3">
            <div class="flex items-center space-x-1">
              <label for="">
                {{ $t('from') }}
                <input v-model="filterMonthData.startDate" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg w-full" />
              </label>
              <ArrowDownIcon class="-rotate-90 text-gray-600 mt-6" />
              <label for="">
                {{ $t('to') }}
                <input v-model="filterMonthData.endDate" type="date"
                  class="border-none text-gray-500 bg-gray-100 rounded-lg w-full" />
              </label>
            </div>
            <div class="flex items-center space-x-2">
              <div @click="cleanFilterMonthData()"
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
                <div v-else @click="submitMonthStatsFilterData()"
                  class="w-full bg-blue-500 hover:bg-blue-600 cursor-pointer select-none py-3 text-white rounded-lg flex items-center justify-center">
                  <span>{{ $t('filter') }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <apexchart type="area" height="320" :options="monthStatsAreaChartOptions" :series="monthStatsChartSeries">
      </apexchart>
    </div>

  </div>
</template>