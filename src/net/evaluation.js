import {request} from "./request";

export function insertEvaluation(data){
  return request({
    url:"/evaluation/",
    method:"post",
    data
  })
}
export function removeEvaluation(id){
  return request({
    url:"/evaluation/"+id,
    method:"delete",
  })
}
export function modifyEvaluation(data){
  return request({
    url:"/evaluation/",
    method:"put",
    data
  })
}
export function selectEvaluation(data){
  return request({
    url:"/evaluation/",
    method:"patch",
    data
  })
}
