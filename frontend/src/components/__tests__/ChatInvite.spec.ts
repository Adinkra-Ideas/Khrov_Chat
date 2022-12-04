import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount, shallowMount, flushPromises, type VueWrapper } from '@vue/test-utils'
import ChatInvite from '@/components/user/ChatInvite.vue'
import { createTestingPinia } from '@pinia/testing'
import axios from 'axios'
import waitForExpect from 'wait-for-expect'
import router from '@/router'
import MockAdapter from 'axios-mock-adapter'

const mock = new MockAdapter(axios)
const baseUrlauth = `${import.meta.env.VITE_BACKEND_SERVER_URI}/auth/`

describe('Unit test of the ChatInvite Component', () => {
  let wrapper: any = null

  beforeEach(() => {
    wrapper = shallowMount(ChatInvite, {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })
      ]
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findAll('p').length).toEqual(1)
    expect(wrapper.findAll('div').length).toEqual(1)
    expect(wrapper.findAll('p').at(0).text()).toMatch('Validate yourself with your Auth App code')
    expect(wrapper.findAll('form-stub').length).toEqual(1)
  })
})

describe('Integration Test of the Validation2FA Component', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    wrapper = mount(ChatInvite, {
      plugins: [
        createTestingPinia({
          createSpy: vi.fn,
          stubActions: false
        })
      ]
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('renders the component', () => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.findAll('div').length).toEqual(3)
    expect(wrapper.findAll('p').length).toEqual(1)
    expect(wrapper.findAll('p').at(0)?.text()).toMatch('Validate yourself with your Auth App code')
    expect(wrapper.findAll('form').length).toEqual(1)
    expect(wrapper.findAll('label').length).toEqual(1)
    expect(wrapper.findAll('label').at(0)?.text()).toMatch('Code:')
    expect(wrapper.findAll('input').length).toEqual(1)
    expect(wrapper.find('input').text()).toContain('')
    expect(wrapper.findAll('button').length).toEqual(1)
    expect(wrapper.findAll('button').at(0)?.text()).toMatch('Submit')
  })

  it('show error msg on empty submit', async () => {
    await wrapper.find('input').trigger('submit')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.findAll('div').length).toEqual(3)
      expect(wrapper.findAll('p').length).toEqual(2)
      expect(wrapper.findAll('p').at(0)?.text()).toMatch(
        'Validate yourself with your Auth App code'
      )
      expect(wrapper.findAll('p').at(1)?.text()).toMatch('Code is required')
      expect(wrapper.findAll('form').length).toEqual(1)
      expect(wrapper.findAll('label').length).toEqual(1)
      expect(wrapper.findAll('label').at(0)?.text()).toMatch('Code:')
      expect(wrapper.findAll('input').length).toEqual(1)
      expect(wrapper.find('input').text()).toMatch('')
      expect(wrapper.findAll('button').length).toEqual(1)
      expect(wrapper.findAll('button').at(0)?.text()).toMatch('Submit')
    })
  })

  it('show error msg on wrong code', async () => {
    mock.onPost(baseUrlauth + 'verify2FA').reply(403, { message: 'test has worked' })
    await wrapper.find('input').setValue('123456')
    await wrapper.find('input').trigger('submit')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.findAll('div').length).toEqual(3)
      expect(wrapper.findAll('p').length).toEqual(2)
      expect(wrapper.findAll('p').at(0)?.text()).toMatch(
        'Validate yourself with your Auth App code'
      )
      expect(wrapper.findAll('p').at(1)?.text()).toMatch('test has worked')
      expect(wrapper.findAll('form').length).toEqual(1)
      expect(wrapper.findAll('label').length).toEqual(1)
      expect(wrapper.findAll('label').at(0)?.text()).toMatch('Code:')
      expect(wrapper.findAll('input').length).toEqual(1)
      expect(wrapper.find('input').text()).toMatch('')
      expect(wrapper.findAll('button').length).toEqual(1)
      expect(wrapper.findAll('button').at(0)?.text()).toMatch('Submit')
    })
  })

  it('testing a valid code send', async () => {
    mock.onPost(baseUrlauth + 'verify2FA').reply(200)
    await wrapper.find('input').setValue('123456')
    await wrapper.find('input').trigger('submit')

    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.findAll('div').length).toEqual(3)
      expect(wrapper.findAll('p').length).toEqual(1)
      expect(wrapper.findAll('p').at(0)?.text()).toMatch(
        'Validate yourself with your Auth App code'
      )
      expect(wrapper.findAll('form').length).toEqual(1)
      expect(wrapper.findAll('label').length).toEqual(1)
      expect(wrapper.findAll('label').at(0)?.text()).toMatch('Code:')
      expect(wrapper.findAll('input').length).toEqual(1)
      expect(wrapper.find('input').text()).toContain('')
      expect(wrapper.findAll('button').length).toEqual(1)
      expect(wrapper.findAll('button').at(0)?.text()).toMatch('Submit')
    })
  })

  it('testing when access token is invalid', async () => {
    mock.onPost(baseUrlauth + 'verify2FA').reply(401)
    await wrapper.find('input').setValue('123456')
    await wrapper.find('input').trigger('submit')
    const spy = vi.spyOn(router, 'push')
    window.alert = vi.fn()
    await flushPromises()
    await waitForExpect(() => {
      expect(window.alert).toBeCalledTimes(1)
      expect(window.alert).toBeCalledWith('Took to long restart login')
      expect(spy).toBeCalledTimes(1)
      expect(spy).toBeCalledWith('/')
    })
  })

  it('testing when something goes wrong on the server', async () => {
    mock.onPost(baseUrlauth + 'verify2FA').reply(500)
    await wrapper.find('input').setValue('123456')
    await wrapper.find('input').trigger('submit')
    window.alert = vi.fn()
    const spy = vi.spyOn(router, 'push')
    await flushPromises()
    await waitForExpect(() => {
      expect(spy).toBeCalledTimes(1)
      expect(spy).toBeCalledWith('/')
      expect(window.alert).toBeCalledTimes(1)
      expect(window.alert).toBeCalledWith('Something went wrong, contact an admin')
    })
  })
})
