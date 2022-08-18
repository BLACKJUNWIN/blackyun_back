<template>
  <div>
    <filter-plant>
      <el-form-item slot="filters">
        <el-col :span="8">
          <el-form-item label="软件名">
            <el-input v-model:value="filterParam.name" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col  :span="1">&nbsp</el-col>
        <el-col :span="8">
          <el-form-item label="用户名">
            <el-input v-model:value="filterParam.userName" placeholder="请输入内容"></el-input>
          </el-form-item>
        </el-col>
        <el-col  :span="1">&nbsp</el-col>
        <el-col :span="6">
          <el-form-item label="星级">
          <el-rate style="position: relative;top:10px" v-model="filterParam.level" show-score allow-half text-color="#ff9900"></el-rate>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-button type="primary" slot="button" @click="list()">搜索</el-button>
<!--      <el-button type="success" slot="button" @click="editVisible=true;addBefore()">新增</el-button>-->
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
        prop="userName"
        label="用户名"
        width="auto">
      </el-table-column>
      <el-table-column
        prop="level"
        label="评价"
        width="auto">
        <template slot-scope="scope">
          <el-rate
            :value="parseFloat(scope.row.level)"
            disabled
            allow-half
            text-color="#ff9900">
          </el-rate>
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
      center>
      <el-form>
        <el-form-item label="分类名">
          <el-input disabled v-model="editParam.name"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input disabled v-model="editParam.userName"></el-input>
        </el-form-item>
        <el-form-item label="星级">
          <el-input-number v-model="editParam.level" :precision="1" :step="0.5" :max="5"></el-input-number>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button  type="info" @click="editVisible = false">取 消</el-button>
    <el-button type="success" @click="editVisible = false;editButton()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
import FilterPlant from "../../components/filterPlant/filterPlant";
import {insertCategory, modifyCategory, removeCategory, selectCategory} from "../../net/category";
import {insertEvaluation, modifyEvaluation, removeEvaluation, selectEvaluation} from "../../net/evaluation";

export default {
  name: "evaluation",
  components: {FilterPlant},
  data() {
    return {
      filterParam: {
        name: "",
        userName: "",
        level:"",
        page:1
      },
      tableData:'',
      total:'',
      editTitle:'',
      editVisible:false,
      editParam:{
        category:'',
        userName: "",
        level:"",
      },
      isAdd:true
    }
  },
  async created() {
    await this.list();
  },
  methods:{
    async list(){
      let res=await selectEvaluation(this.filterParam);
      this.tableData=res.data.records;
      this.total=res.data.total;
    },
    async add(){
      this.setParam(await insertEvaluation(this.editParam));
    },
    async remove(id){
      this.setParam(await removeEvaluation(id));
    },
    async update(){
      this.setParam(await modifyEvaluation(this.editParam));
    },
    addBefore(){
      this.isAdd=true;
      this.editParam={
        category:'',
      }
      this.editTitle=this.$route.name+"(新增)";
    },
    async updBefore(id){
      this.isAdd=false;
      this.filterParam.id=id;
      this.editParam=(await selectEvaluation(this.filterParam)).data.records[0];
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
    getFile(file){
      console.log(file);
    },
    setParam(res){
      if(res.code==="200"){
        this.tableData=res.data.records;
        this.total=res.data.total;
      }
      this.$store.commit("tip",res);
    }
  }
}
</script>

<style scoped>

</style>
