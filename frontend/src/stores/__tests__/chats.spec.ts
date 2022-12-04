import type { MatchMetaData } from '@/types/match'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, test } from 'vitest'
import { getKhrovCelestial, manageAllNotifCounter } from '../khrov-chat/chats'

describe('Chats Store', () => {
  let fakeMatch: MatchMetaData

  beforeEach(() => {
    fakeMatch = { id: 1, start: new Date(Date.now()), players: [] }
  })

  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    setActivePinia(createPinia())
  })

  test('should create a new match', async () => {
    const store = useMatchStore()
    const matchCountBefore = store.matchCount

    expect(store.currentMatch).toBeFalsy()
    await store.createMatch()
    expect(store.loading).toBe(false)
    expect(store.matchCount).greaterThan(matchCountBefore)
    expect(store.currentMatch).toBeTruthy()
  })

  it('should get the matches from the backend', async () => {
    const store = useMatchStore()

    await store.getMatches()
    expect(store.loading).toBe(false)
    expect(store.matches.length).greaterThan(0)
  })

  it('should get the match history', async () => {
    const store = useMatchStore()

    await store.getMatchHistory(Scope.global)
    expect(store.loading).toBe(false)
    expect(store.filters.gameStatus).toEqual('COMPLETED')
    expect(store.matches.length).greaterThan(0)
  })

  it('should get the matches to join', async () => {
    const store = useMatchStore()

    await store.getMatchesToJoin()
    expect(store.loading).toBe(false)
    expect(store.filters.gameStatus).toEqual('CREATED')
    expect(store.filters.includePlayers).toBe(true)
    expect(store.filters.includeScores).toBe(false)
    expect(store.matches.length).greaterThan(0)
  })

  it('should get the matches to spectate', async () => {
    const store = useMatchStore()

    await store.getMatchesToSpectate()
    expect(store.loading).toBe(false)
    expect(store.filters.gameStatus).toEqual('IN_PROGRESS')
    expect(store.filters.includePlayers).toBe(true)
    expect(store.filters.includeScores).toBe(true)
    expect(store.matches.length).greaterThan(0)
  })

  test.fails('should not create a new match when there already is one active', async () => {
    const store = useMatchStore()

    store.currentMatch = fakeMatch
    await store.createMatch()
  })

  it('should remove the active match', () => {
    const store = useMatchStore()

    store.currentMatch = fakeMatch
    store.removeCurrentMatch()
    expect(store.currentMatch).toBeFalsy()
  })
})
