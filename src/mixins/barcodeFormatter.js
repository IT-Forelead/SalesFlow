export function isBarcode(str) {
    const ean13Regex = /^\d{13}$/;
    const ean8Regex = /^\d{8}$/;
    const itf14Regex = /^\d{14}$/;
    
    if (ean13Regex.test(str) || ean8Regex.test(str) || itf14Regex.test(str)) {
        return true
    } else {
        return false
    }
}

export function isBarcodeType(str) {
    const ean13Regex = /^\d{13}$/;
    const ean8Regex = /^\d{8}$/;
    const itf14Regex = /^\d{14}$/;
    
    if (ean13Regex.test(str)) {
        return 'ean13'
    } else if (ean8Regex.test(str)) {
        return 'ean8'
    } else if (itf14Regex.test(str)) {
        return 'itf14'
    } else {
        return '-'
    }
}