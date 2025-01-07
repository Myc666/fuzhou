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
                    <el-button type="text" style="color: #67C23A !important" @click="startChannelSync(row)">同步通道</el-button>
                </div>
            </Tables>
        </div>
        <!-- 通道 -->
        <ChannelManagement v-if="channelVisible" :currentId="currentId" @close="closeChannel"></ChannelManagement>
        <!-- 配置信息 -->
        <ConfigInfo v-if="configVisible" :currentId="channelId" @close="(configVisible = false)"/>

        <el-dialog
            title="同步进度"
            :visible.sync="syncVisible"
            width="240px"
            :before-close="handleSyncClose">
            <span style="display: flex; justify-content: center;"><el-progress type="circle" :percentage="syncNum" :status="syncStatus" :width=120></el-progress></span>
        </el-dialog>
    </div>
</template>
<script>
import { deviceList, getAccessInfo, channelSync, channelSyncStatus } from "./api"
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
            syncTimer: null,
            syncVisible: false,
            syncNum: 0,
            syncStatus: '' // exception
        };
    },
    created() {
        this.getList()
    },
    beforeDestroy() {
        if(this.syncTimer != null) {
            clearInterval(this.syncTimer);
            this.syncTimer = null;
        }
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
        },
        // 通道同步
        startChannelSync(row) {
            
            // 发送国标同步请求
            let formdata = new FormData();
            formdata.append("id", row.id);
            channelSync(formdata).then(res => {
                console.log('sync', res)
                this.syncVisible = true;
                this.syncStatus = 'success';
                this.syncNum = 0;
                this.syncTimer = setInterval(() => {
                    // 获取通道同步状态
                    channelSyncStatus(formdata).then(res => {
                        console.log('sync status', res)
                        if(res.code == 0) {
                            let data = res.data;
                            if(data.code == 0) {
                                if(data.syncIng) {
                                    if((this.syncNum + 10) < 100) {
                                        this.syncNum = this.syncNum + 10;
                                    }
                                } else {
                                    this.syncNum = 100;
                                    this.syncStatus = 'success';

                                    this.$message.success(data.msg)

                                    setTimeout(() => {
                                        this.syncVisible = false;
                                        this.syncNum = 0;
                                        clearInterval(this.syncTimer);
                                        this.syncTimer = null;
                                    }, 1000);
                                }
                            } else {
                                this.$message.error(data.msg);
                                this.syncNum = 100;
                                this.syncStatus = 'exception';
                                setTimeout(() => {
                                    this.syncVisible = false;
                                    this.syncNum = 0;
                                    clearInterval(this.syncTimer);
                                    this.syncTimer = null;
                                }, 1000);
                            }
                        }
                    });
                }, 3000);
                // this.syncVisible.close();
            }).catch(()=>{
                this.syncVisible = false;
                this.syncNum = 0;
                clearInterval(this.syncTimer);
                this.syncTimer = null;
            })
        },
        handleSyncClose() {
            this.syncVisible = false;
            this.syncNum = 0;
            clearInterval(this.syncTimer);
            this.syncTimer = null;
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
  