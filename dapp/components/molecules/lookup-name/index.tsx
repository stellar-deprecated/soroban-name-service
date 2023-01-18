import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from 'react'
import { Button, Input, InputLabel } from '../../atoms'

interface LookupNameProps {
  name: string
  setName: Dispatch<SetStateAction<string>>
  handleLookup: () => void
}

const LookupName: FunctionComponent<LookupNameProps> = props => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    setIsSubmitting(true)
    await props.handleLookup()
    setIsSubmitting(false)
  }

  return (
    <div>
      <InputLabel text={'Enter a name'} />

      <Input setValue={props.setName} value={props.name} />

      <Button
        title={'Search'}
        onClick={submit}
        disabled={!props.name || isSubmitting}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export { LookupName }
