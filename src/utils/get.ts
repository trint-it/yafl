import { Path } from '../sharedTypes'
import { isObject } from './checkType'
function baseGet<F>(obj: any, path: Path): F {
  if (path.length === 0 || !isObject(obj)) {
    return obj
  }
  const next = obj[path.shift() as string]
  return baseGet<F>(next, path)
}

export default function get<F>(obj: {}, path: Path | string, def?: any): F {
  const split = typeof path === 'string' ? path.split('.') : [...path]
  const result = baseGet<F>(obj, split)
  return result === undefined ? def : result
}
