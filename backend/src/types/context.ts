export type AuthUser = {
  id: number
  usuario: string
}

export type AppEnv = {
  Variables: {
    authUser: AuthUser
  }
}
