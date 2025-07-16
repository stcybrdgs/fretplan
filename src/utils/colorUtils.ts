// utils/colorUtils.ts
export const getColorClass = (color: string): string => {
  const colorMap = {
    red: 'bg-red-600',
    orange: 'bg-orange-600',
    yellow: 'bg-yellow-500',
    green: 'bg-green-600',
    teal: 'bg-teal-600',
    blue: 'bg-blue-600',
    indigo: 'bg-indigo-600',
    purple: 'bg-purple-600',
    pink: 'bg-pink-600',
    gray: 'bg-gray-600',
  }
  return colorMap[color as keyof typeof colorMap] || 'bg-purple-600'
}
