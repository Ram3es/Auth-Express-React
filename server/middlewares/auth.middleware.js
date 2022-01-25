import { ApiError } from "../exceptions/api-exceptions.js"
import tokenService from "../services/token.service.js"

export default (req, res, next) => {
 try {
     const authorizationHeader= req.headers.authorization
     if(!authorizationHeader){
         next(ApiError.UnauthorizedError())
     }
     const token = authorizationHeader.split(" ")[1]
     if(!token){
        next(ApiError.UnauthorizedError())
     }
     const userData = tokenService.validateAccessToken(token)
     if(!userData){
        next(ApiError.UnauthorizedError())
     }
     req.user = userData
     next()
 } catch (e) {
     next(ApiError.UnauthorizedError())
 }
  
}