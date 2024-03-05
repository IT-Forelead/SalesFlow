<script setup>
import { vMaska } from 'maska'
import MultiSelect from 'primevue/multiselect'
import { reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import EyeIcon from '../../assets/icons/EyeIcon.vue'
import EyeSlashIcon from '../../assets/icons/EyeSlashIcon.vue'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { cleanObjectEmptyFields } from '../../mixins/utils'
import MarketService from '../../services/market.service.js'
import UserService from '../../services/user.service.js'
import { useModalStore } from '../../store/modal.store.js'
import { useUserStore } from '../../store/user.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isLoading = ref(false)
const hidePassword = ref(true)
const selectedRole = ref([])
const markets = ref([])

const privileges = ref([
  {
    name: t('cashier'),
    code: [
      'create_history',
      'create_order',
      'create_product',
      'dashboard',
      'find_barcode',
      'find_order',
      'update_product',
      'update_settings',
      'view_histories',
      'view_orders',
      'view_products',
      'view_settings'
    ],
  },
  {
    name: t('admin'),
    code: [
      'create_barcode',
      'create_market',
      'create_user',
      'dashboard',
      'update_barcode',
      'update_user',
      'view_barcodes',
      'view_histories',
      'view_markets',
      'view_orders',
      'view_products',
      'view_users'
    ],
  },
  {
    name: t('manager'),
    code: [
      'create_history',
      'create_order',
      'create_product',
      'create_user',
      'dashboard',
      'find_barcode',
      'find_order',
      'update_product',
      'update_settings',
      'view_histories',
      'view_markets',
      'view_orders',
      'view_products',
      'view_settings',
      'view_users'
    ]
  },
])

const togglePassword = () => (hidePassword.value = !hidePassword.value)

const getMarkets = () => {
  MarketService.getMarkets()
    .then((res) => {
      markets.value = res
    })
}

const submitForm = reactive({
  marketId: '',
  firstname: '',
  lastname: '',
  login: '',
  password: '',
  confirmPassword: '',
  privileges: [],
  phone: '',
})

const clearForm = () => {
  selectedRole.value = []
  submitForm.firstname = ''
  submitForm.lastname = ''
  submitForm.login = ''
  submitForm.phone = ''
  submitForm.marketId = ''
  submitForm.privileges = []
  submitForm.password = ''
  submitForm.confirmPassword = ''
}

const closeModal = () => {
  useModalStore().closeCreateUserModal()
  clearForm()
}

const createUser = () => {
  submitForm.privileges = selectedRole.value.flatMap(role => role.code)
  if (!submitForm.firstname) {
    toast.warning(t('plsEnterFirstname'))
  } else if (!submitForm.lastname) {
    toast.warning(t('plsEnterlastname'))
  } else if (!submitForm.login) {
    toast.warning(t('plsEnterlogin'))
  } else if (!submitForm.phone) {
    toast.warning(t('plsEnterPhoneNumber'))
  } else if (submitForm.phone.length !== 18) {
    toast.warning(t('plsEnterPhoneNumber'))
  } else if (!submitForm.marketId) {
    toast.warning(t('plsSelectStore'))
  } else if (submitForm.privileges.length === 0) {
    toast.warning(t('plsSelectRole'))
  } else if (!submitForm.password) {
    toast.warning(t('plsEnterPassword'))
  } else if (!submitForm.confirmPassword) {
    toast.warning(t('plsRepeatThePassword'))
  } else if (submitForm.password !== submitForm.confirmPassword) {
    toast.warning(t('passwordsDidNotMatch'))
  } else {
    isLoading.value = true
    UserService.createUser(
      cleanObjectEmptyFields({
        firstname: submitForm.firstname,
        lastname: submitForm.lastname,
        login: submitForm.login,
        phone: submitForm.phone.replace(/([() -])/g, ''),
        marketId: submitForm.marketId,
        privileges: submitForm.privileges,
        password: submitForm.password,
      })
    ).then(() => {
      toast.success(t('userSuccessfullyAdded'))
      isLoading.value = false
      useUserStore().privileges = submitForm.privileges
      UserService.getUsers()
        .then((res) => {
          useUserStore().clearStore()
          useUserStore().setUsers(res)
        })
    }).catch((err) => {
      toast.error(t('errorWhileCreatingUser'))
      isLoading.value = false
    })
    closeModal()
  }
}

watch(
  () => useModalStore().isOpenCreateUserModal,
  (data) => {
    if (data) {
      getMarkets()
    }
  },
  { deep: true }
)
</script>
<template>
  <div>
    <CModal :is-open="useModalStore().isOpenCreateUserModal" v-if="useModalStore().isOpenCreateUserModal"
      @close=closeModal>
      <template v-slot:header>
        {{ $t('createUser') }}
      </template>
      <template v-slot:body>
        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="firstname" class="text-base font-medium">
                {{ $t('firstname') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="firstname" type="text" v-model="submitForm.firstname"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                :placeholder="t('enterFirstname')">
            </div>
            <div class="flex-1">
              <label for="lastname" class="text-base font-medium">
                {{ $t('lastname') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="lastname" type="text" v-model="submitForm.lastname"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                :placeholder="t('lastname')">
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="login" class="text-base font-medium">
                {{ $t('login') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="login" type="text" v-model="submitForm.login"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                :placeholder="t('enterLogin')">
            </div>
            <div class="flex-1">
              <label for="phone" class="text-base font-medium">
                {{ $t('phone') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="phone" type="text" v-model="submitForm.phone" v-maska data-maska="+998(##) ###-##-##"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                placeholder="+998(00) 000-00-00">
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-1 space-y-1">
              <label for="market" class="text-base font-medium">
                {{ $t('store') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <select id="market" v-model="submitForm.marketId"
                class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
                <option value="" selected>{{ $t('selectStore') }}</option>
                <option v-for="(market, idx) in markets" :key="idx" :value="market?.id">
                  {{ market?.name }}
                </option>
              </select>
            </div>
            <div class="flex-1">
              <label for="role" class="text-base font-medium">
                {{ $t('role') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <MultiSelect :show-toggle-all="false" :display="'chip'" :select-all="false"
                panel-class="bg-slate-100 rounded-2xl" v-model="selectedRole" :options="privileges" optionLabel="name"
                :placeholder="t('selectRole')" :maxSelectedLabels="1" :selection-limit="1"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full placeholder-slate-400" />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="password" class="text-base font-medium">
                {{ $t('password') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <div class="relative">
                <input v-model="submitForm.password" id="password" :type="hidePassword ? 'password' : 'text'"
                  class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                  :placeholder="t('enterPassword')">
                <EyeIcon v-if="hidePassword" @click="togglePassword()"
                  class="text-gray-500 dark:text-gray-500 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
                <EyeSlashIcon v-else @click="togglePassword()"
                  class="text-gray-500 dark:text-gray-500 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
              </div>
            </div>
            <div class="flex-1">
              <label for="confirm-password" class="text-base font-medium">
                {{ $t('confirmPassword') }}
                <span class="text-red-500 mr-2">*</span>
              </label>
              <div class="relative">
                <input v-model="submitForm.confirmPassword" id="confirm-password"
                  :type="hidePassword ? 'password' : 'text'"
                  class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                  :placeholder="t('enterThePasswordAgain')">
                <EyeIcon v-if="hidePassword" @click="togglePassword()"
                  class="text-gray-500 dark:text-gray-500 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
                <EyeSlashIcon v-else @click="togglePassword()"
                  class="text-gray-500 dark:text-gray-500 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-slot:footer>
        <CancelButton @click="closeModal" />
        <button v-if="isLoading" type="bSearchIconutton"
          class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
          <Spinners270RingIcon
            class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
          {{ $t('create') }}
        </button>
        <button v-else @click="createUser()" type="button"
          class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
          {{ $t('create') }}
        </button>
      </template>
    </CModal>
  </div>
</template>

<style scoped></style>