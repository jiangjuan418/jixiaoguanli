import requests from '@/router/axios/myAxios'

export function getManagerList (params) {
  return requests({
    url: '/myPhpPro/Controller/manager/getManager.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function delManager (params) {
  return requests({
    url: '/myPhpPro/Controller/manager/delManager.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function getDepts (params) {
  return requests({
    url: '/myPhpPro/Controller/manager/getDepts.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function getAllDepts (params) {
  return requests({
    url: '/myPhpPro/Controller/manager/getAllDepts.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function getUsersOfTheDept (params) {
  return requests({
    url: '/myPhpPro/Controller/manager/getUsersOfTheDept.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function editManager (params) {
  return requests({
    url: '/myPhpPro/Controller/manager/editManager.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function addManager (params) {
  return requests({
    url: '/myPhpPro/Controller/manager/addManager.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}
