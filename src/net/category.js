import {request} from "./request";

export function insertCategory(data){
  return request({
    url:"/category/",
    method:"post",
    data
  })
}
export function removeCategory(id){
  return request({
    url:"/category/"+id,
    method:"delete",
  })
}
export function modifyCategory(data){
  return request({
    url:"/category/",
    method:"put",
    data
  })
}
export function selectCategory(data){
  return request({
    url:"/category/",
    method:"patch",
    data
  })
}

export function allCategory(){
  return request({
    url:"/category/",
    method:"get"
  })
}
