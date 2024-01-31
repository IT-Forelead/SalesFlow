<script setup>
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import SaveButton from '../buttons/SaveButton.vue'
import { reactive, ref, computed, watch} from 'vue'
import UserService from '../../services/user.service.js'
import { toast } from 'vue-sonner'
import { useUserStore } from '../../store/user.store.js'
import { vMaska } from 'maska'

const userStore = useUserStore()

const selectedUser = computed(() => {
  return userStore.selectedUser
})

const privileges = ref([
  { name: 'Kassir', code: ['create_order', 'create_product'] },
  { name: 'Admin', code: ['create_order', 'create_product', 'create_user', 'update_any_user', 'update_user', 'view_users'] },
  { name: 'Boshqaruvchi', code: ['create_user', 'update_user', 'view_users'] },
])

watch(
  () => selectedUser.value,
  (data) => {
    if (data) {
      selectedUser.value.privileges = selectedUser.value?.privileges?.sort()
    }
  }
)

const closeModal = () => {
  useModalStore().closeEditUserModal()
  useUserStore().setSelectedUser({})
}

const editUser = () => {
  if (!selectedUser.value.firstname) {
    toast.error('Foydolanuvchini ismi kiriting!')
  } else if (!selectedUser.value.lastname) {
    toast.error('Foydolanuvchini familiyasini kiriting!')
  } else if (!selectedUser.value.phone) {
    toast.error("Foydolanuvchini telefon raqamini kiriting!")
  } else {
    toast.success('Mahsulot muoffaqiyatli taxrirlandi!')
    closeModal()
  }
}


</script>
<template>
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
            <label for="login" class="text-base text-left font-medium">
              Login
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="login" type="text" v-model="selectedUser.login" class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400" placeholder="Loginni kiriting" />
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

            <select id="role" v-model="selectedUser.privileges" class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
              <option value="" selected>Tanlang</option>
              <option v-for="(priv, idx) in privileges" :key="idx" :value="priv?.code">
                {{ priv?.name }}
              </option>
            </select>
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
