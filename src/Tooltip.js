import styled from "@emotion/styled"
import Colors from "./Colors"

const Tooltip = styled('div')(({ text }) => ({
  position: 'relative',
  ':before': {
    content: '"' + text + '"',
    position: 'absolute',
    zIndex: 10,
    fontSize: 14,
    whiteSpace: 'pre',
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginLeft: 4,
    padding: '4px 6px',
    backgroundColor: Colors.backgroundLight,
    borderRadius: 3,
    border: `1px solid ${Colors.borderLight}`,
    opacity: 0,
    transition: 'opacity 0.14s',
    visibility: 'hidden'
  },
  ':after': {
    content: '""',
    position: 'absolute',
    left: '100%',
    top: '50%',
    transform: 'translateY(-50%)',
    marginLeft: -5,
    border: `5px solid ${Colors.borderLight}`,
    borderColor: `transparent ${Colors.borderLight} transparent transparent`,
    visibility: 'hidden'
  },
  ':hover': {
    ':before': {
      opacity: 1,
      visibility: 'visible'
    },
    ':after': {
      opacity: 1,
      visibility: 'visible'
    }
  }
}))

export default Tooltip
