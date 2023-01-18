import React, { FunctionComponent, useState } from 'react'
import { Input, Button } from '../../atoms'

const FormSearch: FunctionComponent = () => {
  const [name, setName] = useState<string>('')
  const [isSubmitting, setSubmitting] = useState(false)

  const handleSubmit = async (): Promise<void> => {
    setSubmitting(true)

    //  TODO - call lookup()

    setSubmitting(false)
  }

  return (
    <div>
      <Input placeHolder="Name to lookup" setValue={setName} value={name} />
      <Button
        title={'Search'}
        onClick={handleSubmit}
        disabled={!name || isSubmitting}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export { FormSearch }
