<template>
    <div class="organizational">
        <div class="flex-left">
            <div class="top-title">
                <div class="title">组织管理</div>
                <el-button type="primary" v-if="!isShow" icon="el-icon-s-tools" @click="editFun">编辑</el-button>
                <el-button type="primary" v-else @click="saveFun">保存</el-button>
            </div>
            <div class="tree-cont">
                <el-input placeholder="组织名称" v-model="filterText" style="margin-bottom: 10px;" suffix-icon="el-icon-search"></el-input>
                <div class="top-title top-hover" :style="{backgroundColor: isDefault?'#F5F7FA':''}" @click="allClick()">
                    <div>全部</div>
                    <div class="btn-sty" style="margin-top: 0px !important;" v-if="isShow && btnData.includes('organizational-add')" @click="addDep(0)">添加</div>
                </div>
                <el-tree
                    class="filter-tree"
                    :data="treeData"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    ref="tree">
                    <div class="custom-tree-node" slot-scope="{ node, data }" style="width: 100%;line-height: 26px;">
                        <div @click.stop="handleNodeClick(data)" class="label-color"  style="width: 100%;">{{ node.label }}</div>
                        <div class="btn-sty" style="margin-top: 0px !important;" v-if="isShow">
                            <span class="mr-10" v-if="btnData.includes('organizational-add')" @click.stop="addDep(1,data)">添加</span>
                            <span class="mr-10" v-if="btnData.includes('organizational-edit')" @click.stop="editDep(data)">编辑</span>
                            <span style="color: red;" v-if="btnData.includes('organizational-delete')" @click.stop="delFun(data)">删除</span>
                        </div>
                    </div>
                </el-tree>
            </div>
        </div>
        <div class="flex-right">
            <div class="flex-item">
                <div class="user-title">用户管理</div>
                <el-button type="primary" v-if="btnData.includes('user-add')" @click="addUserFun()">新增用户</el-button>
            </div>
            <Tables
            :pagination="pagination"
            :columns="columns"
            :dataSource="dataSource"
            :loading="loading"
            @pageChange="pageChange"
            :rowSelection="rowSelection"
            :selections.sync="selectedRowKeys"
            >
                <div slot="header">
                    <div class="seach-cont">
                        <el-row>
                            <el-col :span="18">
                                <el-row>
                                    <el-form label-position="right" label-width="80px">
                                        <el-row>
                                            <el-col :span="8">
                                                <el-form-item label="姓名">
                                                    <el-input v-model="formatData.name"  placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-form-item label="账号名称">
                                                    <el-input v-model="formatData.account"  placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-form-item label="所属组织">
                                                    <el-cascader
                                                        v-model="formatData.departIds"
                                                        :options="depList"
                                                        :props="{ value: 'id', label: 'name',multiple: true}"
                                                        :show-all-levels="false"
                                                        clearable>
                                                    </el-cascader>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                        <el-row v-if="isOpen">
                                            <el-col :span="8">
                                                <el-form-item label="手机号">
                                                    <el-input v-model="formatData.phone"  placeholder="请输入"></el-input>
                                                </el-form-item>
                                            </el-col>
                                            <el-col :span="8">
                                                <el-form-item label="角色">
                                                    <el-select
                                                        style="width: 100%"
                                                        v-model="formatData.roleIds"
                                                        placeholder="请选择"
                                                        clearable
                                                    >
                                                        <el-option
                                                        v-for="(item, index) in roleOptions"
                                                        :key="index"
                                                        :label="item.nameCh"
                                                        :value="item.id"
                                                        ></el-option>
                                                    </el-select>
                                                </el-form-item>
                                            </el-col>
                                        </el-row>
                                    </el-form>
                                </el-row>
                            </el-col>
                            <el-col :span="6" style="padding-left:20px; display: flex; align-items: center;justify-content: space-between;">
                                <el-button type="primary" icon="el-icon-search" @click="getTable">查询</el-button>
                                <el-button icon="el-icon-refresh" @click="reset">重置</el-button>
                                <div style="cursor: pointer; font-size: 14px; color: #606266;" @click="openFun()">
                                    <span :class="[isOpen?'el-icon-arrow-up':'el-icon-arrow-down']"></span>
                                    <span>{{ isOpen?'收起':'展开' }}</span>
                                </div>
                            </el-col>
                        </el-row> 
                    </div>
                    <div class="flex-item">
                        <div class="item-sty" v-for="(items,ind) in staticsList" :key="ind">
                            <div>{{ items.nameCh }}</div>
                            <div class="num">{{ items.accountNum }}</div>
                        </div>
                    </div>
                    <div v-if="selectedRowKeys.length>0">
                        <el-button>本页已选{{ selectedRowKeys.length }}个</el-button>
                        <el-button  type="primary" v-if="btnData.includes('user-delete')"  @click="delAll">删除</el-button>
                    </div>
                </div>
                <div slot="operate" slot-scope="{ row }">
                    <el-button type="text" v-if="btnData.includes('user-edit')&&row.account!='admin'" @click="editData(row)">修改</el-button>
                    <el-button type="text" v-if="btnData.includes('user-edit')" @click="editPasswordFun(row)">修改密码</el-button>
                    <el-button type="text" v-if="btnData.includes('user-delete') && row.account!='admin'" style="color: #f56c6c !important" @click="delData(row.id)">删除</el-button>
                </div>
                <div slot="roles" slot-scope="{ row }">
                    <div v-if="row.roles.length>0">
                        <el-tag type="success" v-for="(item,index) in row.roles" :key="index">{{ item.nameCh }}</el-tag>
                    </div>
                </div>
            </Tables>
        </div>
        <!-- 新增部门 -->
         <DepartmentAdd v-if="depAddVisible" :parentId="parentId" :currentId="currentId" @close="closeDep"/>
        <!-- 新增用户 -->
        <el-drawer
            :title="title"
            :visible.sync="drawer"
            :wrapperClosable="false"
            :close-on-press-escape="false"
            :direction="direction"
            :before-close="handleClose">
            <UserAdd v-if="drawer" :currentId="currentUserId" :currentdepId="currentdepId" @close="handleClose"/>
        </el-drawer>
        <!-- 修改密码 -->
        <EditPassword v-if="editVisible" :currentName="currentUserName" :currentId="currentUserId" @close="passwordClose"/>
    </div>
</template>
<script>
import Tables from "@/components/Table/index.vue";
import UserAdd from "./components/userAdd.vue";
import DepartmentAdd from "./components/departmentAdd.vue";
import EditPassword from './components/editPassword.vue'
import { listData } from "../roleManagement/api"
import { listTree,deleteData,accountList,statics,accountDelete,batchDelete } from "./api"
export default {
    components:{
        Tables,
        UserAdd,
        DepartmentAdd,
        EditPassword
    },
    data() {
        return {
            depAddVisible:false,
            title:'新增用户',
            filterText: '',
            treeData: [],
            staticsList:[],
            defaultProps:{
                children: 'children',
                label: 'name'
            },
            isShow:false,//组织按钮是否展示
            isDefault:true,//默认展示全部
            isOpen:false,
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            rowSelection: {
                type: "checkbox",
                change: (selectedRowKeys, selectedRows) => {
                    this.selectedRowKeys = selectedRowKeys;
                    this.selectedRows = selectedRows;
                },
            },
            selectedRowKeys: [],
            selectedRows: [],
            loading: false,
            dataSource: [],
            columns: Object.freeze([
                {
                    key: "name",
                    title: "姓名",
                    align: "center",
                },
                {
                    key: "roles",
                    title: "角色",
                    align: "center",
                    slot: "roles",
                },
                {
                    key: "departNames",
                    title: "所属组织",
                    align: "center",
                },
                {
                    key: "state",
                    title: "状态",
                    align: "center",
                    render(h,{value}){
                        let obj = {
                        '0':'正常',
                        "1":"禁用",
                        }
                        return h('span',[obj[value]])
                    }
                },
                {
                    key: "phone",
                    title: "手机号",
                    align: "center",
                },
                {
                    key: "account",
                    title: "账号名称",
                    align: "center",
                },
                {
                    key: "Base",
                    title: "操作",
                    align: "center",
                    flex: "right",
                    slot: "operate",
                    width:200
                },
            ]),
            formatData: {},
            drawer: false,
            direction: 'rtl',
            currentId:'',
            parentId:'',
            currentUserId:'',
            currentdepId:'',
            depList:[],
            roleOptions:[],
            btnData:[],
            btnObjList:[],
            editVisible:false,
            currentUserName:'',
        };
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
        this.getBtn();
        this.getListTree();
        this.getTable();
        this.getStatics();
        this.getRole();
    },
    methods: {
        getBtn(){
            this.btnData = [];
            this.btnObjList = [];
            this.isDetail = false;
            const menuArr = JSON.parse(sessionStorage.getItem('menuTree'));
            let newArr = [];
            this.getbtnList(menuArr);
            this.btnObjList.filter((item,index)=>{
                newArr.push(item.auth)
            })
            this.btnData = newArr;
        },
        getbtnList(data){
            let arr = []
            data.forEach(item=>{
                if(item.path==this.$route.path){
                    arr = item.children.filter((items,ind)=>{
                        return items.type==2
                    })
                    this.btnObjList = arr;
                }else{
                    this.getbtnList(item.children);
                }
            })
        },
        // 获取角色
        async getRole(){
            const res = await listData();
            this.roleOptions = res.data;
        },
        //获取组织树
        getListTree(){
            this.treeData = [];
            listTree().then(res=>{
                if(res.data&&res.data.length>0){
                    this.treeData = res.data;
                    this.depList = this.getData(res.data);
                }
            })
        },
        getData(data) {
            data.forEach(item=>{
                if(item.children.length < 1){
                    item.children = undefined;
                }else{
                    this.getData(item.children);
                }
            })
            return data;
        },
        filterNode(value, data) {
            if (!value) return true;
            return data.name.indexOf(value) !== -1;
        },
        // 编辑
        editFun(){
            this.isShow = true;
        },
        // 保存
        saveFun(){
            this.isShow =false;
        },
        // 点击tree节点
        handleNodeClick(node) {
            this.isDefault = false;
            let arr = [];
            arr.push(node.id)
            this.formatData.departIds = [arr];
            this.getTable()
        },
        // 点击全部
        allClick(){
            this.isDefault = true;
            this.formatData.departIds = [];
            this.getTable()
        },
        // 组织新增
        addDep(type,data){
            this.currentId = '';
            if(type==1){//点击节点
                this.parentId = data.id;
                this.depAddVisible = true;
            }else{//点击全部节点
                this.parentId = '0';
                this.depAddVisible = true;
            }
        },
        // 组织编辑
        editDep(data){
            this.parentId = "";
            this.currentId = data.id;
            this.depAddVisible = true;
        },
        // 组织新增弹窗关闭
        closeDep(){
            this.currentId = "";
            this.parentId = "";
            this.depAddVisible = false;
            this.getListTree()
        },
        // 组织删除
        delFun(data){
            let str = data.children&&data.children.length>0?'删除该数据的同时会删除所有⼦节点,确定删除该条数据?':'确定删除该条数据?'
            this.$confirm(str, "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }).then(async() => {
                const res = await deleteData({id:data.id});
                this.$message.success("删除成功");
                this.getListTree()
            }).catch(() => {});
        },
        // 获取角色人员统计
        async getStatics(){
            const res = await statics();
            this.staticsList = res.data;
        },
        // 获取用户表格数据
        async getTable(){
            let obj = {
                pageNum:this.pagination.currentPage,
                pageSize:this.pagination.pageSize,
                ...this.formatData
            }
            let arr = [];
            if(obj.departIds&&obj.departIds.length>0){
                obj.departIds.forEach((item,index)=>{
                    let len = item.length-1
                    arr.push(item[len])
                })
            }
            obj.departIds = arr;
            this.loading = true;
            const res = await accountList(obj);
            this.dataSource =res.data;
            this.pagination.total = parseInt(res.count);
            this.loading = false;
        },
        // 重置
        reset() {
            this.pagination.currentPage = 1;
            this.formatData = {};
            this.getTable();
        },
        pageChange(page, pageSize) {
            this.pagination.currentPage = page;
            this.pagination.pageSize = pageSize;
            this.getTable();
        },
        // 查询条件展开收起
        openFun(){
            this.isOpen = !this.isOpen;
        },
        /******************************/ 
        // 新增
        addUserFun(){
            this.title = '新增用户'
            this.currentUserId = '';
            this.drawer = true;
        },
        // 修改用户信息
        editData(row){
            this.title = '编辑用户'
            this.currentUserId = row.id;
            this.currentdepId = row.departId;
            this.drawer = true;
        },
        // 修改密码
        editPasswordFun(row){
            this.currentUserId = row.id;
            this.currentUserName = row.account;
            this.editVisible = true;
        },
        passwordClose(){
            this.editVisible = false;
            this.currentUserId = "";
            this.currentUserName = "";
            this.getTable();
        },
        // 单个删除
        delData(id){
            this.$confirm('如果您认为会再次需要此用户信息，建议您停用。', '是否删除此用户', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let formData = new FormData();
                formData.append("accountId", id);
                accountDelete(formData).then(res=>{
                    if(res.code==0){
                        this.$message.success('删除用户成功')
                        this.getTable();
                    }
                }).catch(res=>{

                })
            }).catch(() => {
            
            });
      
        },
        // 批量删除
        delAll(){
            let len = this.selectedRowKeys.length;
            this.$confirm('如果您认为会再次需要此用户信息，建议您停用。', '是否批量删除  '+len+'位 用户？', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let Arr = [];
                let isDelete = true;
                this.selectedRows.forEach(item=>{
                    Arr.push(item.id)
                    if(item.account == 'admin'){
                        isDelete = false;
                    }
                })
                if(!isDelete){
                    this.$message.error('admin账号不可删除')
                    return;
                }
                let obj = {
                    accountIds:Arr
                }
                batchDelete(obj).then(res=>{
                    this.$message.success('删除用户成功')
                    this.getTable();
                    this.selectedRowKeys = [];
                    this.selectedRows = [];
                }).catch(res=>{

                })
            }).catch(() => {
            
            });
        },
        handleClose() {
            this.currentUserId = '';
            this.currentdepId = "";
            this.drawer = false;
            this.getTable();
        }
    },
};
</script>
<style scoped lang="scss">
.organizational{
    display: flex;
    .flex-left{
        width: 280px;
        border-radius: 8px;
        background: #fff;
        padding: 16px;
        margin: 0px 10px 0 0;
        flex-shrink: 0;
        .top-title{
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 14px;
            padding: 5px 10px;
        }
        .btn-sty{
            color:#409EFF;
            cursor: pointer;
        }
        .top-hover:hover{
            background-color: #F5F7FA;
        }
        .title{
            font-size: 20px;
            font-weight: bold;
        }
        .tree-cont{
            margin-top: 16px;
        }
        .custom-tree-node{
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .mr-10{
            margin-right: 10px;
        }
    }
    .flex-right{
        background: #FFF;
        border-radius: 8px;
        padding: 16px;
        flex: 1;
        .flex-item{
            display: flex;
            align-items: center;
        }
        .user-title{
            font-size: 20px;
            color: #606266;
            font-weight: bold;
            margin-right: 20px;
        }
        .seach-cont{
            padding-top: 16px;
        }
        .item-sty{
            text-align: center;
            color: #606266;
            font-size: 12px;
            margin-right: 20px;
            margin-bottom: 10px;
            .num{
                font-size: 20px;
                color: #303133;
                font-weight: bold;
                margin-top: 5px
            }
        }
    }
    :deep(.table-container){
        padding: 0px !important;
    }
}
</style>
  