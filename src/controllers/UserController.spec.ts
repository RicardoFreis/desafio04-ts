import { beforeEach, describe, expect, it, jest } from '@jest/globals'
import { UserController } from "./UserController";
import { User, UserService } from '../services/UserService'
import { Request } from 'express'
import { makeMockResponse } from "../__mocks__/mockResponse.mock";

describe('UserController', () => {
    const mockGetAllUsers = jest.fn((): User[] => [])
    const mockUserService: Partial<UserService> = {
        createUser: jest.fn(),
        getAllUsers: mockGetAllUsers,
        deleteUser: jest.fn((email: string) => email === 'nath@test.com')
    }

    const userController = new UserController(mockUserService as UserService);

    beforeEach(() => {
        jest.clearAllMocks()
    })

    // Teste para adicionar um usuário.
    it('Deve adicionar um novo usuário', () => {
        const mockRequest = {
            body: {
                name: 'Nath',
                email: 'nath@test.com'
            }
        } as Request
        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(201)
        expect(mockResponse.state.json).toEqual({ message: 'Usuário criado' })
        expect(mockUserService.createUser).toHaveBeenCalledWith('Nath', 'nath@test.com')
    })

    // Teste para retornar erro caso não tenha sido enviado o nome.
    it('Deve retornar erro caso o nome não seja informado', () => {
        const mockRequest = {
            body: {
                email: 'nath@test.com'
            }
        } as Request
        const mockResponse = makeMockResponse()

        userController.createUser(mockRequest, mockResponse)

        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toEqual({
            message: 'Bad request! Name obrigatório'
        })
        expect(mockUserService.createUser).not.toHaveBeenCalled()
    })

    // Teste para retornar erro caso não tenha sido enviado o email.
    it('Deve retornar erro caso o email não seja informado', () => {
        const mockRequest = {
            body: {
                name: 'Nath'
            }
        } as Request
        const mockResponse = makeMockResponse()

        userController.createUser(mockRequest, mockResponse)

        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toEqual({
            message: 'Bad request! Email obrigatório'
        })
        expect(mockUserService.createUser).not.toHaveBeenCalled()
    })

    // Teste para retornar erro caso o email não esteja em um formato válido.
    it('Deve retornar erro caso o email seja inválido', () => {
        const mockRequest = {
            body: {
                name: 'Nath',
                email: 'email-invalido'
            }
        } as Request
        const mockResponse = makeMockResponse()

        userController.createUser(mockRequest, mockResponse)

        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toEqual({
            message: 'Bad request! Email inválido'
        })
        expect(mockUserService.createUser).not.toHaveBeenCalled()
    })

    //Teste caso não retorne um array de usuários
    it('Deve retornar todos os usuários', () => {
        const users = [{ name: 'Nath', email: 'nath@test.com' }]
        mockGetAllUsers.mockReturnValue(users)
        const mockRequest = {} as Request
        const mockResponse = makeMockResponse()

        userController.getAllUsers(mockRequest, mockResponse)

        expect(mockGetAllUsers).toHaveBeenCalledTimes(1)
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toEqual(users)
    })

    it('Deve deletar um usuário pelo email', () => {
        const mockRequest = {
            body: { email: 'nath@test.com' }
        } as Request
        const mockResponse = makeMockResponse()

        userController.deleteUser(mockRequest, mockResponse)

        expect(mockUserService.deleteUser).toHaveBeenCalledWith('nath@test.com')
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toEqual({ message: 'Usuário deletado' })
    })

    it('Deve retornar erro caso o email para exclusão não seja informado', () => {
        const mockRequest = {
            body: undefined
        } as Request
        const mockResponse = makeMockResponse()

        userController.deleteUser(mockRequest, mockResponse)

        expect(mockUserService.deleteUser).not.toHaveBeenCalled()
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toEqual({
            message: 'Bad request! Email obrigatório'
        })
    })

    it('Deve retornar erro caso o email para exclusão seja inválido', () => {
        const mockRequest = {
            body: { email: 'email-invalido' }
        } as Request
        const mockResponse = makeMockResponse()

        userController.deleteUser(mockRequest, mockResponse)

        expect(mockUserService.deleteUser).not.toHaveBeenCalled()
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toEqual({
            message: 'Bad request! Email inválido'
        })
    })

    it('Deve retornar erro caso o usuário não exista', () => {
        const mockRequest = {
            body: { email: 'outro@test.com' }
        } as Request
        const mockResponse = makeMockResponse()

        userController.deleteUser(mockRequest, mockResponse)

        expect(mockUserService.deleteUser).toHaveBeenCalledWith('outro@test.com')
        expect(mockResponse.state.status).toBe(404)
        expect(mockResponse.state.json).toEqual({
            message: 'Usuário não encontrado'
        })
    })
})
