<script setup>
import { vMaska } from 'maska'
import { computed, reactive, ref, watch } from 'vue'
import { toast } from 'vue-sonner'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import UserService from '../../services/user.service.js'
import { useModalStore } from '../../store/modal.store.js'
import { useUserStore } from '../../store/user.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'

const isLoading = ref(false)
const userStore = useUserStore()

const selectedUser = computed(() => {
  return userStore.selectedUser
})

const privileges = ref([
  {
    name: 'Kassir',
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
    name: 'Admin',
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
    name: 'Boshqaruvchi',
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
  if (!submitData.firstname) {
    toast.warning('Foydolanuvchini ismini kiriting!')
  } else if (!submitData.lastname) {
    toast.warning('Foydolanuvchini familiyasini kiriting!')
  } else if (!submitData.phone) {
    toast.warning('Foydolanuvchini telefon raqamini kiriting!')
  } else if (!submitData.privileges) {
    toast.warning('Foydolanuvchini rolini tanlang!')
  } else {
    isLoading.value = true
    UserService.updateUser({
      id: submitData.id,
      firstname: submitData.firstname,
      lastname: submitData.lastname,
      privileges: submitData.privileges,
      phone: submitData.phone.replace(/([() -])/g, ''),
    }).then(() => {
      toast.success('Mahsulot muvaffaqiyatli tahrirlandi!')
      UserService.getUsers()
        .then((res) => {
          userStore.clearStore()
          userStore.setUsers(res)
        })
        .catch((err) => {
          toast.error(err.message)
        })
      isLoading.value = false
      closeModal()
    }).catch((err) => {
      toast.error(err.message)
      isLoading.value = false
      closeModal()
    })
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
  },
  { deep: true }
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
              class="bg-slate-100 border-none text-sm md:text-base text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="Ismni kiriting" />
          </div>
          <div class="flex-1">
            <label for="lastname" class="text-base font-medium">
              Familiya
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="lastname" type="text" v-model="submitData.lastname"
              class="bg-slate-100 border-none text-sm md:text-base text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
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
              class="bg-slate-100 border-none text-sm md:text-base text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="+998(00) 000-00-00" />
          </div>
          <div class="flex-1">
            <label for="role" class="text-base text-left font-medium">
              Rol:
              <span class="text-red-500 mr-2">*</span>
            </label>

            <select id="role" v-model="submitData.privileges"
              class="bg-slate-100 border-none text-sm md:text-base text-slate-900 rounded-lg block w-full h-11">
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
      <button v-if="isLoading" type="button"
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
