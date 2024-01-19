<script setup>
import { ref } from '@vue/reactivity'
import ImageIcon from '../assets/icons/ImageIcon.vue';
import MinusIcon from '../assets/icons/MinusIcon.vue';
import PlusIcon from '../assets/icons/PlusIcon.vue';
import TrashIcon from '../assets/icons/TrashIcon.vue';
import SearchIcon from '../assets/icons/SearchIcon.vue';
import MoneyIcon from '../assets/icons/MoneyIcon.vue';
import CreditCardIcon from '../assets/icons/CreditCardIcon.vue';
import ClockIcon from '../assets/icons/ClockIcon.vue';
import ArrowsLeftRightIcon from '../assets/icons/ArrowsLeftRightIcon.vue';
import UserIcon from '../assets/icons/UserIcon.vue';

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const cost = ref(0)

</script>


<template>
  <div class="flex">
    <div class="flex-auto w-2/3 space-y-4 py-8 px-8">
      <div class="flex items-center space-x-2 pb-2">
        <div class="relative flex-auto">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon class="w-5 h-5 text-slate-400" />
          </div>
          <input type="search"
            class="bg-slate-100 border-none text-slate-900 text-base md:text-lg rounded-xl block w-full h-12 pl-10 py-2 placeholder-slate-400"
            placeholder="Mahsulot nomi bo'yicha izlash...">
          <button type="button" class="absolute inset-y-0 right-0 px-4 bg-[#0167F3] text-white rounded-xl">
            Izlash
          </button>
          <!-- <div class="absolute top-12 left-0 bg-white border shadow-sm rounded-xl h-20 w-full">
          </div> -->
        </div>
        <div class="flex items-center justify-center bg-slate-100 rounded-xl h-12 w-12">
          <ArrowsLeftRightIcon class="w-5 h-5 text-blue-600" />
        </div>
        <div class="flex items-center justify-center bg-slate-100 rounded-xl h-12 w-12">
          <ClockIcon class="w-5 h-5 text-blue-600" />
        </div>
      </div>

      <div class="text-slate-900 text-2xl md:text-3xl font-semibold">
        Savatcha
      </div>

      <!-- <div class="flex flex-col items-center justify-center border-2 border-dashed h-96 rounded-3xl space-y-1">
        <h4 class="text-slate-900 text-xl font-semibold">
          Savat hozircha bo'sh
        </h4>
        <div class="text-slate-600 text-base text-center">
          Mahsulotlarni izlab toping yoki <br> mahsulotlarni skanerlang
        </div>
      </div> -->

      <div class="inline-block min-w-full py-2 align-middle">
        <div class="overflow-hidden border border-white">
          <table class="min-w-full divide-y-8 divide-white">
            <thead>
              <tr class="bg-slate-100 text-base font-semibold text-gray-900  h-12">
                <th class="px-3 py-2 text-left rounded-l-xl">Mahsulot</th>
                <th class="px-3 py-2 text-center">Miqdori</th>
                <th class="px-3 py-2 text-center">Jami narxi</th>
                <th class="px-3 py-2 text-center rounded-r-xl">Amallar</th>
              </tr>
            </thead>
            <tbody class="bg-slate-100 divide-y-8 divide-white">
              <tr>
                <td class="px-3 py-2 whitespace-nowrap rounded-l-xl">
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center justify-center bg-slate-200 w-12 h-12 rounded-lg">
                      <ImageIcon class="text-gray-500 w-8 h-8" />
                    </div>
                    <div>
                      <div class="text-base font-semibold text-gray-800">Jacobs Monarch 500g</div>
                      <div class="text-base font-medium text-gray-500">
                        Narxi:
                        <span class="text-gray-700">
                          158 000 so'm
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  <div class="flex justify-center">
                    <div class="flex items-center justify-between bg-slate-100 w-28 rounded-xl p-1">
                      <div
                        class="flex items-center justify-center w-8 h-8 bg-white text-slate-700 hover:text-blue-500 hover:bg-slate-50 cursor-pointer rounded-xl">
                        <MinusIcon class="w-4 h-4" />
                      </div>
                      <div class="flex items-center justify-center text-lg font-normal">
                        2
                      </div>
                      <div
                        class="flex items-center justify-center w-8 h-8 bg-white text-blue-600 hover:text-blue-500 hover:bg-slate-50 cursor-pointer rounded-xl">
                        <PlusIcon class="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  316 000 so'm
                </td>
                <td class="px-3 py-2 whitespace-nowrap rounded-r-2xl">
                  <div class="flex justify-center">
                    <TrashIcon class="w-6 h-6 text-rose-500 cursor-pointer transform hover:scale-105" />
                  </div>
                </td>
              </tr>
              <tr>
                <td class="px-3 py-2 whitespace-nowrap rounded-l-xl">
                  <div class="flex items-center space-x-3">
                    <div class="flex items-center justify-center bg-slate-200 w-12 h-12 rounded-lg">
                      <ImageIcon class="text-gray-500 w-8 h-8" />
                    </div>
                    <div>
                      <div class="text-base font-semibold text-gray-800">Frima 1000g</div>
                      <div class="text-base font-medium text-gray-500">
                        Narxi:
                        <span class="text-gray-700">
                          93 000 so'm
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  <div class="flex justify-center">
                    <div class="flex items-center justify-between bg-slate-100 w-28 rounded-xl p-1">
                      <div
                        class="flex items-center justify-center w-8 h-8 bg-white text-slate-700 hover:text-blue-500 hover:bg-slate-50 cursor-pointer rounded-xl">
                        <MinusIcon class="w-4 h-4" />
                      </div>
                      <div class="flex items-center justify-center text-lg font-normal">
                        1
                      </div>
                      <div
                        class="flex items-center justify-center w-8 h-8 bg-white text-blue-600 hover:text-blue-500 hover:bg-slate-50 cursor-pointer rounded-xl">
                        <PlusIcon class="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  93 000 so'm
                </td>
                <td class="px-3 py-2 whitespace-nowrap rounded-r-2xl">
                  <div class="flex justify-center">
                    <TrashIcon class="w-6 h-6 text-rose-500 cursor-pointer transform hover:scale-105" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="flex-auto w-1/3 border-l h-dvh py-8 px-8 space-y-4">
      <!-- <div class="space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-xl font-semibold">Mijoz</h3>
          <h3 class="text-balance font-semibold text-blue-600">Yaratish</h3>
        </div>
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <UserIcon class="w-5 h-5 text-slate-400" />
          </div>
          <input type="text"
            class="bg-slate-100 border-none text-slate-700 text-base rounded-xl block w-full pl-10 placeholder-slate-400"
            placeholder="Mijozni tanlang">
        </div>
      </div>
      <div class="space-y-2">
        <h3 class="text-xl font-semibold">Chegirma</h3>
        <input type="text"
          class="bg-slate-100 border-none text-slate-700 text-base rounded-xl h-10 block w-full placeholder-slate-400"
          placeholder="Mijozni tanlang">
      </div> -->

      <div class="space-y-2">
        <h3 class="text-xl font-semibold">Harid tafsilotlari</h3>
        <div class="pb-3 space-y-1">
            <div class="flex items-center justify-between">
              <div class="text-base text-gray-600">
                Mahsulotlar soni
              </div>
              <div class="text-base font-semibold text-gray-900">
                2 ta
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-base text-gray-600">
                Narxi
              </div>
              <div class="text-base font-semibold text-gray-900">
                409 000 so'm
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-base text-gray-600">
                Chegirma
              </div>
              <div class="text-base font-semibold text-gray-900">
                0 %
              </div>
            </div>
            <div class="flex items-center justify-between">
              <div class="text-base text-gray-600">
                Chegirma miqdori
              </div>
              <div class="text-base font-semibold text-red-500">
                -0 so'm
              </div>
            </div>
          </div>
          <div class="flex items-center justify-between mt-2 pt-3 border-t border-dashed">
            <div class="text-xl font-semibold text-gray-900">
              Umumiy
            </div>
            <div class="text-xl font-semibold text-gray-900">
              409 000 so'm
            </div>
          </div>
      </div>

      <div class="space-y-1">
        <label class="text-base font-medium">Qabul qilingan to'lov</label>
        <money3 v-model="cost" v-bind="moneyConf" id="price"
          class="border-none text-right text-gray-500 bg-slate-100 rounded-lg w-full text-lg">
        </money3>
      </div>
      <div class="py-3 space-y-1">
        <div class="text-base font-medium">To'lov turi</div>
        <div class="flex items-center space-x-4">
          <div
            class="flex-1 flex flex-col items-center justify-center bg-blue-50 border border-blue-300 rounded-lg py-4">
            <MoneyIcon class="w-6 h-6 text-blue-500" />
            <div class="text-lg font-medium text-blue-500">
              Naqt pul orqali
            </div>
          </div>
          <div class="flex-1 flex flex-col items-center justify-center border rounded-lg py-4">
            <CreditCardIcon class="w-6 h-6 text-gray-500" />
            <div class="text-lg font-medium">
              Plastik orqali
            </div>
          </div>
        </div>
      </div>

      <button
        class="w-full py-3 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
        To'lov
      </button>
    </div>
  </div>
</template>

<style scoped></style>