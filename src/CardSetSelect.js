import styled from '@emotion/styled'
import React from 'react'
import { useCardSets } from './Providers/CardSetProvider'
import Colors from './Colors'
import Select, { selectStyles } from './Select'

const CardSetSelect = React.forwardRef(({ onChange, ...rest }, ref) => {
  const { sets } = useCardSets()

  const options = React.useMemo(
    () => {
      const values = Object.values(sets)
      const result = []

      for (let i = values.length - 1; i >= 0; i--) {
        const set = values[i]

        result.push({
          value: `set:${set.code}`,
          label: set.name,
          code: set.code
        })
      }

      return result

      // return Object.values(sets).map((set) => {
      //   return {
      //     value: `set:${set.code}`,
      //     label: set.name,
      //     code: set.code
      //   }
      // })
    },
    [sets]
  )

  const onSelectChange = React.useCallback(
    (data) => {
      const value = data.map((entry) => entry.value)
      onChange && onChange(value)
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

// const styles = {
//   ...selectStyles,
//   container: (provided) => ({
//     ...provided,
//     flex: 1,
//     minWidth: 360,
//     maxWidth: 600
//   })
// }

export const styles = {
  container: (provided) => ({
    ...provided,
    // fontFamily: `'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif`,
    flex: 1,
    minWidth: 360,
    maxWidth: 600,
    borderBottom: `2px solid ${Colors.foregroundDark}`
  }),
  control: (provided) => ({
    ...provided,
    boxShadow: 'none',
    borderRadius: 0,
    border: 'none',
    backgroundColor: Colors.backgroundLight
    // backgroundColor: Colors.backgroundDark
  }),
  input: (provided) => ({
    ...provided,
    cursor: 'text',
    fontSize: 31,
    margin: 0,
    padding: 0,
    color: Colors.control
  }),
  valueContainer: (provided) => ({
    ...provided,
    flexWrap: 'nowrap',
    padding: 0,
  }),
  placeholder: (provided) => ({
    ...provided,
    fontSize: 31,
    color: Colors.foregroundDark
  }),
  multiValue: (provided) => ({
    ...provided,
    padding: 4,
    // borderRadius: 3,
    backgroundColor: Colors.backgroundLight
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    fontSize: 12,
    color: Colors.control
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    cursor: 'pointer',
    color: Colors.control,
    ':hover': {
      color: Colors.decline
    }
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 28,
    width: 38,
    height: 38,
    padding: 0,
    color: Colors.control,
    transition: 'none',
    ':hover': {
      color: Colors.accept
    }
  }),
  clearIndicator: (provided) => ({
    ...provided,
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 22,
    width: 38,
    height: 38,
    padding: 0,
    color: Colors.control,
    transition: 'none',
    ':hover': {
      color: Colors.decline
    }
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    backgroundColor: Colors.foregroundDark
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 10,
    backgroundColor: Colors.backgroundDark
  }),
  option: () => ({
    cursor: 'pointer',
    padding: '4px 8px',
    color: Colors.control,
    ':hover': {
      color: Colors.foregroundLight
    }
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: Colors.foregroundDark
  })
}

const Symbol = styled('i')({
  marginRight: 8
})

export default CardSetSelect
