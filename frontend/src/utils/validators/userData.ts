export const passwordIsValid = (password: string) => {
  return password.length > 7
}

export const usernameIsValid = (username: string) => {
  return username.length > 2
}
