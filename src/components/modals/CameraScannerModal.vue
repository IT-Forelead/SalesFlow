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
const zoom = ref(1)
const hasZoom = ref(false)
const autofocus = ref(true)
const focusDistance = ref(0)
const hasTorch = ref(false)
const landscape = ref(false)
const hasAutofocus = ref(false)
const hasFocusDistance = ref(false)
const videoDevices = ref({})
const deviceIndex = ref(null)
const debounce = ref(false)
const debounceTimeout = ref(null)
const cameraDetails = ref({})

const barcodeScannedAudio = new Audio('/audios/barcode-scanned.mp3')
const isMobile = navigator?.userAgentData?.mobile || navigator?.platform === 'iPad' || navigator?.platform === 'iPhone'
const isAndroid = navigator?.userAgentData?.platform === 'Android'
const isChrome = navigator?.userAgentData?.brands.findIndex(brand => brand.brand === 'Google Chrome' || brand.brand === 'Chromium') !== -1

watch(
    () => hasAutofocus.value,
    () => {
        autofocus.value = hasAutofocus.value
    },
    { deep: true }
)

watch(
    () => focusDistance.value,
    () => {
        sliderMovement()
    },
    { deep: true }
)

watch(
    () => zoom.value,
    () => {
        sliderMovement()
    },
    { deep: true }
)

const sliderMovement = () => {
    if (!debounce.value) {
        debounce.value = true
        window.navigator?.vibrate?.(10)
        clearTimeout(debounceTimeout.value)
        debounceTimeout.value = setTimeout(() => {
            debounce.value = false
        }, 10)
    }
}

const onDecode = (decodedText) => {
    console.log('Barcode scanned:', decodedText)
    useBarcodeStore().setDecodedBarcode(decodedText)
    barcodeScannedAudio.play()
    useModalStore().closeCameraScannerModal()
}

const onLoaded = () => {
    loaded.value = true
    if (!hasAutofocus.value) {
        autofocus.value = false
    }
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
            <div class="text-white text-lg">Shtrix kod skanerlash</div>
            <button @click="useModalStore().closeCameraScannerModal()"
                class="text-gray-600 bg-gray-100 hover:bg-gray-800 hover:text-gray-300 transition-all duration-300 rounded-full text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <XIcon />
            </button>
        </div>
        <div class="flex items-center justify-center space-x-4">
            <!-- camera rotate -->
            <div v-if="videoDevices?.devices?.length < 2"
                class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full">
                <CameraRotateIcon class="w-7 h-7 text-gray-700" />
            </div>
            <div v-else @click="switchInputDevice()"
                class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full cursor-pointer">
                <CameraRotateIcon class="w-7 h-7 text-white" />
            </div>
            <!-- focus -->
            <div v-if="hasAutofocus && autofocus" @click="autofocus = !autofocus"
                class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full cursor-pointer">
                <CornersOutIcon class="w-7 h-7 text-white" />
            </div>
            <div v-else class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full">
                <CornersOutIcon class="w-7 h-7 text-gray-700" />
            </div>
            <!-- rotate -->
            <div v-if="!landscape" class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full">
                <SmartphoneRotateIcon class="w-7 h-7 text-gray-700" />
            </div>
            <div v-else-if="landscape" @click="screenRotate()"
                class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full cursor-pointer">
                <SmartphoneRotateIcon class="w-7 h-7 text-white" />
            </div>
            <!-- lightning -->
            <div v-if="hasTorch && torch" @click="lightning()"
                class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full cursor-pointer">
                <LightningIcon v-if="torch" class="w-7 h-7 text-white" />
                <LightningSlashIcon v-else class="w-7 h-7 text-white" />
            </div>
            <div v-else class="flex items-center justify-center bg-gray-950 w-12 h-12 rounded-full">
                <LightningIcon class="w-7 h-7 text-gray-700" />
            </div>
        </div>
        <div class="relative flex items-center justify-center">
            <StreamBarcodeReader v-model:videoDevices="videoDevices" v-model:hasFocusDistance="hasFocusDistance"
                v-model:hasAutofocus="hasAutofocus" v-model:hasTorch="hasTorch" v-model:hasZoom="hasZoom"
                v-model:cameraDetails="cameraDetails" :landscape="landscape" :torch="torch" :zoom="zoom"
                :autofocus="autofocus" :focus-distance="focusDistance" :device-index="deviceIndex"
                :ms-between-decoding="500" @decode="onDecode" @loaded="onLoaded" />
            <div v-if="!autofocus && hasFocusDistance && loaded" class="focus-container">
                <span>Focus</span>
                <input v-model="focusDistance" type="range" :min="hasFocusDistance.min || 0"
                    :max="Math.min(hasFocusDistance.max, 1) || 1" :step="hasFocusDistance.step || 0.1" />
            </div>
            <div v-if="hasZoom && loaded" class="zoom-container">
                <span>Zoom</span>
                <input v-model="zoom" type="range" :min="hasZoom.min || 1" :max="hasZoom.max || 2"
                    :step="hasZoom.step || 0.1" />
            </div>
        </div>

    </div>
</template>

<style scoped>
.zoom-container {
    position: absolute;
    z-index: 3;
    top: 50px;
    right: 0;
    width: 55px;
    color: white;
}

.focus-container {
    position: absolute;
    z-index: 3;
    top: 50px;
    left: 0;
    width: 55px;
    color: white;
}

.focus-container > span, .zoom-container > span {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    text-align: center;
}

.focus-container input[type="range"], .zoom-container input[type="range"] {
    transform: rotate(270deg);
    touch-action: none;
    width: 200px;
    height: 24px;
    position: absolute;
    left: -75px;
    top: 120px;
}
</style>