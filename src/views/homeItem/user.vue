<template>
  <div>
    <filter-plant>
      <el-form-item slot="filters">
        <el-col :span="8">
          <el-form-item label="用户名">
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
        label="用户名"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="password"
        label="密码"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="avatar"
        label="头像"
        width="100">
        <template slot-scope="scope">
          <img :src="scope.row.avatar" width="80px" style="border-radius: 50%" alt="avatar"/>
        </template>
      </el-table-column>
      <el-table-column
        prop="role"
        label="权限"
        width="auto">
        <template slot-scope="scope">
          <span>{{scope.row.role==="user"?"用户":"管理员"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="vip"
        label="级别"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="memory"
        label="存储大小"
        width="auto">
        <template slot-scope="scope">
          <span>{{scope.row.memory/1048576>=1024?(scope.row.memory/1048576/1024).toFixed(2)+" GB":(scope.row.memory/1048576).toFixed(2)+" MB"}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="speed"
        label="下行限速"
        width="auto">
        <template slot-scope="scope">
          <span>{{(scope.row.speed/1024).toFixed(2)+" M"}}</span>
        </template>
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
        <el-form-item label="用户名">
          <el-input v-model="editParam.name"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="editParam.password" show-password ></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <div>&nbsp</div>
          <div style="display: flex">
            <div style="flex: none;margin-right: 30px" v-if="isUpload||!isAdd">
              <img :src="editParam.avatar" style="width: 80px;" alt="头像"/>
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
        <el-form-item label="权限">
          <el-select v-model="editParam.role" clearable placeholder="请选择">
            <el-option label="管理员" value="admin"/>
            <el-option label="用户" value="user"/>
          </el-select>
        </el-form-item>
        <el-form-item label="级别">
          <el-input v-model="editParam.vip"></el-input>
        </el-form-item>
        <el-form-item label="储存大小(kb)">
          <el-input v-model="editParam.memory" type="number"></el-input>
        </el-form-item>
        <el-form-item label="下行限速(kb)">
          <el-input v-model="editParam.speed" type="number"></el-input>
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
import {insertUser, modifyUser, removeUser, selectUser} from "../../net/user";
import {removeFile, uploadFile} from "../../net/file";
import md5 from 'js-md5'

export default {
  name: "user",
  components: {FilterPlant},
  data() {
    return {
      filterParam: {
        name: "",
        page:1
      },
      tableData:'',
      total:'',
      editTitle:'',
      editVisible:false,
      editParam:{
        name:'',
        avatar:'',
        password:'',
        role:'',
        vip:'',
        memory:'',
        speed:'',
      },
      isAdd:true,
      isUpload:false,
    }
  },
  async created() {
    await this.list();
  },
  methods:{
    async list(){
      let res=await selectUser(this.filterParam);
      this.tableData=res.data.records;
      this.total=res.data.total;
    },
    async add(){
      this.editParam.password=md5(this.editParam.password);
      this.setParam(await insertUser(this.editParam));
    },
    async remove(id){
      this.setParam(await removeUser(id));
    },
    async update(){
      this.editParam.password=md5(this.editParam.password);
      this.setParam(await modifyUser(this.editParam));
    },
    addBefore(){
      this.isAdd=true;
      this.editParam={
        name:'',
        password: '',
        avatar:'',
        role:'',
        vip:'',
        memory:'',
        speed:'',
      }
      this.editTitle=this.$route.name+"(新增)";
    },
    async updBefore(id){
      this.isAdd=false;
      this.filterParam.id=id;
      this.editParam=(await selectUser(this.filterParam)).data.records[0];
      this.filterParam.id='';
      this.editTitle=this.$route.name+"(修改)";
    },
    reset(){
      this.filterParam={
        name: "",
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
          this.editParam.avatar=res.data.path;
          this.isUpload=true;
        }
      }
      this.$refs.upload.clearFiles();
      this.$store.commit("tip",res);
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
        let res=await removeFile({filePath:this.editParam.avatar});
        this.$store.commit("tip",res);
        this.isUpload=false;
      }
    }
  }
}
</script>

<style scoped>

</style>
