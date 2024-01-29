<script setup>
import EyeIcon from '../../assets/icons/EyeIcon.vue'
import EyeSlashIcon from '../../assets/icons/EyeSlashIcon.vue'
import PhPencilLine from '../../assets/icons/EditIcon.vue'
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import SaveButton from '../buttons/SaveButton.vue'
import { reactive, ref } from 'vue'
import MultiSelect from 'primevue/multiselect'
import UserService from '../../services/user.service.js'
import { toast } from 'vue-sonner'
import { useUserStore } from '../../store/user.store.js'
import { vMaska } from 'maska'
import MarketService from '../../services/market.service.js'

const togglePassword = () => (hidePassword.value = !hidePassword.value)

const isLoading = ref(false)
const selectedRole = ref([])

const privileges = ref([
  { name: 'Kassir', code: ['edit_product', 'edit_order'] },
  { name: 'Admin', code: ['edit_user', 'update_user', 'edit_order', 'update_any_user', 'view_users', 'edit_product'] },
  { name: 'Boshqaruvchi', code: ['edit_user', 'view_users', 'update_user'] },
])

const markets = ref([])
const selectedMarket = ref([])
const getMarkets = () => {
  isLoading.value = true
  MarketService.getMarkets({})
    .then((res) => {
      markets.value = res
    })
    .finally(() => {
      isLoading.value = false
    })
}

getMarkets()
const selected = reactive({
  marketId: '',
  firstname: '',
  lastname: '',
  login: '',
  password: '',
  privileges: [],
  phone: '',
})

const clearForm = () => {
  selectedRole.value = []
  selectedMarket.value = []
  selected.firstname = ''
  selected.lastname = ''
  selected.login = ''
  selected.password = ''
  selected.phone = ''
}

const closeModal = () => {
  useModalStore().closeEditUserModal()
  clearForm()
}

const editUser = () => {
  selected.privileges = selectedRole.value.flatMap((role) => role.code)
  const selectedMarketId = selectedMarket.value.length > 0 ? selectedMarket.value[0].id : null
  selected.marketId = selectedMarketId !== null ? String(selectedMarketId) : ''
  if (!selected.firstname) return toast.warning('Iltimos ism kiriting')
  if (!selected.lastname) return toast.warning('Iltimos familiya kiriting')
  if (!selected.login) return toast.warning('Iltimos login kiriting')
  if (!selected.password) return toast.warning('Iltimos parol kiriting')
  if (selected.privileges.length === 0) return toast.warning('Iltimos rol tanlang')
  if (selected.marketId.length === 0) return toast.warning("Iltimos do'kon tanlang")
  if (!selected.phone) return toast.warning('Iltimos telefon raqam kiriting')
  else {
    isLoading.value = true
    const formData = new FormData()
    formData.append('marketId', selected.marketId)
    formData.append('firstname', selected.firstname)
    formData.append('lastname', selected.lastname)
    formData.append('login', selected.login)
    formData.append('password', selected.password)
    selected.privileges.forEach((privilege) => {
      formData.append('privileges[]', privilege)
    })
    formData.append('phone', selected.phone.replace(/([() -])/g, ''))
    UserService.editUser(formData)
      .then(() => {
        toast.success('Foydalanuvchi muvaffaqiyatli yaratildi!')
        isLoading.value = false
        useUserStore().privileges = selected.privileges
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
  <button type="button" @click="useModalStore().openEditUserModal()">
    <PhPencilLine class="w-6 h-6 text-blue-600 hover:scale-105" />
  </button>
  <CModal :is-open="useModalStore().isOpenEditUserModal" v-if="useModalStore().isOpenEditUserModal" @close="closeModal">
    <template v-slot:header> Foydalanuvchini tahrirlash </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="grid grid-cols-2 grid-rows-4 gap-4">
          <div class="flex flex-col">
            <label for="firstname" class="text-base text-left font-medium">
              Ism
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="firstname" type="text" v-model="selected.firstname" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Ismni kiriting" />
          </div>
          <div class="flex flex-col">
            <label for="lastname" class="text-base text-left font-medium">
              Familiya
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="lastname" type="text" v-model="selected.lastname" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Familiyani kiriting" />
          </div>

          <div class="flex flex-col">
            <label for="login" class="text-base text-left font-medium">
              Login
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="login" type="text" v-model="selected.login" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Loginni kiriting" />
          </div>
          <div class="flex flex-col">
            <label for="phone" class="text-base text-left font-medium">
              Telefon raqam:
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="phone" type="text" v-model="selected.phone" v-maska data-maska="+998(##) ###-##-##" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="+998(00) 000-00-00" />
          </div>
          <div class="flex flex-col">
            <label for="market" class="text-base text-left font-medium">
              Do'kon
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="market" v-model="selected.marketId" class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
              <option value="" selected>Do'konni tanlang</option>
              <option v-for="(market, idx) in markets" :key="idx" :value="market?.id">
                {{ market?.name }}
              </option>
            </select>
          </div>
          <div class="flex flex-col">
            <label for="role" class="text-base text-left font-medium">
              Rol:
              <span class="text-red-500 mr-2">*</span>
            </label>
            <MultiSelect :show-toggle-all="false" :display="'chip'" :select-all="false" panel-class="bg-slate-100 rounded-2xl" v-model="selectedRole" :options="privileges" optionLabel="name" placeholder="Tanlang" :maxSelectedLabels="1" :selection-limit="1" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full placeholder-slate-400" />
          </div>
          <div class="flex flex-col">
            <label for="password" class="text-base text-left font-medium">
              Parol
              <span class="text-red-500 mr-2">*</span>
            </label>
            <div class="relative">
              <input v-model="selected.password" id="password" :type="hidePassword ? 'password' : 'text'" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Parolni kiriting" />
              <EyeIcon v-if="hidePassword" @click="togglePassword()" class="text-gray-500 dark:text-gray-500 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
              <EyeSlashIcon v-else @click="togglePassword()" class="text-gray-500 dark:text-gray-500 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
            </div>
          </div>
          <div class="flex flex-col">
            <label for="confirm-password" class="text-base text-left font-medium">
              Parolni takrorlang
              <span class="text-red-500 mr-2">*</span>
            </label>
            <div class="relative">
              <input v-model="selected.confirmPassword" id="confirm-password" :type="hidePassword ? 'password' : 'text'" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Parolni qayta kiriting" />
              <EyeIcon v-if="hidePassword" @click="togglePassword()" class="text-gray-500 dark:text-gray-500 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
              <EyeSlashIcon v-else @click="togglePassword()" class="text-gray-500 dark:text-gray-500 absolute z-10 top-1/2 -translate-y-1/2 right-3 w-5 h-5 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <SaveButton :isLoading="isLoading" @click="editUser" />
      <CancelButton @click="closeModal" />
    </template>
  </CModal>
</template>
<style scoped></style>
