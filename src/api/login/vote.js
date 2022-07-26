import requests from '@/router/axios/myAxios'

export function getVote (params) {
  return requests({
    url: '/myPhpPro/Controller/vote/getVote.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}
export function getNotVote (params) {
  return requests({
    url: '/myPhpPro/Controller/vote/getNotVote.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function addVote (params) {
  return requests({
    url: '/myPhpPro/Controller/vote/addVote.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}
