<template>
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
                <el-row>
                    <el-form label-position="left">
                        <el-col :span="5">
                            <el-form-item label="">
                                <el-input
                                style="width: 200px"
                                v-model="formaData.name"
                                placeholder="请输入盒子名称"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="5">
                            <el-form-item label="">
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
                        </el-col>
                        <el-col :span="6">
                            <el-button class="pr10" type="primary" @click="getTable()">搜索</el-button>
                            <el-button @click="reset()">取消</el-button>
                        </el-col>
                    </el-form>
                </el-row> 
            </div>
            <div slot="resourceMonitor" slot-scope="{ row }">
                <el-button type="text" @click="viewFun(row)">查看</el-button>
            </div>
            <div slot="operate" slot-scope="{ row }">
                <el-button type="text" @click="editData(row)">编辑</el-button>
                <el-button type="text" @click="detailFun(row)">详情</el-button>
                <el-button type="text" @click="restartFun(row)">重启</el-button>
                <el-button type="text" style="color: #f56c6c !important" @click="ceaseFun(row)">停止</el-button>
                <!-- <el-button type="text" @click="synchronizeFun(row)">同步时间</el-button>
                <el-button type="text" @click="upgradationFun(row)">升级</el-button> -->
            </div>
       </Tables>
       <!-- 编辑 -->
       <el-dialog
          :close-on-click-modal="false"
          width="40%"
          title="编辑"
          :visible.sync="editVisible"
          
        >
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px" size="mini">
                <el-form-item label="盒子名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                </el-form-item>
                <el-form-item label="ip地址" prop="ipAddr">
                    <el-input v-model="ruleForm.ipAddr"></el-input>
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
    upgrade
 } from '@/api/applicationMonitoring/casketManagement'
import DetailInfo from './components/detail.vue';
import ResourceMonitor from './components/resourceMonitor.vue';
export default {
   data() {
     return {
        detailVisible:false,
        resourceVisible:false,
        rowId:'',
        editVisible:false,
        ruleForm:{
            id:'',
            name:'',
            ipAddr:'',
        },
        rules:{
            name: [
                { required: true, message: '请输入盒子名称', trigger: 'blur' },
            ],
            ipAddr: [
                { required: true, message: '请输入ip地址', trigger: 'blur' },
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
                title: "盒子名称",
                align: "center",
            },
            {
                key: "boxNo",
                title: "盒子编号",
                align: "center",
            },
            {
                key: "ipAddr",
                title: "IP地址",
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
        };
    },
    components:{
        Tables,
        DetailInfo,
        ResourceMonitor
    },
    created() {
        this.getTable()
    },
    methods: {
        pageChange(page, pageSize) {
            this.pagination.currentPage = page;
            this.pagination.pageSize = pageSize;
            this.getTable();
        },
        async getTable(){
            this.formaData = { 
                ...this.formaData,
                limit: this.pagination.pageSize,
                page: this.pagination.currentPage,
            }
            this.loading = true
            const { data,count } = await listPage(this.formaData)
            this.dataSource = data
            this.pagination.total = parseInt(count)
            this.loading = false
        },
        reset(){
            this.formaData = {}
            this.pagination.currentPage = 1
            this.getTable()
        },
        // 编辑
        async editData(row){
            const res = await detail({id: row.id});
            if (res.code == 0) {
                this.ruleForm = {
                    id:res.data.id,
                    name:res.data.name,
                    ipAddr:res.data.ipAddr,
                }
                this.editVisible = true;
            }
        },
        // 保存
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.saveData();
            } else {
                return false;
            }
            });
        },
        async saveData(){
            const res = await save(this.ruleForm);
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
            this.$confirm(`确定重启?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
            .then(async () => {
                const res = await restart({id: row.id});
                if (res.code == 0) {
                    this.$message.success("重启成功");
                    this.getTable();
                }
            })
            .catch(() => {});
        },
        // 停止
        async ceaseFun(row){
            this.$confirm(`确定停止?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
            .then(async () => {
                const res = await stop({id: row.id});
                if (res.code == 0) {
                    this.$message.success("操作成功");
                    this.getTable();
                }
            })
            .catch(() => {});
        },
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
    },
};
</script>
<style scoped lang="scss">
.pr10{
    padding-right: 10px;
}

</style>
  