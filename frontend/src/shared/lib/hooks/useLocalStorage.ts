import { useState, useEffect } from 'react'

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(
        `При чтении данных из localStorage возникла ошибка: ${key}`,
        error
      )
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(
        `При сохранение данных в localStorage возникла ошибка: ${key}`,
        error
      )
    }
  }, [key, value])

  return [value, setValue]
}
