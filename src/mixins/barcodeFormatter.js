export default function isBarcode(str) {
    const ean13Regex = /^\d{13}$/;
    const ean8Regex = /^\d{8}$/;
    const itf14Regex = /^\d{14}$/;
    
    if (ean13Regex.test(str) || ean8Regex.test(str) || itf14Regex.test(str)) {
        return true
    } else {
        return false
    }
  }
  