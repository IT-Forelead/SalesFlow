<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import HouseIcon from './../assets/icons/HouseIcon.vue'
import PhShoppingCart from '../assets/icons/ShoppingCartIcon.vue'
import PhBarcodeIcon from '../assets/icons/BarcodeIcon.vue'
import PhPercent from '../assets/icons/PercentIcon.vue'
import UsersIcon from '../assets/icons/UsersIcon.vue'
import StoreIcon from '../assets/icons/StoreIcon.vue'
import SunIcon from '../assets/icons/SunIcon.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue-sonner'
import decodeJwt, { parseJwt } from '../mixins/utils'
import { useSidebarStore } from '../store/sidebar.store'
import ProfileDropDown from './ProfileDropDown.vue'
import { useAuthStore } from '../store/auth.store'
import DebtIcon from '../assets/icons/DebtIcon.vue'
import ProductHistoryIcon from '../assets/icons/ProductHistoryIcon.vue'
import SettingsIcon from '../assets/icons/SettingsIcon.vue'
import CaretDownIcon from '../assets/icons/CaretDownIcon.vue'
import SelectOptionLanguage from './inputs/SelectOptionLanguage.vue'
import SelectOptionTheme from './inputs/SelectOptionTheme.vue'
import PhUsersThree from '../assets/icons/UsersThreeIcon.vue'
import OverlayPanel from 'primevue/overlaypanel'
import XIcon from '../assets/icons/XIcon.vue'
import TicketSaleIcon from '../assets/icons/TicketSaleIcon.vue'
import FileLinearIcon from '../assets/icons/FileLinearIcon.vue'
import WishService from '../services/wish.service.js'
import { useWishStore } from '../store/wish.store.js'
import { cleanObjectEmptyFields } from '../mixins/utils'
import PhLockKey from '../assets/icons/LockKey.vue'
import InvestIcon from '../assets/icons/InvestIcon.vue'
import PhHandShake from '../assets/icons/HandShakeIcon.vue'
import InvestPlanIcon from '../assets/icons/InvestPlanIcon.vue'
import ClientIcon from '../assets/icons/ClientIcon.vue'
import ClientCorpIcon from '../assets/icons/ClientCorpIcon.vue'
import PhPriceList from '../assets/icons/PriceListIcon.vue'
import PriceListIcon from '../assets/icons/PriceListIcon.vue'
import UserIcon from '@/assets/icons/UserIcon.vue'
import InvisIcon from '@/assets/icons/EyeSlashIcon.vue'
import EyeIcon from '@/assets/icons/EyeIcon.vue'
import CashRegisterIcon from '@/assets/icons/CashRegisterIcon.vue'
import AgentIcon from '@/assets/icons/AgentIcon.vue'
import VoucherIcon from '@/assets/icons/VoucherIcon.vue'
import CategoryIcon from '@/assets/icons/CategoryIcon.vue'
import SalesCartIcon from '@/assets/icons/SalesCartIcon.vue'
import UserBanIcon from '@/assets/icons/UserBanIcon.vue'
import QrCodeIcon from '@/assets/icons/QrCodeIcon.vue'
import DollarIcon from '@/assets/icons/DollarIcon.vue'
import UpcomingIcon from '@/assets/icons/UpcomingIcon.vue'
import PercentCartIcon from '@/assets/icons/PercentCartIcon.vue'
import DiscountIcon from '@/assets/icons/DiscountIcon.vue'
import PercentBagIcon from '@/assets/icons/PercentBagIcon.vue'
import ExpenseIcon from '@/assets/icons/ExpenseIcon.vue'

const { t } = useI18n()
const router = useRouter()

const payload = ref({})
const wishToBuyProductName = ref('')
const wishToBuyProductModal = ref()
const wishFocus = ref(null)
const page = ref(1)
const pageSize = 50
const toggleWishToBuyProductModal = (event) => {
  wishToBuyProductModal.value.toggle(event);
}

watchEffect(() => {
  if (wishFocus.value && document.getElementById('wish')) {
    useSidebarStore().setWishFocus(true)
    document.getElementById('wish').focus();
  } else {
    useSidebarStore().setWishFocus(false)
  }
})

const selectPage = () => {
  useSidebarStore().isOpenSidebar = true
}

const closeSidebar = (event) => {
  if (event.target.closest('#sidebar') === null) {
    useSidebarStore().setSidebarState(false);
  }
}
const closeBar = () => {
  useSidebarStore().setSidebarState(false);
}

const navigationGuard = (access) => {
  return payload.value?.privileges?.includes(access)
}

const createWishToBuyProduct = () => {
  if (!wishToBuyProductName.value) {
    toast.warning(t('plsEnterProductName'))
  } else {
    WishService.createWish({
      name: wishToBuyProductName.value,
    }).then(() => {
      toast.success("Mahsulot muoffaqiyatli qo'shildi!")
      toggleWishToBuyProductModal()
      WishService.getWishes(
        cleanObjectEmptyFields({ limit: pageSize, page: page.value }),
      ).then((res) => {
        useWishStore().clearStore()
        useWishStore().setWishes(res.data)
        useWishStore().renderkey += 1
      })
    })
  }
}

const loadSidebarState = () => {
  const savedState = localStorage.getItem('sidebarState');
  if (savedState) {
    const parsedState = JSON.parse(savedState);
    investsVisible.value = parsedState.investsVisible ?? true;
    investPlansVisible.value = parsedState.investPlansVisible ?? true;
    investorsVisible.value = parsedState.investorsVisible ?? true;
    ipBannedVisible.value = parsedState.ipBannedVisible ?? true;
    wishesVisible.value = parsedState.wishesVisible ?? true;
    priceListsVisible.value = parsedState.priceListsVisible ?? true;
    vouchersVisible.value = parsedState.vouchersVisible ?? true;
    agentsVisible.value = parsedState.agentsVisible ?? true;
    clientsVisible.value = parsedState.clientsVisible ?? true;
    corporateClientsVisible.value = parsedState.corporateClientsVisible ?? true;
    saleSettingsVisible.value = parsedState.saleSettingsVisible ?? true;
    barcodeDuplicatesVisible.value = parsedState.barcodeDuplicatesVisible ?? true;
    productBarcodesVisible.value = parsedState.productBarcodesVisible ?? true;
    usersVisible.value = parsedState.usersVisible ?? true;
    marketsVisible.value = parsedState.marketsVisible ?? true;
    ordersVisible.value = parsedState.ordersVisible ?? true;
    cashbackHistoriesVisible.value = parsedState.cashbackHistoriesVisible ?? true;
    discountVisible.value = parsedState.discountVisible ?? true;
    upcomingProductsVisible.value = parsedState.upcomingProductsVisible ?? true
    incomeExpenseVisible.value = parsedState.incomeExpenseVisible ?? true
    productsVisible.value = parsedState.productsVisible ?? true
    saleVisible.value = parsedState.saleVisible ?? true
    dashboardVisible.value = parsedState.dashboardVisible ?? true
    categoriesVisible.value = parsedState.categoriesVisible ?? true
    expensesVisible.value = parsedState.expensesVisible ?? true
    whiteListVisible.value = parsedState.whiteListVisible ?? true
  }
};

const saveSidebarState = () => {
  const state = {
    investsVisible: investsVisible.value,
    investPlansVisible: investPlansVisible.value,
    investorsVisible: investorsVisible.value,
    ipBannedVisible: ipBannedVisible.value,
    wishesVisible: wishesVisible.value,
    priceListsVisible: priceListsVisible.value,
    vouchersVisible: vouchersVisible.value,
    agentsVisible: agentsVisible.value,
    clientsVisible: clientsVisible.value,
    corporateClientsVisible: corporateClientsVisible.value,
    saleSettingsVisible: saleSettingsVisible.value,
    barcodeDuplicatesVisible: barcodeDuplicatesVisible.value,
    productBarcodesVisible: productBarcodesVisible.value,
    usersVisible: usersVisible.value,
    marketsVisible: marketsVisible.value,
    ordersVisible: ordersVisible.value,
    cashbackHistoriesVisible: cashbackHistoriesVisible.value,
    discountVisible: discountVisible.value,
    upcomingProductsVisible: upcomingProductsVisible.value,
    incomeExpenseVisible: incomeExpenseVisible.value,
    productsVisible: productsVisible.value,
    saleVisible: saleVisible.value,
    dashboardVisible: dashboardVisible.value,
    categoriesVisible: categoriesVisible.value,
    expensesVisible: expensesVisible.value,
    whiteListVisible: whiteListVisible.value
  };
  localStorage.setItem('sidebarState', JSON.stringify(state));
};

const investsVisible = ref(true);
const investPlansVisible = ref(true);
const investorsVisible = ref(true);
const ipBannedVisible = ref(true);
const wishesVisible = ref(true);
const priceListsVisible = ref(true);
const vouchersVisible = ref(true);
const agentsVisible = ref(true);
const clientsVisible = ref(true);
const corporateClientsVisible = ref(true);
const saleSettingsVisible = ref(true);
const barcodeDuplicatesVisible = ref(true);
const productBarcodesVisible = ref(true);
const usersVisible = ref(true);
const marketsVisible = ref(true);
const ordersVisible = ref(true);
const cashbackHistoriesVisible = ref(true);
const discountVisible = ref(true);
const upcomingProductsVisible = ref(true);
const incomeExpenseVisible = ref(true);
const productsVisible = ref(true);
const saleVisible = ref(true);
const dashboardVisible = ref(true);
const categoriesVisible = ref(true);
const expensesVisible = ref(true);
const whiteListVisible = ref(true);

const whenPressEnter = (e) => {
  if (e.keyCode === 13) {
    createWishToBuyProduct()
    wishToBuyProductName.value = ''
  }
}

onMounted(() => {
  useAuthStore().setUser(decodeJwt(JSON.parse(localStorage.getItem('session'))?.accessToken))
  payload.value = parseJwt()
  loadSidebarState();
})
watch([investsVisible, investPlansVisible, investorsVisible, ipBannedVisible, wishesVisible, priceListsVisible, vouchersVisible, agentsVisible, clientsVisible, corporateClientsVisible, saleSettingsVisible, barcodeDuplicatesVisible, productBarcodesVisible, usersVisible, marketsVisible, ordersVisible, cashbackHistoriesVisible, discountVisible, upcomingProductsVisible, incomeExpenseVisible, productsVisible, saleVisible, dashboardVisible, categoriesVisible, expensesVisible, whiteListVisible], saveSidebarState, { deep: true });

const moveDashboardToOthers = () => {
  dashboardVisible.value = false;
};
const restoreDashboardFromOthers = () => {
  dashboardVisible.value = true;
};

const moveSaleToOthers = () => {
  saleVisible.value = false;
};
const restoreSaleFromOthers = () => {
  saleVisible.value = true;
};

const moveProductsToOthers = () => {
  productsVisible.value = false;
};
const restoreProductsFromOthers = () => {
  productsVisible.value = true;
};

const moveProductBarcodesToOthers = () => {
  productBarcodesVisible.value = false;
};
const restoreProductBarcodesFromOthers = () => {
  productBarcodesVisible.value = true;
};

const moveBarcodeDuplicatesToOthers = () => {
  barcodeDuplicatesVisible.value = false;
};
const restoreBarcodeDuplicatesFromOthers = () => {
  barcodeDuplicatesVisible.value = true;
};

const moveCashbackHistoriesToOthers = () => {
  cashbackHistoriesVisible.value = false;
};
const restoreCashbackHistoriesFromOthers = () => {
  cashbackHistoriesVisible.value = true;
};

const moveDiscountToOthers = () => {
  discountVisible.value = false;
};
const restoreDiscountFromOthers = () => {
  discountVisible.value = true;
};

const moveUpcomingProductsToOthers = () => {
  upcomingProductsVisible.value = false;
};
const restoreUpcomingProductsFromOthers = () => {
  upcomingProductsVisible.value = true;
};

const moveIncomeExpenseToOthers = () => {
  incomeExpenseVisible.value = false;
};
const restoreIncomeExpenseFromOthers = () => {
  incomeExpenseVisible.value = true;
};

const moveSaleSettingsToOthers = () => {
  saleSettingsVisible.value = false;
};
const restoreSaleSettingsFromOthers = () => {
  saleSettingsVisible.value = true;
};

const moveOrdersToOthers = () => {
  ordersVisible.value = false;
};
const restoreOrdersFromOthers = () => {
  ordersVisible.value = true;
};

const moveMarketToOthers = () => {
  marketsVisible.value = false;
};
const restoreMarketFromOthers = () => {
  marketsVisible.value = true;
};

const moveUsersToOthers = () => {
  usersVisible.value = false;
};
const restoreUsersFromOthers = () => {
  usersVisible.value = true;
};

const moveCorprorateClientsToOthers = () => {
  corporateClientsVisible.value = false;
};
const restoreCorporrateClientsFromOthers = () => {
  corporateClientsVisible.value = true;
};

const moveClientsToOthers = () => {
  clientsVisible.value = false;
};
const restoreClientsFromOthers = () => {
  clientsVisible.value = true;
};

const moveAgentsToOthers = () => {
  agentsVisible.value = false;
};
const restoreAgentsFromOthers = () => {
  agentsVisible.value = true;
};
const moveVouchersToOthers = () => {
  vouchersVisible.value = false;
};

const restoreVouchersFromOthers = () => {
  vouchersVisible.value = true;
};
const movePriceListsToOthers = () => {
  priceListsVisible.value = false;
};

const restorePriceListsFromOthers = () => {
  priceListsVisible.value = true;
};
const moveWishesToOthers = () => {
  wishesVisible.value = false;
};

const restoreWishesFromOthers = () => {
  wishesVisible.value = true;
};
const moveIpBannedToOthers = () => {
  ipBannedVisible.value = false;
};

const restoreIpBannedFromOthers = () => {
  ipBannedVisible.value = true;
};
const moveInvestorsToOthers = () => {
  investorsVisible.value = false;
};

const restoreInvestorsFromOthers = () => {
  investorsVisible.value = true;
};
const moveInvestsToOthers = () => {
  investsVisible.value = false;
};

const restoreInvestsFromOthers = () => {
  investsVisible.value = true;
};
const moveInvestPlansToOthers = () => {
  investPlansVisible.value = false;
};
const restoreInvestPlansFromOthers = () => {
  investPlansVisible.value = true;
};
const moveCategoriesToOthers = () => {
  categoriesVisible.value = false;
};
const restoreCategoriesFromOthers = () => {
  categoriesVisible.value = true;
};

const moveExpensesToOthers = () => {
  expensesVisible.value = false;
};
const restoreExpensesFromOthers = () => {
  expensesVisible.value = true;
};
const moveWhiteListToOthers = () => {
  whiteListVisible.value = false;
};
const restoreWhiteListFromOthers = () => {
  whiteListVisible.value = true;
};

const showHideButtons = ref(false)

const toggleShowHideButtons = () => {
  showHideButtons.value = !showHideButtons.value
}
</script>

<template>
  <div class="relative z-40" v-if="useSidebarStore().toggleSidebar && useSidebarStore().isOpenSidebar">
    <div class="fixed inset-0 z-40 transition-opacity duration-200 bg-slate-900 bg-opacity-30 lg:hidden lg:z-auto"
      :class="useSidebarStore().isOpenSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'" @click="closeSidebar">
    </div>
    <div id="sidebar" ref="sidebar"
      class="flex justify-between flex-col bg-slate-100 dark:bg-slate-900 absolute z-40 left-0 top-0 lg:static border-r lg:left-auto lg:top-auto lg:translate-x-0 min-h-screen w-72 md:w-64 2xl:w-72 shrink-0 transition-all duration-200 ease-in-out"
      :class="useSidebarStore().isOpenSidebar ? 'translate-x-0' : '-translate-x-64'">
      <div>
        <div class="h-20 flex justify-around">
          <div class="flex space-x-1 items-center justify-center">
            <img src="/images/logo.svg" class="w-12 h-12" alt="#">
            <div class="text-3xl font-extrabold cursor-default">
              <span class="text-[#0167f3]">Sales</span>
              <span class="dark:text-white">Flow</span>
            </div>
          </div>
          <div class="flex items-center justify-end">
            <XIcon
              class="w-6 h-6 mt-1 hover:text-[#0167f3] dark:text-white dark:hover:bg-gray-700 rounded-md cursor-pointer"
              @click="closeBar" />
          </div>
        </div>
        <ProfileDropDown @toggle-show-hide-buttons="toggleShowHideButtons" />
        <div class="max-h-svh flex pb-[18rem] flex-col">
          <div class="relative space-y-1 py-1 overflow-y-auto overflow-x-hidden md:max-h-screen">
            <div class="flex w-full justify-between" v-if="dashboardVisible && navigationGuard('dashboard')">
              <router-link to="/dashboard" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <HouseIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('dashboard') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveDashboardToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="saleVisible && navigationGuard('create_product')">
              <router-link to="/sales" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <CashRegisterIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('sale') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveSaleToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="productsVisible">
              <router-link to="/products" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PhShoppingCart class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('products') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveProductsToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="incomeExpenseVisible && navigationGuard('view_histories')">
              <router-link to="/product-histories" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <ProductHistoryIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('incomeExpense') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveIncomeExpenseToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between"
              v-if="upcomingProductsVisible && navigationGuard('view_histories')">
              <router-link to="/upcoming-products" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <UpcomingIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('upcomingProducts') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveUpcomingProductsToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="discountVisible">
              <router-link to="/discounts" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <DiscountIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('discount') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveDiscountToOthers"
                  class="ml-auto text-sm space-y-1 px-1 py-2 hover:bg-blue-300/10 text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="cashbackHistoriesVisible">
              <router-link to="/cashback-histories" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PercentBagIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('cashbackHistories') }}
                </div>
              </router-link>.
              <div v-if="showHideButtons">
                <button @click="moveCashbackHistoriesToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="ordersVisible">
              <router-link to="/orders" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <SalesCartIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('sales') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveOrdersToOthers"
                  class="ml-auto text-sm space-y-1 px-1 py-2 hover:bg-blue-300/10 text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="marketsVisible && navigationGuard('view_markets')">
              <router-link to="/markets" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <StoreIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('shops') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveMarketToOthers"
                  class="ml-auto text-sm space-y-1 px-1 py-2 hover:bg-blue-300/10 text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="usersVisible && navigationGuard('view_users')">
              <router-link to="/users" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <UsersIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('users') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveUsersToOthers"
                  class="ml-auto text-sm space-y-1 px-1 py-2 hover:bg-blue-300/10 text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="productBarcodesVisible && navigationGuard('view_barcodes')">
              <router-link to="/product-barcodes" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PhBarcodeIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('barcodes') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveProductBarcodesToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between"
              v-if="barcodeDuplicatesVisible && navigationGuard('view_barcodes')">
              <router-link to="/barcode-duplicates" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color relative">
                  <PhBarcodeIcon class="absolute top-0 right-0 w-6 h-6" />
                  <PhBarcodeIcon class="bg-slate-100 dark:bg-slate-900 absolute top-3 right-3"/>
                </div>
                <div class="w-full">
                  {{ $t('duplicates') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveBarcodeDuplicatesToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="saleSettingsVisible && navigationGuard('view_settings')">
              <router-link to="/sale-settings" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <SettingsIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('settings') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveSaleSettingsToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="corporateClientsVisible && navigationGuard('view_settings')">
              <router-link to="/corporate-clients" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color relative">
                      <UserIcon class="absolute top-0 right-0 w-6 h-6" />
                      <DollarIcon class="bg-slate-100 dark:bg-slate-900 absolute top-3 right-3"/>
                    </div>
                <div class="w-full">
                  {{ $t('corporateClients') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveCorprorateClientsToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="clientsVisible && navigationGuard('view_settings')">
              <router-link to="/clients" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color relative">
                      <UserIcon class="absolute top-0 right-0 w-6 h-6" />
                      <QrCodeIcon class="bg-slate-100 dark:bg-slate-900 absolute top-3 right-3"/>
                    </div>
                <div class="w-full">
                  {{ $t('clients') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveClientsToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="agentsVisible && navigationGuard('view_agents')">
              <router-link to="/agents" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <AgentIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('agents') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveAgentsToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="vouchersVisible && navigationGuard('view_agents')">
              <router-link to="/vouchers" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <VoucherIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('vouchers') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveVouchersToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="priceListsVisible && navigationGuard('view_agents')">
              <router-link to="/price-lists" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PhPriceList class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('priceLists') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="movePriceListsToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="wishesVisible && navigationGuard('view_users')">
              <router-link to="/wishes" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <FileLinearIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('wishes') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveWishesToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="categoriesVisible && navigationGuard('view_agents')">
              <router-link to="/categories" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <CategoryIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('categories') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveCategoriesToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="whiteListVisible && navigationGuard('view_agents')">
              <router-link to="/categories" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <CategoryIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('whiteList') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveWhiteListToOthers()"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>

            <div class="flex w-full justify-between" v-if="expensesVisible && navigationGuard('view_agents')">
              <router-link to="/expenses" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <ExpenseIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('expenses') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveExpensesToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>

            <div class="flex w-full justify-between" v-if="ipBannedVisible && navigationGuard('create_market')">
              <router-link to="/ip-banned" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <UserBanIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('ipBanned') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveIpBannedToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="investorsVisible && navigationGuard('view_investors')">
              <router-link to="/investors" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PhHandShake class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('investors') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveInvestorsToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="investsVisible && navigationGuard('view_invests')">
              <router-link to="/invests" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <InvestIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('invests') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveInvestsToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <div class="flex w-full justify-between" v-if="investPlansVisible && navigationGuard('view_invest_plans')">
              <router-link to="/invest-plans" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <InvestPlanIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('investPlans') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
                <button @click="moveInvestPlansToOthers"
                  class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-red-600 hover:text-red-800">
                  <InvisIcon class="w-6 h-6" />
                </button>
              </div>
            </div>
            <details
              v-if="!investsVisible || !investPlansVisible || !investorsVisible || !ipBannedVisible || !wishesVisible || !priceListsVisible || !vouchersVisible || !agentsVisible || !clientsVisible || !corporateClientsVisible || !saleSettingsVisible || !barcodeDuplicatesVisible || !productBarcodesVisible || !usersVisible || !marketsVisible || !ordersVisible || !cashbackHistoriesVisible || !discountVisible || !upcomingProductsVisible || !incomeExpenseVisible || !productsVisible || !saleVisible || !dashboardVisible"
              class="mt-4">
              <summary
                class="cursor-pointer py-2 pl-9 text-lg font-medium hover:bg-blue-300/10 hover:text-blue-600 text-zinc-400 dark:text-zinc-200 space-x-4">
                {{ $t('Others') }}
              </summary>
              <div class="flex flex-col space-y-2 ">
                <div v-if="!dashboardVisible && navigationGuard('dashboard')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/dashboard" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <HouseIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">
                      {{ $t('dashboard') }}
                    </div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreDashboardFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div v-if="!saleVisible && navigationGuard('create_product')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/sales" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <CashRegisterIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">
                      {{ $t('sale') }}
                    </div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreSaleFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!productsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/products" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhShoppingCart class="w-6 h-6" />
                    </div>
                    <div class="w-full">
                      {{ $t('products') }}
                    </div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreProductsFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!incomeExpenseVisible && navigationGuard('view_histories')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/product-histories" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <ProductHistoryIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">
                      {{ $t('incomeExpense') }}
                    </div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreIncomeExpenseFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!upcomingProductsVisible && navigationGuard('view_histories')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/upcoming-products" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <UpcomingIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('upcomingProducts') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreUpcomingProductsFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!discountVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/discounts" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <DiscountIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('discount') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreDiscountFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div v-if="!cashbackHistoriesVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/cashback-histories" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PercentBagIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('cashbackHistories') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreCashbackHistoriesFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div v-if="!ordersVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/orders" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhShoppingCart class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('sales') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreOrdersFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!marketsVisible && navigationGuard('view_markets')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/markets" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <StoreIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('shops') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreMarketFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!usersVisible && navigationGuard('view_users')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/users" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2">
                    </div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <UsersIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('users') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreUsersFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!productBarcodesVisible && navigationGuard('view_barcodes')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/product-barcodes" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhBarcodeIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('barcodes') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreProductBarcodesFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!barcodeDuplicatesVisible && navigationGuard('view_barcodes')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/barcode-duplicates" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color relative">
                      <PhBarcodeIcon class="absolute top-0 right-0 w-6 h-6" />
                      <PhBarcodeIcon class="bg-slate-100 dark:bg-slate-900 absolute top-3 right-3"/>
                    </div>
                    <div class="w-full">{{ $t('duplicates') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreBarcodeDuplicatesFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!saleSettingsVisible && navigationGuard('view_settings')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/sale-settings" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <SettingsIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('settings') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreSaleSettingsFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!corporateClientsVisible && navigationGuard('view_settings')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/corporate-clients" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color relative">
                      <UserIcon class="absolute top-0 right-0 w-6 h-6" />
                      <DollarIcon class="bg-slate-100 dark:bg-slate-900 absolute top-3 right-3" />
                    </div>
                    <div class="w-full">{{ $t('corporateClients') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreCorporrateClientsFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!clientsVisible && navigationGuard('view_settings')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/clients" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color relative">
                      <UserIcon class="absolute top-0 right-0 w-6 h-6" />
                      <QrCodeIcon class="bg-slate-100 dark:bg-slate-900 absolute top-3 right-3"/>
                    </div>
                    <div class="w-full">{{ $t('clients') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreClientsFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!agentsVisible && navigationGuard('view_agents')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/agents" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <AgentIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('agents') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreAgentsFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!vouchersVisible && navigationGuard('view_agents')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/vouchers" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <VoucherIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('vouchers') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreVouchersFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!priceListsVisible && navigationGuard('view_agents')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/price-lists" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhPriceList class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('priceLists') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restorePriceListsFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!wishesVisible && navigationGuard('view_users')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/wishes" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <FileLinearIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('wishes') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreWishesFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!categoriesVisible && navigationGuard('view_agents')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/categories" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <CategoryIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('categories') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreCategoriesFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!whiteListVisible && navigationGuard('view_agents')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/categories" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <CategoryIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('whitelist') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreWhiteListFromOthers()"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div v-if="!expensesVisible && navigationGuard('view_agents')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/categories" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <ExpenseIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('categories') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreExpensesFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>

                <div v-if="!ipBannedVisible && navigationGuard('create_market')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/ip-banned" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <UserBanIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('ipBanned') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreIpBannedFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!investorsVisible && navigationGuard('view_investors')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/investors" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhHandShake class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('investors') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreInvestorsFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!investsVisible && navigationGuard('view_invests')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/invests" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <InvestIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('invests') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreInvestsFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div v-if="!investPlansVisible && navigationGuard('view_invest_plans')"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-2">
                  <router-link to="/invest-plans" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <InvestPlanIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('investPlans') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                    <button @click="restoreInvestPlansFromOthers"
                      class="ml-auto space-y-1 px-1 py-2 hover:bg-blue-300/10 text-sm text-blue-600 hover:text-blue-800">
                      <EyeIcon class="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </details>
          </div>
          <div class="absolute bottom-32 h-min w-full space-y-4 pb-3 bg-slate-100 dark:bg-slate-900">
            <div class="px-4">
              <button @click="toggleWishToBuyProductModal"
                class="w-full py-2 rounded-lg text-white text-base bg-blue-500 cursor-pointer hover:bg-blue-600">
                Istak qo'shish
              </button>
              <OverlayPanel ref="wishToBuyProductModal">
                <div class="w-56">
                  <input ref="wishFocus" v-model="wishToBuyProductName" id="wish" type="text"
                    v-on:keypress="whenPressEnter($event)"
                    class="bg-slate-100 border-none dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg w-full py-2.5 placeholder-slate-400"
                    :placeholder="t('enterProductName')">
                </div>
              </OverlayPanel>
            </div>
            <div class="flex items-center space-x-3 px-4">
              <SelectOptionLanguage />
              <SelectOptionTheme />
            </div>
            <div class="text-xs text-center text-slate-400 dark:text-white">
              Copyright &copy; {{ new Date().getFullYear() }} <a href="https://it-forelead.uz"
                class="hover:underline">IT-Forelead</a>.
              <br />
              All Rights Reserved.
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.dark .p-overlaypanel-content {
  background-color: rgb(30 41 59) !important;
}
</style>
