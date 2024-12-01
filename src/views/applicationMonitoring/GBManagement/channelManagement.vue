<template>
    <div class="equipment-cont">
        <Tables
            :pagination="pagination"
            :columns="columns"
            :dataSource="dataSource"
            :loading="loading"
            @pageChange="pageChange"
            :rowSelection="false"
        >
            <div slot="status" slot-scope="{ row }">
                <el-tag :type="row.status == '1' ? 'success' : 'danger'">
                    {{ row.status == '1' ? '在线' : '离线' }}
                </el-tag>
            </div>
            <div slot="hasAccess" slot-scope="{ row }">
                <el-tag :type="row.accessCameraId > 0 ? 'success' : 'info'">
                    {{ row.accessCameraId > 0 ? '已接入' : '未接入' }}
                </el-tag>
            </div>
            <div slot="operate" slot-scope="{ row }">
                <!-- <el-button type="text">播放</el-button> -->
                <template v-if="row.accessCameraId == 0">
                    <el-button type="text" @click="insertFun(row)">接入</el-button>
                </template>
                <template v-else>
                    无操作
                </template>
            </div>
        </Tables>
        <!-- 接入 -->
        <AddCamera v-if="addVisible" :channelObj="channelObj" pageType="channel" @close="(addVisible = false), getList()"/>
    </div>
</template>
<script>
import { channelList,getAccessInfo } from "./api"
import Tables from "@/components/Table/index.vue";
import AddCamera from "@/components/applicationMonitoring/boxManagement/addCamera/newAdd.vue";
export default {
    components:{
        Tables,
        AddCamera
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
            dataSource: [],
            columns: Object.freeze([
                {
                    key: "deviceId",
                    title: "设备编号",
                    align: "center",
                },
                {
                    key: "channelId",
                    title: "通道编号",
                    align: "center",
                },
                {
                    key: "name",
                    title: "通道名称",
                    align: "center",
                },
                {
                    key: "manufacture",
                    title: "厂家",
                    align: "center",
                },
                {
                    key: "status",
                    title: "状态",
                    align: "center",
                    slot: "status"
                    // render(h, { value }) {
                    //     const obj = {
                    //         0:'离线',
                    //         1:'在线',
                    //     }
                    //     return h("span", [obj[value]]);
                    // },
                },
                {
                    key: "hasAccess",
                    title: "接入状态",
                    align: "center",
                    slot: "hasAccess"
                    // render(h, { value }) {
                    //     const obj = {
                    //         0:'离线',
                    //         1:'在线',
                    //     }
                    //     return h("span", [obj[value]]);
                    // },
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
        }
    },
};
</script>
<style scoped lang="scss">

</style>
  