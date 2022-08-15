import styled from '@emotion/styled'
import Tag from './Tag'

export const Grade = {
  m: 'm',
  nm: 'nm',
  ex: 'ex',
  gd: 'gd',
  lp: 'lp',
  pl: 'pl',
  dmg: 'dmg'
}

const colors = {
  [Grade.m]: '#17A2B8',
  [Grade.nm]: '#57BB8A',
  [Grade.ex]: '#ABC978',
  [Grade.gd]: '#FFD666',
  [Grade.lp]: '#F3A96D',
  [Grade.pl]: '#FB5555',
  [Grade.dmg]: '#858585'
}

function GradeTag ({ grade, ...rest }) {
  return (
    <GradeTagContainer grade={grade} {...rest}>
      {Grade[grade]}
    </GradeTagContainer>
  )
}

const GradeTagContainer = styled(Tag)({
  width: 36
}, ({ grade }) => ({
  backgroundColor: colors[grade]
}))

export default GradeTag
