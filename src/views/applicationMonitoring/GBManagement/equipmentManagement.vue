<template>
    <div>
        <div class="platform-info">
            <el-button type="primary" icon="el-icon-setting" @click="showPlatform">国标平台信息</el-button>
        </div>
        <div class="channel-cont">
            <Tables
                :pagination="pagination"
                :columns="columns"
                :dataSource="dataSource"
                :loading="loading"
                @pageChange="pageChange"
                :rowSelection="false"
            >
                <div slot="onLine" slot-scope="{ row }">
                    <el-tag :type="row.onLine == '1' ? 'success' : 'danger'">
                        {{ row.onLine == '1' ? '在线' : '离线' }}
                    </el-tag>
                </div>

                <div slot="operate" slot-scope="{ row }">
                    <el-button type="text" @click="channelFun(row)">通道信息</el-button>
                </div>
            </Tables>
        </div>
        <!-- 通道 -->
        <ChannelManagement v-if="channelVisible" :currentId="currentId" @close="closeChannel"></ChannelManagement>
        <!-- 配置信息 -->
        <ConfigInfo v-if="configVisible" :currentId="channelId" @close="(configVisible = false)"/>
    </div>
</template>
<script>
import { deviceList, getAccessInfo } from "./api"
import Tables from "@/components/Table/index.vue";
import ChannelManagement from "./components/channel.vue";
import ConfigInfo from "./components/configInfo.vue";
export default {
    components:{
        Tables,
        ChannelManagement,
        ConfigInfo
    },
    data() {
        return {
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
                    title: "名称",
                    align: "center",
                },
                {
                    key: "deviceId",
                    title: "设备编号",
                    align: "center",
                    width: 180
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
                    key: "channelNums",
                    title: "通道数",
                    align: "center",
                },
                {
                    key: "onLine",
                    title: "状态",
                    align: "center",
                    slot: "onLine"
                    // render(h, { value }) {
                    //     const obj = {
                    //         0:'离线',
                    //         1:'在线',
                    //     }
                    //     return h("span", [obj[value]]);
                    // },
                },
                {
                    key: "registerTime",
                    title: "注册时间",
                    align: "center",
                },
                {
                    key: "keepaliveTime",
                    title: "心跳时间",
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
            configVisible: false,
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
            this.currentId = row.deviceId;
            this.channelVisible = true;
        },
        // 关闭通道弹窗
        closeChannel(){
            this.channelVisible = false;
            this.currentId = "";
            this.getList()
        },
        // 展示国标平台信息
        showPlatform() {
            this.channelId = '';
            this.configVisible = true;
        }
    },
};
</script>
<style scoped lang="scss">
.platform-info {
    margin-bottom: 10px;
}
.equipment-cont{
    background: #FFF;
    border-radius: 6px;
    padding: 16px;
}
</style>
  