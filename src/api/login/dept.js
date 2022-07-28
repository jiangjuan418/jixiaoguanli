import requests from '@/router/axios/myAxios'

export function getDeptList (params) {
  return requests({
    url: '/myPhpPro/Controller/dept/getDept.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function delDept (params) {
  return requests({
    url: '/myPhpPro/Controller/dept/delDept.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function getManagers (params) {
  return requests({
    url: '/myPhpPro/Controller/dept/getManagers.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function addDept (params) {
  return requests({
    url: '/myPhpPro/Controller/dept/addDept.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function getUsersOfTheSameDept (params) {
  return requests({
    url: '/myPhpPro/Controller/dept/getUsersOfTheSameDept.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}

export function editDept (params) {
  return requests({
    url: '/myPhpPro/Controller/dept/editDept.php',
    method: 'post',
    data: params // post请求，params在data里
  })
}
