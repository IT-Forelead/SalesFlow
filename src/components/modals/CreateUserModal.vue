<script setup>
import { useModalStore } from '../../store/modal.store.js'
import CModal from '../common/CModal.vue'
import CancelButton from '../buttons/CancelButton.vue'
import CreateUserButton from '../buttons/CreateUserButton.vue'
import SaveButton from '../buttons/SaveButton.vue'
import { reactive, ref } from '@vue/reactivity'
import MultiSelect from 'primevue/multiselect'
import UserService from '../../services/user.service.js'
import { toast } from 'vue-sonner'
import { useUserStore } from '../../store/user.store.js'
import { vMaska } from 'maska'

const isLoading = ref(false)
const selectedRole = ref([])

const privileges = ref([
  { name: 'Kassir', code: ['create_product'] },
  { name: 'Admin', code: ['create_user', 'update_user', 'update_any_user', 'view_users', 'create_product'] },
  { name: 'Boshqaruvchi', code: ['create_user', 'view_users', 'update_user'] },
])
const submitForm = reactive({
  firstname: '',
  lastname: '',
  login: '',
  password: '',
  privileges: [],
  phone: '',
})

const clearForm = () => {
  submitForm.firstname = ''
  submitForm.lastname = ''
  submitForm.login = ''
  submitForm.password = ''
  submitForm.privileges = ['']
  submitForm.phone = ''
}

const closeModal = () => {
  useModalStore().closeCreateUserModal()
  clearForm()
}

const createUser = () => {
  submitForm.privileges = selectedRole.value.flatMap(role => role.code)
  if (!submitForm.firstname) return toast.warning('Iltimos ism kiriting')
  if (!submitForm.lastname) return toast.warning('Iltimos familiya kiriting')
  if (!submitForm.login) return toast.warning('Iltimos login kiriting')
  if (!submitForm.password) return toast.warning('Iltimos parol kiriting')
  if (submitForm.privileges.length === 0) return toast.warning('Iltimos rol tanlang')
  if (!submitForm.phone) return toast.warning('Iltimos telefon raqam kiriting')
  else {
    isLoading.value = true
    const formData = new FormData()
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
        UserService.getUsers()
          .then((res) => {
              useUserStore().clearStore()
            setTimeout(()=>{
              useUserStore().setUsers(res)
            }, 100)
          })
          .catch((err) => {
            toast.error('Foydalanuvchilar topilmadi!')
          })
      })
      .catch((err) => {
        toast.error('Foydalanuvchi yaratishda xatolik!')
        isLoading.value = false
      })
    closeModal()
  }
}
</script>

<template>
  <div>
    <CreateUserButton @click="useModalStore().openCreateUserModal()" />
    <CModal
      :is-open="useModalStore().isCreateUserModalOpen"
      v-if="useModalStore().isCreateUserModalOpen"
      @close=closeModal
    >
      <template v-slot:header>
        Foydalanuvchi qo'shish
      </template>
      <template v-slot:body>
        <form @submit.prevent="createUser()" method="post">
          <div class="grid gap-4 sm:grid-cols-1 sm:gap-6 px-2">
            <div class="w-full">
              <label for="firstname"
                     class="block mb-2 text-neutral-800 text-base font-normal  after:text-red-500 after:content-['*']">Ism</label>
              <input
                v-model="submitForm.firstname"
                type="text"
                name="firstname"
                id="firstname"
                class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
                placeholder="Ismingizni kiriting"
                required=""
              />
            </div>
            <div class="w-full">
              <label for="lastname" class="text-neutral-800 text-base font-normal  after:text-red-500 after:content-['*']">Familiya</label>
              <input
                v-model="submitForm.lastname"
                type="text"
                name="lastname"
                id="lastname"
                class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
                placeholder="Familiyangizni kiriting"
                required=""
              />
            </div>
            <div class="w-full">
              <label for="login" class="block mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">Login</label>
              <input
                v-model="submitForm.login"
                type="text"
                name="login"
                id="login"
                class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
                placeholder="Login kiriting" />
            </div>
            <div class="w-full">
              <label for="parol"
                     class="block mb-2 text-neutral-800 text-base font-normal  after:text-red-500 after:content-['*']">Parol</label>
              <input v-model="submitForm.password"
                     type="password"
                     name="parol"
                     id="parol"
                     class="bg-slate-50 border border-slate-200 text-slate-900 text-base rounded-2xl focus:ring-green-400/40 focus:border-green-400/40 focus:ring-4 block w-full p-2.5"
                     placeholder="***"
              />
            </div>
            <div class="w-full">
              <label for="password"
                     class="block mb-2 text-neutral-800 text-base font-normal after:text-red-500 after:content-['*']">Rol
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
                class="w-full border rounded-2xl bg-slate-100"
              />
            </div>
            <div class="w-full">
              <label for="phone" class="block mb-2 text-neutral-800 text-base font-normal">Telefon raqam:</label>
              <input
                v-maska
                data-maska="+998(##) ###-##-##"
                v-model="submitForm.phone"
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
        <SaveButton :isLoading="isLoading" @click="createUser" />
        <CancelButton @click="closeModal" />
      </template>
    </CModal>
  </div>
</template>

<style scoped>

</style>