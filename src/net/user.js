import {request} from "./request";

export function insertUser(data){
  return request({
    url:"/user/",
    method:"post",
    data
  })
}

export function removeUser(id){
  return request({
    url:"/user/"+id,
    method:"delete",
  })
}

export function modifyUser(data){
  return request({
    url:"/user/",
    method:"put",
    data
  })
}

export function selectUser(data){
  return request({
    url:"/user/",
    method:"patch",
    data
  })
}

export function login(data){
  return request({
    url:"/user/login",
    method:"post",
    data
  })
}
