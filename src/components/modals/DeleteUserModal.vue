<script setup>
import PhTrash from '../../assets/icons/TrashIcon.vue'
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import { useUserStore } from '../../store/user.store.js'
import { computed } from 'vue'
import moment from 'moment/moment.js'
import WarningCircleBoldIcon from '../../assets/icons/WarningCircleBoldIcon.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

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
      return t('admin')
    case
    privileges.includes('dashboard') &&
    privileges.includes('view_users') &&
    privileges.includes('create_product') &&
    privileges.includes('delete_product') &&
    privileges.includes('update_product') &&
    privileges.includes('view_products') &&
    privileges.includes('create_history') &&
    privileges.includes('view_histories') &&
    privileges.includes('find_barcode') &&
    privileges.includes('create_order') &&
    privileges.includes('find_order') &&
    privileges.includes('view_orders') &&
    privileges.includes('view_markets'):
      return t('manager')
    case
    privileges.includes('dashboard') &&
    privileges.includes('create_order') &&
    privileges.includes('view_products') &&
    privileges.includes('view_orders') &&
    privileges.includes('find_barcode') &&
    privileges.includes('find_order'):
      return t('cashier')
    default:
      return t('user')
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
        {{ $t('deleteUser') }}
      </template>
      <template v-slot:body>
        <div class="space-y-16">
          <div class="space-y-2">
            <div class="bg-slate-100 px-3 text-center py-2 text-lg font-medium rounded-xl">
              {{ $t('userInformation') }}
            </div>
            <ul class="divide-y divide-slate-100">
              <li class="flex items-center dark:text-white justify-between py-2 px-3">
                <div class="text-base">
                  {{ $t('user') }}
                </div>
                <div class="text-base font-medium">
                  {{ selectedUser.firstname}} {{ selectedUser.lastname}}
                </div>
              </li>
              <li class="flex items-center dark:text-white justify-between py-2 px-3">
                <div class="text-base">
                  {{ $t('login') }}
                </div>
                <div class="text-base font-medium">
                  {{ selectedUser.login }}
                </div>
              </li>
              <li class="flex items-center dark:text-white justify-between py-2 px-3">
                <div class="text-base">
                  {{ $t('phone') }}
                </div>
                <div class="text-base font-medium">
                  {{ selectedUser.phone }}
                </div>
              </li>
              <li class="flex items-center dark:text-white justify-between py-2 px-3">
                <div class="text-base">
                  {{ $t('role') }}
                </div>
                <div class="text-base font-medium">
                  {{ getRole(selectedUser.privileges) }}
                </div>
              </li>
              <li class="flex items-center dark:text-white justify-between py-2 px-3">
                <div class="text-base">
                  {{ $t('createdAt') }}
                </div>
                <div class="text-base font-medium">
                  {{ moment(selectedUser?.createdAt).format('DD/MM/YYYY H:mm') }}
                </div>
              </li>
            </ul>
          </div>
          <div class="flex items-center justify-center">
            <div class="py-8 border border-red-300 rounded-2xl w-full md:w-2/3 max-w-md md:max-w-lg">
              <div class="flex flex-col items-center space-y-4">
                <WarningCircleBoldIcon class="dark:text-white w-14 h-14" />
                <h3 class="mb-5 text-lg md:text-xl text-center font-normal dark:text-white text-slate-500">
                  {{ $t('areYouSureYouWantToDeleteThisInformation') }}
                </h3>
                <div class="flex flex-col md:flex-row items-center justify-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
                  <button type="button" @click="closeModal()"
                          class="w-full md:w-auto py-2 px-4 rounded-xl text-base font-medium bg-slate-50 cursor-pointer hover:bg-slate-200 border md:flex-1">
                          {{ $t('no') }}
                  </button>
                  <button
                    class="w-full md:w-auto py-2 px-4 rounded-xl text-white text-base font-medium bg-red-600 cursor-pointer hover:bg-red-700">
                    {{ $t('yesOfCourse') }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CModal>
</template>
<style scoped></style>