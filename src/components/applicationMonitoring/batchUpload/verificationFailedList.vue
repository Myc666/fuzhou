<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            title="校验结果"
            :visible.sync="checkVisible"
            width="90%"
            top="8vh"
            append-to-body
            @close="closed"
        >
        <div class="failList-cont">
            <div class="top">
                <div style="margin-right: 10px;">仅展示错误、填写信息不全的摄像头</div>
                <el-switch v-model="switchValue" @change="switchChange"></el-switch>
            </div>
            <el-table
                :data="tableData"
                border
                style="width: 100%"
                :row-class-name="tableRowClassName"
                v-loading="loading"
            >
                <el-table-column align="center" prop="index" label="序号" width="60"></el-table-column>
                <el-table-column align="center" prop="brand" label="品牌" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.brand" placeholder="品牌名称" :class="[getTip(scope.row,'brand')?'borderColor':'']"  @change="inputChange(scope.row,scope.$index)"></el-input>
                        <div class="tip" v-if="getTip(scope.row,'brand')">{{ getTip(scope.row,'brand') }}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="name" label="摄像头名称">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name" placeholder="摄像头名称" :class="[getTip(scope.row,'name')?'borderColor':'']"  @change="inputChange(scope.row,scope.$index)"></el-input>
                        <div class="tip" v-if="getTip(scope.row,'name')">{{ getTip(scope.row,'name') }}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="ipHost" label="摄像头IP">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.ipHost" placeholder="摄像头IP" :class="[getTip(scope.row,'ipHost')?'borderColor':'']"  @change="inputChange(scope.row,scope.$index)"></el-input>
                        <div class="tip" v-if="getTip(scope.row,'ipHost')">{{ getTip(scope.row,'ipHost') }}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="account" label="账号" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.account" placeholder="账号" :class="[getTip(scope.row,'account')?'borderColor':'']"  @change="inputChange(scope.row,scope.$index)"></el-input>
                        <div class="tip" v-if="getTip(scope.row,'account')">{{ getTip(scope.row,'account') }}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="password" label="密码" width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.password" placeholder="密码" :class="[getTip(scope.row,'password')?'borderColor':'']"  @change="inputChange(scope.row,scope.$index)"></el-input>
                        <div class="tip" v-if="getTip(scope.row,'password')">{{ getTip(scope.row,'password') }}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="algorithms" label="关联算法">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.algorithms" placeholder="关联算法" :class="[getTip(scope.row,'algorithm')?'borderColor':'']" @change="inputChange(scope.row,scope.$index)"></el-input>
                        <div class="tip" v-if="getTip(scope.row,'algorithm')">{{ getTip(scope.row,'algorithm') }}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="location" label="点位归属" >
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.location" placeholder="点位归属" :class="[getTip(scope.row,'location')?'borderColor':'']"  @change="inputChange(scope.row,scope.$index)"></el-input>
                        <div class="tip" v-if="getTip(scope.row,'location')">{{ getTip(scope.row,'location') }}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="alarmInterval" label="告警间隔" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.alarmInterval" placeholder="告警间隔" :class="[getTip(scope.row,'alarmInterval')?'borderColor':'']"  @change="inputChange(scope.row,scope.$index)"></el-input>
                        <div class="tip" v-if="getTip(scope.row,'alarmInterval')">{{ getTip(scope.row,'alarmInterval') }}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" prop="intervalTime" label="识别间隔" width="100">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.intervalTime" placeholder="识别间隔" :class="[getTip(scope.row,'intervalTime')?'borderColor':'']"  @change="inputChange(scope.row,scope.$index)"></el-input>
                        <div class="tip" v-if="getTip(scope.row,'intervalTime')">{{ getTip(scope.row,'intervalTime') }}</div>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160">
                    <template slot-scope="scope">
                        <el-button type="text" style="margin-right: 10px;" v-if=" getTip(scope.row,'rtspUrl')" @click="editData(scope.row,scope.$index)">修改Rtsp地址</el-button>
                        <el-popover
                            :ref="scope.row.id"
                            placement="top"
                            width="200"
                        >
                            <div>
                                <span class="el-icon-question" style="color: #E6A23C;"></span>
                                <span style="margin-left: 10px;font-size: 12px;">是否放弃导入此摄像头？</span>
                            </div>
                            <div style="display: flex;justify-content: end;margin-top: 15px;">
                                <div style="cursor: pointer;border-radius: 2px;border: 1px solid rgba(0, 0, 0, 0.10);font-size: 12px;line-height: 20px;padding: 0px 12px;color: #000;" @click="visibleDelCancel(scope.row.id)">取消</div>
                                <div style="cursor: pointer;border-radius: 2px;font-size: 12px;line-height: 20px;padding: 0px 12px;color: #FFF;background: #409EFF;margin-left: 10px;" @click="deleteData(scope.row)">删除</div>
                            </div>
                            <el-button slot="reference" type="text">删除</el-button>
                        </el-popover>
                    </template>
                </el-table-column>
            </el-table>
            <div class="total">共{{ tableData.length }}条数据</div>
            <div>
                <el-button type="danger" @click="recalibrationFun()">重新校验</el-button>
                <el-button icon="el-icon-arrow-left" @click="goBack()">返回</el-button>
            </div>
        </div>
        </el-dialog>
        <el-dialog
            width="50%"
            title="修改Rtsp地址"
            :visible.sync="innerVisible"
            append-to-body>
            <div v-if="innerVisible" class="edit-cont">
                <el-input placeholder="请输入内容" type="textarea" v-model="editObj.rtspUrl"></el-input>
                <div style="margin-top: 10px;text-align: right;">
                    <el-button @click="editCancel()">取消</el-button>
                    <el-button type="primary" @click="saveFun()">保存</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {listDataByCheckState,deleteById,checkBasicById,update} from "@/api/applicationMonitoring/batchUpload"
export default {
    data() {
        return {
            checkVisible:true,
            loading:false,
            tableData:[],
            switchValue:false,
            visible:false,
            innerVisible:false,
            editObj:{},
            editIndex:null,
        };
    },
    created() {
        this.getList()
    },
    methods: {
        // 获取列表
        getList(){
            this.loading = true;
            listDataByCheckState({checkState:this.switchValue?'2':''}).then(res=>{
                this.loading = false;
                if(res.data&&res.data.length>0){
                    res.data.map((item,idx)=>{
                        item.index = idx+1;
                        item.visible = false
                    })
                    this.tableData = res.data
                }else{
                    this.tableData = []
                }
            }).catch(res => {
                this.loading = false;
                this.tableData = []
            })
        },
        // 获取提示
        getTip(row,str){
            if(row.mistake){
                let obj = JSON.parse(row.mistake)
                return obj[str]
            }else{
                return ''
            }
        },
        // 判断是否属于错误数据
        tableRowClassName({row, rowIndex}) {
            console.log(row)
            if (row.checkState == 2) {
                return 'error-row';
            } 
            return '';
        },
        // 是否只展示错误信息
        switchChange(){
            this.getList()
        },
        // 关闭弹窗
        closed(){
            this.$emit('checkColse',false)
        },
        // 修改rtsp地址
        editData(row,index){
            this.editObj = row;
            this.editIndex = index;
            this.innerVisible = true
        },
        // 修改rtsp地址--取消
        editCancel(){
            this.editObj = {};
            this.editIndex = null;
            this.innerVisible = false
        },
        // 修改rtsp地址--保存
        saveFun(){
            this.inputChange(this.editObj,this.editIndex,true)
        },
        // 删除
        deleteData(row){
            deleteById({id:row.id}).then(res=>{
                this.$message({
                    message: '删除成功',
                    type: 'success',
                    duration:500
                });
                this.$refs[row.id].doClose()
                this.getList()
            })
        },
        // 返回
        goBack(){
            this.$emit('checkColse',false)
        },
        // 重新校验
        recalibrationFun(){
            this.$emit('checkColse',true)
        },
        // 删除取消
        visibleDelCancel(id) { // 取消
            this.$refs[id].doClose()
        },
        // 修改数据
        inputChange(row,index,isSave){
            // console.log(row.id)
            let form = new FormData();
            form.append("id", row.id);
            form.append("rtspUrl", row.rtspUrl);
            form.append("name", row.name);
            form.append("brand", row.brand);
            form.append("ipHost", row.ipHost);
            form.append("account", row.account);
            form.append("paaaword", row.paaaword);
            form.append("channel", row.channel);
            form.append("algorithms", row.algorithms);
            form.append("location", row.location);
            form.append("intervalTime", row.intervalTime);
            form.append("alarmInterval", row.alarmInterval);
            update(form).then(res=>{
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration:500
                });
                this.checkInfoFun(row.id,index)
                if(isSave){
                    this.editCancel();
                }
            })
        },
        // 单条校验
        checkInfoFun(Id,index){
            console.log(index)
            checkBasicById({id:Id}).then(res=>{
                console.log(JSON.stringify(res.data))
                let str = JSON.stringify(res.data)
                this.tableData[index].mistake=str
                console.log(this.tableData[index].mistake)
            })
        }
    },
};
</script>
<style scoped lang="scss">
.failList-cont{
    :deep(.el-input){
        margin-bottom: 0px !important;
    }
    .tip{
        font-size: 12px;
        color: #D54941;
    }
    .borderColor{
        :deep(.el-input__inner){
            border: 1px solid #D54941 !important;
        }
    }
    :deep(.el-table){
        .error-row{
            background: #fae2e2;
        }
    }
    .top{
        color: #303133;
        font-size: 12px;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
    }
    .total{
        margin: 10px 0px;
        color: rgba(0, 0, 0, 0.60);
        font-size: 12px;
    }
    :deep(.el-button--danger){
        color: #FFF !important;
        background-color: #F56C6C !important;
        border-color:transparent;
        border: none;
    }
    :deep(.el-input--small .el-input__inner){
        text-align: center;
    }
}
.edit-cont{
    :deep(.el-textarea__inner){
        min-height: 150px !important;
    }
}
</style>
  