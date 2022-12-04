import { beforeAll, describe, expect, it } from 'vitest'

import MatchItemVue from '@/components/match/MatchItem.vue'
import { mount } from '@vue/test-utils'
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'

beforeAll(() => {
  TimeAgo.addDefaultLocale(en)
})

describe('ChatBlocked', () => {
  it('should render a completed match', () => {
    const currentTime = new Date()
    const pastTime = new Date()
    pastTime.setHours(currentTime.getHours() - 1) // one hour earlier

    const wrapper = mount(MatchItemVue, {
      props: {
        match: {
          id: 1,
          start: pastTime,
          end: currentTime,
          players: [
            {
              id: 1,
              score: 4,
              name: 'Marty',
              email: 'marty@example.com'
            },
            {
              id: 2,
              score: 0,
              name: 'Chris',
              email: 'chelmerd@example.com'
            }
          ]
        }
      }
    })

    expect(wrapper.text()).toContain('Match #1')
    expect(wrapper.text()).toContain('Marty vs Chris')
    expect(wrapper.text()).toContain('4 : 0')
    expect(wrapper.text()).toContain('just now')
    // expect(wrapper.text()).toContain('start: ');
    // expect(wrapper.text()).toContain('end: ');
  })

  it('should render an empty match', () => {
    const wrapper = mount(MatchItemVue, {
      props: {
        match: {
          id: 1,
          players: []
        }
      }
    })

    expect(wrapper.text()).toContain('Match #1')
    expect(wrapper.text()).not.toContain('duration')

    const joinButton = wrapper.find('.button.join')
    expect(joinButton.text()).toEqual('Join Game')
  })

  it('should render a match with one player', () => {
    const wrapper = mount(MatchItemVue, {
      props: {
        match: {
          id: 1,
          players: [
            {
              id: 1,
              score: 0,
              name: 'Marty',
              email: 'marty@example.com'
            }
          ]
        }
      }
    })

    expect(wrapper.text()).toContain('Match #1')
    expect(wrapper.text()).toContain('Marty')
    expect(wrapper.text()).not.toContain('duration')
    expect(wrapper.text()).not.toContain(':') // no score

    const joinButton = wrapper.find('.button.join')
    expect(joinButton.exists()).toBe(true)
    expect(joinButton.text()).toEqual('Join Game')

  })

  it('should render a match in progress', () => {
    const currentTime = new Date()
    const pastTime = new Date()
    pastTime.setHours(currentTime.getHours() - 1) // one hour earlier
    const wrapper = mount(MatchItemVue, {
      props: {
        match: {
          id: 1,
          start: pastTime,
          players: [
            {
              id: 1,
              score: 4,
              name: 'Marty',
              email: 'marty@example.com'
            },
            {
              id: 2,
              score: 0,
              name: 'Chris',
              email: 'chelmerd@example.com'
            }
          ]
        }
      }
    })

    expect(wrapper.text()).toContain('Match #1')
    expect(wrapper.text()).toContain('duration')
    expect(wrapper.text()).toContain('Marty vs Chris')
    expect(wrapper.text()).toContain('4 : 0')

    const joinButton = wrapper.find('.button.join')
    expect(joinButton.exists()).toBe(false)

  })
})
