import jwt_decode from "jwt-decode";

export default function decodeJwt(token) {
  return JSON.parse(window.atob(token.split('.')[1]))
}

export function cleanObjectEmptyFields(obj) {
  for (let propName in obj) {
    if (!obj[propName]) {
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