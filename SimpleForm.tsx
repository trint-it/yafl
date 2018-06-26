import * as React from 'react'
import { createFormContext } from './src/index'
import { Person, Contact } from './src/sharedTypes'

const { Form, Section, Repeat, Field } = createFormContext<Person>()

interface Guy {
  name: string
  friends: Array<Guy>
}

const Error: any = ''
const Required = ({ value, touched, children }) => {
  return touched && !value && <Error msg="Required">{children}</Error>
}

const MinLength = ({ value, touched }) => {
  return touched && value.length < 4 && <Error msg="Must be at least 4 characters" />
}

const GuyFields = props => {
  return (
    <Form initialValue={{} as Person} commonFieldProps={{ validateOn: 'blur' }}>
      <Repeat<Contact> name="contacts">
        {(value, utils) => {
          return value.map((contact, i) => {
            return (
              <Section<Contact> name={i}>
                <Field<string>
                  name="name"
                  parent={props.parent}
                  render={({ input, ...props }) => {
                    props.form.setFormValue({ age: 4 })
                    return (
                      <>
                        <TextInput {...input} />
                        <Required {...input} {...props}>
                          <MinLength {...input} {...props} />
                        </Required>
                      </>
                    )
                  }}
                />
              </Section>
            )
          })

          // utils.push({ address: { code: '', street: '' }, tel: '' })
        }}
      </Repeat>
    </Form>
  )
}

class SimpleForm extends React.Component<any> {
  render() {
    return (
      <Form>
        <GuyFields />
      </Form>
    )
  }
}

function TextInput(props) {
  return (
    <div>
      <label>{props.forwardProps.label}</label>
      <input {...props.input} />
    </div>
  )
}
