import { describe, expect, it, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TheHeader from '@/components/user/friends/TheHeader.vue'
import ButtonApp from '@/components/ButtonApp.vue'

describe('TheHeader', () => {

  it('renders the component', () => {
    const wrapper = mount(TheHeader, {
		props: {
			friendName: 'Nicole'
		}
	})
    expect(wrapper.exists()).toBe(true)
  });


  it('renders the "Add Friend" button', () => {
    const wrapper = mount(TheHeader, {
		components: {
			ButtonApp
		},
		props: {
			friendName: 'Nicole'
		}
	});
    const addButton = wrapper.find('button');
    expect(addButton.text()).toBe('Add Friend')
  });


  it('calls addFriend() method when clicking on the "Add Friend" button', async () => { 
    const wrapper = mount(TheHeader, {
		components: {
			ButtonApp
		},
		props: {
			friendName: 'Nicole'
		}
	});
	const addFriendSpy = vi.spyOn(wrapper.vm, 'addFriend');
    const button = wrapper.find('button');
	await button.trigger('click');
	expect(addFriendSpy).toHaveBeenCalled();
  });


  it('friend name is correct after calling addFriend()', async () => { 
    const wrapper = mount(TheHeader, {
		props: {
			friendName: 'Nicole'
		}
	})
	await wrapper.vm.addFriend();
	expect(wrapper.vm.friendName).toBe('Nicole');
  });


  // it('updates message and messageType after succesfully adding friend', async () => { 
  //   const wrapper = mount(TheHeader, {
		// props: {
			// friendName: 'Nicole'
		// }
	// })
	// await wrapper.vm.addFriend();
  //   expect(wrapper.vm.message).toBe('Successfully added Nicole to your friend list!');
  //   expect(wrapper.vm.messageType).toBe('success')
  // });


  // it('handles not found', async () => { 
	// const wrapper = mount(TheHeader, {
		// components: {
			// ButtonApp
		// },
		// props: {
			// friendName: 'Not Found'
		// }
	// });
	// await wrapper.vm.addFriend();
  //   expect(wrapper.vm.message).toBe('Failed to add Not Found to your friend list.');
  //   expect(wrapper.vm.messageType).toBe('error')
  // });


  // it('handles forbidden', async () => { 
	// const wrapper = mount(TheHeader, {
		// components: {
			// ButtonApp
		// },
		// props: {
			// friendName: 'Forbidden'
		// }
	// });
	// await wrapper.vm.addFriend();
  //   expect(wrapper.vm.message).toBe('Failed to add Forbidden to your friend list.');
  //   expect(wrapper.vm.messageType).toBe('error')
  // });

  // it('handles bad request', async () => { 
	// const wrapper = mount(TheHeader, {
		// components: {
			// ButtonApp
		// },
		// props: {
			// friendName: 'Bad Request'
		// }
	// });
	// await wrapper.vm.addFriend();
  //   expect(wrapper.vm.message).toBe('Failed to add Bad Request to your friend list.');
  //   expect(wrapper.vm.messageType).toBe('error')
  // });


  // it('emits "friendAdded" event after succesfully adding friend', async () => { 
	// const wrapper = mount(TheHeader, {
		// components: {
			// ButtonApp
		// },
		// props: {
			// friendName: 'Nicole'
		// }
	// });
	// await wrapper.vm.addFriend();
  //   expect(wrapper.emitted('friendAdded')).toBeTruthy();
  // });


  // it('does not emit "friendAdded" event after failed adding friend', async () => { 
	// const wrapper = mount(TheHeader, {
		// components: {
			// ButtonApp
		// },
		// props: {
			// friendName: 'Not Found'
		// }
	// });
	// await wrapper.vm.addFriend();
  //   expect(wrapper.emitted('friendAdded')).toBeFalsy();
  // });
})
