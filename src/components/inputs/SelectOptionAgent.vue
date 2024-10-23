<script setup>
import { computed, onMounted, ref, toRefs } from 'vue'
import { useDropdownStore } from '../../store/dropdown.store'
import { onClickOutside } from '@vueuse/core'
import XIcon from '../../assets/icons/XIcon.vue'
import ChevronRightIcon from '../../assets/icons/ChevronRightIcon.vue'

const dropdownStore = useDropdownStore()

const selectedOption = computed(() => {
  return dropdownStore.selectOptionAgent
})

const props = defineProps({
  options: { type: Array, required: true },
})

const { options } = toRefs(props)

const dropdown = ref(null)

onMounted(() => {
  clearSelectedOptionData()
})

const clearSelectedOptionData = () => {
  dropdownStore.setSelectOptionAgent('')
}

onClickOutside(dropdown, () => {
  dropdownStore.closeAgentDropdown()
})

const optionClicked = (data) => {
  dropdownStore.setSelectOptionAgent(data)
  dropdownStore.closeAgentDropdown()
}

const search = ref('')
const searchResults = ref([])

// const getSearchResult = (options) => {
//   if (search.value) {
//     searchResults.value = options.filter((agent) => agent?.fullName.toLowerCase().includes(search?.value.toLowerCase()))
//   } else {
//     searchResults.value = []
//   }
// }

const getSearchResult = (options) => {
  if (search.value) {
    const searchLower = search.value.toLowerCase()
    searchResults.value = options.filter((agent) =>
      agent?.fullName.toLowerCase().includes(searchLower) ||
      agent?.company.toLowerCase().includes(searchLower)
    )
  } else {
    searchResults.value = []
  }
}
</script>
<template>
  <div class="select-none">
    <label ref="dropdown" class="flex items-center w-full relative">
      <div v-if="selectedOption"
        class="border-none focus:ring-0 outline-0 bg-gray-100 w-full text-lg rounded-lg pl-2 py-2">{{
          selectedOption?.fullName }} - <span class="font-light">{{ selectedOption?.company }}</span></div>
      <input type="text" v-model="search" v-if="useDropdownStore().isOpenAgentDropdown"
        v-on:keyup="getSearchResult(options)"
        class="relative w-full foucus:ring-0 focus:outline-none border-none rounded-lg bg-gray-100"
        :placeholder="$t('search')" />
      <div @click="useDropdownStore().openAgentDropdown()"
        v-if="!useDropdownStore().isOpenAgentDropdown && !selectedOption"
        class="border-none bg-gray-100 py-2 w-full text-lg rounded-lg cursor-pointer text-slate-500 pl-2">
        {{ $t('selectAgent') }}
      </div>
      <ChevronRightIcon @click="useDropdownStore().openAgentDropdown()" v-if="!selectedOption"
        class="absolute right-2.5 z-10 rotate-90 cursor-pointer dark:text-white" />
      <XIcon @click="clearSelectedOptionData()" v-if="selectedOption"
        class="absolute right-2.5 z-10 cursor-pointer bg-gray-500 hover:bg-gray-600 text-white rounded-full p-1" />
      <div v-if="!search && useDropdownStore().isOpenAgentDropdown"
        class="absolute shadow p-2 z-20 top-12 max-h-56 overflow-auto w-full bg-gray-100 rounded-lg divide-y">
        <div v-for="(option, idx) in options" :key="idx" @click="optionClicked(option)"
          class="hover:bg-gray-200 cursor-pointer p-2 rounded-lg">
          {{ option?.fullName }} - <span class="font-light">{{ option?.company }}</span>
        </div>
        <div v-if="options?.length === 0" class="hover:bg-gray-200 cursor-pointer p-2 rounded-lg">
          <p class="text-red-500">{{ $t('agentNotFound') }}</p>
        </div>
      </div>
      <div v-if="search && useDropdownStore().isOpenAgentDropdown"
        class="absolute shadow p-2 z-20 top-12 max-h-56 overflow-auto w-full bg-gray-100 rounded-lg divide-y">
        <div class="hover:bg-gray-200 cursor-pointer p-2 rounded-lg" v-for="(option, idx) in searchResults" :key="idx"
          @click="optionClicked(option)">
          {{ option?.fullName }} - <span class="font-light">{{ option?.company }}</span>
        </div>
        <div v-if="searchResults?.length === 0" class="hover:bg-gray-200 cursor-pointer p-2 rounded-lg">
          <p class="text-red-500">{{ $t('agentNotFound') }}</p>
        </div>
      </div>
    </label>
  </div>
</template>