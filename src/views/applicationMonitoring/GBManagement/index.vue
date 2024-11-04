<template>
    <div class="channel-cont">
        <Tables
            :pagination="pagination"
            :columns="columns"
            :dataSource="dataSource"
            :loading="loading"
            @pageChange="pageChange"
            :rowSelection="false"
        >
            <div slot="operate" slot-scope="{ row }">
                <el-button type="text" @click="channelFun(row)">通道</el-button>
            </div>
        </Tables>
        <!-- 通道 -->
        <ChannelManagement v-if="channelVisible" :currentId="currentId" @close="closeChannel"></ChannelManagement>
    </div>
</template>
<script>
import { deviceList } from "./api"
import Tables from "@/components/Table/index.vue";
import ChannelManagement from "./components/channelManagement.vue";
export default {
    components:{
        Tables,
        ChannelManagement
    },
    data() {
        return {
            pagination: {
                currentPage: 1,
                pageSize: 10,
                total: 0,
            },
            loading: false,
            dataSource: [{}],
            columns: Object.freeze([
                {
                    key: "name",
                    title: "名称",
                    align: "center",
                },
                {
                    key: "deviceId",
                    title: "设备编号",
                    align: "center",
                },
                {
                    key: "hostAddress",
                    title: "地址",
                    align: "center",
                },
                {
                    key: "manufacturer",
                    title: "厂家",
                    align: "center",
                },
                {
                    key: "transport",
                    title: "信令传输模式",
                    align: "center",
                },
                {
                    key: "streamMode",
                    title: "流传输模式",
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
                    key: "keepaliveTime",
                    title: "最近心跳",
                    align: "center",
                },
                {
                    key: "registerTime",
                    title: "最近注册",
                    align: "center",
                },
                {
                    key: "Base",
                    title: "操作",
                    align: "center",
                    slot: "operate",
                },
            ]),
            currentId:'',
            channelVisible:false,
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
            deviceList(formData).then(res=>{
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
        // 点击通道
        channelFun(row){
            this.currentId = row.id;
            this.channelVisible = true;
        },
        // 关闭通道弹窗
        closeChannel(){
            this.channelVisible = false;
            this.currentId = "";
            this.getList()
        },
    },
};
</script>
<style scoped lang="scss">
.equipment-cont{
    background: #FFF;
    border-radius: 6px;
    padding: 16px;
}
</style>
  