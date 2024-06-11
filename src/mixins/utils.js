import jwt_decode from 'jwt-decode'

export default function decodeJwt(token) {
  return JSON.parse(window.atob(token.split('.')[1]))
}

export function cleanObjectEmptyFields(obj) {
  for (let propName in obj) {
    if (obj[propName] === undefined || obj[propName] === null || obj[propName] === '') {
      delete obj[propName]
    }
  }
  return obj
}

export function parseJwt() {
  let accessToken = JSON.parse(localStorage.getItem('session'))?.accessToken
  try {
    return jwt_decode(accessToken)
  } catch (err) {
    if (accessToken) {
      alert("Your token is not valid!")
      localStorage.clear()
      window.location.reload()
    } else {
      localStorage.clear()
      window.location.reload()
    }
  }

}

export function shortenNumber(num) {
  const suffixes = ['', 'K', 'M', 'B'];
  let suffixIndex = 0;

  while (num >= 1000 && suffixIndex < suffixes.length - 1) {
    num /= 1000;
    suffixIndex++;
  }

  return num.toLocaleString(undefined, {maximumFractionDigits: 1}) + suffixes[suffixIndex];
}

export function roundFloatToOneDecimal(num) {
  return parseFloat((num).toFixed(1))
}

export function roundFloatToTwoDecimal(num) {
  return parseFloat((num).toFixed(2))
}

//round to 5 decimal places
export function roundFloatToFourDecimal(num) {
  return parseFloat((num).toFixed(4))
}
