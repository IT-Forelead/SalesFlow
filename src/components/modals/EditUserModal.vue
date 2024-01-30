<script setup>
import EyeIcon from '../../assets/icons/EyeIcon.vue'
import EyeSlashIcon from '../../assets/icons/EyeSlashIcon.vue'
import PhPencilLine from '../../assets/icons/EditIcon.vue'
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import SaveButton from '../buttons/SaveButton.vue'
import { reactive, ref, computed } from 'vue'
import MultiSelect from 'primevue/multiselect'
import UserService from '../../services/user.service.js'
import { toast } from 'vue-sonner'
import { useUserStore } from '../../store/user.store.js'
import { vMaska } from 'maska'
import MarketService from '../../services/market.service.js'

const selectedUser = computed(() => {
  console.log(useUserStore().selectedUser)
  return useUserStore().selectedUser
})

const selectedRole = ref([])

const hidePassword = ref(true)

const togglePassword = () => (hidePassword.value = !hidePassword.value)

const isLoading = ref(false)
const selectedUserPrivileges = ref([])

const privileges = ref([
  { name: 'Kassir', code: ['create_product', 'create_order'] },
  { name: 'Admin', code: ['create_user', 'update_user', 'create_order', 'update_any_user', 'view_users', 'create_product'] },
  { name: 'Boshqaruvchi', code: ['create_user', 'view_users', 'update_user'] },
  { name: 'Foydalanuvchi', code: [''] },
])

console.log(privileges.value)

const getRole = (privileges) => {
  console.log(privileges)
  switch (true) {
    case privileges.includes('create_user') && privileges.includes('update_user') && privileges.includes('create_order') && privileges.includes('update_any_user') && privileges.includes('view_users') && privileges.includes('create_product'):
      return 'Admin'
    case privileges.includes('create_user') && privileges.includes('view_users') && privileges.includes('update_user'):
      return 'Boshqaruvchi'
    case privileges.includes('create_product') && privileges.includes('create_order'):
      return 'Kassir'
    default:
      return 'Foydalanuvchi'
  }
}

const selectedUserRole = computed(() => {
  // selectedUserPrivileges.value =
  return useUserStore().selectedUser.privileges
  // return [getRole(selectedUserPrivileges.value)]
  // return [{ name: roleName, code: selectedUserPrivileges.value }];
})

const markets = ref([])
//const selectedMarket = ref([])
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

const closeModal = () => {
  useModalStore().closeEditUserModal()
  useUserStore().setSelectedUser({})
}

const editUser = () => {
  console.log(selectedRole.value)
  selectedUser.value.privileges = selectedRole.value.flatMap((role) => role.code)
  if (!selectedUser.value.firstname) {
    toast.error('Foydolanuvchini ismi kiriting!')
  } else if (!selectedUser.value.lastname) {
    toast.error('Foydolanuvchini familiyasini kiriting!')
  } else if (!selectedUser.value.login) {
    toast.error('Foydolanuvchini loginni kiriting!')
  } else if (!selectedUser.value.phone) {
    toast.error('Foydolanuvchini telefon raqamini kiriting!')
  } else if (!selectedUser.value.marketId) {
    toast.error("Foydolanuvchini do'kon kiriting!")
  } else if (selectedUser.value.privileges.length === 0) {
    toast.error('Foydolanuvchini rolni kiriting!')
  } else {
    toast.success('Mahsulot muoffaqiyatli taxrirlandi!')
  }
}
</script>
<template>
  <!-- <div> -->
  <!-- <button type="button" @click="useModalStore().openEditUserModal()">
      <PhPencilLine class="w-6 h-6 text-blue-600 hover:scale-105" />
    </button> -->
  <CModal :is-open="useModalStore().isOpenEditUserModal" v-if="useModalStore().isOpenEditUserModal" @close="closeModal">
    <template v-slot:header> Foydalanuvchini tahrirlash </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="grid grid-cols-2 grid-rows-4 gap-6">
          <div class="flex flex-col">
            <label for="firstname" class="text-base text-left font-medium">
              Ism
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="firstname" type="text" v-model="selectedUser.firstname" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Ismni kiriting" />
          </div>
          <div class="flex flex-col">
            <label for="lastname" class="text-base text-left font-medium">
              Familiya
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="lastname" type="text" v-model="selectedUser.lastname" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Familiyani kiriting" />
          </div>

          <div class="flex flex-col">
            <label for="phone" class="text-base text-left font-medium">
              Telefon raqam:
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="phone" type="text" v-model="selectedUser.phone" v-maska data-maska="+998(##) ###-##-##" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="+998(00) 000-00-00" />
          </div>

          <div class="flex flex-col">
            <label for="role" class="text-base text-left font-medium">
              Rol:
              <span class="text-red-500 mr-2">*</span>
            </label>

            <MultiSelect :show-toggle-all="false" :display="'chip'" :select-all="false" panel-class="bg-slate-100 rounded-2xl" v-model="selectedRole" :options="privileges" optionLabel="name" placeholder="Tanlang" :maxSelectedLabels="1" :selection-limit="1" class="text-left bg-slate-100 border-none text-slate-900 rounded-lg w-full placeholder-slate-400" />
          </div>
        </div>
      </div>
    </template>
    <template v-slot:footer>
      <CancelButton @click="closeModal" />
      <button type="button" class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10" @click="editUser()">Saqlash</button>
    </template>
  </CModal>
</template>

<style scoped></style>
