<template>
    <div>
        <div v-if="true">
            <Tables
            :pagination="pagination"
            :columns="columns"
            :dataSource="dataSource"
            :loading="loading"
            @pageChange="pageChange"
            :rowSelection="false"
            >
                <div slot="header" class="head-container">
                    <el-form label-position="right" style="display: flex;align-items: center;flex-wrap: wrap;" label-width="100px" size="mini">
                        <el-form-item label="计算设备名称:">
                            <el-input
                            style="width: 200px"
                            v-model="formaData.name"
                            placeholder="请输入计算设备名称"
                            ></el-input>
                        </el-form-item>
                        <el-form-item label="在线状态:" class="margin15">
                            <el-select
                                class="pr10"
                                style="width: 200px"
                                v-model="formaData.status"
                                placeholder="请选择在线状态"
                            >
                            <el-option label="全部" value="" > </el-option>
                                <el-option label="在线" value="1" > </el-option>
                                <el-option label="离线" value="0" > </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="所属组织:" style="margin-right: 15px; text-align: right;">
                            <el-cascader
                                v-model="formaData.departIds"
                                :options="depList"
                                :props="{ value: 'id', label: 'name',multiple: true,}"
                                collapse-tags
                                clearable>
                            </el-cascader>
                        </el-form-item>
                        <el-button class="pr10" type="primary" icon="el-icon-search" @click="getTable()">搜索</el-button>
                        <el-button icon="el-icon-refresh" @click="reset()">重置</el-button>
                    </el-form>
                </div>
                <div slot="header-btn" style="margin-bottom: 16px;">
                    <el-button type="primary" v-if="btnData.includes('caske-add')" @click="addData()">新增计算设备</el-button>
                </div>
                <div slot="resourceMonitor" slot-scope="{ row }">
                    <el-button type="text" v-if="btnData.includes('caske-view')" @click="viewFun(row)">查看</el-button>
                </div>
                <div slot="operate" slot-scope="{ row }">
                    <el-button type="text"  v-if="btnData.includes('caske-edit')" @click="editData(row)">编辑</el-button>
                    <!-- <el-button type="text"  v-if="btnData.includes('caske-detail')" @click="detailFun(row)">详情</el-button> -->
                    <el-button type="text"  v-if="btnData.includes('caske-restart')"  @click="restartFun(row)">重启</el-button>
                    <el-button type="text"  v-if="row.activeStatus !=1" @click="activationFun(row)" >激活</el-button>
                    <el-button type="text"  v-if="btnData.includes('caske-delete')" @click="delFun(row)" style="color: #f56c6c !important">删除</el-button>
                    <!-- <el-button type="text" style="color: #f56c6c !important" @click="ceaseFun(row)">停止</el-button> -->
                    <!-- <el-button type="text" @click="synchronizeFun(row)">同步时间</el-button>
                    <el-button type="text" @click="upgradationFun(row)">升级</el-button> -->
                </div>
            </Tables>
        </div>
        <div v-else style="background: #FFF;border-radius: 6px;padding: 16px;height: calc(100vh - 180px);">
            <el-button type="primary" v-if="btnData.includes('caske-add')" @click="addData()">新增计算设备</el-button>
            <div style="display: flex;align-items: center;justify-content: center;height: 100%;">
                <div style="text-align: center;">
                    <img src="@/assets/images/empty-icon.png" style="width: 360px;"/>
                    <div style="color: #909399;font-size: 14px;margin-top: 16px;">请添加边缘盒子后使用</div>
                </div>
            </div>
        </div>
        <!-- 编辑 -->
        <el-dialog
          :close-on-click-modal="false"
          width="40%"
          title="编辑"
          :visible.sync="editVisible"

        >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="mini">
                <el-form-item label="设备名称" prop="name">
                    <el-input v-model="ruleForm.name" placeholder="请输入计算设备名称"></el-input>
                </el-form-item>
                <el-form-item label="设备IP地址" prop="ipAddr">
                    <el-input v-model="ruleForm.ipAddr" :disabled="!isAdd" placeholder="请输入计算设备IP地址"></el-input>
                </el-form-item>
                <el-form-item label="设备编号" prop="sn">
                    <el-input
                        placeholder="请输入计算设备编号"
                        :disabled="!isAdd"
                        v-model="ruleForm.sn"
                    ></el-input>
                </el-form-item>
                <el-form-item label="所属组织" prop="departId">
                    <el-cascader
                        v-model="ruleForm.departId"
                        :options="depList"
                        :props="{ value: 'id', label: 'name'}"
                        :show-all-levels="false"
                        clearable>
                    </el-cascader>
                    </el-form-item>
                <el-form-item>
                    <div style="text-align: right;">
                        <el-button @click="resetForm()">取消</el-button>
                        <el-button type="primary" @click="submitForm('ruleForm')">确认</el-button>
                    </div>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!-- 查看详情 -->
        <DetailInfo v-if="detailVisible" :rowId="rowId" @close="closeHandle"/>
        <!-- 资源监控 -->
        <ResourceMonitor v-if="resourceVisible" :rowId="rowId" @close="closeR"/>
        <!-- 激活 -->
        <Activation v-if="activationVisible" :rowId="rowId" @close="closeA"/>
    </div>
</template>
<script>
import Tables from '@/components/Table/index.vue'
import { getMyDate } from '@/utils/common.js'
import {
    listPage,
    detail,
    save,
    restart,
    stop,
    syncTime,
    upgrade,
    basicDelete
 } from '@/api/applicationMonitoring/casketManagement'
 import {saveBasic,listTree} from "@/api/applicationMonitoring/boxManagement";
import DetailInfo from './components/detail.vue';
import ResourceMonitor from './components/resourceMonitor.vue';
import Activation from "./components/activation.vue"
export default {
   data() {
     return {
        activationVisible:false,
        detailVisible:false,
        resourceVisible:false,
        rowId:'',
        editVisible:false,
        ruleForm:{
            id:'',
            name:'',
            ipAddr:'',
            sn:'',
            departId:'',
        },
        rules:{
            name: [
                { required: true, message: '请输入计算设备名称', trigger: 'blur' },
            ],
            ipAddr: [
                { required: true, message: '请输入计算设备IP地址', trigger: 'blur' },
            ],
            sn: [
                { required: true, message: '请输入计算设备编码', trigger: 'blur' },
            ],
            departId: [
                { required: true, message: '请选中所属组织', trigger: 'change' },
            ],
        },
        pagination: {
            currentPage: 1,
            pageSize: 10,
            total: 0,
        },
        loading: false,
        dataSource: [],
        columns: Object.freeze([
            {
                key: "name",
                title: "计算设备名称",
                align: "center",
            },
            {
                key: "boxNo",
                title: "计算设备编号",
                align: "center",
            },
            {
                key: "ipAddr",
                title: "IP地址",
                align: "center",
            },
            {
                key: "departName",
                title: "所属组织",
                align: "center",
            },
            {
                key: "resourceMonitor",
                title: "资源监控",
                align: "center",
                slot:'resourceMonitor'
            },
            {
                key: "online",
                title: "在线状态",
                align: "center",
                render(h,{value}){
                    const str = {
                        0: '离线',
                        1: '在线',
                    }[value]
                    return h('span', [str])
                }
            },
            {
                key: "activeStatus",
                title: "激活状态",
                align: "center",
                render(h,{value}){
                    const str = {
                        0: '未激活',
                        1: '已激活',
                    }[value]
                    return h('span', [str])
                }
            },
            {
                key: "boxHeartTime",
                title: "心跳时间",
                align: "center",
                render(h,{value}){
                    return h('span',[getMyDate(Number(value))])
                }
            },
            {
                key: "Base",
                title: "操作",
                width:220,
                align: "center",
                flex: "right",
                slot:'operate'
            },
        ]),
            formaData:{},
            depList:[],
            isAdd:false,
            btnData:[],
            btnObjList:[],
        };
    },
    components:{
        Tables,
        DetailInfo,
        ResourceMonitor,
        Activation
    },
    created() {
        this.getBtn();
        this.getTable();
        this.getTree();
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
        pageChange(page, pageSize) {
            this.pagination.currentPage = page;
            this.pagination.pageSize = pageSize;
            this.getTable();
        },
        async getTable(){
            let obj = {
                ...this.formaData,
                limit: this.pagination.pageSize,
                page: this.pagination.currentPage,
            }
            let arr =[];
            if(obj.departIds&&obj.departIds.length>0){
                obj.departIds.forEach((item,ind)=>{
                    let len = item.length-1;
                    arr.push(item[len])
                })
            }
            obj.departIds = arr.length>0?arr.join(','):''
            this.loading = true
            const { data,count } = await listPage(obj)
            this.dataSource = data
            this.pagination.total = parseInt(count)
            this.loading = false
        },
        reset(){
            this.formaData = {}
            this.pagination.currentPage = 1
            this.getTable()
        },
        addData(){
            this.isAdd = true;
            this.ruleForm = {
                id:'',
                name:'',
                ipAddr:'',
                sn:'',
                departId:'',
            },
            this.editVisible = true;
            this.getTree();
        },
        // 编辑
        async editData(row){
            this.depList = [];
            this.isAdd = false;
            this.getTree();
            const res = await detail({id: row.id});
            if (res.code == 0) {
                this.ruleForm = {
                    id:res.data.id,
                    name:res.data.name,
                    ipAddr:res.data.ipAddr,
                    sn:res.data.boxNo,
                    departId:this.getFathersById(res.data.departId,this.depList)
                }
                this.editVisible = true;

            }
        },
        // 保存
        submitForm(formName) {
            console.log(this.ruleForm);
            console.log(this.ruleForm.departId);
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.saveData();
            } else {
                return false;
            }
            });
        },
        async saveData(){

            let obj ={
                id:this.ruleForm.id,
                name:this.ruleForm.name,
                ipAddr:this.ruleForm.ipAddr,
                sn:this.ruleForm.sn,
            }
            if(this.ruleForm.departId&&this.ruleForm.departId.length>0){
                let len = this.ruleForm.departId.length-1;
                obj.departId = this.ruleForm.departId?this.ruleForm.departId[len]:'';
            }
            const res = await saveBasic(obj);
            if (res.code == 0) {
                this.$message.success("保存成功");
                this.editVisible = false;
                this.getTable();
            }
        },
        // 取消
        resetForm() {
            this.editVisible = false;
            this.getTable();
        },
        // 重启
        async restartFun(row){
            this.$confirm(`是否重启算法?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
            .then(() => {
                let formData = new FormData();
                formData.append("id", row.id);
                restart(formData).then(res=>{
                    this.$message.success("重启成功");
                    this.getTable();
                })
            })
            .catch(() => {});
        },
        // // 停止
        // async ceaseFun(row){
        //     this.$confirm(`确定停止?`, "提示", {
        //         confirmButtonText: "确定",
        //         cancelButtonText: "取消",
        //         type: "warning",
        //     })
        //     .then(async () => {
        //         const res = await stop({id: row.id});
        //         if (res.code == 0) {
        //             this.$message.success("操作成功");
        //             this.getTable();
        //         }
        //     })
        //     .catch(() => {});
        // },
        // 查看详情
        detailFun(row){
            this.rowId = row.id;
            this.detailVisible = true;
        },
        // 关闭详情弹窗
        closeHandle(){
            this.getTable()
            this.detailVisible=false;
        },
        //资源监控
        viewFun(row){
            this.rowId = row.id;
            this.resourceVisible = true;
        },
        // 关闭弹窗
        closeR(){
            this.resourceVisible=false;
            this.getTable()
        },
        // 同步时间
        // async synchronizeFun(row){
        //     this.$confirm(`确定同步时间?`, "提示", {
        //         confirmButtonText: "确定",
        //         cancelButtonText: "取消",
        //         type: "warning",
        //     })
        //     .then(async () => {
        //         const res = await syncTime({id: row.id});
        //         if (res.code == 0) {
        //             this.$message.success("操作成功");
        //             this.getTable();
        //         }
        //     })
        //     .catch(() => {});
        // },
        // // 升级
        // async upgradationFun(row){
        //     this.$confirm(`确定升级?`, "提示", {
        //         confirmButtonText: "确定",
        //         cancelButtonText: "取消",
        //         type: "warning",
        //     })
        //     .then(async () => {
        //         const res = await upgrade({id: row.id});
        //         if (res.code == 0) {
        //             this.$message.success("操作成功");
        //             this.getTable();
        //         }
        //     })
        //     .catch(() => {});
        // },

        // 获取部门树
        getTree(){
            listTree().then(res=>{
                if(res.data&&res.data.length>0){
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
        // 上级部门回显
        getFathersById(id, data, prop = 'id') {
            var arrRes = []
            const rev = (data, nodeId) => {
                for (var i = 0, length = data.length; i < length; i++) {
                const node = data[i]
                if (node[prop] === nodeId) {
                    arrRes.unshift(node[prop])
                    return true
                } else {
                    if (node.children && node.children.length) {
                    if (rev(node.children, nodeId)) {
                        arrRes.unshift(node[prop])
                        return true
                    }
                    }
                }
                }
                return false
            }
            rev(data, id)
            return arrRes
        },
        // 删除
        async delFun(row){
            this.$confirm(`盒子摄像头数据将被清空，请谨慎操作。`, "是否删除此边缘盒子？", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                // type: "warning",
            })
            .then(async () => {
                const res = await basicDelete({id: row.id});
                if (res.code == 0) {
                    this.$message.success("删除成功");
                    this.getTable();
                }
            })
            .catch(() => {});
        },
        // 激活
        activationFun(row){
            this.rowId = row.id;
            this.activationVisible = true;
        },
        closeA(){
            this.activationVisible = false;
            this.rowId = ""
        }
    },
};
</script>
<style scoped lang="scss">
.pr10{
    padding-right: 10px;
}
.head-container{
    background: #FFF;
    padding: 16px 10px;
    :deep(.el-form-item--mini.el-form-item){
        margin-bottom: 0px !important;
    }
}
.margin15{
    margin: 0px 15px;
}
</style>
