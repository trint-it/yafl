import * as React from 'react'
// import { Form, Section, Field, Repeat, Gizmo } from '../index'
import { createFormContext } from '../src/index'
const { Form, Section, Field, Repeat, connect } = createFormContext()
import renderer from 'react-test-renderer'
const initialValue = {
  firstName: 'John',
  lastName: 'Woodcock',
  age: 30,
  contact: {
    tel: '983838333'
  },
  friends: ['stuart', 'oumar']
  // hobbies: [{ type: 'art', name: 'print making' }, undefined, undefined]
}

const defaultValue = {
  firstName: '',
  lastName: '',
  age: 0,
  contact: {
    tel: '',
    email: 'asdf@testing.com'
  }
  // friends: [],
  // hobbies: []
}

function TextInput(props: any) {
  return (
    <div>
      <label>{props.label}</label>
      <input {...props.input} />
    </div>
  )
}

const TestForm = connect(({ yafl, children, ...props }) => (
  <form onSubmit={yafl.submit}>
    {children}
    <pre>{JSON.stringify(yafl, null, 2)}</pre>
  </form>
))

describe('Form', () => {
  it('should render correctly', () => {
    const tree = renderer
      .create(
        <Form initialValue={initialValue} defaultValue={defaultValue} onSubmit={() => {}}>
          <TestForm>
            <Field name="firstName" label="First Name" component={TextInput} />
            <Section name="contact">
              <Field name="tel" label="First Name" component={TextInput} />
              <Field name="email" label="Email Address" component={TextInput} />
            </Section>
            <Repeat<{ type: string; name: string }>
              name="hobbies"
              fallback={[{ type: 'art', name: 'print making' }, undefined, undefined] as any}
            >
              {hobbies => {
                return hobbies.map((value, i) => {
                  return (
                    <Section name={i} key={i} fallback={{ type: 'new', name: 'new' }}>
                      <Field name="type" label="Type of hobby" component={TextInput} />
                      <Field name="name" label="Name of hobby" component={TextInput} />
                    </Section>
                  )
                })
              }}
            </Repeat>
          </TestForm>
        </Form>
      )
      .toJSON()
    expect(tree).toMatchSnapshot()
  })
})
