import * as React from 'react'
import { render, fireEvent } from 'react-testing-library'
import { createFormContext, FormProps, FormConfig } from '../src'

interface Props<T extends object> {
  initialProps: Partial<FormConfig<T>>
  children: (state: State<T>, setProps: (setFn: SetProps<T>) => void) => React.ReactNode
}

type SetProps<T extends object> =
  | ((prev: Partial<FormConfig<T>>) => Partial<FormConfig<T>>)
  | Partial<FormConfig<T>>

interface State<T extends object> extends Partial<FormConfig<T>> {}

export function createDataSetter<T extends object>() {
  const { Form, Section, Field, Repeat } = createFormContext<T>()
  class DataSetter extends React.Component<Props<T>, State<T>> {
    constructor(props: Props<T>) {
      super(props)

      this.state = { ...props.initialProps }
    }

    setProps = (setFn: SetProps<T>) => {
      this.setState(setFn)
    }

    render() {
      return this.props.children(this.state, this.setProps)
    }
  }

  function noop(e: T, props: FormProps<T>) {}
  function renderForm(initialProps: Partial<FormConfig<T>> = {}, ui: React.ReactNode = null) {
    let injected: FormProps<T>
    let setPropsFn: (prev: SetProps<T>) => void
    let containerState: State<T>
    let renderCount: number = 0

    return {
      getRenderCount(): number {
        return renderCount
      },
      getFormProps(): FormProps<T> {
        return injected
      },
      setFormConfig(setFn: SetProps<T>): void {
        setPropsFn(setFn)
      },
      getFormConfig(): State<T> {
        return containerState
      },
      ...render(
        <DataSetter initialProps={initialProps}>
          {(state, setFn) => {
            containerState = state
            setPropsFn = setFn
            return (
              <Form onSubmit={noop} {...state as any}>
                {props => {
                  renderCount = renderCount + 1
                  injected = props
                  return ui
                }}
              </Form>
            )
          }}
        </DataSetter>
      )
    }
  }

  return {
    renderForm,
    Form,
    Section,
    Field,
    Repeat
  }
}

export function createFormRenderer<T extends object>() {
  const { Form, Section, Field, Repeat, ForwardProps, useYaflContext } = createFormContext<T>()
  function noop(e: T, props: FormProps<T>) {}
  function renderForm(
    props: Partial<FormConfig<T>> = {},
    ui: React.ReactNode | ((props: FormProps<T>) => React.ReactNode) = null
  ) {
    let injected: FormProps<T>
    let renderCount: number = 0
    const { onSubmit = noop } = props
    return {
      getRenderCount(): number {
        return renderCount
      },
      getFormProps(): FormProps<T> {
        return injected
      },
      ...render(
        <Form onSubmit={onSubmit} {...props as any}>
          {props => {
            renderCount = renderCount + 1
            injected = props
            return typeof ui === 'function' ? ui(props) : ui
          }}
        </Form>
      )
    }
  }

  return {
    Form,
    ForwardProps,
    renderForm,
    Section,
    Field,
    Repeat,
    useYaflContext
  }
}

const createChangeEvent = (value: string | number) => ({ target: { value } })

interface ISelectionController<T extends Element> {
  change: (value: string | number) => ISelectionController<T>
  focus: () => ISelectionController<T>
  blur: () => ISelectionController<T>
  click: () => ISelectionController<T>
  current: T
}

type ISelectors<TShape extends { [key: string]: () => Element }> = {
  [K in keyof TShape]: ISelectionController<ReturnType<TShape[K]>>
}

export class Selection<TShape extends { [key: string]: () => Element }> {
  private selectors: ISelectors<TShape>
  static create<TShape extends { [key: string]: () => Element }>(selectors: TShape) {
    return new Selection<TShape>(selectors)
  }

  constructor(selectors: TShape) {
    this.selectors = Object.keys(selectors).reduce(
      (ret, key: keyof TShape) => {
        ret[key] = SelectionController.create(selectors[key])
        return ret
      },
      {} as ISelectors<TShape>
    )
  }

  element<K extends keyof TShape>(key: K): ISelectors<TShape>[K] {
    return this.selectors[key]
  }
}

export class SelectionController<T extends Element> implements ISelectionController<T> {
  query: () => T
  private constructor(query: () => Element) {
    this.query = query as () => T
  }

  static create<T extends Element>(query: () => Element) {
    return new SelectionController<T>(query)
  }

  get current() {
    return this.query()
  }

  change(value: string | number) {
    fireEvent.change(this.query(), createChangeEvent(value))
    return this
  }

  click() {
    fireEvent.click(this.query())
    return this
  }

  focus() {
    fireEvent.focus(this.query())
    return this
  }

  blur() {
    fireEvent.blur(this.query())
    return this
  }
}

interface ToggleRenderProps {
  toggle: () => void
  value: boolean
}

interface TogglerConfig {
  initialValue?: boolean
  children: (props: ToggleRenderProps) => React.ReactElement
}

export const Toggler: React.FC<TogglerConfig> = ({ children, initialValue = false }) => {
  const [value, setToggled] = React.useState(initialValue)
  const toggle = () => setToggled(!value)
  return children({ toggle, value })
}
