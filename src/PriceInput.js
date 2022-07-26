import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'
import Icons from './Icon'
import LinkButton from './LinkButton'
import TextInput from './TextInput'

const priceInputRegExp = new RegExp(/^([0-9]*)(\.?[0-9]{0,2})$/)

function PriceInput ({ value = '', onChange, ...rest }) {
  const container = React.useRef()

  const [inputVisible, setInputVisible] = React.useState(false)
  const [internalValue, setInternalValue] = React.useState(value)

  const declineChange = React.useCallback(
    () => {
      setInputVisible(false)
      setInternalValue(value)
    },
    [value]
  )

  React.useEffect(
    () => {
      function click (e) {
        if (container.current && !container.current.contains(e.target)) {
          declineChange()
        }
      }

      document.addEventListener('click', click)

      return () => {
        document.removeEventListener('click', click)
      }
    },
    [declineChange]
  )

  function onClick () {
    setInputVisible(!inputVisible)
  }

  function handleChange (e) {
    if (priceInputRegExp.test(e.target.value)) {
      setInternalValue(e.target.value)
    }
  }

  function acceptChange (e) {
    e.stopPropagation()
    onChange && onChange(internalValue)
    setInputVisible(false)
  }

  return (
    <PriceInputContainer ref={container} {...rest}>
      <PriceInputTrigger
        readOnly
        value={value}
        placeholder={'0.00'}
        onClick={onClick}
      />
      {inputVisible && (
        <PriceInputPopupContainer>
          <CurrencySymbol>€</CurrencySymbol>
          <PriceInputPopupInput
            autoFocus
            value={internalValue}
            onChange={handleChange}
          />
          <LinkButton.Accept onClick={acceptChange}><Icons.Check /></LinkButton.Accept>
          <LinkButton.Danger onClick={declineChange}><Icons.Cross /></LinkButton.Danger>
        </PriceInputPopupContainer>
      )}
    </PriceInputContainer>
  )
}

const PriceInputContainer = styled('div')({
  position: 'relative'
})

const PriceInputTrigger = styled('input')({
  cursor: 'pointer',
  boxSizing: 'border-box',
  fontSize: 12,
  position: 'relative',
  width: 62,
  height: 16,
  margin: 0,
  padding: '0 4px',
  outline: 'none',
  borderTop: 'none',
  borderRight: 'none',
  borderLeft: 'none',
  borderBottom: `1px solid ${Colors.borderDark}`,
  color: Colors.control,
  backgroundColor: 'transparent',
  ':hover': {
    borderColor: Colors.backgroundAccent
  }
})

const PriceInputPopupContainer = styled('div')({
  boxSizing: 'border-box',
  display: 'flex',
  fontSize: 12,
  position: 'absolute',
  top: -36,
  left: -22,
  margin: 0,
  padding: 4,
  borderRadius: 3,
  color: Colors.control,
  backgroundColor: Colors.backgroundLight,
  button: {
    lineHeight: '12px',
    height: 24,
    padding: '0 8px'
  },
  ':before': {
    content: '""',
    position: 'absolute',
    left: 44,
    bottom: -12,
    border: `6px solid ${Colors.borderLight}`,
    borderColor: `${Colors.backgroundLight} transparent transparent transparent`
  }
})

const PriceInputPopupInput = styled(TextInput)({
  width: 54,
  padding: 4
})

const CurrencySymbol = styled('span')({
  boxSizing: 'border-box',
  lineHeight: '24px',
  height: 24,
  paddingLeft: 4,
  paddingRight: 6,
  backgroundColor: Colors.backgroundLight
})

export default PriceInput
