<script setup>
import { onMounted, ref, watch, watchEffect } from 'vue'
import HouseIcon from './../assets/icons/HouseIcon.vue'
import MoneyIcon from './../assets/icons/MoneyIcon.vue'
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
import InvestorIcon from '../assets/icons/InvestorIcon.vue'
import InvestPlanIcon from '../assets/icons/InvestPlanIcon.vue'
import ClientIcon from '../assets/icons/ClientIcon.vue'
import ClientCorpIcon from '../assets/icons/ClientCorpIcon.vue'
import PhPriceList from '../assets/icons/PriceListIcon.vue'
import PriceListIcon from '../assets/icons/PriceListIcon.vue'
import UserIcon from '@/assets/icons/UserIcon.vue'
import InvisIcon from '@/assets/icons/InvisIcon.vue'
import EyeIcon from '@/assets/icons/EyeIcon.vue'

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
    incomeExpenseVisible.value = parsedState.upcomingProductsVisible ?? true
    productsVisible.value = parsedState.upcomingProductsVisible ?? true
    saleVisible.value = parsedState.upcomingProductsVisible ?? true
    dashboardVisible.value = parsedState.upcomingProductsVisible ?? true
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
    productsVisible: productBarcodesVisible.value,
    saleVisible: saleVisible.value,
    dashboardVisible: dashboardVisible.value
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
watch([investsVisible, investPlansVisible, investorsVisible, ipBannedVisible, wishesVisible, priceListsVisible, vouchersVisible, agentsVisible, clientsVisible, corporateClientsVisible, saleSettingsVisible, barcodeDuplicatesVisible, productBarcodesVisible, usersVisible, marketsVisible, ordersVisible, cashbackHistoriesVisible, discountVisible, upcomingProductsVisible, incomeExpenseVisible, productsVisible, saleVisible, dashboardVisible], saveSidebarState, { deep: true });

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

const showHideButtons = ref(false)

// Метод для обработки события
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
      class="flex justify-between flex-col bg-slate-100 dark:bg-slate-900 absolute z-40 left-0 top-0 lg:static border-r lg:left-auto lg:top-auto lg:translate-x-0 min-h-screen w-96 shrink-0 transition-all duration-200 ease-in-out"
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
            <div class="flex w-full justicy-between" v-if="dashboardVisible">
              <router-link v-if="navigationGuard('dashboard')" to="/dashboard" @click="selectPage()"
                active-class="active"
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
              <button @click="moveDashboardToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
              </div>
            </div>
            <div class="flex w-full justicy-between" v-if="saleVisible">
              <router-link v-if="navigationGuard('create_product')" to="/sales" @click="selectPage()"
                active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <MoneyIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('sale') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveSaleToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="productsVisible">
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
              <button @click="moveProductsToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="incomeExpenseVisible">
              <router-link v-if="navigationGuard('view_histories')" to="/product-histories" @click="selectPage()"
                active-class="active"
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
              <button @click="moveIncomeExpenseToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="upcomingProductsVisible">
              <router-link v-if="navigationGuard('view_histories')" to="/upcoming-products" @click="selectPage()"
                active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PhShoppingCart class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('upcomingProducts') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveUpcomingProductsToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="discountVisible">
              <router-link to="/discounts" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PhPercent class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('discount') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveDiscountToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="cashbackHistoriesVisible">
              <router-link to="/cashback-histories" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <TicketSaleIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('cashbackHistories') }}
                </div>
              </router-link>.
              <div v-if="showHideButtons">
              <button @click="moveCashbackHistoriesToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="ordersVisible">
              <router-link to="/orders" @click="selectPage()" active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PhShoppingCart class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('sales') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveOrdersToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="marketsVisible">
              <router-link v-if="navigationGuard('view_markets')" to="/markets" @click="selectPage()"
                active-class="active"
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
              <button @click="moveMarketToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="usersVisible">
              <router-link v-if="navigationGuard('view_users')" to="/users" @click="selectPage()" active-class="active"
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
              <button @click="moveUsersToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="productBarcodesVisible">
              <router-link v-if="navigationGuard('view_barcodes')" to="/product-barcodes" @click="selectPage()"
                active-class="active"
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
              <button @click="moveProductBarcodesToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="barcodeDuplicatesVisible">
              <router-link v-if="navigationGuard('view_barcodes')" to="/barcode-duplicates" @click="selectPage()"
                active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
                  <PhBarcodeIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('duplicates') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveBarcodeDuplicatesToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="saleSettingsVisible">
              <router-link v-if="navigationGuard('view_settings')" to="/sale-settings" @click="selectPage()"
                active-class="active"
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
              <button @click="moveSaleSettingsToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="corporateClientsVisible">
              <router-link v-if="navigationGuard('view_settings')" to="/corporate-clients" @click="selectPage()"
                active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <ClientCorpIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('corporateClients') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveCorprorateClientsToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="clientsVisible">
              <router-link v-if="navigationGuard('view_settings')" to="/clients" @click="selectPage()"
                active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <ClientIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('clients') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveClientsToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="agentsVisible">
              <router-link v-if="navigationGuard('view_agents')" to="/agents" @click="selectPage()"
                active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PhUsersThree class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('agents') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveAgentsToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="vouchersVisible">
              <router-link v-if="navigationGuard('view_agents')" to="/vouchers" @click="selectPage()"
                active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PhUsersThree class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('vouchers') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveVouchersToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="priceListsVisible">
              <router-link v-if="navigationGuard('view_agents')" to="/price-lists" @click="selectPage()"
                active-class="active"
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
              <button @click="movePriceListsToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="wishesVisible">
              <router-link v-if="navigationGuard('view_users')" to="/wishes" @click="selectPage()" active-class="active"
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
              <button @click="moveWishesToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="ipBannedVisible">
              <router-link v-if="navigationGuard('create_market')" to="/ip-banned" @click="selectPage()"
                active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <PhLockKey class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('ipBanned') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveIpBannedToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="investorsVisible">
              <router-link v-if="navigationGuard('view_investors')" to="/investors" @click="selectPage()"
                active-class="active"
                class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                  <InvestorIcon class="w-6 h-6" />
                </div>
                <div class="w-full">
                  {{ $t('investors') }}
                </div>
              </router-link>
              <div v-if="showHideButtons">
              <button @click="moveInvestorsToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="investsVisible">
              <router-link v-if="navigationGuard('view_invests')" to="/invests" @click="selectPage()"
                active-class="active"
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
              <button @click="moveInvestsToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <div class="flex w-full justicy-between" v-if="investPlansVisible">
              <router-link v-if="navigationGuard('view_invest_plans')" to="/invest-plans" @click="selectPage()"
                active-class="active"
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
              <button @click="moveInvestPlansToOthers" class="ml-auto text-sm text-red-600 hover:text-red-800">
                <InvisIcon class="w-6 h-6" />
              </button>
            </div>
            </div>
            <details
              v-if="!investsVisible || !investPlansVisible || !investorsVisible || !ipBannedVisible || !wishesVisible || !priceListsVisible || !vouchersVisible || !agentsVisible || !clientsVisible || !corporateClientsVisible || !saleSettingsVisible || !barcodeDuplicatesVisible || !productBarcodesVisible || !usersVisible || !marketsVisible || !ordersVisible || !cashbackHistoriesVisible || !discountVisible || !upcomingProductsVisible || !incomeExpenseVisible || !productsVisible || !saleVisible || !dashboardVisible"
              class="mt-4">
              <summary class="cursor-pointer py-2 pl-9  text-lg font-medium pl-12 hover:bg-blue-300/10 hover:text-blue-600 text-zinc-400 dark:text-zinc-200 space-x-4">
                Others
              </summary>
              <div class="flex flex-col space-y-2 ">
                <div v-if="!dashboardVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('dashboard')" to="/dashboard" @click="selectPage()"
                    active-class="active"
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

                  <button @click="restoreDashboardFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                  </div>
                </div>
                <div v-if="!saleVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('create_product')" to="/sales" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <MoneyIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">
                      {{ $t('sale') }}
                    </div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreSaleFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!productsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link to="/products" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhShoppingCart class="w-6 h-6" />
                    </div>
                    <div class="w-full">
                      {{ $t('products') }}
                    </div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreProductsFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!incomeExpenseVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_histories')" to="/product-histories" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <ProductHistoryIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">
                      {{ $t('incomeExpense') }}
                    </div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreIncomeExpenseFromOthers"
                    class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!upcomingProductsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_histories')" to="/upcoming-products" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhShoppingCart class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('upcomingProducts') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreUpcomingProductsFromOthers"
                    class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!discountVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link to="/discounts" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhPercent class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('discount') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreDiscountFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!cashbackHistoriesVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link to="/cashback-histories" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <TicketSaleIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('cashbackHistories') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreCashbackHistoriesFromOthers"
                    class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!ordersVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link to="/orders" @click="selectPage()" active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhShoppingCart class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('sales') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreOrdersFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!marketsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_markets')" to="/markets" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <StoreIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('shops') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreMarketFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!usersVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_users')" to="/users" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <UsersIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('users') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreUsersFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!productBarcodesVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_barcodes')" to="/product-barcodes" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhBarcodeIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('barcodes') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreProductBarcodesFromOthers"
                    class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!barcodeDuplicatesVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_barcodes')" to="/barcode-duplicates" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
                      <PhBarcodeIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('duplicates') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreBarcodeDuplicatesFromOthers"
                    class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!saleSettingsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_settings')" to="/sale-settings" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <SettingsIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('settings') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreSaleSettingsFromOthers"
                    class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!corporateClientsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_settings')" to="/corporate-clients" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <ClientCorpIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('corporateClients') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreCorporrateClientsFromOthers"
                    class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!clientsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_settings')" to="/clients" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <ClientIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('clients') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreClientsFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!agentsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_agents')" to="/agents" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhUsersThree class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('agents') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreAgentsFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!vouchersVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_agents')" to="/vouchers" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhUsersThree class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('vouchers') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreVouchersFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                  </div>
                </div>
                <div v-if="!priceListsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_agents')" to="/price-lists" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhPriceList class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('priceLists') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restorePriceListsFromOthers"
                    class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!wishesVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_users')" to="/wishes" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <FileLinearIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('wishes') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreWishesFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!ipBannedVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('create_market')" to="/ip-banned" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <PhLockKey class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('ipBanned') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreIpBannedFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!investorsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_investors')" to="/investors" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <InvestorIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('investors') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreInvestorsFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
                </div>
                <div v-if="!investsVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_invests')" to="/invests" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <InvestIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('invests') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreInvestsFromOthers" class="ml-auto text-sm text-blue-600 hover:text-blue-800">
                    <EyeIcon class="w-6 h-6" />
                  </button>
                </div>
              </div>
                <div v-if="!investPlansVisible"
                  class="relative h-10 flex items-center w-full py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4">
                  <router-link v-if="navigationGuard('view_invest_plans')" to="/invest-plans" @click="selectPage()"
                    active-class="active"
                    class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 dark:text-zinc-200 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
                    <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
                    <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
                      <InvestPlanIcon class="w-6 h-6" />
                    </div>
                    <div class="w-full">{{ $t('investPlans') }}</div>
                  </router-link>
                  <div v-if="showHideButtons">
                  <button @click="restoreInvestPlansFromOthers"
                    class="ml-auto text-sm text-blue-600 hover:text-blue-800">
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
                <div class="w-96">
                  <input ref="wishFocus" v-model="wishToBuyProductName" id="wish" type="text" v-on:keypress="whenPressEnter($event)"
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

