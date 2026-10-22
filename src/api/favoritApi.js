const API_KEY =
  import.meta.env.VITE_FAVORIT_KEY ||
  'A1234567-ABCD-1234-ABCD-ABC123456789'

const API_BASE = '/hsprice'

export function isEmptyGood(item) {
  if (!item || typeof item !== 'object') return true
  return !item.brand && !item.number && !item.name && !item.goodsID
}

export function parseApiError(data) {
  if (!data?.error) return null
  if (typeof data.error === 'string') return data.error
  if (Array.isArray(data.error)) return data.error.filter(Boolean).join('. ')
  if (typeof data.error === 'object') {
    return Object.values(data.error).filter(Boolean).join('. ')
  }
  return 'Неизвестная ошибка API'
}

export async function searchParts({ number, brand, analogues = false, signal }) {
  const params = new URLSearchParams({
    key: API_KEY,
    number,
  })

  if (brand) params.set('brand', brand)
  if (analogues) params.set('analogues', 'on')

  let response
  try {
    response = await fetch(`${API_BASE}/?${params.toString()}`, { signal })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new Error('Нет соединения с сервером. Проверьте сеть и повторите запрос.')
  }

  if (!response.ok) {
    throw new Error(`Сервер вернул ошибку (${response.status})`)
  }

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Не удалось разобрать ответ сервера')
  }

  const apiError = parseApiError(data)
  if (apiError) {
    throw new Error(apiError)
  }

  const goods = Array.isArray(data?.goods) ? data.goods : []
  return goods.filter((item) => !isEmptyGood(item))
}

export function uniqueBrands(goods) {
  const map = new Map()
  for (const item of goods) {
    if (!item.brand || map.has(item.brand)) continue
    map.set(item.brand, {
      brand: item.brand,
      name: item.name || '',
      number: item.number || '',
      count: item.count ?? 0,
    })
  }
  return [...map.values()]
}

export function flattenOffers(goods) {
  const rows = []

  for (const item of goods) {
    rows.push({ ...item, isAnalogue: false })
    for (const analogue of item.analogues || []) {
      if (isEmptyGood(analogue)) continue
      rows.push({ ...analogue, isAnalogue: true })
    }
  }

  return rows
}

export function getOfferPrice(item) {
  const warehouses = Array.isArray(item.warehouses) ? item.warehouses : []
  const prices = warehouses
    .map((warehouse) => warehouse.price)
    .filter((price) => typeof price === 'number' && price > 0)

  if (prices.length) {
    return Math.min(...prices)
  }

  return typeof item.price === 'number' && item.price > 0 ? item.price : null
}
