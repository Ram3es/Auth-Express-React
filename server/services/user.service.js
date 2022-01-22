import userModel from "../models/user.model" 

export class UserService {

    async createUser(dtoUser){
        const user = await userModel.create(dtoUser)
        return user
    } 
}