import { ApiError } from "../exceptions/api-exceptions.js"

export default  (err, req, res, next) =>{
    console.log(err, "**middleware**");
    if(err instanceof ApiError){
        return res.status(err.status).json({ message:err.message, errors: err.errors})
    }
    return res.status(500).json({message:" Непредвиденная ошибка"})


}