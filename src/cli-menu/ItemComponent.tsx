import React, { ReactElement } from 'react'
import { Text } from 'ink'

interface Props {
  readonly isSelected?: boolean
  readonly label: string
}

export default function ItemComponent(props: Props): ReactElement {
  const { isSelected = false, label } = props

  return <Text color={isSelected ? 'cyan' : undefined}>{label}</Text>
}
