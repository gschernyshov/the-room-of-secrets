export const generatePassword = (): string => {
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ' // без I, O
  const lowercase = 'abcdefghijkmnpqrstuvwxyz' // без l, o
  const digits = '23456789' // без 0, 1

  const allChars = uppercase + lowercase + digits
  let password = ''

  // Гарантируем хотя бы по одному символу из каждого набора
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += digits[Math.floor(Math.random() * digits.length)]

  // Остальные 3 символа случайные
  for (let i = 0; i < 3; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Перемешиваем символы, чтобы позиции были случайными
  return password
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('')
}
