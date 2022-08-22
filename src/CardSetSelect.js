import styled from '@emotion/styled'
import React from 'react'
import { useCardSets } from './CardSetProvider'
import Select, { selectStyles } from './Select'

const CardSetSelect = React.forwardRef(({ onChange, ...rest }, ref) => {
  const { sets } = useCardSets()

  const options = React.useMemo(
    () => {
      return Object.values(sets).map((set) => {
        return {
          value: `set:${set.code}`,
          label: set.name,
          code: set.code
        }
      })
    },
    [sets]
  )

  const onSelectChange = React.useCallback(
    (data) => {
      const value = data.map((entry) => entry.value)
      onChange(value)
    },
    [onChange]
  )

  return (
    <Select
      {...rest}
      ref={ref}
      isMulti
      styles={styles}
      options={options}
      placeholder={'Sets...'}
      components={{ Option: CardSetOption, MultiValue: CardSetMultiValue }}
      onChange={onSelectChange}
    />
  )
})

function CardSetOption (props) {
  return (
    <Select.Option {...props}>
      {props.data.code && (
        <Symbol className={`ss ss-${props.data.code} ss-fw`} />
      )}
      {props.data.label}
    </Select.Option>
  )
}

function CardSetMultiValue (props) {
  return (
    <Select.MultiValue {...props}>
      {props.data.code && (
        <Symbol className={`ss ss-${props.data.code} ss-fw`} />
      )}
      {props.data.label}
    </Select.MultiValue>
  )
}

const styles = {
  ...selectStyles,
  container: (provided) => ({
    ...provided,
    flex: 1,
    minWidth: 360,
    maxWidth: 600
  })
}

const Symbol = styled('i')({
  marginRight: 8
})

export default CardSetSelect
