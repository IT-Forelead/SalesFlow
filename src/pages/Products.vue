<script setup>
import BarcodeIcon from "../assets/icons/BarcodeIcon.vue";

const formatIndex = (index) => {
  return index.toString().padStart(2, '0');
};
</script>

<template>
  <!-- add_products -->
  <div class="container mx-auto">
    <div class="overflow-auto border border-gray-200 rounded shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="font-medium bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-sm leading-4 tracking-wider text-center text-gray-500">SL No</th>
            <th scope="col" class="px-4 py-3 text-sm leading-4 tracking-wider text-left text-gray-500">Name</th>
            <th scope="col" class="px-4 py-3 text-sm leading-4 tracking-wider text-left text-gray-500">Barcode</th>
            
          </tr>
        </thead>
        <tbody class="font-medium bg-white divide-y divide-gray-200">
          <tr v-for="index in 8" :key="index">
            <td class="px-4 py-4 text-sm leading-5 text-center text-gray-900 whitespace-nowrap">{{ formatIndex(index) }}.</td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-gray-900">{{ 'product' + index }}</td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-gray-900">
              <BarcodeIcon class="h-6 w-6"/>
            </td>
           
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
