<script setup>
import { useModalStore } from '../../store/modal.store'
import { useBarcodeStore } from '../../store/barcode.store'
import XIcon from '../../assets/icons/XIcon.vue'
import CameraRotateIcon from '../../assets/icons/CameraRotateIcon.vue'
import LightningIcon from '../../assets/icons/LightningIcon.vue'
import LightningSlashIcon from '../../assets/icons/LightningSlashIcon.vue'
import SmartphoneRotateIcon from '../../assets/icons/SmartphoneRotateIcon.vue'
import CameraRotateLinearIcon from '../../assets/icons/CameraRotateLinearIcon.vue'
import CornersOutIcon from '../../assets/icons/CornersOutIcon.vue'
import ClockIcon from '../../assets/icons/ClockIcon.vue'
import { StreamBarcodeReader } from '@teckel/vue-barcode-reader'
import { ref, watch } from 'vue';

const loaded = ref(false)
const torch = ref(false)
const hasTorch = ref(false)
const landscape = ref(false)
const videoDevices = ref({})
const deviceIndex = ref(null)

const barcodeScannedAudio = new Audio('/audios/barcode-scanned.mp3')
const isMobile = navigator?.userAgentData?.mobile || navigator?.platform === 'iPad' || navigator?.platform === 'iPhone'
const isAndroid = navigator?.userAgentData?.platform === 'Android'
const isChrome = navigator?.userAgentData?.brands.findIndex(brand => brand.brand === 'Google Chrome' || brand.brand === 'Chromium') !== -1

const onDecode = (decodedText) => {
    console.log('Barcode scanned:', decodedText)
    useBarcodeStore().setDecodedBarcode(decodedText)
    barcodeScannedAudio.play()
    useModalStore().closeCameraScannerModal()
}

const onLoaded = () => {
    loaded.value = true
    console.log('loaded')
}

const onResult = (result) => {
    console.log('Result:', result)
}

const lightning = () => {
    torch.value = !torch.value
}

const screenRotate = () => {
    landscape.value = !landscape.value
}

const switchInputDevice = () => {
    const length = videoDevices.value?.devices?.length
    if (deviceIndex.value >= 0 && length.value > 1) {
        loaded.value = false
        deviceIndex.value = deviceIndex.value + 1 >= length ? 0 : deviceIndex.value + 1
    }
}

watch(
    () => videoDevices.value.selectedIndex,
    (data) => {
        if (data && loaded.value) {
            deviceIndex.value = videoDevices.value?.selectedIndex
            console.log("xxx" + videoDevices.value?.selectedIndex);
        }
    },
    { deep: true }
)
</script>

<template>
    <div v-if="useModalStore().isOpenCameraScannerModal"
        class="fixed flex flex-col items-center space-y-4 justify-center top-0 left-0 bottom-0 right-0 bg-black w-full h-screen z-[1000]">
        <div class="absolute top-0 left-0 w-full flex items-center justify-between px-4 py-3">
            <div class="text-white text-lg">Shtrix kod skanerlanmoqda...</div>
            <button @click="useModalStore().closeCameraScannerModal()"
                class="text-gray-600 bg-gray-100 hover:bg-gray-800 hover:text-gray-300 transition-all duration-300 rounded-full text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <XIcon />
            </button>
        </div>

        <div class="flex items-center justify-center space-x-4">
            <!-- camera rotate -->
            <div v-if="videoDevices?.devices?.length < 2" class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full">
                <CameraRotateIcon class="w-7 h-7 text-gray-700" />
            </div>
            <div v-else @click="switchInputDevice()" class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full cursor-pointer">
                <CameraRotateIcon class="w-7 h-7 text-white" />
            </div>
            <!-- focus -->
            <div class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full cursor-pointer">
                <CornersOutIcon class="w-7 h-7 text-gray-700" />
            </div>
            <!-- rotate -->
            <div v-if="!landscape" class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full">
                <SmartphoneRotateIcon class="w-7 h-7 text-gray-700" />
            </div>
            <div v-else-if="landscape" @click="screenRotate()" class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full cursor-pointer">
                <SmartphoneRotateIcon class="w-7 h-7 text-white" />
            </div>
            <!-- lightning -->
            <div v-if="!hasTorch" class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full">
                <LightningIcon class="w-7 h-7 text-gray-700" />
            </div>
            <div v-else-if="hasTorch && torch" @click="lightning()" class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full cursor-pointer">
                <LightningIcon v-if="torch" class="w-7 h-7 text-white" />
                <LightningSlashIcon v-else class="w-7 h-7 text-white" />
            </div>
        </div>
        <!-- <div class="text-white">
            ss {{ videoDevices }} aa
        </div> -->
        <div class="flex items-center justify-center">
            <StreamBarcodeReader v-model:videoDevices="videoDevices" v-model:hasTorch="hasTorch" :landscape="landscape" :torch="torch" @decode="onDecode" @loaded="onLoaded" />
        </div>

    </div>
</template>

<style scoped></style>