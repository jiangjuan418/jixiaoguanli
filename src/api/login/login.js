import requests from '@/router/axios/myAxios'

export function login (params) {
  return requests({
    url: '/myPhpPro/Controller/login/login.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}
