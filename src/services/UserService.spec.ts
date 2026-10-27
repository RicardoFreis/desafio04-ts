import { User, UserService } from "./UserService";

describe('UserService', () => {
    const mockDb: User[] = []
    const userService = new UserService(mockDb);

    it('Deve adicionar um novo usuário', () => {
        const mockConsole = jest.spyOn(global.console, 'log')
        userService.createUser('nath', 'nath@test.com');
        expect(mockConsole).toHaveBeenCalledWith('DB atualizado', mockDb)
    })

    it('Deve deletar um usuário pelo email', () => {
        const database: User[] = [{ name: 'Nath', email: 'nath@test.com' }]
        const service = new UserService(database)

        expect(service.deleteUser('nath@test.com')).toBe(true)
        expect(database).toEqual([])
    })

    it('Deve retornar false caso o usuário não exista', () => {
        const database: User[] = []
        const service = new UserService(database)

        expect(service.deleteUser('nath@test.com')).toBe(false)
        expect(database).toEqual([])
    })
})
