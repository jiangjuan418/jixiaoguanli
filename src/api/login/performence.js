import requests from '@/router/axios/myAxios'

export function getPerformenceList (params) {
  return requests({
    url: '/myPhpPro/Controller/performence/performenceList.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function getVoteDetail (params) {
  return requests({
    url: '/myPhpPro/Controller/performence/voteDetail.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}
export function uploadImg (params) {
  return requests({
    url: '/myPhpPro/Controller/logo/saveLogo.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}
