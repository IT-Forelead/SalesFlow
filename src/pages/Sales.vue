<script setup>
import { ref } from '@vue/reactivity'
import ImageIcon from '../assets/icons/ImageIcon.vue';
import MinusIcon from '../assets/icons/MinusIcon.vue';
import PlusIcon from '../assets/icons/PlusIcon.vue';
import TrashIcon from '../assets/icons/TrashIcon.vue';
import SearchIcon from '../assets/icons/SearchIcon.vue';
import MoneyIcon from '../assets/icons/MoneyIcon.vue';
import CreditCardIcon from '../assets/icons/CreditCardIcon.vue';

const moneyConf = {
  thousands: ' ',
  suffix: ' UZS',
  precision: 0,
}

const cost = ref(0)

</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div class="col-span-2 bg-white rounded-lg py-6 px-4 space-y-4">
      <div class="flex items-center justify-between">
        <div class="relative w-96">
          <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <SearchIcon class="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
          <input type="text"
            class="bg-white border border-gray-300 text-gray-900 text-md rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 px-3 py-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Mahsulot nomi bo'yicha izlash...">
          <button type="button" class="absolute inset-y-0 right-0 px-3 bg-[#0167F3] text-white rounded-r-lg">
            Izlash
          </button>
        </div>
      </div>

      <div class="inline-block min-w-full py-2 align-middle">
        <div class="overflow-hidden rounded-lg border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-3 py-2 text-base font-semibold text-left text-gray-900">Mahsulot</th>
                <th scope="col" class="px-3 py-2 text-base font-semibold text-center text-gray-900">Miqdori</th>
                <th scope="col" class="px-3 py-2 text-base font-semibold text-center text-gray-900">Jami narxi</th>
                <th scope="col" class="px-3 py-2 text-base font-semibold text-center text-gray-900">Amallar</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="flex items-center px-3 py-2 space-x-3 whitespace-nowrap">
                  <div class="flex items-center justify-center bg-gray-100 w-12 h-12 rounded-lg">
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
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  <div class="flex justify-center">
                    <div class="flex items-center justify-between w-28 rounded-full shadow">
                      <div
                        class="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-[#0167F3] hover:bg-gray-100 rounded-full">
                        <MinusIcon class="w-4 h-4" />
                      </div>
                      <div class="flex items-center justify-center text-lg font-normal">
                        2
                      </div>
                      <div
                        class="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-[#0167F3] hover:bg-gray-100 rounded-full">
                        <PlusIcon class="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  316 000 so'm
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="flex justify-center">
                    <TrashIcon class="w-6 h-6 text-rose-500 cursor-pointer transform hover:scale-105" />
                  </div>
                </td>
              </tr>
              <tr>
                <td class="flex items-center px-3 py-2 space-x-3 whitespace-nowrap">
                  <div class="flex items-center justify-center bg-gray-100 w-12 h-12 rounded-lg">
                    <ImageIcon class="text-gray-500 w-8 h-8" />
                  </div>
                  <div>
                    <div class="text-base font-semibold text-gray-800">Frima 1kg</div>
                    <div class="text-base font-medium text-gray-500">Narxi: <span class="text-gray-700">93 000 so'm</span>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  <div class="flex justify-center">
                    <div class="flex items-center justify-between w-28 rounded-full shadow">
                      <div
                        class="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-[#0167F3] hover:bg-gray-100 rounded-full">
                        <MinusIcon class="w-4 h-4" />
                      </div>
                      <div class="flex items-center justify-center text-lg font-normal">
                        1
                      </div>
                      <div
                        class="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-[#0167F3] hover:bg-gray-100 rounded-full">
                        <PlusIcon class="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  93 000 so'm
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="flex items-center justify-center">
                    <TrashIcon class="w-6 h-6 text-rose-500 cursor-pointer transform hover:scale-105" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="bg-white rounded-lg py-2 px-6">
      <div class="border-b py-2">
        <h3 class="text-xl font-semibold">Harid tafsilotlari</h3>
      </div>
      <div class="border-b py-4">
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
      <div class="border-b py-3 space-y-1">
        <label class="text-base font-medium">Qabul qilingan to'lov</label>
        <money3 v-model="cost" v-bind="moneyConf" id="price"
          class="border-none text-right text-gray-500 bg-gray-100 rounded-lg w-full text-lg dark:text-gray-300 dark:bg-gray-900"> </money3>
      </div>
      <div class="py-3 space-y-1">
        <div class="text-base font-medium">To'lov turi</div>
        <div class="flex items-center space-x-4">
          <div class="flex-1 flex flex-col items-center justify-center bg-blue-50 border border-blue-300 rounded-lg py-4">
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

      <div class="py-4">
        <button class="w-full py-3 px-4 rounded-full text-white text-lg font-medium bg-blue-500 cursor-pointer hover:bg-blue-600">
          To'lov
        </button>
      </div>

    </div>


  </div>
</template>

<style scoped></style>