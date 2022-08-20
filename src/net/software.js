import {request} from "./request";

export function insertSoftware(data){
  return request({
    url:"/software/",
    method:"post",
    data
  })
}
export function removeSoftware(id){
  return request({
    url:"/software/"+id,
    method:"delete",
  })
}
export function modifySoftware(data){
  return request({
    url:"/software/",
    method:"put",
    data
  })
}
export function selectSoftware(data){
  return request({
    url:"/software/",
    method:"patch",
    data
  })
}

export function net_verify(data){
  return request({
    url:"/software/verify",
    method:"post",
    data
  })
}

