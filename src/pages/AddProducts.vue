<script setup>
const formatIndex = (index) => {
  return index.toString().padStart(2, '0')
}
</script>

<template>
  <!-- add_products -->
  <div class="container mx-auto">
    <div class="overflow-auto border border-gray-200 rounded shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="font-medium bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-sm leading-4 tracking-wider text-center text-gray-500">SL No</th>
            <th scope="col" class="px-4 py-3 text-sm leading-4 tracking-wider text-left text-gray-500">Loan Money</th>
            <th scope="col" class="px-4 py-3 text-sm leading-4 tracking-wider text-left text-gray-500">Left to Repay</th>
            <th scope="col" class="px-4 py-3 text-sm leading-4 tracking-wider text-left text-gray-500">Duration</th>
            <th scope="col" class="px-4 py-3 text-sm leading-4 tracking-wider text-left text-gray-500">Interest rate</th>
            <th scope="col" class="px-4 py-3 text-sm leading-4 tracking-wider text-left text-gray-500">Insallment</th>
            <th scope="col" class="px-4 py-3 text-sm leading-4 tracking-wider text-left text-gray-500">Repay</th>
          </tr>
        </thead>
        <tbody class="font-medium bg-white divide-y divide-gray-200">
          <tr v-for="index in 8" :key="index">
            <td class="px-4 py-4 text-sm leading-5 text-center text-gray-900 whitespace-nowrap">{{ formatIndex(index) }}.</td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-gray-900">$100,000</td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-gray-900">
              <div>$40,500</div>
            </td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-gray-900">
              <div>8 Month</div>
            </td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-gray-900">
              <div>12%</div>
            </td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-gray-900">$2000 / month</td>
            <td class="flex w-24 h-8 my-4 rounded-3xl border-solid border-2 border-gray-500 text-gray-500 hover:border-indigo-500 hover:text-indigo-500 text-sm text-center">
              <button class="flex m-auto justify-center items-center">Repay</button>
            </td>
          </tr>
          <tr>
            <td class="text-center px-4 py-4 text-sm leading-5 text-red-600">Total</td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-red-600">$125,0000</td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-red-600">$750,0000</td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-red-600"></td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-red-600"></td>
            <td class="px-4 py-4 text-sm leading-5 text-left text-red-600">$50,000 / month</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
