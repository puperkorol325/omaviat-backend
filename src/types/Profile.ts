export type Profile = {
    id: string,
    name: string,
    password: string,
    email: string,
    type: 'user' | 'mod' | 'admin'
}