import { Effect } from 'effect'
import { afterEach, describe, expect, it } from 'vitest'

import { pushUrl, replaceUrl } from './index.js'

afterEach(() => {
  window.history.replaceState({}, '', '/')
})

describe('navigation history state', () => {
  it.each([pushUrl, replaceUrl])(
    'stores caller state and dispatches a URL change',
    navigate => {
      const state = { historyIndex: 4 }
      let notifications = 0
      const onChange = () => {
        notifications += 1
      }
      window.addEventListener('foldkit:urlchange', onChange)

      try {
        Effect.runSync(navigate('/next', state))
        expect(window.history.state).toEqual(state)
        expect(window.location.pathname).toBe('/next')
        expect(notifications).toBe(1)
      } finally {
        window.removeEventListener('foldkit:urlchange', onChange)
      }
    },
  )

  it.each([pushUrl, replaceUrl])(
    'defaults omitted state to an empty object',
    navigate => {
      Effect.runSync(navigate('/next'))
      expect(window.history.state).toEqual({})
    },
  )
})
