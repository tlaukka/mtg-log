import styled from '@emotion/styled'

const CardImage = styled('img')({
  display: 'block',
  aspectRatio: '488 / 680'
}, ({ size = 'auto', set, onClick }) => ({
  cursor: onClick ? 'pointer' : 'default',
  width: size,
  borderRadius: (set === 'lea') ? '7.5%/5.4%' : '4.8%/3.4%'
}))

export default CardImage
