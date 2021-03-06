import * as React from 'react'
import PropTypes from 'prop-types'
import { Path, FormProvider } from './sharedTypes'
import { useSafeContext } from './useSafeContext'
import { VALIDATOR_PATH_WARNING } from './warnings'
import warning from 'tiny-warning'

export type InnerValidatorProps = FormProvider<any> & {
  msg: string
}

export const InnerError: React.FC<InnerValidatorProps> = props => {
  const { msg, path, registerError, unregisterError } = props
  React.useEffect(() => {
    registerError(path, msg)
    return () => unregisterError(path, msg)
  }, [])

  return null
}

export interface ValidatorProps {
  msg?: string | null | void
  path: Path
}

export default function createValidator(ctx: React.Context<FormProvider<any, any> | Symbol>) {
  const Validator: React.FC<ValidatorProps> = props => {
    const yafl = useSafeContext(ctx)

    const { path = [], msg, children = null } = props

    if (process.env.NODE_ENV !== 'production') {
      warning(path.length > 0, VALIDATOR_PATH_WARNING)
    }

    if (typeof msg === 'string') {
      return <InnerError key={msg + path} {...yafl} msg={msg} path={path} />
    }

    return children as React.ReactElement<any>
  }

  Validator.propTypes /* remove-proptypes */ = {
    msg: PropTypes.string,
    path: PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.string.isRequired, PropTypes.number.isRequired]).isRequired
    ).isRequired
  }

  return Validator
}
