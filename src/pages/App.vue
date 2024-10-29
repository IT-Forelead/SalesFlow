<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios'
import AndroidIcon from '../assets/icons/AndroidIcon.vue'

const browserDownloadUrl = ref('')

async function getSeleases() {
    await axios.get('https://api.github.com/repos/IT-Forelead/SalesFlowMobile/releases/latest')
        .then(async (res) => {
            browserDownloadUrl.value = res?.data?.assets[0]?.browser_download_url
            console.log("Chaque printed");
        }).catch((err) => {
            console.log("Chaque not printed");
        })
}

onMounted(() => {
    getSeleases()
})

</script>
<template>
    <div class="overflow-hidden py-10 sm:py-32 lg:pb-32 xl:pb-36">
        <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div class="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
                <div class="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
                    <div class="inline-flex space-x-2 items-center">
                        <img src="/images/logo.svg" class="w-12 h-12" alt="#">
                        <div class="text-4xl font-extrabold">
                            <span class="text-[#0167f3]">Sales</span>
                            <span class="dark:text-white">Flow</span>
                        </div>
                    </div>
                    <p class="mt-6 text-lg text-gray-600 dark:text-white">
                        Ushbu dastur yordamida mobil telefoninggiz orqali
                        market.iflead.uz tizimidagi ko'plab funksiyalardan foydalanishingiz mumkun.
                        Hozirda mobil dasturimiz faqat Android foydalanuvchilari uchgun mavjud.
                    </p>
                    <div class="mt-8 flex flex-wrap gap-x-6 gap-y-4">
                        <a class="flex items-center px-6 py-3 space-x-3 rounded-lg transition-colors bg-gray-800 text-white hover:bg-gray-900"
                            :href="browserDownloadUrl">
                            <AndroidIcon class="w-12 h-12" />
                            <div>
                                <span class="block text-xs">
                                    Download for
                                </span>
                                <span class="block text-xl font-semibold">
                                    Android
                                </span>
                            </div>
                        </a>
                    </div>
                </div>
                <div class="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
                    <div
                        class="absolute left-1/2 top-4 h-[1026px] w-[1026px] -translate-x-1/3 stroke-gray-300/70 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-top-16 lg:ml-12 xl:-top-14 xl:ml-0">
                        <svg viewBox="0 0 1026 1026" fill="none" aria-hidden="true"
                            class="absolute inset-0 h-full w-full animate-spin-slow">
                            <path
                                d="M1025 513c0 282.77-229.23 512-512 512S1 795.77 1 513 230.23 1 513 1s512 229.23 512 512Z"
                                stroke="#D4D4D4" stroke-opacity="0.7"></path>
                            <path d="M513 1025C230.23 1025 1 795.77 1 513" stroke="url(#:R65m:-gradient-1)"
                                stroke-linecap="round"></path>
                            <defs>
                                <lineargradient id=":R65m:-gradient-1" x1="1" y1="513" x2="1" y2="1025"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#06b6d4"></stop>
                                    <stop offset="1" stop-color="#06b6d4" stop-opacity="0"></stop>
                                </lineargradient>
                            </defs>
                        </svg>
                        <svg viewBox="0 0 1026 1026" fill="none" aria-hidden="true"
                            class="absolute inset-0 h-full w-full animate-spin-reverse-slower">
                            <path
                                d="M913 513c0 220.914-179.086 400-400 400S113 733.914 113 513s179.086-400 400-400 400 179.086 400 400Z"
                                stroke="#D4D4D4" stroke-opacity="0.7"></path>
                            <path d="M913 513c0 220.914-179.086 400-400 400" stroke="url(#:R65m:-gradient-2)"
                                stroke-linecap="round"></path>
                            <defs>
                                <lineargradient id=":R65m:-gradient-2" x1="913" y1="513" x2="913" y2="913"
                                    gradientUnits="userSpaceOnUse">
                                    <stop stop-color="#06b6d4"></stop>
                                    <stop offset="1" stop-color="#06b6d4" stop-opacity="0"></stop>
                                </lineargradient>
                            </defs>
                        </svg>
                    </div>
                    <div
                        class="-mx-4 h-[448px] px-9 [mask-image:linear-gradient(to_bottom,white_60%,transparent)] sm:mx-0 lg:absolute lg:-inset-x-10 lg:-top-10 lg:-bottom-20 lg:h-auto lg:px-0 lg:pt-10 xl:-bottom-32">
                        <div class="relative aspect-[366/729] mx-auto max-w-[366px]">
                            <div
                                class="absolute inset-y-[calc(1/729*100%)] right-[calc(5/729*100%)] left-[calc(7/729*100%)] rounded-[calc(58/366*100%)/calc(58/729*100%)] shadow-2xl">
                            </div>
                            <div
                                class="absolute top-[calc(23/729*100%)] left-[calc(23/366*100%)] grid h-[calc(686/729*100%)] w-[calc(318/366*100%)] transform grid-cols-1 overflow-hidden bg-gray-900 pt-[calc(23/318*100%)]">
                                <div class="flex flex-col">
                                    <div class="flex justify-between px-4 pt-4">
                                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
                                            class="h-6 w-6 flex-none">
                                            <path d="M5 6h14M5 18h14M5 12h14" stroke="#fff" stroke-width="2"
                                                stroke-linecap="round" stroke-linejoin="round"></path>
                                        </svg>
                                        <div class="flex space-x-1 items-center justify-center">
                                            <img src="/images/logo.svg" class="h-6" alt="#">
                                            <div class="text-lg font-extrabold">
                                                <span class="text-[#0167f3]">Sales</span>
                                                <span class="text-white">Flow</span>
                                            </div>
                                        </div>
                                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"
                                            class="h-6 w-6 flex-none">
                                            <path
                                                d="M15 8a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.696 19h10.608c1.175 0 2.08-.935 1.532-1.897C18.028 15.69 16.187 14 12 14s-6.028 1.689-6.836 3.103C4.616 18.065 5.521 19 6.696 19Z"
                                                stroke="#fff" stroke-width="2" stroke-linecap="round"
                                                stroke-linejoin="round"></path>
                                        </svg>
                                    </div>
                                    <div class="mt-6 flex-auto rounded-t-2xl bg-white dark:bg-slate-600">
                                        <div class="p-4">
                                            <div class="flex gap-2">
                                                <div class="text-base leading-6 dark:text-zinc-200">
                                                    Mahsulot qo'shish
                                                </div>
                                                <svg viewBox="0 0 24 24" class="ml-auto h-6 w-6" fill="none">
                                                    <path d="M5 12a7 7 0 1 1 14 0 7 7 0 0 1-14 0ZM12 9v6M15 12H9"
                                                        stroke="#171717" stroke-width="2" stroke-linecap="round"
                                                        stroke-linejoin="round"></path>
                                                </svg>
                                            </div>
                                            <div class="mt-3 border-t border-gray-200 pt-5">
                                                <div class="flex items-baseline gap-2">
                                                    <div class="text-2xl tabular-nums tracking-tight dark:text-zinc-200">
                                                        Shtrix-kod orqali mahsulot qo'shish
                                                    </div>
                                                </div>
                                                <div class="mt-6 text-xs text-gray-500 dark:text-zinc-300">
                                                    Shtrix-kodni skanerlash
                                                </div>
                                                <div class="mt-3 rounded-lg bg-gray-50 ring-1 ring-inset ring-black/5">
                                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-72 h-72" width="32"
                                                        height="32" viewBox="0 0 24 24">
                                                        <path fill="currentColor"
                                                            d="M1.5 20.5v-4h1v3h3v1zm17 0v-1h3v-3h1v4zM4 18V6h2v12zm3 0V6h1v12zm3 0V6h2v12zm3 0V6h3v12zm4 0V6h1v12zm2 0V6h1v12zM1.5 7.5v-4h4v1h-3v3zm20 0v-3h-3v-1h4v4z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <svg viewBox="0 0 366 729" aria-hidden="true"
                                class="pointer-events-none absolute inset-0 h-full w-full fill-gray-100">
                                <path fill="#F2F2F2" fill-rule="evenodd" clip-rule="evenodd"
                                    d="M300.092 1c41.22 0 63.223 21.99 63.223 63.213V184.94c-.173.184-.329.476-.458.851.188-.282.404-.547.647-.791.844-.073 2.496.257 2.496 2.157V268.719c-.406 2.023-2.605 2.023-2.605 2.023a7.119 7.119 0 0 1-.08-.102v394.462c0 41.213-22.001 63.212-63.223 63.212h-95.074c-.881-.468-2.474-.795-4.323-.838l-33.704-.005-.049.001h-.231l-.141-.001c-2.028 0-3.798.339-4.745.843H66.751c-41.223 0-63.223-21.995-63.223-63.208V287.739c-.402-.024-2.165-.23-2.524-2.02v-.973A2.039 2.039 0 0 1 1 284.62v-47.611c0-.042.001-.084.004-.126v-.726c0-1.9 1.652-2.23 2.496-2.157l.028.028v-16.289c-.402-.024-2.165-.23-2.524-2.02v-.973A2.039 2.039 0 0 1 1 214.62v-47.611c0-.042.001-.084.004-.126v-.726c0-1.9 1.652-2.23 2.496-2.157l.028.028v-26.041a2.26 2.26 0 0 0 .093-.236l-.064-.01a3.337 3.337 0 0 1-.72-.12l-.166-.028A2 2 0 0 1 1 135.62v-24.611a2 2 0 0 1 1.671-1.973l.857-.143v-44.68C3.528 22.99 25.53 1 66.75 1h233.341ZM3.952 234.516a5.481 5.481 0 0 0-.229-.278c.082.071.159.163.228.278Zm89.99-206.304A4.213 4.213 0 0 0 89.727 24H56.864C38.714 24 24 38.708 24 56.852v618.296C24 693.292 38.714 708 56.864 708h250.272c18.15 0 32.864-14.708 32.864-32.852V56.852C340 38.708 325.286 24 307.136 24h-32.864a4.212 4.212 0 0 0-4.213 4.212v2.527c0 10.235-8.3 18.532-18.539 18.532H112.48c-10.239 0-18.539-8.297-18.539-18.532v-2.527Z">
                                </path>
                                <rect x="154" y="29" width="56" height="5" rx="2.5" fill="#D4D4D4"></rect>
                            </svg>
                            <img alt="" src="/images/phone-frame.svg" width="366" height="729" decoding="async"
                                data-nimg="future" class="pointer-events-none absolute inset-0 h-full w-full"
                                style="color:transparent">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>