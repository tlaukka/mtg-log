import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'
import Icons from './Icon'
import LinkButton from './LinkButton'
import TextInput from './TextInput'

const priceInputRegExp = new RegExp(/^([0-9]*)(\.?[0-9]{0,2})$/)

function PriceInput ({ value = '', disabled, isReadOnly, editInline, onChange, ...rest }) {
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

  function onKeyDown (e) {
    if (e.key === 'Enter') {
      acceptChange()
    }

    if (e.key === 'Escape') {
      declineChange()
    }
  }

  function onTriggerClick () {
    if (!isReadOnly) {
      setInputVisible(!inputVisible)
    }
  }

  function handleChange (e) {
    if (priceInputRegExp.test(e.target.value)) {
      setInternalValue(e.target.value)
    }
  }

  function onBlur () {
    if (internalValue.length === 0) {
      declineChange()
    } else {
      acceptChange()
    }
  }

  function handleAccept (e) {
    e.stopPropagation()
    acceptChange()
  }

  function acceptChange () {
    let finalValue = internalValue

    if ((internalValue === '.') || (internalValue === '') || (internalValue.match(/^0+$/))) {
      finalValue = `0${internalValue}00`
    } else if (internalValue.startsWith('.')) {
      finalValue = `0${internalValue}`
    } else if (internalValue.endsWith('.')) {
      finalValue = `${internalValue}00`
    } else if (!internalValue.includes('.')) {
      finalValue = `${internalValue}.00`
    } else if (!internalValue.match(/(\.[0-9]{2})$/)) {
      finalValue = `${internalValue}0`
    }

    finalValue = finalValue.replace(/^0*/, '')

    onChange && onChange(finalValue)
    setInternalValue(finalValue)
    setInputVisible(false)
  }

  function renderEditInput () {
    if (editInline) {
      return (
        <InlineEditInput
          autoFocus
          value={internalValue}
          valueLength={value.length}
          onFocus={(e) => e.target.select()}
          // onBlur={() => acceptChange()}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          onChange={handleChange}
        />
      )
    }

    return (
      <PriceInputPopupContainer>
        <CurrencySymbol>€</CurrencySymbol>
        <PriceInputPopupInput
          autoFocus
          value={internalValue}
          onFocus={(e) => e.target.select()}
          onKeyDown={onKeyDown}
          onChange={handleChange}
        />
        <LinkButton.Accept onClick={handleAccept}><Icons.Check /></LinkButton.Accept>
        <LinkButton.Danger onClick={declineChange}><Icons.Cross /></LinkButton.Danger>
      </PriceInputPopupContainer>
    )
  }

  return (
    <PriceInputContainer ref={container} disabled={disabled} {...rest}>
      <PriceInputTrigger
        readOnly
        isReadOnly={isReadOnly}
        disabled={disabled}
        value={value}
        placeholder={disabled ? '-.--' : '0.00'}
        onClick={onTriggerClick}
      />
      {inputVisible && renderEditInput()}
    </PriceInputContainer>
  )
}

const PriceInputContainer = styled('div')({
  display: 'flex',
  justifyContent: 'right',
  alignItems: 'center',
  position: 'relative'
}, ({ disabled }) => ({
  ':after': {
    content: '"€"',
    fontFamily: 'Lucida Console',
    fontSize: 12,
    display: 'inline',
    marginLeft: 4,
    color: disabled ? Colors.borderLight : Colors.control
  }
}))

const PriceInputTrigger = styled('input')({
  fontFamily: 'Lucida Console',
  boxSizing: 'border-box',
  fontSize: 12,
  textAlign: 'center',
  position: 'relative',
  minWidth: 4 * 7.23,
  height: 16,
  margin: 0,
  padding: 0,
  outline: 'none',
  borderTop: 'none',
  borderRight: 'none',
  borderLeft: 'none',
  borderBottom: `1px solid ${Colors.borderLight}`,
  color: Colors.control,
  backgroundColor: 'transparent'
}, ({ value = '', isReadOnly, disabled }) => ({
  cursor: disabled ? 'default' : isReadOnly ? 'text' : 'pointer',
  width: value.length * 7.23,
  ':hover': {
    borderColor: (disabled || isReadOnly) ? Colors.borderLight : Colors.control
  }
}))

const InlineEditInput = styled(PriceInputTrigger)({
  cursor: 'text',
  textAlign: 'left',
  position: 'absolute',
  left: 0,
  backgroundColor: 'black'
}, ({ valueLength }) => ({
  width: valueLength * 7.23
}))

const PriceInputPopupContainer = styled('div')({
  boxSizing: 'border-box',
  display: 'flex',
  fontSize: 12,
  position: 'absolute',
  top: -38,
  left: 0,
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
    left: 4,
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
