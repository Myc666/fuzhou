<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            title="新增算法"
            :visible.sync="dialogVisible"
            width="500px"
            @close="closed"
        >
            <div>
                <div class="title line32">注意事项</div>
                <div class="tip"><span class="title">导入完整算法</span>请单击“<span class="title">导入算法完整包</span>” </div>
                <div class="tip"><span class="title">临时测试新算法</span>请单击“<span class="title">新增算法卡片</span>”</div>
                <div class="btn-sty">
                    <el-button type="primary" icon="el-icon-box" @click="addUploadFun">导入算法完整包</el-button>
                </div>
                <div class="btn-sty">
                    <el-button icon="el-icon-bank-card" @click="addFun">新增算法卡片</el-button>
                </div>
            </div>
        </el-dialog>
        <AddUpload v-if="addUploadVisible" @closeAdd="closeUpload"/>
        <AddInfo v-if="addAlgorithmVisible" @closeHandel="closeHandel"/>
    </div>
</template>
<script>
import AddUpload from "../addUpload";
import AddInfo from "./addInfo";
export default {
    components:{
        AddUpload,
        AddInfo
    },
    data(){
        return{
            dialogVisible:true,
            addUploadVisible:false,
            addAlgorithmVisible:false,
        }
    },
    created(){

    },
    methods:{
        addUploadFun(){
            this.addUploadVisible = true;
        },
        addFun(){
            this.addAlgorithmVisible = true;
        },
        closeUpload(isClose){
            this.addUploadVisible=false;
            if(isClose){
                this.$emit('closeAdd')
            }
        },
        closeHandel(isClose){
            this.addAlgorithmVisible = false;
            if(isClose){
                this.$emit('closeAdd')
            }
        },
        closed(){
            this.$emit('closeAdd')
        },
    }
}
</script>
<style lang="scss">
.title{
    font-size: 14px;
    color: #606266;
    font-weight: bold;
    letter-spacing: 1px;
}
.tip{
    color: #B1B3B8;
    font-size: 14px;
    line-height: 24px;
    letter-spacing: 1px;
}
.btn-sty{
    text-align: center;
    margin-top: 20px;
}
.line32{
    line-height: 32px;
}
</style>