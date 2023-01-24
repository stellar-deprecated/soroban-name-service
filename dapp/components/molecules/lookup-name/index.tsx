import React, {
  Dispatch,
  FunctionComponent,
  SetStateAction,
  useState,
} from 'react'
import { Button, Input, InputLabel } from '../../atoms'

interface LookupNameProps {
  setName: Dispatch<SetStateAction<string>>
  handleLookup: (searchTerm: string) => void
}

const LookupName: FunctionComponent<LookupNameProps> = props => {
  const [nameInput, setNameInput] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = () => {
    setIsSubmitting(true)

    const formattedName = nameInput.replaceAll('.xlm', '')
    props.setName(formattedName)

    setTimeout(async () => {
      await props.handleLookup(formattedName)
    }, 1000)
  }

  return (
    <div>
      <InputLabel text={'Enter a name'} />

      <Input setValue={setNameInput} value={nameInput} />

      <Button
        title={'Search'}
        onClick={submit}
        disabled={!nameInput || isSubmitting}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export { LookupName }
