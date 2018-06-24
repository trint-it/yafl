import * as React from 'react'
import { FormProvider, GeneralComponentConfig, GizmoConfig, GizmoProps } from './sharedTypes'
import isEqual from 'react-fast-compare'
import omit from 'lodash.omit'
import { DefaultFieldTypeKey } from './defaults'

const listenForProps: (keyof GeneralComponentConfig<any>)[] = [
  'type',
  'touched',
  'visited',
  'isDirty',
  'formValue',
  'formErrors',
  'fieldErrors',
  'submitCount',
  'activeField',
  'forwardProps',
  'componentTypes'
]

const propsToOmit: (keyof FormProvider<any>)[] = [
  'registeredFields',
  'unregisterField',
  'unregisterField',
  'unwrapFormState',
  'setActiveField',
  'registerField',
  'componentTypes',
  'initialMount',
  'setErrors',
  'value',
  'path'
]

function createGizmo<F extends object>() {
  return class extends React.Component<GeneralComponentConfig<F>> {
    constructor(props: GeneralComponentConfig<F>) {
      super(props)
      this.collectProps = this.collectProps.bind(this)
    }

    shouldComponentUpdate(np: GeneralComponentConfig<F>) {
      return listenForProps.some(key => !isEqual(this.props[key], np[key]))
    }

    collectProps(): GizmoProps<F> {
      const {
        type,
        render,
        children,
        allErrors,
        forwardProps,
        component: Component,
        componentTypes,
        ...props
      } = this.props
      return { errors: allErrors, ...props, ...forwardProps }
    }

    render() {
      const { render, component: Component, componentTypes, type } = this.props

      const props = this.collectProps()

      if (render) {
        return render(props)
      }

      if (Component) {
        return <Component {...props} />
      }

      const DefaultComponent = componentTypes[type]
      return <DefaultComponent {...props} />
    }
  }
}

export default function<F extends object>(Consumer: React.Consumer<FormProvider<F, F>>) {
  const InnerGizmo = createGizmo<F>()

  return class Gizmo extends React.Component<GizmoConfig<F>> {
    constructor(props: GizmoConfig<F>) {
      super(props)
      this._render = this._render.bind(this)
    }

    _render(incomingProps: FormProvider<F, F>) {
      const {
        render,
        component,
        children,
        type = DefaultFieldTypeKey,
        ...forwardProps
      } = this.props
      return (
        <InnerGizmo
          {...omit(incomingProps, propsToOmit) as GeneralComponentConfig<F>}
          type={type}
          render={render}
          component={component}
          forwardProps={forwardProps}
        />
      )
    }

    render() {
      return <Consumer>{this._render}</Consumer>
    }
  }
}
