import React, { ReactElement } from 'react'
import figures from 'figures'
import { Box, Text } from 'ink'

const { pointer } = figures

interface Props {
  readonly isSelected?: boolean
}

export default function IndicatorComponent(props: Props): ReactElement {
  const { isSelected } = props

  return (
    <Box marginRight={1}>
      {isSelected ? <Text color="cyan">{pointer}</Text> : <Text> </Text>}
    </Box>
  )
}
