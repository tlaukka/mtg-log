import styled from '@emotion/styled'
import React from 'react'
import Select, { selectStyles } from './Select'

const colors = [
  { value: 'c:red', label: 'Red' },
  { value: 'c:green', label: 'Green' },
  { value: 'c:Blue', label: 'Blue' },
  { value: 'c:white', label: 'White' },
  { value: 'c:black', label: 'Black' },
  { value: 'c:multicolor', label: 'Multicolor' },
  { value: 'c:colorless', label: 'Colorless' }
]

function ColorSelect ({ onChange, ...rest }) {
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
      isMulti
      styles={styles}
      options={colors}
      placeholder={'Color...'}
      // components={{ Option: CardSetOption, MultiValue: CardSetMultiValue }}
      onChange={onSelectChange}
    />
  )
}

// function CardSetOption (props) {
//   return (
//     <Select.Option {...props}>
//       {props.data.code && (
//         <Symbol className={`ss ss-${props.data.code}`} />
//       )}
//       {props.data.label}
//     </Select.Option>
//   )
// }

// function CardSetMultiValue (props) {
//   return (
//     <Select.MultiValue {...props}>
//       {props.data.code && (
//         <Symbol className={`ss ss-${props.data.code}`} />
//       )}
//       {props.data.label}
//     </Select.MultiValue>
//   )
// }

const styles = {
  ...selectStyles,
  container: (provided) => ({
    ...provided,
    flex: 1,
    // minWidth: 360,
    maxWidth: 400
  })
}

// const Symbol = styled('i')({
//   marginRight: 8
// })

export default ColorSelect
