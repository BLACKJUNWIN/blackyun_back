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
        prop="size"
        label="大小"
        width="auto">
        <template slot-scope="scope">
          <span>{{scope.row.size/1024>=1024?(scope.row.size/1024/1024).toFixed(2)+" MB":(scope.row.size/1024).toFixed(2)+" KB"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="downTick"
        label="下载次数"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="shareTick"
        label="分享次数"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="注册时间"
        width="auto">
        <template slot-scope="scope">
          {{scope.row.createTime.substring(0,10)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间"
        width="auto">
        <template slot-scope="scope">
          {{scope.row.updateTime.substring(0,10)}}
        </template>
      </el-table-column>
      <el-table-column
        prop="id"
        label="操作"
        width="140">
        <template slot-scope="scope">
          <el-button-group>
            <el-button type="primary" icon="el-icon-edit" @click="editVisible=true;updBefore(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" @click="remove(scope.row.id)"></el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <div style="width:90%;display: flex;justify-content: space-between;margin:0 auto;position:relative;top:-30px">
      <div>
        总共&nbsp{{total}}&nbsp条数据,共&nbsp{{Math.ceil(total/10)}}&nbsp页,当前为第&nbsp<strong style="color: #3a8ee6;font-size: 21px">{{this.filterParam.page}}</strong>&nbsp页
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
          <b v-if="!isAdd||isUpload">{{editParam.name}}</b>
        <el-upload
          v-if="!isUpload&&isAdd"
          class="upload-demo"
          action="#"
          :on-change="getFile"
          multiple
          :limit="1"
          :auto-upload="false">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">暂时不支持文件夹，且不超过2MB</div>
        </el-upload>
        </el-form-item>
        <el-form-item label="软件名">
          <el-input v-model="editParam.name" :disabled="isAdd"></el-input>
        </el-form-item>
        <el-form-item label="软件分类">
          <el-select v-model="editParam.categoryId">
            <el-option v-for="(item,index) in category" :key="index" :value="item.id" :label="item.category"/>
          </el-select>
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
    <el-button  type="info" @click="deleteFile()">取 消</el-button>
    <el-button type="success" @click="editVisible = false;editButton()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import FilterPlant from "../../components/filterPlant/filterPlant";
import {insertSoftware, modifySoftware, removeSoftware, selectSoftware} from "../../net/software";
import {removeFile, uploadFile} from "../../net/file";
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
        page:1
      },
      tableData:'',
      total:'',
      editTitle:'',
      category:'',
      editVisible:false,
      editParam:{
        name: '',
        categoryId:'',
        size: '',
        downTick: '',
        shareTick: '',
        realName:'',
        path:'',
        type:'',
        md5: ''
      },
      isAdd:true,
      isUpload:false,
    }
  },
  created: async function () {
    await this.list();
    this.category=(await allCategory()).data;
  },
  methods:{
    async list(){
      let res=await selectSoftware(this.filterParam);
      this.tableData=res.data.records;
      this.total=res.data.total;
    },
    async add(){
      this.editParam.size*=1024;
      this.setParam(await insertSoftware(this.editParam));
    },
    async remove(id){
      this.setParam(await removeSoftware(id));
    },
    async update(){
      this.editParam.size*=1024;
      this.setParam(await modifySoftware(this.editParam));
    },
    addBefore(){
      this.isAdd=true;
      this.isUpload=false;
      this.editParam={
        name: '',
        categoryId:'1534448966809767937',
        size: '',
        downTick: '',
        shareTick: '',
        realName:'',
        path:'',
        type:'',
        md5: ''
      }
      this.editTitle=this.$route.name+"(新增)";
    },
    async updBefore(id){
      this.isAdd=false;
      this.filterParam.id=id;
      this.editParam=(await selectSoftware(this.filterParam)).data.records[0];
      this.editParam.size=(this.editParam.size/1024).toFixed(2);
      this.filterParam.id='';
      this.editTitle=this.$route.name+"(修改)";
    },
    reset(){
      this.filterParam={
        category: "",
        page:1
      }
      this.list();
    },
    editButton(){
      if(this.isAdd){
        this.add();
      }else{
        this.update();
      }
    },
    changePage(page){
      this.filterParam.page=page;
      this.list();
    },
    async getFile(file){
      this.editParam.name=file.name;
      this.editParam.size=(file.size/1024).toFixed(2);
      //生成MD5
      let fr = new FileReader();
      let spark=new SparkMD5.ArrayBuffer();
      fr.readAsArrayBuffer(file.raw)
      let md5;
      fr.onload = async (e)=> {
        spark.append(e.target.result);
        md5= spark.end(false);
        this.editParam.md5=md5;
        let data = new FormData();
        data.append("file",file.raw);
        data.append("category","software")
        data.append("md5",md5);
        let res=await uploadFile(data);
        if(res.code==="200"){
          this.editParam.path=res.data.path;
          this.editParam.realName=res.data.realName;
          this.editParam.type=res.data.type;
          this.isUpload=true;
        }
        this.$store.commit("tip",res);
      };
    },
    setParam(res){
      if(res.code==="200"){
        this.tableData=res.data.records;
        this.total=res.data.total;
      }
      this.$store.commit("tip",res);
    },
    async deleteFile(){
      this.editVisible=false;
      if(this.isUpload){
        let res=await removeFile({filePath:this.editParam.path});
        this.$store.commit("tip",res);
        this.isUpload=false;
      }
    }
  }
}
</script>

<style scoped>

</style>
