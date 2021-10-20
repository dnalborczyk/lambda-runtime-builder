import React, { ReactElement, useEffect } from 'react'
import { Text, useApp } from 'ink'

export default function Exit(): ReactElement {
  const { exit } = useApp()

  useEffect(() => {
    // exit the app after 1 second
    setTimeout(() => {
      exit()
    }, 1000)
  })

  return <Text></Text>
}
