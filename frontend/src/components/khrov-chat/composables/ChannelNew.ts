import { reactive } from 'vue'
import { layer } from '@layui/layer-vue'
import type { ChNew } from '@/components/khrov-chat/interface/khrov-chat'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

export function useChannelNew() {
  const chNew: ChNew = reactive({
    chnLiFirstIsActive: true,
    chnLiSecondIsActive: false,
    chnNameInput: '',
    chnVisiSelect: '',
    chnPassInput: '',
    chnPassValidatorField: '0px',
    chnChPassLowercase: 'chPassInvalid',
    chnChPassUppercase: 'chPassInvalid',
    chnChPassNumber: 'chPassInvalid',
    chnChPassLength: 'chPassInvalid',
    chnDescInput: '',
    chnError: '',
    chnSearchInput: '',
    renderSearchOutput: false,
    chnSearchLoading: false,
    suggestionsOutput: [],
    suggestionsOutputRef: 0,
    searchOutput: [],
    searchOutputRef: 0
  })

  const { fetchForKhrov } = useGlobal()

  const switchChnActive = (name: string) => {
    if (!name.match(/^first$|^second$/)) {
      return
    }
    chNew.chnLiFirstIsActive = name === 'first' ? true : false
    chNew.chnLiSecondIsActive = name === 'second' ? true : false
  }
  
  const chnPassValidator = () => {
    const lowerCase = /[a-z]/g
    const upperCase = /[A-Z]/g
    const numberIn = /[0-9]/g
  
    if (chNew.chnPassInput.match(lowerCase)) {
      chNew.chnChPassLowercase = 'chPassValid'
    } else {
      chNew.chnChPassLowercase = 'chPassInvalid'
    }
  
    if (chNew.chnPassInput.match(upperCase)) {
      chNew.chnChPassUppercase = 'chPassValid'
    } else {
      chNew.chnChPassUppercase = 'chPassInvalid'
    }
  
    if (chNew.chnPassInput.match(numberIn)) {
      chNew.chnChPassNumber = 'chPassValid'
    } else {
      chNew.chnChPassNumber = 'chPassInvalid'
    }
  
    if (chNew.chnPassInput.length >= 6) {
      chNew.chnChPassLength = 'chPassValid'
    } else {
      chNew.chnChPassLength = 'chPassInvalid'
    }
  }
  
  const requestChannelCreation = async () => {
    if (!String(chNew.chnNameInput).match(/^[a-zA-Z\d]{3,15}$/)) {
      chNew.chnError =
        '* Channel name must be between 3-15 characters long and contain only alphanumeric characters'
      return false
    } else if (!String(chNew.chnVisiSelect).match(/^public$|^private$|^password$/)) {
      chNew.chnError = '* A visibility option must be selected'
      return false
    }
    if (
      chNew.chnVisiSelect === 'password' &&
      !chNew.chnPassInput.match(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])^[a-zA-Z\d]{6,20}$/)
    ) {
      chNew.chnError = '* Please check password rules'
      return false
    } else if (!String(chNew.chnDescInput).match(/^[a-zA-Z\d?@ ,.'^\n]{10,42}$/)) {
      chNew.chnError =
        "* Channel description must be between 10-42 characters long, only Special chars ?@ ,.'^\n and Alphanumerics"
      return false
    } else {
      chNew.chnError = ''
    }
    const tmp = {
      name: chNew.chnNameInput,
      desc: chNew.chnDescInput,
      visibility: chNew.chnVisiSelect,
      password: ''
    }
    tmp.password = chNew.chnVisiSelect === 'password' ? chNew.chnPassInput : 'Aa1234'
    const response = await fetchForKhrov('/channels', 'POST', tmp);
    if (response) {
      try {
        if (!response.ok) {
          const error = await response.json()
          chNew.chnError = error.message
        } else {
          layer.msg(`Success. Channel ${chNew.chnNameInput} Created Successfully!`, { time: 5000 })
          chNew.chnNameInput = ''
          chNew.chnVisiSelect = ''
          chNew.chnPassInput = ''
          chNew.chnDescInput = ''
        }
      } catch {/* Do nothing */}
    }
  }
  
  const searchChannels = async (key: string) => {
    chNew.renderSearchOutput = true
    chNew.searchOutput = []
    chNew.searchOutputRef += 1
    chNew.chnSearchLoading = true
    if (key.length === 1) {
      return
    } else if (key.length === 0) {
      suggestedChannels()
      return
    }
    const response = await fetchForKhrov(`/channels/me/${key}`, 'GET', {});
    if (response) {
      try {
        chNew.chnSearchLoading = false
        if (!response.ok) throw response;
        const jsonObj = await response.json();
        chNew.searchOutput = jsonObj
        chNew.searchOutputRef += 1
      } catch {/* Do nothing */}
    }
  }
  
  const suggestedChannels = async () => {
    chNew.renderSearchOutput = false
    chNew.chnSearchLoading = true
    const response = await fetchForKhrov(`/channels/suggestions`, 'GET', {});
    if (response) {
      try {
        chNew.chnSearchLoading = false
        if (!response.ok) throw response;
        const jsonObj = await response.json();
        chNew.suggestionsOutput = jsonObj
        chNew.suggestionsOutputRef += 1 
      } catch {/* Do nothing */}
    }
  }

  suggestedChannels()
  
  return { 
    chNew, 
    switchChnActive, 
    chnPassValidator, 
    requestChannelCreation,
    searchChannels,
    suggestedChannels
  }
}
