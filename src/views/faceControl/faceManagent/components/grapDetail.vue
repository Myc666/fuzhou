<template>
  <el-dialog
    title="分组管理"
    :visible.sync="visible"
    width="30%"
    @update:visible="val => $emit('update:visible', val)"
    append-to-body>
    <div style="overflow: hidden;"> 
      <div>
        <span>名称：</span>
        <el-input style="width: 200px;margin: 0 20px;" maxlength="10" :disabled="disabled" placeholder="请输入名称" v-model="formatData.name"></el-input>
        <el-button size="mini" :disabled="disabled" type="primary" @click="addgrap()">新增</el-button>

      </div>
      
      <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作"
        width="180">
        <template slot-scope="scope">
          <el-button @click="delGrap( scope.row.id )" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
      <!-- <span slot="footer" class="footer">
        <el-button size="mini" :disabled="disabled" type="primary" @click="save();closeDialog();">确 定</el-button>
        <el-button size="mini"  @click="closeDialog">取 消</el-button>
      </span> -->
    </div>
  </el-dialog>
</template>
<script>
import { listPageDGroup,saveGroup,delectGroup } from '../api'
export default {
  components: {
  },
  props:{
    visible:Boolean,
    currentItme:Object,
    currentState:String
  },
  data() {
    return {
      formatData:{},
      tableData:[]
    };
  },
  computed:{
    
  },
  created(){
    this.int()
  },
  methods: {
    int(){
      this.getTable()
    },
    async addgrap(){
      if(!this.formatData.name){
        this.$message.warning("名称不能为空")
        return
      }

      if(this.tableData.findIndex(item=>item.name == this.formatData.name) > -1){
        this.$message.warning("名称重复")
        return
      }


      const { data,code } = await saveGroup({
        name:this.formatData.name
      })
      if(code == 0){
        this.$message.success("新增成功")
        this.getTable()
      }
    },
    async delGrap(id){
      this.$confirm(`确定删除该条数据?`, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(async () => {
						const { data,code } = await delectGroup({id:id})
            if(code == 0){
              this.$message.success("删除成功")
              this.getTable()
            }
					})
					.catch(() => {});
      
      
    },
    async getTable(){
      const { data,count } = await listPageDGroup()
      const newArr = data.filter((item)=>{
        return item.name != "总计"
      })
      this.tableData = newArr

    },
    closeDialog() {
      this.$emit('update:visible', false)
      this.$emit('close', false)
    },
    async save(){
      const { code,data } =await saveGroup(this.formatData)
      if(code == 0) {
        this.$message.success('保存成功')
        this.closeDialog()
      }
    },
    changes(val){
      this.formatData.nameEn =  val.replace(/[^a-zA-Z]/g,'')
    }
  },
};
</script>
<style scoped>
.bg {
  background: white;
}
.wh{
  width: 100%;
  height: 100%;
}
.footer{
  float: right;
}
</style>