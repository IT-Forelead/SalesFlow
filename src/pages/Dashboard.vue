<script setup>
import TotalProductIcon from '../assets/icons/TotalProductIcon.vue'

</script>

<template>
    <div class="p-8">

        <div class="flex flex-row bg-slate-100c space-x-10 p-2 rounded-3xl">
            <div class="flex items-center px-4 basis-1/4 h-32 bg-white shadow rounded-3xl">
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

    </div>
</template>