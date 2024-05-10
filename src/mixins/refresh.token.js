import { PublicAxiosService } from "../services/axios.service"

function removeItemsFromLocalStorage(keys) {
  return new Promise((resolve, reject) => {
      try {
          keys.forEach(key => localStorage.removeItem(key));
          resolve();
      } catch (error) {
          reject(error);
      }
  });
}

export async function refreshToken() {
  const oldSession = JSON.parse(localStorage.getItem('session'))
  try {
    /* REFRESH TOKEN REQUEST */
    const response = await PublicAxiosService.get('/auth/user/refresh', {
      headers: {
        Authorization: `Bearer ${oldSession?.refreshToken}`,
      },
    })

    const session = response?.data
    if (!session?.accessToken) {
      localStorage.removeItem('session')
      localStorage.removeItem('user')
    }

    localStorage.setItem('session', JSON.stringify(session))

    return session
  } catch (error) {
    if (error?.response?.status === 403) {
      alert("Your session has been expired!")
      removeItemsFromLocalStorage(['session', 'user'])
        .then(() => {
          window.location.reload()
        })
        .catch(error => {
          console.error("Error occurred while removing items from localStorage:", error);
        });
    }
  }
}
