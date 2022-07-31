import styled from '@emotion/styled'
import React from 'react'
import Colors from './Colors'
import Tag from './Tag'

// const rarityLabel = {
//   common: 'common',
//   uncommon: 'uncommon',
//   rare: 'rare',
//   mythic: 'mythic',
//   bonus: 'bonus'
// }

const rarityLabel = {
  common: 'co',
  uncommon: 'un',
  rare: 'ra',
  mythic: 'my',
  bonus: 'bo'
}

export const rarityBackground = {
  common: 'black',
  uncommon: 'linear-gradient(90deg, rgba(94,104,107,1) 0%, rgba(245,253,255,1) 50%)',
  rare: 'linear-gradient(90deg, rgba(102,84,56,1) 0%, rgba(255,244,146,1) 50%)',
  mythic: 'linear-gradient(90deg, rgba(210,87,29,1) 0%, rgba(255,192,53,1) 50%)',
  bonus: 'linear-gradient(90deg, rgba(69,88,112,1) 0%, rgba(156,181,214,1) 50%)'
}

// export const rarityBorderColor = {
//   common: Colors.borderLight,
//   uncommon: 'rgba(94,104,107,1)',
//   rare: 'rgba(102,84,56,1)',
//   mythic: 'rgba(210,87,29,1)',
//   bonus: 'rgba(69,88,112,1)'
// }

export const rarityBorderColor = {
  common: Colors.borderLight,
  uncommon: 'rgba(245,253,255,1)',
  rare: 'rgba(255,244,146,1)',
  mythic: 'rgba(255,192,53,1)',
  bonus: 'rgba(156,181,214,1)'
}

function Rarity ({ rarity }) {
  return (
    <RarityTag rarity={rarity} background={rarityBackground[rarity]}>
      {rarityLabel[rarity] || '-'}
    </RarityTag>
  )
}

const RarityTag = styled(Tag)(({ rarity }) => ({
  border: `1px solid ${rarityBorderColor[rarity]}`,
  color: (rarity === 'common') ? Colors.borderLight : '#15171B'
}))

export default Rarity
