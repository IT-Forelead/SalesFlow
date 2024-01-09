<script setup>
import ImageIcon from '../assets/icons/ImageIcon.vue';
import MinusIcon from '../assets/icons/MinusIcon.vue';
import PlusIcon from '../assets/icons/PlusIcon.vue';
import TrashIcon from '../assets/icons/TrashIcon.vue';
import SearchIcon from '../assets/icons/SearchIcon.vue';


</script>

<template>
  <div class="grid grid-cols-3 gap-4">
    <div class="col-span-2">
      <div class="flex items-center justify-between">
        <div class="relative w-96">
          <div class="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
            <SearchIcon class="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </div>
          <input type="text" class="bg-white border border-gray-300 text-gray-900 text-md rounded focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 px-3 py-2  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Mahsulot nomi bo'yicha izlash...">
          <button type="button" class="absolute inset-y-0 right-0 px-3 bg-[#0167F3] text-white rounded-r">
            Izlash
          </button>
        </div>
      </div>

      <div class="inline-block min-w-full py-2 align-middle">
        <div class="overflow-hidden rounded-sm ring-1 ring-black ring-opacity-5">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-white">
              <tr>
                <th scope="col" class="p-3 text-lg font-semibold text-left text-gray-900">Mahsulot</th>
                <th scope="col" class="p-3 text-lg font-semibold text-center text-gray-900">Miqdori</th>
                <th scope="col" class="p-3 text-lg font-semibold text-center text-gray-900">Jami narxi</th>
                <th scope="col" class="p-3 text-lg font-semibold text-center text-gray-900">Amallar</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr>
                <td class="flex items-center px-3 py-2 space-x-3 whitespace-nowrap">
                  <div class="flex items-center justify-center bg-gray-100 w-12 h-12 rounded-md">
                    <ImageIcon class="text-gray-500 w-8 h-8" />
                  </div>
                  <div>
                    <div class="text-base font-semibold text-gray-800">Jacobs Monarch 500g</div>
                    <div class="text-base font-medium text-gray-500">Narxi: <span class="text-gray-700">158 000 so'm</span>
                    </div>
                  </div>
                </td>
                <td class="p-3 text-center whitespace-nowrap">
                  <div class="flex justify-center">
                    <div class="flex items-center justify-between w-28 rounded-full shadow">
                      <div class="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-[#0167F3] hover:bg-gray-100 rounded-full">
                        <MinusIcon class="w-4 h-4" />
                      </div>
                      <div class="flex items-center justify-center text-lg font-normal">
                        2
                      </div>
                      <div class="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-[#0167F3] hover:bg-gray-100 rounded-full">
                        <PlusIcon class="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </td>
                <td class="p-3 text-center whitespace-nowrap">
                  316 000 so'm
                </td>
                <td class="p-3 whitespace-nowrap">
                  <div class="flex justify-center">
                    <TrashIcon class="w-6 h-6 text-rose-500 cursor-pointer" />
                  </div>
                </td>
              </tr>
              <tr>
                <td class="flex items-center px-3 py-2 space-x-3 whitespace-nowrap">
                  <div class="flex items-center justify-center bg-gray-100 w-12 h-12 rounded-md">
                    <ImageIcon class="text-gray-500 w-8 h-8" />
                  </div>
                  <div>
                    <div class="text-base font-semibold text-gray-800">Frima 1kg</div>
                    <div class="text-base font-medium text-gray-500">Narxi: <span class="text-gray-700">93 000 so'm</span>
                    </div>
                  </div>
                </td>
                <td class="p-3 text-center whitespace-nowrap">
                  <div class="flex justify-center">
                    <div class="flex items-center justify-between w-28 rounded-full shadow">
                      <div class="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-[#0167F3] hover:bg-gray-100 rounded-full">
                        <MinusIcon class="w-4 h-4" />
                      </div>
                      <div class="flex items-center justify-center text-lg font-normal">
                        1
                      </div>
                      <div class="flex items-center justify-center w-8 h-8 text-gray-700 hover:text-[#0167F3] hover:bg-gray-100 rounded-full">
                        <PlusIcon class="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </td>
                <td class="p-3 text-center whitespace-nowrap">
                  93 000 so'm
                </td>
                <td class="p-3 whitespace-nowrap">
                  <div class="flex justify-center">
                    <TrashIcon class="w-6 h-6 text-rose-500 cursor-pointer" />
                  </div>
                </td>
              </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>


</div></template>

<style scoped></style>