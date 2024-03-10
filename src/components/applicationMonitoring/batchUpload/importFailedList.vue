<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            title="导入结果"
            :visible.sync="importVisible"
            width="1200px"
            top="8vh"
            append-to-body
            @closed="closed"
        >
            <div>
                <el-table
                    :data="tableData"
                    border
                    style="width: 100%"
                    v-loading="loading"
                >
                    <el-table-column align="center" prop="index" label="序号" width="60"></el-table-column>
                    <el-table-column align="center" prop="brand" label="品牌"></el-table-column>
                    <el-table-column align="center" prop="name" label="摄像头名称"></el-table-column>
                    <el-table-column align="center" prop="ipHost" label="摄像头IP"></el-table-column>
                    <el-table-column align="center" prop="account" label="账号" width="150"></el-table-column>
                    <el-table-column align="center" prop="password" label="密码" width="150"></el-table-column>
                    <el-table-column align="center" prop="algorithms" label="关联算法"></el-table-column>
                    <el-table-column align="center" prop="location" label="点位归属"></el-table-column>
                    <el-table-column align="center" prop="alarmInterval" label="告警间隔" width="100"></el-table-column>
                    <el-table-column align="center" prop="intervalTime" label="识别间隔" width="100"></el-table-column>
                    <el-table-column align="center" label="操作" width="60">
                        <el-button type="text" @click="deleteData(scope.row)">删除</el-button>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 10px;">
                    <el-button type="danger" @click="reImportFun()">重新导入</el-button>
                    <el-button icon="el-icon-arrow-left" @click="goBack()">返回</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {listDataByImportState} from "@/api/applicationMonitoring/batchUpload"
export default {
    data() {
        return {
            importVisible:true,
            loading:false,
            tableData:[]
        };
    },
    created() {
        this.getList()
    },
    methods: {
        // 获取列表
        getList(){
            this.loading = true;
            listDataByImportState({importState:'2'}).then(res=>{
                this.loading = false;
                if(res.data&&res.data.length>0){
                    res.data.map((item,idx)=>{
                        item.index = idx+1;
                    })
                    this.tableData = res.data
                }
            }).catch(res => {
                this.loading = false;
            })
        },
        // 关闭弹窗
        closed(){
            this.$emit('importColse',false)
        },
        // 删除
        deleteData(row){
            deleteById({id:row.id}).then(res=>{
                this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration:500
                });
                this.getList()
            })
        },
        // 返回
        goBack(){
            this.$emit('importColse',false)
        },
        // 重新校验
        reImportFun(){
            this.$emit('importColse',true)
        },
    },
};
</script>
<style scoped lang="scss">
</style>
  