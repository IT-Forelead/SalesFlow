<script setup>
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import CancelButton from '../buttons/CancelButton.vue'
import { reactive, ref } from 'vue'
import MultiSelect from 'primevue/multiselect'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import EyeIcon from '../../assets/icons/EyeIcon.vue'
import EyeSlashIcon from '../../assets/icons/EyeSlashIcon.vue'
import UserService from '../../services/user.service.js'
import { toast } from 'vue-sonner'
import { useUserStore } from '../../store/user.store.js'
import { vMaska } from 'maska'
import MarketService from '../../services/market.service.js'

const isLoading = ref(false)
const hidePassword = ref(true)
const selectedRole = ref([])

const togglePassword = () => (hidePassword.value = !hidePassword.value)

const privileges = ref([
  { name: 'Kassir', code: ['create_product', 'create_order'] },
  { name: 'Admin', code: ['create_user', 'update_user', 'create_order', 'update_any_user', 'view_users', 'create_product'] },
  { name: 'Boshqaruvchi', code: ['create_user', 'view_users', 'update_user'] },
])

const markets = ref([])
const selectedMarket = ref([])
const getMarkets = () => {
  isLoading.value = true
  MarketService.getMarkets({})
    .then((res) => {
      markets.value = res
    }).finally(() => {
    isLoading.value = false
  })
}

getMarkets()
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
  selectedMarket.value = []
  submitForm.firstname = ''
  submitForm.lastname = ''
  submitForm.login = ''
  submitForm.password = ''
  submitForm.phone = ''
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
  } else if (submitForm.privileges.length === 0) {
    toast.warning('Iltimos rol tanlang')
  } else if (!submitForm.password) {
    toast.warning('Iltimos parolni kiriting')
  } else if (!submitForm.confirmPassword) {
    toast.warning('Iltimos parolni qayta takrorlang')
  } else if (submitForm.password !== submitForm.confirmPassword) {
    toast.warning('Parollar mos kelmadi')
  } else {
  const selectedMarketId = selectedMarket.value.length > 0 ? selectedMarket.value[0].id : null;
  submitForm.marketId = selectedMarketId !== null ? String(selectedMarketId) : '';
  if (!submitForm.firstname) return toast.warning('Iltimos ism kiriting')
  if (!submitForm.lastname) return toast.warning('Iltimos familiya kiriting')
  if (!submitForm.login) return toast.warning('Iltimos login kiriting')
  if (!submitForm.password) return toast.warning('Iltimos parol kiriting')
  if (submitForm.privileges.length === 0) return toast.warning('Iltimos rol tanlang')
  if (submitForm.marketId.length === 0) return toast.warning('Iltimos do\'kon tanlang')
  if (!submitForm.phone) return toast.warning('Iltimos telefon raqam kiriting')
  else {
    isLoading.value = true
    const formData = new FormData()
    formData.append('marketId', submitForm.marketId)
    formData.append('firstname', submitForm.firstname)
    formData.append('lastname', submitForm.lastname)
    formData.append('login', submitForm.login)
    formData.append('password', submitForm.password)
    submitForm.privileges.forEach(privilege => {
      formData.append('privileges[]', privilege)
    })
    formData.append('phone', submitForm.phone.replace(/([() -])/g, ''))
    UserService.createUser(formData)
      .then(() => {
        toast.success('Foydalanuvchi muvaffaqiyatli yaratildi!')
        isLoading.value = false
        useUserStore().privileges = submitForm.privileges
        UserService.getUsers()
          .then((res) => {
            useUserStore().clearStore()
            useUserStore().setUsers(res)
            console.log(useUserStore().users)
          })
          .catch(() => {
            toast.error('Foydalanuvchilar topilmadi!')
          })
      })
      .catch((err) => {
        toast.error('Foydalanuvchi yaratishda xatolik!', err)
        isLoading.value = false
      })
    closeModal()
  }
}
</script>
<template>
  <div>
    <CModal :is-open="useModalStore().isCreateUserModalOpen" v-if="useModalStore().isCreateUserModalOpen"
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
              <label for="default-type" class="text-base font-medium">
                Do'kon
              </label>
              <select id="default-type" class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
                <option selected>Do'konni tanlang</option>
                <option value="market">Market 1</option>
                <option value="market">Market 2</option>
                <option value="market">Market 3</option>
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
                <input v-model="submitForm.confirmPassword" id="confirm-password" :type="hidePassword ? 'password' : 'text'"
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