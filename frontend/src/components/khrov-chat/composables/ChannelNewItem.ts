import { reactive } from 'vue'
import { layer } from '@layui/layer-vue'
import type { ChNwItJoinStatus, ChNwItInternal } from '@/components/khrov-chat/interface/khrov-chat'
import { useGlobal } from '@/components/khrov-chat/composables/__Global'

export function useChannelNewItem(props: any) {
  const cnItem: ChNwItJoinStatus = reactive({
    cniConfirmHeight: '0px',
    cniPwdConfirmHeight: '0px',
    cniPwdInput: ''
  })
  const internal: ChNwItInternal = reactive({
    partake: false,
    joinExitFlag:  false,
    visImage: ''
  })

  const { fetchForKhrov } = useGlobal()

  const changeMembership = async (joinOrExit: boolean, chId: number): Promise<boolean> => {
    if (!String(cnItem.cniPwdInput).match(/^[a-zA-Z\d]*$/)) {
      layer.msg('Password Contains Unsupported Characters', { time: 5000 })
      return false
    }
    const tmp = {
      chId: chId,
      password: cnItem.cniPwdInput,
      joinOrExit: joinOrExit
    }
    cnItem.cniPwdInput = ''
    const response = await fetchForKhrov(`/channels/change`, 'PUT', tmp);
    if (response) {
      try {
        const jsonObj = await response.json();
        layer.msg(jsonObj.message, { time: 5000 })
        return true
      } catch {
        return false
      }
    } else {
      return false
    }
  }

  internal.partake = props.memberOr != 'not' ? true : false
  internal.visImage = '/khrov-chat-media/Channel.png'
  if (props.visibility === 'public') {
    internal.visImage = internal.visImage.substring(0, 18) + 'public' + internal.visImage.substring(18)
  } else if (props.visibility === 'private') {
    internal.visImage = internal.visImage.substring(0, 18) + 'private' + internal.visImage.substring(18)
  } else if (props.visibility === 'password') {
    internal.visImage = internal.visImage.substring(0, 18) + 'password' + internal.visImage.substring(18)
  }

  return { cnItem, internal, changeMembership }
}
