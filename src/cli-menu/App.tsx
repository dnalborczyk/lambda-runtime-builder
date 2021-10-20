import React from 'react'
import { render } from 'ink'
import PageComponent from './PageComponent.js'

async function start(): Promise<void> {
  const app = render(<PageComponent />)

  await app.waitUntilExit()

  console.log('lambda runtime builder exited.')
}

start()
