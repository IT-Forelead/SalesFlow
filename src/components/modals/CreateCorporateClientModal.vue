<script setup>
import { vMaska } from 'maska'
import { reactive, ref, computed, h, onMounted} from 'vue'
import { toast } from 'vue-sonner'
import Spinners270RingIcon from '../../assets/icons/Spinners270RingIcon.vue'
import { cleanObjectEmptyFields } from '../../mixins/utils'
import { useModalStore } from '../../store/modal.store.js'
import CancelButton from '../buttons/CancelButton.vue'
import CModal from '../common/CModal.vue'
import CTable from '../../components/common/CTable.vue'
import { useI18n } from 'vue-i18n'
import CorporateClientsService from '../../services/corporateClients.service.js'
import { useCorporateClientsStore } from '../../store/corporateClients.store.js'
import CustomerService from '../../services/customer.service'
import { useCustomerStore } from '../../store/customer.store.js'
import PhDownload from '../../assets/icons/DownloadIcon.vue'

const { t } = useI18n()

const renderKey = computed(() => customerStore.renderkey)

const page = ref(1)
const pageSize = 30

const isLoading = ref(false)

const submitForm = reactive({
  fullName: '',
  phone: '',
  company: '',
})

const clearForm = () => {
  submitForm.fullName = ''
  submitForm.phone = ''
  submitForm.company = ''
}
const customerStore = useCustomerStore()
const customers = computed(() => customerStore.customers)

const columns = [
  {
    accessorKey: 'id',
    header: t('n'),
    cell: ({ row }) => `${parseInt(row.id, 10) + 1}`,
  },
  {
    accessorFn: row => `${row.fullName}`,
    header: t('fullName'),
  },
  {
    accessorKey: 'actions',
    header: t('actions'),
    cell: ({ row }) => h('div', { class: 'flex items-center space-x-2' }, [
      h('button', {
        onClick: () => {
          createCorporateClient(row.original.id)
        },
      }, [
        h(PhDownload, { class: 'w-6 h-6 text-blue-600 dark:text-blue-400 hover:scale-105' }),
      ]),
    ]),
    enableSorting: false,
  },
]

const closeModal = () => {
  useModalStore().closeCreateCorporateClientModal()
  clearForm()
}

const createCorporateClient = (customerId) => {
  
    isLoading.value = true
    CorporateClientsService.createCorporateClient(
      cleanObjectEmptyFields({
        customerId: customerId,
        
      }),
    ).then(() => {
      toast.success(t('corporateClientAddedSuccessfully'))
      isLoading.value = false
      CorporateClientsService.getCorporateClients()
        .then((res) => {
          useCorporateClientsStore().clearStore()
          useCorporateClientsStore().setCorporateClients(res)
          useCorporateClientsStore().renderkey += 1
        })
    }).catch(() => {
      toast.error(t('corporateClientAlreadyExist'))
      isLoading.value = false
    })
    closeModal()
  }

const getCustomers = () => {
  CustomerService.getCustomers(
    cleanObjectEmptyFields({ limit: pageSize, page: page.value }),
  ).then((res) => {
    customerStore.clearStore()
    customerStore.setCustomers(res.data)
    customerStore.renderkey += 1
  })
}

getCustomers()

</script>
<template>
  <CModal :is-open="useModalStore().isOpenCreateCorporateClientModal" v-if="useModalStore().isOpenCreateCorporateClientModal"
            @close=closeModal :key="renderKey">
      <template v-slot:header>
        {{ $t('addClient') }}
      </template>
      <template v-slot:body>
        <div class="space-y-4">
          <CTable :data="customers" :columns="columns"  />
          
        </div>
      </template>
      <template v-slot:footer>
        <CancelButton @click="closeModal" />
        
      </template>
  </CModal>
</template>

<style scoped></style>