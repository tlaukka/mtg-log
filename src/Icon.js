import styled from '@emotion/styled'
import React from 'react'

export function Icon ({ icon, color, fixedWidth = true, ...rest }) {
  return (
    <Symbol
      className={`zmdi zmdi-${icon} ${fixedWidth ? 'zmdi-hc-fw' : ''}`}
      color={color}
      {...rest}
    />
  )
}

const Symbol = styled('i')(({ color = 'inherit' }) => ({
  color
}))

function withIconData (icon) {
  return function (WrappedComponent) {
    return function (props) {
      return <WrappedComponent {...props} icon={icon} />
    }
  }
}

const Icons = {
 CaretUp: withIconData('caret-up')(Icon),
 CaretDown: withIconData('caret-down')(Icon),
 CaretLeft: withIconData('caret-left')(Icon),
 CaretRight: withIconData('caret-right')(Icon),
 ChevronUp: withIconData('chevron-up')(Icon),
 ChevronDown: withIconData('chevron-down')(Icon),
 ChevronLeft: withIconData('chevron-left')(Icon),
 ChevronRight: withIconData('chevron-right')(Icon),
 ArrowUp: withIconData('long-arrow-up')(Icon),
 ArrowDown: withIconData('long-arrow-down')(Icon),
 ArrowLeft: withIconData('arrow-left')(Icon),
 ArrowRight: withIconData('arrow-right')(Icon),
 Check: withIconData('check')(Icon),
 Cross: withIconData('close')(Icon),
 Plus: withIconData('plus')(Icon),
 Minus: withIconData('minus')(Icon),
 Camera: withIconData('camera')(Icon),
 HourGlass: withIconData('hourglass-alt')(Icon),
 Search: withIconData('search')(Icon),
 Case: withIconData('case')(Icon),
 Edit: withIconData('edit')(Icon)
}

export default Icons
