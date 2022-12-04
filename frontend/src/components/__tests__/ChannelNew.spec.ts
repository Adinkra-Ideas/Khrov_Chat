import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChannelNew from '@/components/user/friends/ChannelNew.vue'
import { beforeEach } from 'node:test';


describe('ChannelNew', () => {

  beforeEach(() => {
    vi.restoreAllMocks();
  })

  it('renders the component', () => {
    const friend = { displayName: 'John Leets' };
    const wrapper = mount(ChannelNew, {
      props: { friend }
    });
    expect(wrapper.exists()).toBe(true)
  });


  it('renders the friend\'s display name and user name', () => {
    const friend = { displayName: 'John Leete', userName: 'johnny' };
    const wrapper = mount(ChannelNew, {
      props: { friend }
    });
    const displayName = wrapper.find('.displayName');
    expect(displayName.text()).toBe('John Leete');
    const userName = wrapper.find('.userName');
    expect(userName.text()).toBe('johnny');
  });

  it('renders the "Remove Friend" button', () => {
    const friend = { displayName: 'John Leeta' };
    const wrapper = mount(ChannelNew, {
      props: { friend }
    });
    const buttons = wrapper.findAll('button');
    expect(buttons[0].text()).toBe('Remove Friend')
  });


  it('calls removeFriend() method when clicking on the "Remove Friend" button', async () => {
    const friend = { displayName: 'John Leeto', id: 123 };
    const wrapper = mount(ChannelNew, {
      props: { friend }
    });
    const removeFriendSpy = vi.spyOn(wrapper.vm, 'removeFriend');
    const buttons = wrapper.findAll('button');
    await buttons[0].trigger('click');
    expect(removeFriendSpy).toHaveBeenCalled();
    await removeFriendSpy.mockRestore();
  });

  // it('emits "friendRemoved" event after successfully deleting friend', async () => { 
  // const friend = { displayName: 'John Leet', id: 123 };
  //   const wrapper = mount(ChannelNew, {
  // props: { friend }
  // });
  // await wrapper.vm.removeFriend();
  //   expect(wrapper.emitted('friendRemoved')).toBeTruthy();
  // });


  // it('does not emit "friendRemoved" event after failed deleting friend', async () => { 
  // const friend = { displayName: 'Mimi', id: 123 };
  //   const wrapper = mount(ChannelNew, {
  // props: { friend }
  // });
  // await wrapper.vm.removeFriend();
  //   expect(wrapper.emitted('friendRemoved')).toBeFalsy();
  // });
})
