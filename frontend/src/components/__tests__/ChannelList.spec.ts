import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import ChannelList from '@/components/user/friends/ChannelList.vue'
import AddFriend from '@/components/user/friends/AddFriend.vue'

describe('ChannelList', () => {

  it('renders the component', () => {
    const wrapper = mount(ChannelList)
    expect(wrapper.exists()).toBe(true)
  });


  it('renders the "Find" button', () => {
    const wrapper = mount(ChannelList)
	const button = wrapper.find('button')
	expect(button.text()).toBe('Search')
  });


  it('calls findUser() method based on a search with input value from user', async () => {
	const ChannelListSpy = vi.spyOn(ChannelList.methods as any, 'findUser') 
    const wrapper = mount(ChannelList)
	const input = wrapper.find('input');
	await input.setValue('bobb');
	await wrapper.find('form').trigger('submit.prevent');
	await wrapper.vm.$nextTick();
	expect(ChannelListSpy).toHaveBeenCalled();
  });


  it('displays display name and user name when match found based on userName search', async () => {
	const foundUserData = [
		{
			displayName: 'Bobu',
			userName: 'bobby',
		},
	];
    const wrapper = mount(ChannelList, {
		data() {
			return {
				foundUser: foundUserData
			}
		}
	})
	const input = wrapper.find('input');
	await input.setValue('bobb');
	await wrapper.find('form').trigger('submit.prevent');
	await wrapper.vm.$nextTick();
	const userDetails = wrapper.findAll('tr');
	expect(userDetails.length).toBe(2);
	expect(userDetails[1].text()).toContain('Bobu');
	expect(userDetails[1].text()).toContain('bobby');
  });


  it('displays display name and user name when match found based on displayName search', async () => {
	const foundUserData = [
		{
			displayName: 'Bobu',
			userName: 'bobby',
		},
	];
    const wrapper = mount(ChannelList, {
		data() {
			return {
				foundUser: foundUserData
			}
		}
	})
	const input = wrapper.find('input');
	await input.setValue('Bob');
	await wrapper.find('form').trigger('submit.prevent');
	await wrapper.vm.$nextTick();
	const userDetails = wrapper.findAll('tr');
	expect(userDetails.length).toBe(2);
	expect(userDetails[1].text()).toContain('Bobu');
	expect(userDetails[1].text()).toContain('bobby');
  });


  it('finds multiple user matches', async () => {
	const foundUserData = [
		{
			displayName: 'Bobu',
			userName: 'bobby',
		},
		{
			displayName: 'Bobardo',
			userName: 'bobba',
		},
	];
    const wrapper = mount(ChannelList, {
		data() {
			return {
				foundUser: foundUserData
			}
		}
	})
	const input = wrapper.find('input');
	await input.setValue('bobb');
	await wrapper.find('form').trigger('submit.prevent');
	await wrapper.vm.$nextTick();
	const userDetails = wrapper.findAll('tr');
	expect(userDetails.length).toBe(3);
	expect(userDetails[1].text()).toContain('Bobu');
	expect(userDetails[2].text()).toContain('Bobardo');
  });


  it('shows alert and prompts for a input value when user search is empty', async () => {
    const wrapper = mount(ChannelList);
	const alertSpy = vi.spyOn(window, 'alert');
	window.alert = () => {};
	await wrapper.find('form').trigger('submit.prevent');
	expect(alertSpy).toHaveBeenCalledWith('Add name to search')
  });


  it('emits onFriendAdded when AddFriend child component adds a friend', async () => {
	const foundUserData = [
		{
			displayName: 'Bobu',
			userName: 'bobby',
		},
	];
    const wrapper = mount(ChannelList, {
		data() {
			return {
				foundUser: foundUserData
			}
		},
		components: {
			AddFriend,
		},
	})
	const friendComponent = wrapper.findComponent({ name: 'AddFriend' });
	await friendComponent.vm.$emit('friendAdded');
	await wrapper.vm.$nextTick();
	expect(wrapper.emitted('onFriendAdded')).toBeTruthy();
  });


  // it('user not found scenario for message and message type', async () => {
  //   const wrapper = mount(ChannelList, {
		// data() {
			// return {
				// name: 'Mimi',
				// foundUser: []
			// }
		// },
	// })
	// await wrapper.vm.findUser();
	// await wrapper.vm.$nextTick();
	// expect(wrapper.vm.message).toBe('Mimi not found.')
	// expect(wrapper.vm.messageType).toBe('error')
  // });


  // it('user found scenario for message and message type', async () => {
  //   const wrapper = mount(ChannelList, {
		// data() {
			// return {
				// name: 'bobb',
				// foundUser: []
			// }
		// }
	// })
	// await wrapper.vm.findUser();
	// await wrapper.vm.$nextTick();
	// expect(wrapper.vm.message).toBe('Found bobb')
	// expect(wrapper.vm.messageType).toBe('success')
  // });

})
