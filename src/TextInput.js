import styled from "@emotion/styled"
import Colors from "./Colors"

const TextInput = styled('input')({
  fontSize: 13,
  padding: '8px 12px',
  borderRadius: 3,
  border: 'none',
  outline: 'none',
  color: Colors.control,
  backgroundColor: Colors.backgroundDark,
  '::placeholder': {
    color: Colors.foregroundDark
  }
})

export default TextInput
