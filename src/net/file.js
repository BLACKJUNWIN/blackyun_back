import {request} from "./request";

export function uploadFile(data){
  return request({
    url:"/file/uploadImage",
    method:"post",
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

export function net_uploadSliceFile(data){
  return request({
    url:'/filePath/upload_slice_file',
    method:'post',
    data
  })
}

export function net_fileExist(data){
  return request({
    url:"/filePath/file_exist",
    method:"post",
    data
  })
}

export function net_fileCombined(data){
  return request({
    url:"/filePath/file_combined",
    method:"post",
    data
  })
}
export function net_uploadCancel(data){
  return request({
    url:"/filePath/upload_cancel?fileName="+data,
    method:"get",
  })
}

export function net_categoryList(){
  return request({
    url:"/category/",
    method:"get"
  })
}
