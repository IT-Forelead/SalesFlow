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
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const isLoading = ref(false)
const userStore = useUserStore()

const selectedUser = computed(() => {
  return userStore.selectedUser
})

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
      'view_agents',
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
      'create_agent',
      'create_history',
      'create_order',
      'create_product',
      'create_user',
      'dashboard',
      'delete_product',
      'find_barcode',
      'find_order',
      'update_agent',
      'update_product',
      'update_settings',
      'view_agents',
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
    toast.warning(t('plsEnterFirstname'))
  } else if (!submitData.lastname) {
    toast.warning(t('plsEnterlastname'))
  } else if (!submitData.phone) {
    toast.warning(t('plsEnterPhoneNumber'))
  } else if (submitData.phone.length !== 18) {
    toast.warning(t('plsEnterValidPhoneNumber'))
  } else if (!submitData.privileges) {
    toast.warning(t('plsSelectRole'))
  } else {
    isLoading.value = true
    UserService.updateUser({
      id: submitData.id,
      firstname: submitData.firstname,
      lastname: submitData.lastname,
      privileges: submitData.privileges,
      phone: submitData.phone.replace(/([() -])/g, ''),
    }).then(() => {
      toast.success(t('userEditedSuccessfully'))
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
      toast.error(t('errorWhileEditingUser'))
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
    <template v-slot:header>
      {{ $t('editUser') }}
    </template>
    <template v-slot:body>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="firstname" class="text-base dark:text-white font-medium">
              {{ $t('firstname') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="firstname" type="text" v-model="submitData.firstname"
              class="bg-slate-100 border-none text-sm  dark:bg-slate-700 dark:text-white md:text-base text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('enterFirstname')" />
          </div>
          <div class="flex-1">
            <label for="lastname" class="text-base dark:text-white font-medium">
              {{ $t('lastname') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="lastname" type="text" v-model="submitData.lastname"
              class="bg-slate-100 border-none  dark:bg-slate-700 dark:text-white text-sm md:text-base text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              :placeholder="t('lastname')" />
          </div>
        </div>
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <label for="phone" class="text-base dark:text-white font-medium">
              {{ $t('phone') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <input id="phone" type="text" v-model="submitData.phone" v-maska data-maska="+998(##) ###-##-##"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-sm md:text-base text-slate-900 rounded-lg w-full py-2.5 placeholder-slate-400"
              placeholder="+998(00) 000-00-00" />
          </div>
          <div class="flex-1">
            <label for="role" class="text-base dark:text-white text-left font-medium">
              {{ $t('role') }}
              <span class="text-red-500 mr-2">*</span>
            </label>
            <select id="role" v-model="submitData.privileges"
              class="bg-slate-100 border-none dark:bg-slate-700 dark:text-white text-sm md:text-base text-slate-900 rounded-lg block w-full h-11">
              <option value="" selected>{{ $t('selectRole') }}</option>
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
          {{ $t('save') }}
      </button>
      <button v-else @click="editUser()" type="button"
        class="ms-3 text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:outline-none focus:ring-slate-300 rounded-xl border border-slate-200 text-sm font-medium px-5 py-2.5 focus:z-10">
        {{ $t('save') }}
      </button>
    </template>
  </CModal>
</template>
<style scoped></style>
