<template>
  <div>
    <div class="bg">
        <!-- <el-button
            type="primary"
            icon="el-icon-plus"
            @click="addData"
            style="margin-bottom: 10px;"
            >新增菜单</el-button
          > -->
      <el-table
        :data="dataSource"
        row-key="id"
        border 
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
        <el-table-column label="序号" prop="index" align="center" width="60"></el-table-column>
        <el-table-column prop="name" align="center" label="名称"></el-table-column>
        <el-table-column prop="path" align="center" label="菜单路由"></el-table-column>
        <el-table-column prop="filePath" align="center" label="菜单路径"></el-table-column>
        <el-table-column prop="type" align="center" label="菜单类型" width="120">
          <template slot-scope="scope">
            {{ getType(scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column prop="auth" align="center" label="菜单编码"></el-table-column>
        <el-table-column label="操作" align="center" width="100">
          <template slot-scope="scope">
            <el-button type="text"  @click.stop="edit(scope.row)">编辑</el-button>
            <el-button type="text"  style="color: #f56c6c !important" @click.stop="del(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <AddAccount
      :currentAccount="currentAccount"
      v-if="addAccountVisible"
      @close="(addAccountVisible = false), getTable()"
    />
  </div>
</template>
<script>
import Tables from "@/components/Table/index.vue";
import AddAccount from "./components/detail.vue";
import { listData,del } from "./api";
import { getMyDate } from "@/utils/common.js";
export default {
  data() {
    return {
      loading: false,
      dataSource: [],
      formatData: {},
      addAccountVisible: false,
    };
  },
  components: {
    Tables,
    AddAccount,
  },
  created() {
    this.getTable();
  },
  methods: {
    async getTable() {
      this.formatData = {
        ...this.formatData,
      };
      this.loading = true;
      const { data, count } = await listData(this.formatData);
      if(data&&data.length>0){
        data.forEach((item,ind) => {
          item.index = ind+1
        });
      }
      this.dataSource = data;
      this.loading = false;
    },
    reset() {
      this.formatData = {};
      this.getTable();
    },
    // 获取类型
    getType(str){
      let obj = {
        '0':'目录',
        "1":"菜单",
        "2":"按钮"
      }
      return obj[str]
    },
    // 新增账号
    addData() {
      this.currentAccount = null;
      this.addAccountVisible = true;
    },
    edit(row){
      this.currentAccount = row;
      this.addAccountVisible = true;
    },
    del(row){

      this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          del({id:row.id}).then(res=>{
              if(res.code==0){
                this.$message.success('删除成功')
                this.getTable()
              }
            }).catch(res=>{

            })
        }).catch(() => {
          
        });
      
    }
  },
};
</script>
<style scoped lang="scss">
.bg{
  background: #FFF; 
  padding: 10px 16px;
  border-radius: 6px;
}
.pr10 {
  padding-right: 10px;
}

.mt10 {
  margin-top: 10px;
}

.telemetry {
  padding: 10px;
}

.label {
  font-size: 12px;
  color: #666;
}

.card {
  background: white;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  font-size: 13px;
  border-radius: 10px;
  overflow: hidden;

  .card-header {
    padding: 10px;
    border-bottom: 1px solid #ebeef5;
    box-sizing: border-box;
  }

  .card-content {
    padding: 10px;
  }
}

::v-deep .el-form-item {
  margin-bottom: 20px;
}
</style>
