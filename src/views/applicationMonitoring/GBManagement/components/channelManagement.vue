<template>
    <el-dialog
        :close-on-click-modal="false"
        title="设备通道管理"
        :visible.sync="dialogVisible"
        width="80%"
        @close="closed"
    >
        <div class="equipment-cont">
            <Tables
                :pagination="pagination"
                :columns="columns"
                :dataSource="dataSource"
                :loading="loading"
                @pageChange="pageChange"
                :rowSelection="false"
            >
                <div slot="operate" slot-scope="{ row }">
                    <el-button type="text">播放</el-button>
                    <el-button type="text" @click="insertFun(row)">接入</el-button>
                    <el-button type="text" @click="configFun(row)">配置</el-button>
                </div>
            </Tables>
        </div>
        <!-- 接入 -->
         <AddCamera v-if="addVisible" :channelObj="channelObj" @close="(addVisible = false), getList()"/>
         <!-- 配置信息 -->
        <ConfigInfo v-if="configVisible" :currentId="channelId" @close="(configVisible = false), getList()"/>
    </el-dialog>
</template>
<script>
import { channelList,getAccessInfo } from "../api"
import Tables from "@/components/Table/index.vue";
import AddCamera from "@/components/applicationMonitoring/boxManagement/addCamera/newAdd.vue";
import ConfigInfo from "./configInfo.vue"
export default {
    components:{
        Tables,
        AddCamera,
        ConfigInfo
    },
    props:{
        currentId:{
            type:String,
            default:""
        }
    },
    data() {
        return {
            dialogVisible:true,
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            loading: false,
            dataSource: [{}],
            columns: Object.freeze([
                {
                    key: "channelId",
                    title: "通道编号",
                    align: "center",
                },
                {
                    key: "deviceId",
                    title: "设备编号",
                    align: "center",
                },
                {
                    key: "name",
                    title: "通道名称",
                    align: "center",
                },
                {
                    key: "manufacturer",
                    title: "厂家",
                    align: "center",
                },
                {
                    key: "onLine",
                    title: "状态",
                    align: "center",
                    render(h, { value }) {
                        const obj = {
                            0:'离线',
                            1:'在线',
                        }
                        return h("span", [obj[value]]);
                    },
                },
                {
                    key: "Base",
                    title: "操作",
                    align: "center",
                    slot: "operate",
                },
            ]),
            status:'',
            addVisible:false,
            channelObj:{},
            channelId:'',
            configVisible:false,
        };
    },
    created() {
        this.getList()
    },
    methods: {
        // 获取数据
        getList(){
            this.loading = true;
            let formData = new FormData();
            formData.append("page", this.pagination.currentPage);
            formData.append("limit", this.pagination.pageSize);
            formData.append("deviceId", this.currentId);
            formData.append("status", this.status);
            channelList(formData).then(res=>{
                this.dataSource = res.data;
                this.pagination.total = parseInt(res.count);
                this.loading = false;
            }).catch(()=>{
                this.loading = false;
            })
        },
        pageChange(page, pageSize) {
            this.pagination.currentPage = page;
            this.pagination.pageSize = pageSize;
            this.getList();
        },
        // 接入
        insertFun(row){
            let formData = new FormData();
            formData.append("id", row.id);
            getAccessInfo(formData).then(res=>{
                this.channelObj = res.data;
                this.addVisible = true;
            }).catch(()=>{
            })
        },
        closed(){
            this.$emit("close")
        },
        // 配置信息
        configFun(row){
            this.channelId = row.id;
            this.configVisible = true;
        }
    },
};
</script>
<style scoped lang="scss">

</style>
  