<script setup>
import { onMounted, ref } from 'vue'
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

const { t } = useI18n()
const router = useRouter()

const payload = ref({})
const wishToBuyProductName = ref('')
const wishToBuyProductModal = ref()

const page = ref(1)
const pageSize = 50
const toggleWishToBuyProductModal = (event) => {
  wishToBuyProductModal.value.toggle(event);
}

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

const whenPressEnter = (e) => {
  if (e.keyCode === 13) {
    createWishToBuyProduct()
  }
}

onMounted(() => {
  useAuthStore().setUser(decodeJwt(JSON.parse(localStorage.getItem('session'))?.accessToken))
  payload.value = parseJwt()
})
</script>
<template>
  <div class="relative z-40" v-if="useSidebarStore().toggleSidebar && useSidebarStore().isOpenSidebar">
    <div class="fixed inset-0 z-40 transition-opacity duration-200 bg-slate-900 bg-opacity-30 lg:hidden lg:z-auto"
      :class="useSidebarStore().isOpenSidebar ? 'opacity-100' : 'opacity-0 pointer-events-none'" @click="closeSidebar">
    </div>
    <div id="sidebar" ref="sidebar"
      class="flex justify-between flex-col bg-slate-100 absolute z-40 left-0 top-0 lg:static border-r lg:left-auto lg:top-auto lg:translate-x-0 min-h-screen w-72 md:w-64 2xl:w-72 shrink-0 transition-all duration-200 ease-in-out"
      :class="useSidebarStore().isOpenSidebar ? 'translate-x-0' : '-translate-x-64'">
      <div>
      <div class="h-20 flex justify-around">
        <div class="flex space-x-1 items-center justify-center">
          <img src="/images/logo.svg" class="w-12 h-12" alt="#">
          <div class="text-3xl font-extrabold">
            <span class="text-[#0167f3]">Sales</span>
            <span class="text-black">Flow</span>
          </div>
        </div>
        <div class="flex items-center justify-end">
          <XIcon class="w-6 h-6 mt-1 hover:text-[#0167f3] cursor-pointer" @click="closeBar"/>
        </div>
      </div>
      <ProfileDropDown />
        <div class="space-y-8 overflow-y-auto xl:h-[67vh] lg:h-[50vh] py-4">
          <div class="relative space-y-1 md:overflow-visible overflow-y-auto max-h-[400px]">
          <router-link v-if="navigationGuard('dashboard')" to="/dashboard" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <HouseIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('dashboard') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('create_product')" to="/sales" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <MoneyIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('sale') }}
            </div>
          </router-link>
          <router-link to="/products" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <PhShoppingCart class="w-6 h-6" />
            </div>
            <div>
              {{ $t('products') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_histories')" to="/product-histories" @click="selectPage()"
            active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <ProductHistoryIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('incomeExpense') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_histories')" to="/upcoming-products" @click="selectPage()"
            active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <PhShoppingCart class="w-6 h-6" />
            </div>
            <div>
              {{ $t('upcomingProducts') }}
            </div>
          </router-link>
          <router-link to="/discounts" @click="selectPage()"
            active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <PhPercent class="w-6 h-6" />
            </div>
            <div>
              {{ $t('discount') }}
            </div>
          </router-link>
          <router-link to="/cashback-histories" @click="selectPage()"
            active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <TicketSaleIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('cashbackHistories') }}
            </div>
          </router-link>
          <router-link to="/orders" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <PhShoppingCart class="w-6 h-6" />
            </div>
            <div>
              {{ $t('sales') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_markets')" to="/markets" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <StoreIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('shops') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_users')" to="/users" @click="selectPage()" active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <UsersIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('users') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_barcodes')" to="/product-barcodes" @click="selectPage()"
            active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <PhBarcodeIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('barcodes') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_barcodes')" to="/barcode-duplicates" @click="selectPage()"
            active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex items-center justify-center rounded-xl w-10 h-10 second-child-bg-color">
              <PhBarcodeIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('duplicates') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_settings')" to="/sale-settings" @click="selectPage()"
            active-class="active"
            class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <SettingsIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('settings') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_settings')" to="/corporate-clients" @click="selectPage()" active-class="active"
          class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <ClientCorpIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('corporateClients') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_settings')" to="/clients" @click="selectPage()" active-class="active"
          class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <ClientIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('clients') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_agents')" to="/agents" @click="selectPage()" active-class="active"
          class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <PhUsersThree class="w-6 h-6" />
            </div>
            <div>
              {{ $t('agents') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_agents')" to="/price-lists" @click="selectPage()" active-class="active"
          class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <PhPriceList class="w-6 h-6" />
            </div>
            <div>
              {{ $t('priceLists') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_users')" to="/wishes" @click="selectPage()" active-class="active"
          class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <FileLinearIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('wishes') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('create_market')" to="/ip-banned" @click="selectPage()" active-class="active"
          class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <PhLockKey class="w-6 h-6" />
            </div>
            <div>
              {{ $t('ipBanned') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_investors')" to="/investors" @click="selectPage()" active-class="active"
          class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <InvestorIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('investors') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_invests')" to="/invests" @click="selectPage()" active-class="active"
          class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <InvestIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('invests') }}
            </div>
          </router-link>
          <router-link v-if="navigationGuard('view_invest_plans')" to="/invest-plans" @click="selectPage()" active-class="active"
          class="relative h-10 flex items-center w-full hover:bg-blue-300/10 hover:text-blue-600 py-5 text-zinc-400 text-lg font-medium space-x-4 cursor-pointer transition-colors duration-300">
            <div class="w-1.5 h-12 rounded-r-xl first-child-bg-color mr-2"></div>
            <div class="flex h-10 items-center justify-center rounded-xl w-10 second-child-bg-color">
              <InvestPlanIcon class="w-6 h-6" />
            </div>
            <div>
              {{ $t('investPlans') }}
            </div>
          </router-link>
        </div>
      </div>
      </div>
      <div class="absolute bottom-0 w-full mb-3 space-y-4">
        <div class="px-4">
          <button @click="toggleWishToBuyProductModal"
            class="w-full py-2 px-4 rounded-lg text-white text-base bg-blue-500 cursor-pointer hover:bg-blue-600">
            Istak qo'shish
          </button>
          <OverlayPanel ref="wishToBuyProductModal">
            <div class="w-96">
              <input v-model="wishToBuyProductName" id="login" type="text" v-on:keypress="whenPressEnter($event)"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                :placeholder="t('enterProductName')">
            </div>
          </OverlayPanel>
        </div>
        <div class="flex items-center space-x-3 px-4">
          <SelectOptionLanguage />
          <div
            class="flex-1 flex items-center justify-between rounded-lg bg-white p-2 cursor-pointer hover:bg-gray-100">
            <div class="flex items-center space-x-1">
              <SunIcon class="w-5 h-5 text-gray-500" />
              <span>Light</span>
            </div>
            <CaretDownIcon class="w-3 h-3" />
          </div>
        </div>
        <div class="text-xs text-center text-slate-400">
          Copyright &copy; {{ new Date().getFullYear() }} <a href="https://it-forelead.uz"
            class="hover:underline">IT-Forelead</a>.
          <br />
          All Rights Reserved.
        </div>
      </div>
    </div>
  </div>
</template>
