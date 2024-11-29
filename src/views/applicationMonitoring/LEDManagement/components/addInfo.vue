<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            title="新增LED设备"
            :visible.sync="dialogVisible"
            width="500px"
            @close="closed"
        >
            <el-form ref="form" :model="params" :rules="rules" label-width="120px">
                <el-form-item label="LED名称" prop="name">
                    <el-input v-model="params.name"></el-input>
                </el-form-item>
                <el-form-item label="LED服务地址" prop="ipPort">
                    <el-input v-model="params.ipPort"></el-input>
                </el-form-item>
                <el-form-item label="限额人数" prop="limitCount">
                    <el-input-number v-model="params.limitCount" :controls="false" :precision="0" class="input-num"></el-input-number>
                </el-form-item>
                <el-form-item label="统计区间(天)" prop="zeroDay">
                    <el-input-number v-model="params.zeroDay" :controls="false" :precision="0" class="input-num"></el-input-number>
                    <div style="font-size: 12px;color: #909399;">统计所有天数数据填0</div>
                </el-form-item>
                <el-form-item label="摄像头">
                    <el-select v-model="params.cameraIds" multiple placeholder="请选择"  style="width: 100%;">
                        <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closed">取消</el-button>
                <el-button type="primary" @click="saveData" :loading="btnLoading">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { ledInfo,ledSave,listData2 } from "../api";
export default {
    props:{
        currentId:{
            type:String,
            default:''
        }
    },
    data(){
        return{
            dialogVisible:true,
            options:[],
            params:{
                name:'',
                ipPort:'',
                limitCount:'50',
                zeroDay:'1',
                cameraIds:[],
            },
            rules:{
                name: [{ required: true, message: "请输入LED名称", trigger: "blur" }],
                ipPort: [{ required: true, message: "请输入LED服务地址", trigger: "blur" }],
                limitCount: [{ required: true, message: "请输入限额人数", trigger: "blur" }],
                zeroDay: [{ required: true, message: "请输入统计区间(天)", trigger: "blur" }],
                cameraIds: [{ required: true, message: "请选择摄像头", trigger: "change" }],
            },
            btnLoading:false,
        }
    },
    created(){
        this.getlistData();
        if(this.currentId){
            this.getDetail();
        }
    },
    methods:{
        async getlistData(){
            const res = await listData2();
            this.options = res.data;
        },
        async getDetail(){
            let formData = new FormData();
            formData.append("id", this.currentId);
            const res = await ledInfo(formData)
            this.params = res.data;
        },
        closed(){
            this.$emit('closeAdd')
        },
        // 保存
        saveData(){
            this.btnLoading = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    ledSave(this.params).then(res=>{
                        this.$message.success('保存成功');
                        this.btnLoading = false;
                        this.$emit('closeAdd');
                    }).catch(()=>{
                        this.btnLoading = false;
                    })
                } else {
                    this.btnLoading = false;
                    return false;
                }
            });
        }
    }
}
</script>
<style lang="scss">
.input-num{
  width: 100%;
  .el-input__inner{
    text-align: left !important;
  }
}
</style>