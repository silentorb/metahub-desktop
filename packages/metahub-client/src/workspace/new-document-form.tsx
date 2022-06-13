import React from 'react'
import { useFormik } from 'formik'

interface Props {
  onSubmit: (props: { name: string }) => void
}

export const NewDocumentForm = (props: Props) => {
  const formik = useFormik({
    initialValues: {
      name: '',
    },
    onSubmit: values => {
      props.onSubmit(values)
    }
  })

  return <form onSubmit={formik.handleSubmit}>
    <label htmlFor="name">Name</label>
    <input
      id="name"
      name="name"
      type="text"
      onChange={formik.handleChange}
      value={formik.values.name}
    />
    <button type="submit">Create</button>
  </form>
}
