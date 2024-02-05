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

const isLoading = ref(false)
const hidePassword = ref(true)
const selectedRole = ref([])
const markets = ref([])

const privileges = ref([
  {
    name: 'Kassir',
    code: [
      'dashboard',
      'create_order',
      'view_products',
      'view_orders',
      'find_barcode',
      'find_order',
    ],
  },
  {
    name: 'Admin',
    code: [
      'create_user',
      'update_user',
      'dashboard',
      'view_users',
      'create_product',
      'update_product',
      'view_products',
      'create_history',
      'view_histories',
      'find_barcode',
      'create_order',
      'find_order',
      'view_orders',
      'create_market',
      'view_markets'
    ],
  },
  {
    name: 'Boshqaruvchi',
    code: [
      'dashboard',
      'view_users',
      'create_product',
      'update_product',
      'view_products',
      'create_history',
      'view_histories',
      'find_barcode',
      'create_order',
      'find_order',
      'view_orders',
      'view_markets'
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
  submitForm.privileges = ''
  submitForm.password = ''
}

const closeModal = () => {
  useModalStore().closeCreateUserModal()
  clearForm()
}

const createUser = () => {
  submitForm.privileges = selectedRole.value.flatMap(role => role.code)
  if (!submitForm.firstname) {
    toast.warning('Iltimos ismni kiriting')
  } else if (!submitForm.lastname) {
    toast.warning('Iltimos familiyani kiriting')
  } else if (!submitForm.login) {
    toast.warning('Iltimos loginni kiriting')
  } else if (!submitForm.phone) {
    toast.warning('Iltimos telefon raqamni kiriting')
  } else if (!submitForm.marketId) {
    toast.warning("Iltimos do'konni tanlang!")
  } else if (submitForm.privileges.length === 0) {
    toast.warning('Iltimos rol tanlang')
  } else if (!submitForm.password) {
    toast.warning('Iltimos parolni kiriting')
  } else if (!submitForm.confirmPassword) {
    toast.warning('Iltimos parolni qayta takrorlang')
  } else if (submitForm.password !== submitForm.confirmPassword) {
    toast.warning('Parollar mos kelmadi')
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
      toast.success('Foydalanuvchi muvaffaqiyatli yaratildi!')
      isLoading.value = false
      useUserStore().privileges = submitForm.privileges
      UserService.getUsers()
        .then((res) => {
          useUserStore().clearStore()
          useUserStore().setUsers(res)
        })
    }).catch((err) => {
      toast.error('Foydalanuvchi yaratishda xatolik!')
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
        Foydalanuvchi qo'shish
      </template>
      <template v-slot:body>

        <div class="space-y-4">
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="firstname" class="text-base font-medium">
                Ism
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="firstname" type="text" v-model="submitForm.firstname"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                placeholder="Ismni kiriting">
            </div>
            <div class="flex-1">
              <label for="lastname" class="text-base font-medium">
                Familiya
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="lastname" type="text" v-model="submitForm.lastname"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                placeholder="Familiyani kiriting">
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="login" class="text-base font-medium">
                Login
                <span class="text-red-500 mr-2">*</span>
              </label>
              <input id="login" type="text" v-model="submitForm.login"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                placeholder="Loginni kiriting">
            </div>
            <div class="flex-1">
              <label for="phone" class="text-base font-medium">
                Telefon raqam:
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
                Do'kon
                <span class="text-red-500 mr-2">*</span>
              </label>
              <select id="market" v-model="submitForm.marketId"
                class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
                <option value="" selected>Do'konni tanlang</option>
                <option v-for="(market, idx) in markets" :key="idx" :value="market?.id">
                  {{ market?.name }}
                </option>
              </select>
            </div>
            <div class="flex-1">
              <label for="role" class="text-base font-medium">
                Rol:
                <span class="text-red-500 mr-2">*</span>
              </label>
              <MultiSelect :show-toggle-all="false" :display="'chip'" :select-all="false"
                panel-class="bg-slate-100 rounded-2xl" v-model="selectedRole" :options="privileges" optionLabel="name"
                placeholder="Tanlang" :maxSelectedLabels="1" :selection-limit="1"
                class="bg-slate-100 border-none text-slate-900 rounded-lg w-full placeholder-slate-400" />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <label for="password" class="text-base font-medium">
                Parol
                <span class="text-red-500 mr-2">*</span>
              </label>
              <div class="relative">
                <input v-model="submitForm.password" id="password" :type="hidePassword ? 'password' : 'text'"
                  class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                  placeholder="Parolni kiriting">
                <EyeIcon v-if="hidePassword" @click="togglePassword()"
                  class="text-gray-500 dark:text-gray-500 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
                <EyeSlashIcon v-else @click="togglePassword()"
                  class="text-gray-500 dark:text-gray-500 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
              </div>
            </div>
            <div class="flex-1">
              <label for="confirm-password" class="text-base font-medium">
                Parolni takrorlang
                <span class="text-red-500 mr-2">*</span>
              </label>
              <div class="relative">
                <input v-model="submitForm.confirmPassword" id="confirm-password"
                  :type="hidePassword ? 'password' : 'text'"
                  class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
                  placeholder="Parolni qayta kiriting">
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
          Yaratish
        </button>
        <button v-else @click="createUser()" type="button"
          class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
          Yaratish
        </button>
      </template>
    </CModal>
  </div>
</template>

<style scoped></style>