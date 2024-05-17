<script setup>
import { reactive, ref, onMounted } from 'vue'
import { toast } from 'vue-sonner'
import SettingsService from '../services/settings.service'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import { Money3 } from 'v-money3'

const isLoading = ref(false)

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const submitData = reactive({
  boundaryPrice: 0,
  percentage: null

})

onMounted(() => {
  SettingsService.getSettings().then((res) => {
    isLoading.value = true
    if (res) {
      submitData.boundaryPrice = res.boundaryPrice
      submitData.percentage = res.percentage
    }
  }).catch(() => {
    toast.error($t('errorWhileGettingSaleSettings'))
  })
});

const createSaleSettings = () => {
  if (submitData.boundaryPrice < 0) {
    toast.error("Chegirmani kiriting!")
  } else {
    SettingsService.updateSettings({
      boundaryPrice: submitData.boundaryPrice,
    }).then(() => {
      toast.success("Chegirma yaratildi!")
    }).catch(() => {
      toast.error("Chegirma yaratishda xatolik yuz berdi!")
     
    })
  }
}

const createPercentageSettings = () => {
  if (submitData.percentage < 0 || submitData.percentage > 100) {
    toast.error("Foizni to'g'ri kiriting!")
  } else {
    SettingsService.updateSettings({
      percentage: submitData.percentage,
    }).then(() => {
      toast.success("Foiz qo'shildi!")
    }).catch(() => {
      toast.error("Foiz qo'shishda xatolik yuz berdi!")
    })
  }
}
</script>

<template>
  <div class="p-8">
    <div class="text-slate-900 text-3xl font-semibold mb-4">Sotuv sozlama</div>
    <TabView class="tabview-custom">
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <span class="font-bold white-space-nowrap">Mahsulotlarga foiz qo'shish</span>
          </div>
        </template>
        <div class="flex flex-col rounded-3xl">
          <div class="flex relative items-center space-x-4">
            <div class="flex-1 spaceSearchIcon-y-1">
              <label for="percentage" class="text-base md:text-lg font-medium">
                {{ $t('percentage')}}
              </label>
              <input type="number" id="percentage" v-model="submitData.percentage" :placeholder="$t('enterPercentage')"
                     class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg" />
            </div>
            <div class="flex-1">
              <button @click="createPercentageSettings" class="text-white text-base flex items-center rounded-xl px-4 py-2.5 bg-blue-500 hover:bg-blue-600 absolute bottom-0">{{ $t('save')}}</button>
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel>
        <template #header>
          <div class="flex align-items-center gap-2">
            <span class="font-bold white-space-nowrap">Minimal narx qo'shish</span>
          </div>
        </template>
        <div class="flex flex-col rounded-3xl">
          <div class="flex relative items-center space-x-4" v-if="isLoading">
            <div class="flex-1 spaceSearchIcon-y-1">
              <label for="price" class="text-base md:text-lg font-medium">
                {{ $t('boundaryPrice')}}
              </label>
              <money3 v-bind="moneyConf" id="price" v-model="submitData.boundaryPrice"
                       class="border-none text-right text-gray-500 bg-slate-100 h-11 rounded-lg w-full text-lg">
              </money3>
            </div>
            <div class="flex-1">
              <button @click="createSaleSettings" class="text-white text-base flex items-center rounded-xl px-4 py-2.5 bg-blue-500 hover:bg-blue-600 absolute bottom-0">{{ $t('save')}}</button>
            </div>
          </div>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<style>
.tabview-custom .p-tabview-nav li.p-highlight a {
  color: #3b82f6 !important;
  border-bottom: solid #3b82f6 !important;
}
</style>
