import { beforeAll, describe, expect, it } from 'vitest'

import ChatBlockedItem from '@/components/match/ChatBlockedItem.vue'
import type { MatchMetaData } from '@/types/match'
import { mount } from '@vue/test-utils'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

const fakeMatches: MatchMetaData[] = [
  { id: 1, players: [] },
  {
    id: 2,
    // start: new Date(Date.now()),
    players: [
      {
        id: 1,
        email: 'alice@exmaple.com',
        name: 'Alice',
        score: 0
      }
    ]
  }
]

beforeAll(() => {
  TimeAgo.addDefaultLocale(en)
})

describe('ChatBlockedItem', () => {
  it('renders properly', async () => {
    const wrapper = mount(ChatBlockedItemVue, {
      props: {
        matches: fakeMatches
      }
    })

    expect(wrapper.findAll('ul.match-list').length).toBe(1)
    expect(wrapper.findAll('ul.match-list > li').length).toBe(2)
  })
})
