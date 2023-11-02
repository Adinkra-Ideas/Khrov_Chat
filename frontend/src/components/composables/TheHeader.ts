import { reactive } from 'vue'
import { onMounted, onUnmounted } from 'vue'
import type { TheHeader } from '@/components/interface/khrov-chat'

export function useTheHeader() {
  const vars: TheHeader = reactive({
    MobileMenuWidth: '0vh',
    MobileMenuAfterWidth: '0vh',
    HeaderBgChangeOnScroll: 'transparent', //100 onVisitorArrival, 50 on scroll
  })

  const headerHeightResize = (scrollYPos: number) => {
    if (scrollYPos > 50) {
      vars.HeaderBgChangeOnScroll = 'var(--header-bg)';
    } else {
      vars.HeaderBgChangeOnScroll = 'transparent';
    }
  }
  let headerHeightResizeBusy = false;
  const resizeHeaderHeightOnScroll = () => {
    
    const scrollPosition = window.scrollY;
    // Since scroll events can fire at a high rate, the function
    // called onScroll shouldn't execute at every scroll. Instead,
    // it is recommended to throttle the event using requestAnimationFrame().
    // Only enter this loop only when headerHeightResize not Busy
    // else roll past and keep settin headerHeightResizeBusy as true
    // until this requestAnimationFrame has completed. only then will
    // headerHeightResize be set as not busy so as to accept next
    if (!headerHeightResizeBusy) {
      window.requestAnimationFrame(() => {
        headerHeightResize(scrollPosition);
        headerHeightResizeBusy = false;
      });
    }
    headerHeightResizeBusy = true;
  }

  onMounted(() => {
    window.addEventListener('scroll', resizeHeaderHeightOnScroll);
  })
  onUnmounted(() => {
    window.removeEventListener('scroll', resizeHeaderHeightOnScroll);
  })

  return { 
    vars,
    headerHeightResize,
    resizeHeaderHeightOnScroll,
  }
}
