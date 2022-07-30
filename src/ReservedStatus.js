import React from 'react'
import Colors from './Colors'
import Icons from './Icon'

function ReservedStatus ({ reserved }) {
  return reserved
    ? <Icons.Check color={Colors.accept} fixedWidth={false} />
    : <Icons.Cross color={Colors.error} fixedWidth={false} />
}

export default ReservedStatus
