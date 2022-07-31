import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'
import Tag from './Tag'

// const labels = {
//   common: 'common',
//   uncommon: 'uncommon',
//   rare: 'rare',
//   mythic: 'mythic',
//   bonus: 'bonus'
// }

const labels = {
  common: 'co',
  uncommon: 'un',
  rare: 'ra',
  mythic: 'my',
  bonus: 'bo'
}

const backgrounds = {
  common: 'black',
  uncommon: 'linear-gradient(90deg, rgba(94,104,107,1) 0%, rgba(245,253,255,1) 50%)',
  rare: 'linear-gradient(90deg, rgba(102,84,56,1) 0%, rgba(255,244,146,1) 50%)',
  mythic: 'linear-gradient(90deg, rgba(210,87,29,1) 0%, rgba(255,192,53,1) 50%)',
  bonus: 'linear-gradient(90deg, rgba(69,88,112,1) 0%, rgba(156,181,214,1) 50%)'
}

// const borderColor = {
//   common: Colors.borderLight,
//   uncommon: 'rgba(94,104,107,1)',
//   rare: 'rgba(102,84,56,1)',
//   mythic: 'rgba(210,87,29,1)',
//   bonus: 'rgba(69,88,112,1)'
// }

const borderColor = {
  common: Colors.borderLight,
  uncommon: 'rgba(245,253,255,1)',
  rare: 'rgba(255,244,146,1)',
  mythic: 'rgba(255,192,53,1)',
  bonus: 'rgba(156,181,214,1)'
}

function Rarity ({ rarity }) {
  return (
    <RarityTag rarity={rarity} background={backgrounds[rarity]}>
      {labels[rarity] || '-'}
    </RarityTag>
  )
}

const RarityTag = styled(Tag)(({ rarity }) => ({
  border: `1px solid ${borderColor[rarity]}`,
  color: (rarity === 'common') ? Colors.borderLight : Colors.backgroundDark
}))

export default Rarity
