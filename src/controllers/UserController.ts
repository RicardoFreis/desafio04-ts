import { Request, Response } from 'express'
import { UserService } from '../services/UserService'

export class UserController {
    userService: UserService

    constructor(
        userService = new UserService()
    ){
        this.userService = userService
    }

    createUser = (request: Request, response: Response): Response => {
        const user = request.body

        if(!user.name){
            return response.status(400).json({ message: 'Bad request! Name obrigatório'})
        }

        if(typeof user.email !== 'string' || !user.email.trim()){
            return response.status(400).json({ message: 'Bad request! Email obrigatório'})
        }

        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)){
            return response.status(400).json({ message: 'Bad request! Email inválido'})
        }

        this.userService.createUser(user.name, user.email)
        return response.status(201).json({ message: 'Usuário criado'})
    }

    getAllUsers = (request: Request, response: Response) => {
        const users = this.userService.getAllUsers()
        return response.status(200).json( users )
    }

    deleteUser = (request: Request, response: Response): Response => {
        const email = request.body?.email

        if(typeof email !== 'string' || !email.trim()){
            return response.status(400).json({ message: 'Bad request! Email obrigatório'})
        }

        if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
            return response.status(400).json({ message: 'Bad request! Email inválido'})
        }

        const userDeleted = this.userService.deleteUser(email)

        if(!userDeleted){
            return response.status(404).json({ message: 'Usuário não encontrado'})
        }

        return response.status(200).json({ message: 'Usuário deletado'})
    }
}
