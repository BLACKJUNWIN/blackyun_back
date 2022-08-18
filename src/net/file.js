import {request} from "./request";

export function uploadFile(data){
  return request({
    url:"/fileUtils/",
    method:"post",
    headers: {
      'Content-Type': 'multipart/form-data;'
    },
    data
  })
}

export function downFile(data){
  return request({
    url:"/fileUtils/",
    method:"get",
    data
  })
}

export function removeFile(data){
  return request({
    url:"/fileUtils/",
    method:"delete",
    data
  })
}
