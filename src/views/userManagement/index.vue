<template>
    <div class="user-cont">
        <div class="left-cont">
            <div class="title" style="margin-bottom: 15px;">部门信息
                <span style="float: right;">
                    <el-link type="primary" @click="showTreeEdit = !showTreeEdit">管理</el-link>
                </span>
            </div>
            <div v-if="treeData.length == 0">
                <el-empty :image-size="96">
                    <el-link type="primary" @click="addOrgVisiable = true">新增一个部门</el-link>
                </el-empty>
            </div>
            <el-tree
                class="filter-tree"
                :data="treeData"
                :props="defaultProps"
                empty-text=""
                default-expand-all
                ref="tree">

                <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span @click.stop="handleNodeClick(node, data)">{{ node.label }}</span>
                    <span v-show="showTreeEdit">
                    <el-button
                        type="text"
                        size="mini"
                        @click="() => addOrg(data)">
                        新增
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        @click="() => editOrg(data)">
                        编辑
                    </el-button>
                    <el-button
                        type="text"
                        size="mini"
                        @click="() => delOrg(node, data)">
                        删除
                    </el-button>
                    </span>
                </span>
            </el-tree>
        </div>
        <div class="right-cont">
            <div>
                <Tables
                    :pagination="pagination"
                    :columns="columns"
                    :dataSource="dataSource"
                    :loading="loading"
                    @pageChange="pageChange"
                    :rowSelection="false"
                >
                    <div slot="header" class="head-container">
                        <div class="title">员工列表
                            <span style="float: right;">
                                <el-button type="primary" @click="addUserFun()">新增用户</el-button>
                            </span>
                        </div>
                    </div>
                    <div slot="operate" slot-scope="{ row }">
                        <el-button type="text" @click="handleIvUserEdit(row)">编辑</el-button>
                        <el-button type="text" style="color: #f56c6c !important" @click="handleIvUserDel(row.id)">删除</el-button>
                    </div>
                </Tables>
            </div>
            <!-- <el-table
              :pagination="pagination"
              :data="dataSource"
              border
              style="width: 100%;margin-top: 20px;"
              v-loading="loading"
              @pageChange="pageChange"
              :rowSelection="false"
            >
              <el-table-column align="center" prop="empNo"  label="员工工号"></el-table-column>
              <el-table-column align="center" prop="empName"  label="员工名称"></el-table-column>
              <el-table-column align="center" prop="orgName"  label="归属部门"></el-table-column>
              <el-table-column align="center" label="操作" width="120">
                <template slot-scope="scope">
                    <el-button type="text" @click="accessFun(scope.row)">编辑</el-button>
                    <el-button type="text" @click="accessFun(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table> -->
        </div>

        <!-- 新增用户 -->
        <el-drawer
            title="新增"
            :visible.sync="drawer"
            :wrapperClosable="false"
            :close-on-press-escape="false"
            :direction="direction"
            :before-close="handleClose">
            <UserAddV2 v-if="drawer" :data="userData" @close="handleClose"/>
        </el-drawer>

        <OrgAdd v-if="addOrgVisiable" :data="orgData" @close="addOrgVisiable = false; getListTree();"></OrgAdd>
    </div>
</template>
<script>
import { treeIvOrg, delIvOrg, listIvUserV2, delIvUserV2 } from "./api"
import OrgAdd from './components/addOrg.vue'
import UserAddV2 from './components/addUserV2.vue'
import Tables from "@/components/Table/index.vue";
export default {
    components:{
        UserAddV2,
        OrgAdd,
        Tables
    },
    data() {
        return {
            treeData:[],
            defaultProps:{
                children: 'children',
                label: 'name'
            },
            dataSource:[],
            loading:false,
            drawer:false,
            direction: 'rtl',
            addOrgVisiable: false,
            orgData: null,
            showTreeEdit: false,
            orgId: '',
            userData: null,
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            columns: Object.freeze([
                {
                    key: "empNo",
                    title: "员工工号",
                },
                {
                    key: "empName",
                    title: "员工名称",
                },
                {
                    key: "orgName",
                    title: "所属部门",
                },
                {
                    key: "Base",
                    title: "操作",
                    align: "center",
                    slot: "operate",
                },
            ])
        };
    },
    created() {
        this.getListTree();
        this.getTable();
    },
    methods: {
        //获取组织树
        getListTree(){
            this.treeData = [];
            treeIvOrg().then(res=>{
                this.treeData = res.data;
            })
        },
        // 点击tree节点
        handleNodeClick(node, data) {
            this.orgId = data.id;
            this.getTable()
        },
        // 获取用户列表
        getTable(){
            let formData = new FormData();
            formData.append("orgId", this.orgId);
            formData.append("pageSize", this.pagination.pageSize);
            formData.append("pageNum", this.pagination.currentPage);
            this.loading = true;
            listIvUserV2(formData).then(res=>{
                this.dataSource = res.data;
                this.loading = false;
                this.pagination.total = parseInt(res.count);
            })
        },
        // 新增
        addUserFun(){
            this.drawer = true;
        },
        handleClose() {
            this.drawer = false;
            this.getTable();
        },
        accessFun(row){
            this.empName = row.empName;
            this.empNo = row.empNo;
            this.drawer = true;
        },
        addOrg(data) {
            this.orgData = {
                id: '',
                parentId: data.id,
                name: ''
            };
            this.addOrgVisiable = true;
        },
        editOrg(data) {
            this.orgData = data;
            this.addOrgVisiable = true;
        },
        delOrg(node, data) {
            this.$confirm(`是否删除该数据?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let formData = new FormData();
                formData.append("id", data.id);
                delIvOrg(formData).then(res=>{
                    this.$message.success('删除成功');
                    this.getListTree();
                })
            }).catch(()=>{

            })
        },
        closed() {
            //this.getListTree()
        },
        pageChange(page, pageSize) {
            this.pagination.currentPage = page;
            this.pagination.pageSize = pageSize;
            this.getTable();
        },
        handleIvUserEdit(data) {
            this.userData = data;
            this.drawer = true;
        },
        handleIvUserDel(data) {
            console.log('del us', data)
            this.$confirm(`是否删除该数据?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let formData = new FormData();
                formData.append("id", data);
                delIvUserV2(formData).then(res=>{
                    this.$message.success('删除成功');
                    this.getTable();
                })
            }).catch(()=>{

            })
        }
    },
};
</script>
<style scoped lang="scss">
.user-cont{
    display: flex;
    .title{
        font-size: 16px;
        font-weight: normal;
    }
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

.custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
</style>