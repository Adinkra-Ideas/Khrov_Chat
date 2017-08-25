import { useAuthStore } from '@/stores/auth'

const server = import.meta.env.VITE_BACKEND_SERVER_URI

export function useGlobal() {
  const trimDate = (theDate: string) => {
    return theDate.slice(0, 10) + ' ' + theDate.slice(11, 19)
  }

  const authStore = useAuthStore();
  const fetchForKhrov = async (path: string, meth: string, body: object): Promise<any> => {
    if (! meth.match(/^GET$|^HEAD$|^POST$|^PUT$|^PATCH$|^DELETE$/i) ) return;
    const response = await useFetch(server + path, meth, body);
    if (!response) {
      return false;
    }
    else if (response && response.status===401) {
      const refreshResponse = await useFetch(server + '/auth/refresh', 'GET', {});
      if (refreshResponse.ok) {
        return fetchForKhrov(path, meth, body)
      }
      else {
        authStore.setLoginStatus(false);
        return false;
      }
    }
    return response;
  }
  const useFetch = async (path: string, meth: string, body: object): Promise<any> => {
    try {
      const res = await fetch(path, {
        method: meth,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: meth.match(/^GET$|^HEAD$/i) ? undefined : JSON.stringify(body),
        credentials: 'include'
      })
      return res;
    } catch (error) {
      return false;
    }
  }
  
  return { 
    trimDate, 
    fetchForKhrov,
  
  }
}
