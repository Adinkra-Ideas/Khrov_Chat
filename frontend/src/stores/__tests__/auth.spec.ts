import { describe, expect, it, test } from 'vitest'
import { ref } from 'vue'
import { usePagination } from '../auth'

describe('useAuth', () => {
  const ITEMS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven']
  const PAGE_SIZE = 5

  it('should go to the next and previous pages', () => {
    const { currentPage, nextPage, prevPage } = usePagination<String>(ref(ITEMS), ref(PAGE_SIZE))

    expect(currentPage.value).toBe(1)

    nextPage()
    expect(currentPage.value).toBe(2)

    prevPage()
    expect(currentPage.value).toBe(1)
  })

  it('should not go to the previous page when on page 1', () => {
    const { currentPage, prevPage } = usePagination<String>(ref(ITEMS), ref(PAGE_SIZE))

    expect(currentPage.value).toBe(1)

    prevPage()
    expect(currentPage.value).toBe(1)
  })

  it('should not got to the next page when there is none', () => {
    const { currentPage, nextPage } = usePagination<String>(ref(ITEMS), ref(PAGE_SIZE))

    currentPage.value = 2

    nextPage()
    expect(currentPage.value).toBe(2)
  })

  it('should return the correct start and end indices', () => {
    const { currentPage, currentStartIndex, currentEndIndex } = usePagination<String>(
      ref(ITEMS),
      ref(PAGE_SIZE)
    )

    currentPage.value = 1

    expect(currentStartIndex.value).toBe(1)
    expect(currentEndIndex.value).toBe(5)

    currentPage.value = 2
    expect(currentStartIndex.value).toBe(6)
    expect(currentEndIndex.value).toBe(7)
  })

  test.each([2, 5, 10])('should split the list into pages of size %i', (pageSize: number) => {
    const { pagedResults } = usePagination<String>(ref(ITEMS), ref(pageSize))
    expect(pagedResults.value.length).lessThanOrEqual(pageSize)
  })

  test.fails('should not accept a negative page size', () => {
    usePagination<String>(ref(ITEMS), ref(-5))
  })

  test.fails('should not accept zero as page size', () => {
    usePagination<String>(ref(ITEMS), ref(0))
  })

  test('empty list', () => {
    const { currentPage, pageSize, currentStartIndex, currentEndIndex, pagedResults } =
      usePagination(ref([]), ref(PAGE_SIZE))

    expect(currentPage.value).toBe(1)
    expect(pagedResults.value.length).toBe(0)
    expect(currentStartIndex.value).toBe(0)
    expect(currentEndIndex.value).toBe(0)
    expect(pageSize.value).toBe(PAGE_SIZE)
  })

  it('should handle page size changes', () => {
    const pageSize = ref(PAGE_SIZE)
    const { currentStartIndex, currentEndIndex, pagedResults } = usePagination(ref(ITEMS), pageSize)

    expect(pagedResults.value.length).toBe(PAGE_SIZE)

    pageSize.value = 2
    expect(pagedResults.value.length).toBe(2)
    expect(currentStartIndex.value).toBe(1)
    expect(currentEndIndex.value).toBe(2)
  })
})
