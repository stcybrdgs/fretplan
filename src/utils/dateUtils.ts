// utils/dateUtils.ts
export const getLocalDateString = (date: Date): string => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export const getMillisecondsSinceLocalMidnight = (date: Date): number => {
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  const milliseconds = date.getMilliseconds()

  return (hours * 3600 + minutes * 60 + seconds) * 1000 + milliseconds
}
