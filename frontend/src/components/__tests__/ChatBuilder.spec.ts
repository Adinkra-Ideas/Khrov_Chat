import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest'
import { mount, shallowMount, flushPromises, type VueWrapper } from '@vue/test-utils'
import ChatBuilder from '@/components/user/ChatBuilder.vue'
import { createTestingPinia } from '@pinia/testing'
import axios from 'axios'
import jwtInterceptor from '../../interceptor/jwtInterceptor'
import waitForExpect from 'wait-for-expect'
import MockAdapter from 'axios-mock-adapter'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const mock = new MockAdapter(jwtInterceptor)
const mocka = new MockAdapter(axios)
const baseUrlauth = `${import.meta.env.VITE_BACKEND_SERVER_URI}/auth/`
const baseUrl = `${import.meta.env.VITE_BACKEND_SERVER_URI}`
const fakeBaseUrl = 'http://localhost:3000'

describe('Unit test of the ChatBuilder Component', () => {
  let wrapper: any = null

  beforeEach(() => {
    wrapper = shallowMount(ChatBuilder, {
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
  })
  it('renders the component with activated 2fa', async () => {
    wrapper.vm.activated2FA = true
    await waitForExpect(() => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findAll('button').length).toEqual(1)
      expect(wrapper.findAll('button').at(0).text()).toBe('Deactivate 2fa')
    })
  })
  it('renders the component with deactivated 2fa', async () => {
    wrapper.vm.activated2FA = false
    await waitForExpect(() => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findAll('button').length).toEqual(1)
      expect(wrapper.findAll('button').at(0).text()).toBe('Activate 2fa')
    })
  })

  it('renders the component with an url', async () => {
    wrapper.vm.url = 'test'
    wrapper.vm.activated2FA = false
    await waitForExpect(() => {
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.findAll('button').length).toEqual(2)
      expect(wrapper.findAll('button').at(0).text()).toBe('Activate 2fa')
      expect(wrapper.findAll('button').at(1).text()).toBe('Send code')
    })
  })
})
describe('Integration Test of the Validation2FA Component', () => {
  let wrapper: VueWrapper
  mock.onGet(baseUrlauth + 'refresh').reply(200)
  mocka.onGet(baseUrlauth + 'refresh').reply(200)
  beforeEach(() => {
    wrapper = mount(ChatBuilder, {
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
    expect(wrapper.findAll('button').length).toEqual(1)
    expect(wrapper.findAll('button').at(0)?.text()).toBe('Activate 2fa')
  })

  it('clicking the activate 2fa creates an qr image', async () => {
    mock.onGet(baseUrlauth + 'activate2FA').reply(200, { url: fakeBaseUrl + '/TestUrl' })
    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.findAll('button').length).toEqual(2)
      expect(wrapper.findAll('button').at(0)?.text()).toBe('Activate 2fa')
      expect(wrapper.findAll('button').at(1)?.text()).toBe('Send code')
      expect(wrapper.findAll('img').length).toEqual(1)
      expect(wrapper.findAll('img').at(0)?.element.src).toBe(fakeBaseUrl + '/TestUrl')
    })
  })

  it('clicking the deactivate 2fa deactivate the 2FA', async () => {
    mock.onGet(baseUrlauth + 'deactivate2FA').reply(200)
    // @ts-ignore
    wrapper.vm.activated2FA = true
    const authStore = useAuthStore()
    authStore.$patch({ userProfile: { activated2FA: true } })
    const spy = vi.spyOn(authStore, 'deactivate2FA')
    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(spy).toBeCalledTimes(1)
      expect(wrapper.findAll('button').length).toEqual(1)
      // @ts-ignore
      expect(wrapper.vm.url).toBe('')
    })
  })

  it('clicking the deactivate while not logged in', async () => {
    mock.onGet(baseUrlauth + 'deactivate2FA').reply(401)
    mock.onGet(baseUrlauth + 'refresh').reply(401)
    mocka.onGet(baseUrlauth + 'refresh').reply(401)
    const spy2 = vi.spyOn(router, 'push')
    window.alert = vi.fn()
    // @ts-ignore
    wrapper.vm.activated2FA = true
    const authStore = useAuthStore()
    authStore.$patch({ userProfile: { activated2FA: true } })
    const spy = vi.spyOn(authStore, 'deactivate2FA')
    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(window.alert).toBeCalledTimes(1)
      expect(window.alert).toBeCalledWith('Need to login to deactivate 2FA')
      expect(spy).toBeCalledTimes(1)
      expect(wrapper.findAll('button').length).toEqual(1)
      // @ts-ignore
      expect(wrapper.vm.url).toBe('')
      expect(spy2).toBeCalledTimes(1)
      expect(spy2).toBeCalledWith('/')
    })
  })

  it('clicking the activate while not logged in', async () => {
    mock.onGet(baseUrlauth + 'activate2FA').reply(401)
    mock.onGet(baseUrlauth + 'logout').reply(401)
    mock.onGet(baseUrlauth + 'refresh').reply(401)
    mocka.onGet(baseUrlauth + 'refresh').reply(401)
    const spy2 = vi.spyOn(router, 'push')
    window.alert = vi.fn()
    // @ts-ignore
    wrapper.vm.activated2FA = false
    const authStore = useAuthStore()
    authStore.$patch({ userProfile: { activated2FA: false } })
    const spy = vi.spyOn(authStore, 'logout')
    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(window.alert).toBeCalledTimes(1)
      expect(window.alert).toBeCalledWith('Unauthorized, you need to log in')
      expect(spy).toBeCalledTimes(1)
      expect(wrapper.findAll('button').length).toEqual(1)
      // @ts-ignore
      expect(wrapper.vm.url).toBe('')
      expect(spy2).toBeCalledTimes(1)
      expect(spy2).toBeCalledWith('/')
    })
  })

  it('clicking the deactivate with an unknown error', async () => {
    mock.onGet(baseUrlauth + 'deactivate2FA').reply(500)
    mock.onGet(baseUrlauth + 'refresh').reply(401)
    mocka.onGet(baseUrlauth + 'refresh').reply(401)
    window.alert = vi.fn()
    // @ts-ignore
    wrapper.vm.activated2FA = true
    const authStore = useAuthStore()
    authStore.$patch({ userProfile: { activated2FA: true } })
    const spy = vi.spyOn(authStore, 'deactivate2FA')
    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(window.alert).toBeCalledTimes(1)
      expect(window.alert).toBeCalledWith('Something went wrong, contact an admin')
      expect(spy).toBeCalledTimes(1)
      expect(wrapper.findAll('button').length).toEqual(1)
      // @ts-ignore
      expect(wrapper.vm.url).toBe('')
    })
  })

  it('error on receiving the QR-code url', async () => {
    mock.onGet(baseUrlauth + 'activate2FA').reply(401)
    mock.onGet(baseUrlauth + 'refresh').reply(401)
    mocka.onGet(baseUrlauth + 'refresh').reply(401)
    const authStore = useAuthStore()
    authStore.$patch({ userProfile: { activated2FA: false } })
    const spy = vi.spyOn(authStore, 'logout')
    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(spy).toBeCalledTimes(1)
      expect(wrapper.findAll('button').length).toEqual(1)
      expect(wrapper.findAll('button').at(0)?.text()).toBe('Activate 2fa')
      expect(wrapper.findAll('img').length).toEqual(0)
      // @ts-ignore
      expect(wrapper.vm.error).toBe('')
      // @ts-ignore
      expect(wrapper.vm.url).toBe('')
    })
  })

  it('unknown error on receiving the QR-code url', async () => {
    mock.onGet(baseUrlauth + 'activate2FA').reply(500)
    mock.onGet(baseUrlauth + 'refresh').reply(401)
    mocka.onGet(baseUrlauth + 'refresh').reply(401)
    const authStore = useAuthStore()
    authStore.$patch({ userProfile: { activated2FA: false } })
    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(wrapper.findAll('button').length).toEqual(1)
      expect(wrapper.findAll('button').at(0)?.text()).toBe('Activate 2fa')
      expect(wrapper.findAll('img').length).toEqual(0)
      // @ts-ignore
      expect(wrapper.vm.error).toBe('Unknown error, contact an admin')
      // @ts-ignore
      expect(wrapper.vm.url).toBe('')
    })
  })

  it('sending a valid code reset the url and error', async () => {
    mock.onGet(baseUrlauth + 'activate2FA').reply(200, { url: baseUrl + '/TestUrl' })
    mock.onPost(baseUrlauth + 'verifyactivate2fa').reply(200)
    const authStore = useAuthStore()
    authStore.$patch({ userProfile: { activated2FA: false } })
    const spy = vi.spyOn(authStore, 'activate2FA')
    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await wrapper.find('input').setValue('123456')
    await wrapper.find('.codeSend').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(spy).toBeCalledTimes(1)
      expect(wrapper.findAll('button').length).toEqual(1)
      expect(wrapper.findAll('button').at(0)?.text()).toBe('Deactivate 2fa')
      expect(wrapper.findAll('img').length).toEqual(0)
      // @ts-ignore
      expect(wrapper.vm.url).toBe('')
      // @ts-ignore
      expect(wrapper.vm.error).toBe('')
    })
  })

  it('sending a invalid code, displays an error', async () => {
    mock.onGet(baseUrlauth + 'activate2FA').reply(200, { url: baseUrl + '/TestUrl' })
    mock.onPost(baseUrlauth + 'verifyactivate2fa').reply(403, { message: 'the test works' })
    const authStore = useAuthStore()
    authStore.$patch({ userProfile: { activated2FA: false } })
    const spy = vi.spyOn(authStore, 'activate2FA')
    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await wrapper.find('input').setValue('123456')
    await wrapper.find('.codeSend').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(spy).toBeCalledTimes(0)
      expect(wrapper.findAll('button').length).toEqual(2)
      expect(wrapper.findAll('button').at(0)?.text()).toBe('Activate 2fa')
      expect(wrapper.findAll('button').at(1)?.text()).toBe('Send code')
      expect(wrapper.findAll('img').length).toEqual(1)
      // @ts-ignore
      expect(wrapper.vm.url).toBe(baseUrl + '/TestUrl')
      // @ts-ignore
      expect(wrapper.vm.error).toBe('the test works')
    })
  })

  it('sending a code, while no logged in', async () => {
    mock.onGet(baseUrlauth + 'activate2FA').reply(200, { url: baseUrl + '/TestUrl' })
    mock.onPost(baseUrlauth + 'verifyactivate2fa').reply(401)
    mock.onGet(baseUrlauth + 'refresh').reply(401)
    mocka.onGet(baseUrlauth + 'refresh').reply(401)
    const authStore = useAuthStore()
    const spy2 = vi.spyOn(router, 'push')
    window.alert = vi.fn()
    // @ts-ignore
    wrapper.vm.activated2FA = false
    const spy3 = vi.spyOn(authStore, 'logout')
    authStore.$patch({ userProfile: { activated2FA: false } })
    const spy = vi.spyOn(authStore, 'activate2FA')
    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await wrapper.find('input').setValue('123456')
    await wrapper.find('.codeSend').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(spy).toBeCalledTimes(0)
      expect(spy2).toBeCalledTimes(1)
      expect(spy3).toBeCalledTimes(1)
      expect(window.alert).toBeCalledTimes(1)
      expect(window.alert).toBeCalledWith('Unauthorized, you need to log in')
      expect(wrapper.findAll('button').length).toEqual(2)
      expect(wrapper.findAll('button').at(0)?.text()).toBe('Activate 2fa')
      expect(wrapper.findAll('button').at(1)?.text()).toBe('Send code')
      expect(wrapper.findAll('img').length).toEqual(1)
      // @ts-ignore
      expect(wrapper.vm.url).toBe(baseUrl + '/TestUrl')
      // @ts-ignore
      expect(wrapper.vm.error).toBe('')
    })
  })

  it('sending an empty code, does nothing', async () => {
    mock.onGet(baseUrlauth + 'activate2FA').reply(200, { url: baseUrl + '/TestUrl' })
    mock.onPost(baseUrlauth + 'verifyactivate2fa').reply(403, { message: 'the test works' })
    mock.onGet(baseUrlauth + 'refresh').reply(200)
    const authStore = useAuthStore()
    authStore.$patch({ userProfile: { activated2FA: false } })
    const spy = vi.spyOn(authStore, 'activate2FA')

    await wrapper.find('.change2fa').trigger('click')
    await flushPromises()
    await wrapper.find('.codeSend').trigger('click')
    await flushPromises()
    await waitForExpect(() => {
      expect(spy).toBeCalledTimes(0)
      expect(wrapper.findAll('button').length).toEqual(2)
      expect(wrapper.findAll('button').at(0)?.text()).toBe('Activate 2fa')
      expect(wrapper.findAll('button').at(1)?.text()).toBe('Send code')
      expect(wrapper.findAll('img').length).toEqual(1)
      // @ts-ignore
      expect(wrapper.vm.url).toBe(baseUrl + '/TestUrl')
      // @ts-ignore
      expect(wrapper.vm.error).toBe('')
    })
  })
})
