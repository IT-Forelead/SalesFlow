<script setup>
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
    }).finally(() => {
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
  selected.privileges = selectedRole.value.flatMap(role => role.code)
  const selectedMarketId = selectedMarket.value.length > 0 ? selectedMarket.value[0].id : null;
  selected.marketId = selectedMarketId !== null ? String(selectedMarketId) : '';
  if (!selected.firstname) return toast.warning('Iltimos ism kiriting')
  if (!selected.lastname) return toast.warning('Iltimos familiya kiriting')
  if (!selected.login) return toast.warning('Iltimos login kiriting')
  if (!selected.password) return toast.warning('Iltimos parol kiriting')
  if (selected.privileges.length === 0) return toast.warning('Iltimos rol tanlang')
  if (selected.marketId.length === 0) return toast.warning('Iltimos do\'kon tanlang')
  if (!selected.phone) return toast.warning('Iltimos telefon raqam kiriting')
  else {
    isLoading.value = true
    const formData = new FormData()
    formData.append('marketId', selected.marketId)
    formData.append('firstname', selected.firstname)
    formData.append('lastname', selected.lastname)
    formData.append('login', selected.login)
    formData.append('password', selected.password)
    selected.privileges.forEach(privilege => {
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
  <div>
    <button
      type="button"
      @click="useModalStore().openEditUserModal()"
    >
      <PhPencilLine class="w-6 h-6 text-blue-600 hover:scale-105" />
    </button>
    <CModal
      :is-open="useModalStore().isEditUserModalOpen"
      v-if="useModalStore().isEditUserModalOpen"
      @close=closeModal
    >
      <template v-slot:header>
        Foydalanuvchini tahrirlash
      </template>
      <template v-slot:body>
        <form @submit.prevent="editUser()" method="post">
          <div class="grid gap-4 sm:grid-cols-1 sm:gap-6 px-2">
            <div class="w-full">
              <label for="firstname"
                     class="block mb-2 text-left text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">Ism</label>
              <input
                v-model="selected.firstname"
                type="text"
                name="firstname"
                id="firstname"
                class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
                placeholder="Ismingizni kiriting"
                required=""
              />
            </div>
            <div class="w-full">
              <label for="lastname"
                     class="block mb-2 text-left text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">Familiya</label>
              <input
                v-model="selected.lastname"
                type="text"
                name="lastname"
                id="lastname"
                class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
                placeholder="Familiyangizni kiriting"
                required=""
              />
            </div>
            <div class="w-full">
              <label for="login" class="block mb-2 text-left text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">Login</label>
              <input
                v-model="selected.login"
                type="text"
                name="login"
                id="login"
                class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
                placeholder="Login kiriting" />
            </div>
            <div class="w-full">
              <label for="parol"
                     class="block mb-2 text-left text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">Parol</label>
              <input v-model="selected.password"
                     type="password"
                     name="parol"
                     id="parol"
                     class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
                     placeholder="***"
              />
            </div>
            <div class="w-full">
              <label for="password"
                     class="block mb-2 text-left text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">Rol
                tanlash</label>
              <MultiSelect
                :show-toggle-all="false"
                :display="'chip'"
                :select-all="false"
                panel-class="bg-slate-100 rounded-2xl"
                v-model="selectedRole"
                :options="privileges"
                optionLabel="name"
                placeholder="Tanlang"
                :maxSelectedLabels="1"
                :selection-limit="1"
                class="text-left w-full border rounded-2xl bg-slate-100"
              />
            </div>
            <div class="w-full">
              <label for="password"
                     class="block mb-2 text-left text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">Do'kon
                tanlash</label>
              <MultiSelect
                :show-toggle-all="false"
                :display="'chip'"
                :select-all="false"
                panel-class="bg-slate-100 rounded-2xl"
                v-model="selectedMarket"
                :options="markets"
                optionLabel="name"
                placeholder="Tanlang"
                :maxSelectedLabels="1"
                :selection-limit="1"
                class="text-left w-full border rounded-2xl bg-slate-100"
              />
            </div>
            <div class="w-full">
              <label for="phone" class="block mb-2 text-left text-neutral-800 text-base font-normal">Telefon raqam:</label>
              <input
                v-maska
                data-maska="+998(##) ###-##-##"
                v-model="selected.phone"
                placeholder="+998(00) 000-00-00"
                type="text"
                name="phone"
                id="phone"
                class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
              >
            </div>
          </div>
        </form>
      </template>
      <template v-slot:footer>
        <SaveButton :isLoading="isLoading" @click="editUser" />
        <CancelButton @click="closeModal" />
      </template>
    </CModal>
  </div>
</template>

<style scoped>

</style>