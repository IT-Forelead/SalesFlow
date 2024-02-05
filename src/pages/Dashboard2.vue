<script setup>
import { computed } from 'vue';
import StoreIcon from '../assets/icons/StoreIcon.vue'
import TotalProductIcon from '../assets/icons/TotalProductIcon.vue'
import useMoneyFormatter from '../mixins/currencyFormatter';
import ImageIcon from '../assets/icons/ImageIcon.vue';

// Expenses Chart
const salesChartSeries = computed(() => [
    {
        name: 'Sotilgan',
        data: [3100000, 4050000, 2810000, 5179000, 4286000, 1090000, 6004000]
    }, {
        name: 'Sotib olingan',
        data: [1190000, 3250000, 4510000, 3260000, 3480000, 5240000, 4190000]
    }
])

const salesChartChartOptions = {
    legend: {
        labels: {
            colors: ['#8e8da4']
        },
    },
    chart: {
        height: 350,
        type: 'area',
        zoom: {
            enabled: false,
        },
        toolbar: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    xaxis: {
        type: 'datetime',
        labels: {
            style: {
                fontSize: '12px',
                colors: ['#8e8da4', '#8e8da4', '#8e8da4', '#8e8da4', '#8e8da4', '#8e8da4', '#8e8da4', '#8e8da4', '#8e8da4', '#8e8da4', '#8e8da4', '#8e8da4',],
            },
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: false,
        },
        categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
    },
    yaxis: {
        tickAmount: 6,
        floating: false,
        labels: {
            show: true,
            formatter: function (val) {
                return useMoneyFormatter(val)
            },
            style: {
                colors: '#8e8da4',
            },
            offsetY: 0,
            offsetX: 0,
        },
        axisBorder: {
            show: false,
        },
        axisTicks: {
            show: true,
        },
    },
    fill: {
        opacity: 0.5,
    },
    tooltip: {
        fixed: {
            enabled: false,
            position: 'topRight',
        },
    },
    grid: {
        yaxis: {
            lines: {
                offsetX: -30,
            },
        },
        padding: {
            left: 20,
        },
    },
}

</script>

<template>
    <div class="p-8 space-y-6">

        <!-- <div class="flex flex-row bg-slate-100x space-x-10 p-2 rounded-3xl">
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
        </div> -->

        <div class="flex space-x-4">
            <div class="flex-1 w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                <div class="flex items-center justify-between">
                    <div class="space-y-0.5">
                        <div class="text-xl font-semibold">Eng ko'p sotilgan mahsulotlar</div>
                        <div class="text-base text-gray-600">So'ngi bir haftalik statistika</div>
                    </div>
                    <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
                        <StoreIcon class="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <div class="divide-y divide-gray-100 dark:divide-gray-700">
                    <div class="flex items-center justify-between py-1.5">
                        <div class="flex items-center space-x-3">
                            <div class="bg-blue-600 w-4 h-4 rounded rotate-45"></div>
                            <div>
                                <div class="text-base font-semibold text-gray-800">
                                    Coca cola - ПЭТ бутылка 1,5 л.
                                </div>
                                <div class="text-sm text-gray-600">
                                    Narxi:
                                    <span class="text-gray-900">
                                        {{ useMoneyFormatter(13000) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="text-2xl font-bold">110</div>
                    </div>
                    <div class="flex items-center justify-between py-1.5">
                        <div class="flex items-center space-x-3">
                            <div class="bg-blue-600 w-4 h-4 rounded rotate-45"></div>
                            <div>
                                <div class="text-base font-semibold text-gray-800">
                                    Jacobs Monarch 300g
                                </div>
                                <div class="text-sm text-gray-600">
                                    Narxi:
                                    <span class="text-gray-900">
                                        {{ useMoneyFormatter(13000) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="text-2xl font-bold">72</div>
                    </div>
                    <div class="flex items-center justify-between py-1.5">
                        <div class="flex items-center space-x-3">
                            <div class="bg-blue-600 w-4 h-4 rounded rotate-45"></div>
                            <div>
                                <div class="text-base font-semibold text-gray-800">
                                    Frima 500g
                                </div>
                                <div class="text-sm text-gray-600">
                                    Narxi:
                                    <span class="text-gray-900">
                                        {{ useMoneyFormatter(13000) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="text-2xl font-bold">61</div>
                    </div>
                    <div class="flex items-center justify-between py-1.5">
                        <div class="flex items-center space-x-3">
                            <div class="bg-blue-600 w-4 h-4 rounded rotate-45"></div>
                            <div>
                                <div class="text-base font-semibold text-gray-800">
                                    Five Cвежая мята
                                </div>
                                <div class="text-sm text-gray-600">
                                    Narxi:
                                    <span class="text-gray-900">
                                        {{ useMoneyFormatter(13000) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="text-2xl font-bold">57</div>
                    </div>
                    <div class="flex items-center justify-between py-1.5">
                        <div class="flex items-center space-x-3">
                            <div class="bg-blue-600 w-4 h-4 rounded rotate-45"></div>
                            <div>
                                <div class="text-base font-semibold text-gray-800">
                                    Five Cвежая мята
                                </div>
                                <div class="text-sm text-gray-600">
                                    Narxi:
                                    <span class="text-gray-900">
                                        {{ useMoneyFormatter(13000) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div class="text-2xl font-bold">57</div>
                    </div>
                </div>
            </div>

            <div class="flex-1 flex flex-col space-y-2">
                <div class="flex-auto w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <div class="text-base text-gray-600">Do'kondagi ishchilar soni</div>
                            <div class="text-2xl font-semibold">3 ta</div>
                        </div>
                        <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
                            <StoreIcon class="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div class="flex-auto w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <div class="text-base text-gray-600">Do'kondagi barcha mahsulotlar soni</div>
                            <div class="text-2xl font-semibold">17 456 ta</div>
                        </div>
                        <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
                            <StoreIcon class="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>
                <div class="flex-auto w-full space-y-4 rounded-3xl bg-slate-50 p-5">
                    <div class="flex items-center justify-between">
                        <div class="space-y-0.5">
                            <div class="text-base text-gray-600">Do'kondagi barcha mahsulotlar soni</div>
                            <div class="text-2xl font-semibold">784,534,546 UZS</div>
                        </div>
                        <div class="flex items-center justify-center rounded-xl bg-blue-100 p-3">
                            <StoreIcon class="w-8 h-8 text-blue-600" />
                        </div>
                    </div>
                </div>
            </div>


        </div>
        <div class="flex space-x-4">
            <div class=" flex-1 bg-slate-50 rounded-3xl p-5">
                <div class="flex items-center justify-between px-2">
                    <div>
                        <div class="text-base font-bold text-gray-800">
                            Sotuvlar statistikasi
                        </div>
                        <div class="text-sm text-gray-600">
                            Sotuvlar statistikasi
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-xl bg-blue-100 p-2">
                        <StoreIcon class="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <apexchart type="area" height="320" :options="salesChartChartOptions" :series="salesChartSeries">
                </apexchart>
            </div>
            <div class="flex-1 bg-slate-50 rounded-3xl p-5">
                <div class="flex items-center justify-between px-2">
                    <div>
                        <div class="text-base font-bold text-gray-800">
                            Kassirlar statistikasi
                        </div>
                        <div class="text-sm text-gray-600">
                            Sotuvlar statistikasi
                        </div>
                    </div>
                    <div class="flex items-center justify-center rounded-xl bg-blue-100 p-2">
                        <StoreIcon class="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                <apexchart type="area" height="320" :options="salesChartChartOptions" :series="salesChartSeries">
                </apexchart>
            </div>
        </div>


    </div>
</template>