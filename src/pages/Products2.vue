<script setup>
import FunnelIcon from "../assets/icons/FunnelIcon.vue";
import TrashIcon from "../assets/icons/TrashIcon.vue";
import PencilIcon from "../assets/icons/PencilIcon.vue";

</script>

<template>
  <div class="bg-white rounded-lg py-4 px-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-3xl font-bold dark:text-white">Mahsulotlar ro'yhati</h3>
      <div>
        <div class="select-none bg-gray-100 rounded-lg w-full p-2 px-5 flex items-center space-x-2 hover:bg-gray-200 cursor-pointer">
          <FunnelIcon class="w-5 h-5 text-gray-500" />
          <span>
            Filtr
          </span>
        </div>
      </div>
    </div>

    <div class="inline-block min-w-full py-2 align-middle">
        <div class="overflow-hidden rounded-lg border border-gray-200">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-3 py-2 text-base font-semibold text-center text-gray-900">№</th>
                <th scope="col" class="px-3 py-2 text-base font-semibold text-left text-gray-900">Nomi</th>
                <th scope="col" class="px-3 py-2 text-base font-semibold text-center text-gray-900">Barcode</th>
                <th scope="col" class="px-3 py-2 text-base font-semibold text-center text-gray-900">Amallar</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="index in 8" :key="index">
                <td class="text-center whitespace-nowrap">
                  {{ index }}
                </td>
                <td class="px-3 py-2 space-x-3 whitespace-nowrap">
                  <div class="text-base font-semibold text-gray-800">Jacobs Monarch, 500g</div>
                </td>
                <td class="px-3 py-2 text-center whitespace-nowrap">
                  4607001777281
                </td>
                <td class="px-3 py-2 whitespace-nowrap">
                  <div class="flex items-center justify-center space-x-2">
                    <div class="transform text-indigo-500  hover:scale-105 cursor-pointer">
                      <PencilIcon class="w-6 h-6" />
                    </div>
                    <div class="transform text-rose-500 hover:scale-105 cursor-pointer">
                      <TrashIcon class="w-6 h-6" />
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  </div>
</template>
