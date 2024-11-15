<template>
    <div class="sound-cont">
        <div class="mrB10">
            <el-button size="mini" type="primary" @click="addFun()">新增</el-button>
        </div>
        <div class="table-cont">
            <Tables
                :pagination="pagination"
                :columns="columns"
                :dataSource="dataSource"
                :loading="loading"
                @pageChange="pageChange"
                :rowSelection="false"
            >
                <div slot="index" slot-scope="{ $index }">
                    {{ $index + 1 }}
                </div>
                <div slot="operate" slot-scope="{ row }">
                    <el-button type="text" @click="editData(row)">编辑</el-button>
                    <el-button type="text" style="color: #f56c6c !important" @click="delData(row.id)">删除</el-button>
                </div>
            </Tables>
        </div>
        <!-- 新增、编辑 -->
        <AddInfo v-if="addVisible" :currentId="currentId" @closeAdd="closeAdd"></AddInfo>
    </div>
</template>
<script>
import { ledList,ledDelete } from "./api"
import Tables from "@/components/Table/index.vue";
import AddInfo from "./components/addInfo.vue";
export default {
    components:{
        Tables,
        AddInfo
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
                    title: "序号",
                    align: "center",
                    slot: "index",
                    width:60
                },
                {
                    key: "name",
                    title: "led名称",
                    align: "center",
                },
                {
                    key: "ipPort",
                    title: "ip和端口号",
                    align: "center",
                },
                {
                    key: "limitCount",
                    title: "限额人数",
                    align: "center",
                },
                {
                    key: "zeroDay",
                    title: "统计区间(天)",
                    align: "center",
                },
                {
                    key: "cameras",
                    title: "摄像头",
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
            addVisible:false
        };
    },
    created() {
        this.getList();
    },
    methods: {
        getList(){
            this.loading = true;
            ledList().then(res=>{
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
        // 新增
        addFun(){
            this.currentId = "";
            this.addVisible = true;
        },
        // 编辑
        editData(row){
            this.currentId = row.id;
            this.addVisible = true;
        },
        // 关闭新增弹窗
        closeAdd(){
            this.addVisible = false;
            this.currentId = "";
            this.getList()
        },
        // 删除
        delData(id){
            this.$confirm(`是否删除该数据?`, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            }).then(() => {
                let formData = new FormData();
                formData.append("id", id);
                ledDelete(formData).then(res=>{
                    this.$message.success('删除成功');
                    this.getList();
                })
            }).catch(()=>{

            })
        }
    },
};
</script>
<style scoped lang="scss">
.sound-cont{
    background: #FFF;
    border-radius: 6px;
    padding: 16px;
    .mrB10{
        margin-bottom: 15px;
    }
}
</style>
  