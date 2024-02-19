<script setup>
import { useModalStore } from '../../store/modal.store'
import XIcon from '../../assets/icons/XIcon.vue'
import { StreamBarcodeReader } from "vue-barcode-reader";
import { ref, watch } from 'vue';

const decodedBarcode = ref('')

const onDecode = (decodedText) => {
    console.log('Barcode scanned:', decodedText)
    decodedBarcode.value = decodedText
}

const onLoaded = () => {
    console.log('loaded')
}

const onResult = (result) => {
    console.log('Result:', result)
}

</script>

<template>
    <div v-if="useModalStore().isOpenBarcodeScannerModal"
        class="fixed flex flex-col items-center space-y-4 justify-center top-0 left-0 bottom-0 right-0 bg-black w-full h-screen z-[1000]">
        <div class="absolute top-0 left-0 w-full flex items-center justify-between px-4 py-3">
            <div class="text-white text-lg">Shtrix kod skanerlanmoqda...</div>
            <button @click="useModalStore().closeBarcodeScannerModal()"
                class="text-gray-600 bg-gray-100 hover:bg-gray-800 hover:text-gray-300 transition-all duration-300 rounded-full text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
                <XIcon />
            </button>
        </div>
        <div class="flex items-center justify-center">
            <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded"></StreamBarcodeReader>
        </div>
        <div class="text-white">{{ decodedBarcode }}</div>
    </div>
</template>

<style scoped></style>