<script setup>
import PhTrash from '../../assets/icons/TrashIcon.vue'
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import { useUserStore } from '../../store/user.store.js'
import { computed } from 'vue'
import moment from 'moment/moment.js'
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue'

const userStore = useUserStore()
const selectedUser = computed(() => {
  return userStore.selectedUser
})


const getRole = (privileges) => {
  switch (true) {
    case
    privileges.includes('create_user') &&
    privileges.includes('update_user') &&
    privileges.includes('dashboard') &&
    privileges.includes('view_users') &&
    privileges.includes('create_product') &&
    privileges.includes('update_product') &&
    privileges.includes('view_products') &&
    privileges.includes('create_history') &&
    privileges.includes('view_histories') &&
    privileges.includes('find_barcode') &&
    privileges.includes('create_order') &&
    privileges.includes('find_order') &&
    privileges.includes('view_orders') &&
    privileges.includes('create_market') &&
    privileges.includes('view_markets'):
      return 'Admin'
    case
    privileges.includes('dashboard') &&
    privileges.includes('view_users') &&
    privileges.includes('create_product') &&
    privileges.includes('update_product') &&
    privileges.includes('view_products') &&
    privileges.includes('create_history') &&
    privileges.includes('view_histories') &&
    privileges.includes('find_barcode') &&
    privileges.includes('create_order') &&
    privileges.includes('find_order') &&
    privileges.includes('view_orders') &&
    privileges.includes('view_markets'):
      return 'Boshqaruvchi'
    case
    privileges.includes('dashboard') &&
    privileges.includes('create_order') &&
    privileges.includes('view_products') &&
    privileges.includes('view_orders') &&
    privileges.includes('find_barcode') &&
    privileges.includes('find_order'):
      return 'Kassir'
    default:
      return 'Foydalanuvchi'
  }
}

const closeModal = () => {
  useModalStore().closeDeleteUserModal()
  useUserStore().setSelectedUser({})
}

</script>

<template>
    <CModal
      :is-open="useModalStore().isOpenDeleteUserModal"
      v-if="useModalStore().isOpenDeleteUserModal"
      @close=closeModal
    >
      <template v-slot:header>
        Foydalanuvchini o'chirish
      </template>
      <template v-slot:body>
        <div class="space-y-16">
          <div class="space-y-2">
            <div class="bg-slate-100 px-3 text-center py-2 text-lg font-medium rounded-xl">
              Foydalanuvchi ma'lumotlari
            </div>
            <ul class="divide-y divide-slate-100">
              <li class="flex items-center justify-between py-2 px-3">
                <div class="text-base">
                  Ism, Familiya:
                </div>
                <div class="text-base font-medium">
                  {{ selectedUser.firstname}} {{ selectedUser.lastname}}
                </div>
              </li>
              <li class="flex items-center justify-between py-2 px-3">
                <div class="text-base">
                  Login:
                </div>
                <div class="text-base font-medium">
                  {{ selectedUser.login }}
                </div>
              </li>
              <li class="flex items-center justify-between py-2 px-3">
                <div class="text-base">
                  Telefon raqami:
                </div>
                <div class="text-base font-medium">
                  {{ selectedUser.phone }}
                </div>
              </li>
              <li class="flex items-center justify-between py-2 px-3">
                <div class="text-base">
                  Rol
                </div>
                <div class="text-base font-medium">
                  {{ getRole(selectedUser.privileges) }}
                </div>
              </li>
              <li class="flex items-center justify-between py-2 px-3">
                <div class="text-base">
                  Yaratilgan vaqti
                </div>
                <div class="text-base font-medium">
                  {{ moment(selectedUser?.createdAt).format('DD/MM/YYYY H:mm') }}
                </div>
              </li>
            </ul>
          </div>
          <div class="flex items-center justify-center">
            <div class="py-8 border border-red-300 rounded-2xl w-2/3">
              <div class="flex flex-col items-center space-y-4">
                <WarningCircleBoldIcon class="text-slate-400 w-14 h-14" />
                <h3 class="mb-5 text-lg text-justify font-normal text-slate-500">
                  Haqiqatdan ushbu foydalanuvchini o'chirmoqchimisiz?
                </h3>
                <div class="flex items-center space-x-4">
                  <button type="button" @click="closeModal()"
                          class="py-2 px-4 rounded-xl text-gray-900 text-base font-medium bg-slate-50 cursor-pointer hover:bg-slate-200 border">
                    Yo'q
                  </button>
                  <button
                    class="py-2 px-4 rounded-xl text-white text-base font-medium bg-red-600 cursor-pointer hover:bg-red-700">
                    Ha, albatta
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CModal>
</template>

<style scoped>

</style>