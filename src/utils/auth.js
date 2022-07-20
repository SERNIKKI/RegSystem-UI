import db from '@/utils/localstorage'

export function getTokenName() {
  return db.get('TOKEN_NAME', '')
}

export function getTokenValue() {
  return db.get('TOKEN_VALUE', '')
}

export function getToken() {
  return db.get('TOKEN_VALUE', '')
}

export function getRefreshToken() {
  return db.get('REFRESH_TOKEN', '')
}

export function getExpireTime() {
  return db.get('EXPIRE_TIME', 0)
}

export function getRouteTokenExpireTime() {
  return db.get('ROUTE_TOKEN_EXPIRE_TIME', 0)
}

export function getRouteToken() {
  return db.get('ROUTE_TOKEN', '')
}

export function removeRouteToken() {
  return db.remove('ROUTE_TOKEN')
}
