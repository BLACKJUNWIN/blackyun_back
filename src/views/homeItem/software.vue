<template>
  <div>
    <filter-plant>
      <el-form-item slot="filters">
        <el-col :span="8">
          <el-form-item label="软件名">
            <el-input v-model:value="filterParam.name" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-button type="primary" slot="button" @click="list()">搜索</el-button>
      <el-button type="success" slot="button" @click="editVisible=true;addBefore()">新增</el-button>
      <el-button type="info" slot="button" @click="reset()">重置</el-button>
    </filter-plant>
    <!--    表单-->
    <el-table
      :data="tableData"
      stripe
      style="width:90%;margin:50px auto;border-radius:1em;box-shadow: 0 0 3px rgba(128,128,128,0.5)"
    >
      <el-table-column
        prop="name"
        label="软件名"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="image"
        label="图标"
        width="100">
        <template slot-scope="scope">
          <img :src="scope.row.image" width="80px" style="border-radius: 50%" alt="icon"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="category"
        label="分类"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="url"
        label="官网地址"
        width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.url === '' ? "暂无" : scope.row.url.substring(0, 8) + "..." }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="size"
        label="大小"
        width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.size / 1024 >= 1024 ? (scope.row.size / 1024 / 1024).toFixed(2) + " MB" : (scope.row.size / 1024).toFixed(2) + " KB" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="downTick"
        label="下载"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="shareTick"
        label="分享"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="advantages"
        label="优点"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="shortcomings"
        label="缺点"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="verify"
        label="审核"
        width="auto">
        <template slot-scope="scope">
          <span>{{ scope.row.verify === "1" ? "审核通过" : "待审核" }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        width="auto">
        <template slot-scope="scope">
          {{ scope.row.createTime.substring(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="auto">
        <template slot-scope="scope">
          {{ scope.row.updateTime.substring(0, 10) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
        width="200">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" @click="editVisible=true;updBefore(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="remove(scope.row.id)"></el-button>
            <el-button title="取消审核" v-if="scope.row.verify==='1'" type="success" icon="el-icon-bell"
                       @click="verify(scope.row.id)"></el-button>
            <el-button title="通过" v-else type="warning" icon="el-icon-message-solid"
                       @click="verify(scope.row.id)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:90%;display: flex;justify-content: space-between;margin:0 auto;position:relative;top:-30px">
      <div>
        总共&nbsp{{ total }}&nbsp条数据,共&nbsp{{ Math.ceil(total / 10) }}&nbsp页,当前为第&nbsp<strong
        style="color: #3a8ee6;font-size: 21px">{{ this.filterParam.page }}</strong>&nbsp页
      </div>
      <el-pagination style="position:relative"
                     background
                     :current-page="filterParam.page"
                     layout="prev, pager, next"
                     @current-change="changePage"
                     :total="parseInt(total)">
      </el-pagination>
    </div>
    <!--    新增-->
    <el-dialog
      :title="editTitle"
      :visible.sync="editVisible"
      width="40%"
      :before-close="deleteFile"
      center>
      <el-form>
        <el-form-item label="上传的文件">
          <div>&nbsp</div>
          <b v-if="!isAdd||isUpload">{{ editParam.name }}</b>
          <input type="file" style="display: none" id="upload" @change="fileParse()">
          <el-button size="small" type="primary" @click="clickUpload()" v-if="!isUpload">点击上传</el-button>
        </el-form-item>
        <el-form-item label="软件名">
          <el-input v-model="editParam.name"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <div>&nbsp</div>
          <div style="display: flex">
            <div style="flex: none;margin-right: 30px" v-if="isUpload||!isAdd">
              <img :src="editParam.image" style="width: 80px;" alt="头像"/>
            </div>
            <el-upload
              ref="upload"
              v-if="!isUpload"
              class="upload-demo"
              action="#"
              :on-change="getFile"
              multiple
              :limit="1"
              :auto-upload="false">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="软件官网">
          <el-input v-model="editParam.url"></el-input>
        </el-form-item>
        <el-form-item label="软件分类">
          <el-select v-model="editParam.categoryId">
            <el-option v-for="(item,index) in category" :key="index" :value="item.id" :label="item.category"/>
          </el-select>
        </el-form-item>
        <el-form-item label="优点">
          <el-input v-model="editParam.advantages"></el-input>
        </el-form-item>
        <el-form-item label="缺点">
          <el-input v-model="editParam.shortcomings"></el-input>
        </el-form-item>
        <el-form-item label="大小(kb)">
          <el-input v-model="editParam.size" disabled></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-input v-model="editParam.type" disabled></el-input>
        </el-form-item>
        <el-form-item label="MD5">
          <el-input v-model="editParam.md5" disabled></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button type="info" @click="deleteFile()">取 消</el-button>
    <el-button type="success" @click="editVisible = false;editButton()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import FilterPlant from "../../components/filterPlant/filterPlant";
import {insertSoftware, modifySoftware, net_verify, removeSoftware, selectSoftware} from "../../net/software";
import {
  net_fileCombined,
  net_fileExist,
  net_uploadCancel,
  net_uploadSliceFile,
  removeFile,
  uploadFile
} from "../../net/file";
import SparkMD5 from "spark-md5";
import {allCategory} from "../../net/category";

export default {
  name: "software",
  components: {FilterPlant},
  data() {
    return {
      filterParam: {
        name: '',
        size: '',
        downTick: '',
        shareTick: '',
        page: 1
      },
      tableData: '',
      total: '',
      editTitle: '',
      category: '',
      editVisible: false,
      editParam: {
        fileId:'',
        name: '',
        categoryId: '',
        category: '',
        size: '',
        downTick: '',
        shareTick: '',
        url: '',
        type: '',
        md5: '',
        image:'',
        advantages:'',
        shortcomings:''
      },
      isAdd: true,
      isUpload: false,
      sliceTotal: 0,
      hash: "",
      uploadList: [],
      uploadFileName: "",
      uploadFileRealName: "",
      fileUploaded: 0,
      path: "/temp/"
    }
  },
  watch: {
    "$store.state.uploadCancel": async (newData, oldData) => {
      if (newData) {
        await net_uploadCancel(this.$store.state.uploadMd5 + this.$store.state.uploadFileName.substring(this.$store.state.uploadFileName.lastIndexOf(".")))
        document.querySelector('#upload').value = "";
        sessionStorage.removeItem("uploadIndexMax")
        sessionStorage.removeItem("uploadPath");
        sessionStorage.removeItem("uploadFileName");
        sessionStorage.removeItem("uploadMd5");
        this.$store.state.uploadIndexMax = 1;
        this.$store.state.uploadPath = "";
        this.$store.state.uploadFileName = "";
        this.$store.state.uploadMd5 = "";
        let res = {
          code: "201",
          message: "文件取消上传!"
        }
        this.$store.commit("tip", res);
      }
    }
  },
  created: async function () {
    await this.list();
    this.category = (await allCategory()).data;
  },
  methods: {
    async getFile(file){
      let res={
        code:"500",
        message:"文件超过500kb,请重新选择"
      }
      if(file.raw.size<1024*1024){
        let data = new FormData();
        data.append("file",file.raw);
        data.append("category","icon");
        res=await uploadFile(data);
        if(res.code==="200"){
          this.editParam.image=res.data.path;
          this.isUpload=true;
        }
      }
      this.$refs.upload.clearFiles();
      this.$store.commit("tip",res);
    },
    //调用原生上传按钮
    clickUpload() {
      document.querySelector('#upload').click();
    },
    //文件上传开始,分流
    async uploadFile() {
      //获取文件并创建传递data数组
      this.$store.state.loading = false;
      let fileData = document.querySelector('#upload').files[0];
      let res = await net_fileExist({md5: this.hash, path: this.path, name: fileData.name});
      if (res.code !== "200") {
        this.sliceTotal = Math.ceil(fileData.size / (1024 * 1024));
        this.uploadFileName = fileData.name;
        this.uploadFileRealName = this.hash + fileData.name.substring(fileData.name.lastIndexOf("."));
        await this.fileSlice(fileData);
      } else {
        this.editParam.name = res.data.name;
        this.editParam.size = res.data.size;
        this.editParam.type = res.data.type;
        this.editParam.md5 = res.data.md5;
        let res2 = {
          code: "201",
          message: "达到秒传条件,上传成功!"
        }
        this.editParam.fileId=res.data.id;
        console.log(res.data.id);
        this.$store.commit("tip", res2);
        //清空文件
        document.querySelector('#upload').value = "";
      }
    },
    //文件解析完后开始上传
    async fileParse() {
      this.$store.state.loading = true;
      //获取文件并创建传递data数组
      let fileData = document.querySelector('#upload').files[0];
      //获取buffer模式文件,并创建md5码
      let sparkMD5 = new SparkMD5.ArrayBuffer();
      let fileReader = new FileReader();
      fileReader.readAsArrayBuffer(fileData);//将文件转为buffer模式
      fileReader.onload = async (e) => {
        sparkMD5.append(e.target.result);
        this.hash = sparkMD5.end(false);
        await this.uploadFile();
      }
    },

    //文件拆分
    async fileSlice(fileData) {
      let cur = 0;
      for (let i = 0; i < this.sliceTotal; i++) {
        let item = {
          raw: fileData.slice(cur * 1024 * 1024, (cur + 1) * 1024 * 1024),
          index: i,
          name: this.uploadFileName,
          total: this.sliceTotal
        }
        this.uploadList.push(item);
        cur++;
      }
      if (this.$store.state.uploadMd5) {
        if (sessionStorage.getItem("uploadMd5") === this.hash) {
          let res = {
            code: "201",
            message: "文件完成验证,正在继续上传!"
          }
          this.$store.commit("tip", res);
          await this.responseFiles(parseInt(sessionStorage.getItem("uploadIndex")));
        } else {
          let res = {
            code: "500",
            message: "与原文件不符,正在上传新文件!"
          }
          this.$store.commit("tip", res);
          sessionStorage.removeItem("uploadIndexMax")
          sessionStorage.removeItem("uploadIndex")
          sessionStorage.removeItem("uploadPath");
          sessionStorage.removeItem("uploadFileName");
          sessionStorage.removeItem("uploadMd5");
          this.$store.state.uploadIndexMax = 1;
          this.$store.state.uploadPath = "";
          this.$store.state.uploadFileName = "";
          this.$store.state.uploadMd5 = "";
          await this.responseFiles();
        }
      }
      await this.responseFiles();
      this.uploadList = [];
      this.sliceTotal = 0;
    },

    //文件分段上传
    async responseFiles(index = 0) {
      this.$store.state.uploadIndexMax = this.uploadList.length;
      this.$store.state.uploadPath = this.path;
      this.$store.state.uploadFileName = this.uploadFileName;
      this.$store.state.uploadMd5 = this.hash;
      sessionStorage.setItem("uploadIndexMax", this.uploadList.length + "");
      sessionStorage.setItem("uploadPath", this.path);
      sessionStorage.setItem("uploadFileName", this.uploadFileName);
      sessionStorage.setItem("uploadMd5", this.hash);
      await this.uploadFileUpload();
      if (this.fileUploaded === 1) {
        let res = await net_fileCombined({
          md5: this.hash,
          realName: this.uploadFileRealName,
          name: this.uploadFileName,
          path: this.path
        });
        this.editParam.fileId=res.data.id;
        this.$store.commit("tip", res);
        if (res.code === "200") {
          this.editParam.name = res.data.name;
          this.editParam.size = res.data.size;
          this.editParam.type = res.data.type;
          this.editParam.md5 = res.data.md5;
          this.isAdd=true;
        }
        this.fileUploaded = 0;
      }
      //清空文件
      document.querySelector('#upload').value = "";
      sessionStorage.removeItem("uploadIndex")
      sessionStorage.removeItem("uploadIndexMax")
      sessionStorage.removeItem("uploadPath");
      sessionStorage.removeItem("uploadFileName");
      sessionStorage.removeItem("uploadMd5");
      this.$store.state.uploadCancel = false;
      this.$store.state.uploadIndexMax = 1;
      this.$store.state.uploadPath = "";
      this.$store.state.uploadFileName = "";
      this.$store.state.uploadMd5 = "";
    },

    async uploadFileUpload(index = -1) {
      index += 1;
      if (index === this.$store.state.uploadIndexMax) {
        this.fileUploaded = 1;
        return 0;
      }
      this.$store.state.uploadIndex = index;
      sessionStorage.setItem("uploadIndex", index + "");
      let uploadData = new FormData();
      uploadData.append("fileName", this.uploadFileRealName);
      uploadData.append("file", this.uploadList[index].raw);
      uploadData.append("index", this.uploadList[index].index);
      uploadData.append("total", this.sliceTotal);
      uploadData.append("md5", this.hash);
      uploadData.append("path", this.path);
      uploadData.append("name", this.uploadFileName);
      let res = await net_uploadSliceFile(uploadData);
      if (res.code === "200") {
        if (this.$store.state.uploadCancel) {
          return 0;
        }
        await this.uploadFileUpload(parseInt(res.data))
      } else {
        let res = {
          code: "500",
          message: "上传中断!"
        }
        this.$store.commit("tip", res);
        this.$store.state.uploadInterrupt = true;
      }
    },
    async verify(id) {
      let res = await net_verify({id: id});
      this.$store.commit("tip", res);
      await this.list();
    },
    async list() {
      let res = await selectSoftware(this.filterParam);
      this.tableData = res.data.records;
      this.total = res.data.total;
    },
    async add() {
      this.editParam.size *= 1024;
      this.setParam(await insertSoftware(this.editParam));
    },
    async remove(id) {
      this.setParam(await removeSoftware(id));
    },
    async update() {
      this.editParam.size *= 1024;
      this.setParam(await modifySoftware(this.editParam));
    },
    addBefore() {
      this.isAdd = true;
      this.isUpload = false;
      this.editParam = {
        fileId:'',
        name: '',
        categoryId: '1534448966809767937',
        category: '通用',
        size: '',
        downTick: '',
        shareTick: '',
        realName: '',
        url: '',
        type: '',
        md5: '',
        image:'',
        advantages:'啥也没写',
        shortcomings:'啥也没写'
      }
      this.editTitle = this.$route.name + "(新增)";
    },
    async updBefore(id) {
      this.isAdd = false;
      this.filterParam.id = id;
      this.editParam = (await selectSoftware(this.filterParam)).data.records[0];
      this.editParam.size = (this.editParam.size / 1024).toFixed(2);
      this.filterParam.id = '';
      this.editTitle = this.$route.name + "(修改)";
    },
    reset() {
      this.filterParam = {
        category: "",
        page: 1
      }
      this.list();
    },
    editButton() {
      if (this.isAdd) {
        this.add();
      } else {
        this.update();
      }
    },
    changePage(page) {
      this.filterParam.page = page;
      this.list();
    },
    setParam(res) {
      if (res.code === "200") {
        this.tableData = res.data.records;
        this.total = res.data.total;
      }
      this.$store.commit("tip", res);
    },
    async deleteFile() {
      this.editVisible = false;
    }
  },
}
</script>

<style scoped>

</style>
