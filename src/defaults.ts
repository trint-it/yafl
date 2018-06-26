import { FormProvider } from './sharedTypes'

// const { whyDidYouUpdate } = require('why-did-you-update')
// whyDidYouUpdate(React)

/* @internal */
export interface Noop {
  (): never
}

export function noop(): never {
  throw new Error('A <Field /> component can only appear inside a <Form /> component')
}

export function getDefaultProviderValue<F extends object, T>(): FormProvider<F, T> {
  return {
    path: [],
    value: {} as T,
    submitCount: 0,
    formIsValid: true,
    formIsDirty: false,
    initialMount: false,
    formIsTouched: false,
    formValue: {} as F,
    initialValue: {} as T,
    defaultValue: {} as T,
    componentTypes: {},
    activeField: null,
    touched: {},
    visited: {},
    errors: {},
    errorCount: 0,
    registeredFields: {},
    commonFieldProps: {},
    submit: noop,
    resetForm: noop,
    setValue: noop,
    clearForm: noop,
    setTouched: noop,
    setVisited: noop,
    touchField: noop,
    forgetState: noop,
    visitField: noop,
    setFormValue: noop,
    registerField: noop,
    registerError: noop,
    unregisterError: noop,
    setActiveField: noop,
    unregisterField: noop,
    unwrapFormState: noop
  }
}

export const DefaultFieldTypeKey = '__YAFLFieldComponentType__'
export const DefaultGizmoTypeKey = '__YAFLGizmoComponentType__'
