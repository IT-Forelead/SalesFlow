<script setup>
import { h } from 'vue'
import TotalProductIcon from '../assets/icons/TotalProductIcon.vue'
import VueTable from '../components/VueTable.vue'
import cars from '/public/cars.json'
import EditButton from '../components/buttons/EditButton.vue'
import DeleteButton from '../components/buttons/DeleteButton.vue'


const columnsCars = [
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: false,
  },
  {
    accessorKey: 'car_make',
    header: 'Mahsulot nomi',
  },
  {
    accessorKey: 'car_model',
    header: 'Mahsulot turi',
  },
  {
    accessorKey: 'car_year',
    header: 'Ishlan chiqarilgan sana',
  },
  {
    accessorKey: 'price',
    header: 'Narxi',
  },
  {
    accessorKey: 'edit',
    header: 'Amallar',
    cell: ({ row }) => h('button', { class: 'flex space-x-2' }, [
      h(EditButton, { id: row.original.id }),
      h(DeleteButton, { id: row.original.id }),
    ]),
    enableSorting: false,
  },
]
</script>

<template>
  <div class="container mx-auto">
    <div class="flex flex-row space-x-10 mb-5">
      <div class="flex items-center px-4 basis-1/4 h-32 bg-white rounded-3xl">
        <div class="flex items-center justify-center w-20 h-20 bg-violet-100 rounded-full">
          <TotalProductIcon class="w-8 h-8 text-blue-500" />
        </div>
        <div class="px-4 flex flex-col">
          <div class="text-slate-400 text-base font-normal">Umumiy mahsulotlar</div>
          <div class="text-neutral-800 text-xl font-semibold">50,000</div>
        </div>
      </div>
      <div class="flex items-center px-4 basis-1/4 h-32 bg-white rounded-3xl">
        <div class="flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full">
          <TotalProductIcon class="w-8 h-8 text-amber-400" />
        </div>
        <div class="px-4 flex flex-col">
          <div class="text-slate-400 text-base font-normal">Umumiy mahsulotlar</div>
          <div class="text-neutral-800 text-xl font-semibold">50,000</div>
        </div>
      </div>
      <div class="flex items-center px-4 basis-1/4 h-32 bg-white rounded-3xl">
        <div class="flex items-center justify-center w-20 h-20 bg-rose-100 rounded-full">
          <TotalProductIcon class="w-8 h-8 text-pink-400" />
        </div>
        <div class="px-4 flex flex-col">
          <div class="text-slate-400 text-base font-normal">Umumiy mahsulotlar</div>
          <div class="text-neutral-800 text-xl font-semibold">50,000</div>
        </div>
      </div>
      <div class="flex items-center px-4 basis-1/4 h-32 bg-white rounded-3xl">
        <div class="flex items-center justify-center w-20 h-20 bg-sky-100 rounded-full">
          <TotalProductIcon class="w-8 h-8 text-teal-400" />
        </div>
        <div class="px-4 flex flex-col">
          <div class="text-slate-400 text-base font-normal">Umumiy mahsulotlar</div>
          <div class="text-neutral-800 text-xl font-semibold">50,000</div>
        </div>
      </div>
    </div>
    <div class="overflow-auto border border-gray-200 bg-white rounded-3xl shadow">
      <VueTable :data="cars" :columns="columnsCars" />
    </div>
  </div>
</template>
