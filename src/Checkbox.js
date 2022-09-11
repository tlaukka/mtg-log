import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'
import Icons from './Icon'

function Checkbox ({ checked, onChange, children, ...rest }) {
  const [isChecked, setIsChecked] = React.useState(checked)

  function handleChange () {
    setIsChecked((value) => !value)
    onChange && onChange(!isChecked)
  }

  return (
    <CheckboxContainer onClick={handleChange} {...rest}>
      <CheckboxInput>
        {isChecked && <Icons.Check />}
      </CheckboxInput>
      <CheckboxLabel>
        {children}
      </CheckboxLabel>
    </CheckboxContainer>
  )
}

const CheckboxContainer = styled('div')({
  cursor: 'pointer',
  display: 'flex',
  'label i': {
    marginRight: 8
  }
}, ({ disabled }) => ({
  pointerEvents: disabled ? 'none' : 'auto',
  'div i': {
    filter: `brightness(${disabled ? 0.55 : 1}) grayscale(${disabled ? 1 : 0})`
  },
  label: {
    filter: `brightness(${disabled ? 0.55 : 1})`
  },
  'label i': {
    filter: `grayscale(${disabled ? 1 : 0})`
  }
}))

const CheckboxInput = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 24,
  height: 24,
  color: Colors.accept,
  backgroundColor: Colors.backgroundDark,
  ':hover': {
    color: Colors.acceptLight
  }
})

const CheckboxLabel = styled('label')({
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  padding: '0 8px',
  color: Colors.control,
  ':hover': {
    filter: 'brightness(1.1)'
  }
})

export default Checkbox
