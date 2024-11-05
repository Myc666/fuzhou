<template>
    <div class="user-cont">
        <div class="left-cont">
            <el-tree
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                default-expand-all
                ref="tree">
                <div class="custom-tree-node" slot-scope="{ node, data }" style="width: 100%;line-height: 26px;">
                    <div @click.stop="handleNodeClick(data)" class="label-color"  style="width: 100%;">{{ node.label }}</div>
                </div>
            </el-tree>
        </div>
        <div class="right-cont">
            <div class="flex-item">
                <el-button type="primary" @click="addUserFun()">新增用户</el-button>
            </div>
            <el-table
              :data="dataSource"
              border
              style="width: 100%;margin-top: 20px;"
              v-loading="loading"
            >
              <el-table-column align="center" prop="empNo"  label="员工编号"></el-table-column>
              <el-table-column align="center" prop="empName"  label="员工名称"></el-table-column>
              <el-table-column align="center" prop="deptName"  label="归属部门"></el-table-column>
              <el-table-column align="center" prop="postName"  label="岗位名称"></el-table-column>
              <el-table-column align="center" prop="hasAccount"  label="是否接入">
                <template slot-scope="scope">
                    {{ scope.row.hasAccount?'是':'否' }}
                </template>
              </el-table-column>
            </el-table>
        </div>

        <!-- 新增用户 -->
        <el-drawer
            :title="title"
            :visible.sync="drawer"
            :wrapperClosable="false"
            :close-on-press-escape="false"
            :direction="direction"
            :before-close="handleClose">
            <UserAdd v-if="drawer" @close="handleClose"/>
        </el-drawer>
    </div>
</template>
<script>
import { deptTree,userList } from "./api"
import UserAdd from './components/addUser.vue'
export default {
    components:{
        UserAdd
    },
    data() {
        return {
            treeData:[],
            defaultProps:{
                children: 'children',
                label: 'deptName'
            },
            deptCode:'',
            dataSource:[],
            loading:false,
            drawer:false,
            direction: 'rtl',
        };
    },
    created() {
        this.getListTree();
    },
    methods: {
        //获取组织树
        getListTree(){
            this.treeData = [];
            deptTree().then(res=>{
                this.treeData = res.data;
            })
        },
        // 点击tree节点
        handleNodeClick(node) {
            this.deptCode = node.deptCode;
            this.getTable()
        },
        // 获取用户列表
        getTable(){
            let formData = new FormData();
            formData.append("deptCode", this.deptCode);
            this.loading = true;
            userList(formData).then(res=>{
                this.dataSource = res.data;
                this.loading = false;
            })
        },
        // 新增
        addUserFun(){
            this.drawer = true;
        },
        handleClose() {
            this.drawer = false;
            this.getTable();
        }
    },
};
</script>
<style scoped lang="scss">
.user-cont{
    display: flex;
    .left-cont{
        width: 280px;
        border-radius: 8px;
        background: #fff;
        padding: 16px;
        margin: 0px 10px 0 0;
        flex-shrink: 0;
    }
    .right-cont{
        background: #FFF;
        border-radius: 8px;
        padding: 16px;
        flex: 1;
        .flex-item{
            display: flex;
            align-items: center;
            justify-content: end;
        }
    }
}
</style>