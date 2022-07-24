import React from 'react'

export function Icon ({ icon, ...rest }) {
  return <i className={`zmdi zmdi-${icon} zmdi-hc-fw`} {...rest}></i>
}

function withIconData (icon) {
  return function (WrappedComponent) {
    return function (props) {
      return <WrappedComponent {...props} icon={icon} />
    }
  }
}

const Icons = {
 CaretLeft: withIconData('caret-left')(Icon),
 CaretRight: withIconData('caret-right')(Icon),
 ChevronLeft: withIconData('chevron-left')(Icon),
 ChevronRight: withIconData('chevron-right')(Icon),
 ArrowUp: withIconData('long-arrow-up')(Icon),
 ArrowLeft: withIconData('arrow-left')(Icon),
 Check: withIconData('check')(Icon),
 Cross: withIconData('close')(Icon),
 Plus: withIconData('plus')(Icon),
 Minus: withIconData('minus')(Icon),
 Camera: withIconData('camera')(Icon)
}

export default Icons
