import styled from "@emotion/styled";
import Colors from "./Colors";

const Tag = styled('div')({
  boxSizing: 'border-box',
  fontSize: 12,
  fontWeight: 'bold',
  textTransform: 'uppercase',
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  minWidth: 36,
  height: 18,
  padding: '0px 6px',
  borderRadius: 3,
  color: '#15171B'
}, ({ background = Colors.control }) => ({
  background
}))

export default Tag
