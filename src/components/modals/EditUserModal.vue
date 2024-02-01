<script setup>
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import CModal from '../common/CModal.vue'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import { reactive, ref, computed, watch } from 'vue'
import { toast } from 'vue-sonner'
import { useUserStore } from '../../store/user.store.js'
import { vMaska } from 'maska'

const isLoading = ref(false)
const userStore = useUserStore()

const selectedUser = computed(() => {
  return userStore.selectedUser
})

const privileges = ref([
  { name: 'Kassir', code: ['create_order', 'create_product'] },
  { name: 'Admin', code: ['create_market', 'create_user', 'dashboard', 'find_barcode', 'find_order', 'update_user', 'view_histories', 'view_markets', 'view_orders', 'view_products', 'view_users'] },
  { name: 'Boshqaruvchi', code: ['create_user', 'update_user', 'view_users'] },
])

const submitData = reactive({
  id: '',
  firstname: '',
  lastname: '',
  phone: '',
  privileges: [],
})

const clearSubmitData = () => {
  submitData.id = ''
  submitData.firstname = ''
  submitData.lastname = ''
  submitData.phone = ''
  submitData.privileges = []
}

const closeModal = () => {
  useModalStore().closeEditUserModal()
  useUserStore().setSelectedUser({})
  clearSubmitData()
}

const editUser = () => {
  if (!submitData.value.firstname) {
    toast.error('Foydolanuvchini ismi kiriting!')
  } else if (!submitData.value.lastname) {
    toast.error('Foydolanuvchini familiyasini kiriting!')
  } else if (!submitData.value.phone) {
    toast.error('Foydolanuvchini telefon raqamini kiriting!')
  } else if (!submitData.value.privileges) {
    toast.error('Foydolanuvchini rolni kiriting!')
  } else {
    toast.success('Mahsulot muoffaqiyatli taxrirlandi!')
    closeModal()
  }
}

watch(
  () => selectedUser.value,
  (data) => {
    if (data) {
      submitData.id = data?.id
      submitData.firstname = data?.firstname
      submitData.lastname = data?.lastname
      submitData.phone = data?.phone
      submitData.privileges = data?.privileges?.sort()
    }
  }
)
</script>
<template>
  <CModal :is-open="useModalStore().isOpenEditUserModal" v-if="useModalStore().isOpenEditUserModal" @close="closeModal">
    <template v-slot:header> Foydalanuvchini tahrirlash </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="firstname" class="text-base font-medium">
              Ism
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="firstname" type="text" v-model="submitData.firstname"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="Ismni kiriting" />
          </div>
          <div class="flex-1">
            <label for="lastname" class="text-base font-medium">
              Familiya
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="lastname" type="text" v-model="submitData.lastname"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="Familiyani kiriting" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="phone" class="text-base font-medium">
              Telefon raqam:
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="phone" type="text" v-model="submitData.phone" v-maska data-maska="+998(##) ###-##-##"
              class="bg-slate-100 border-none text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="+998(00) 000-00-00" />
          </div>
          <div class="flex-1">
            <label for="role" class="text-base text-left font-medium">
              Rol:
              <span class="text-red-500 mr-2">*</span>
            </label>

            <select id="role" v-model="submitData.privileges"
              class="bg-slate-100 border-none text-slate-900 rounded-lg block w-full h-11">
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
      <button v-if="isLoading" type="bSearchIconutton"
        class="inline-flex items-center justify-center ms-3 text-white bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10 cursor-default">
        <Spinners270RingIcon
          class="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" />
        Saqlash
      </button>
      <button v-else @click="editUser()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        Saqlash
      </button>
    </template>
  </CModal>
</template>

<style scoped></style>
