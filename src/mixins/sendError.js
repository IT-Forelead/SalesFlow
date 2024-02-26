import ErrorService from '../services/error.service.js'

export const sendError = (error)=>{
  return ErrorService.sendError({
    text: error?.message
  })
}