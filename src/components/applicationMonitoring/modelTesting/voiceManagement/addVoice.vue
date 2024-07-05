<template>
    <el-dialog
        :close-on-click-modal="false"
        title="新增算法"
        :visible.sync="dialogVisible"
        width="500px"
        append-to-body
        :before-close="handleDialogClose"
    >
        <el-form ref="form" :model="params" :rules="rules" label-width="120px">
            <el-form-item label="关联算法" prop="name">
                <el-select v-model="params.id" placeholder="请选择">
                    <el-option
                    v-for="item in algorithmList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="上传语音文件" prop="fileName">
                <el-upload
                    class="upload-demo"
                    action=""
                    accept=".mp3,.wav"
                    :on-change="handleChange"
                    :show-file-list="false"
                    :auto-upload="false">
                    <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">
                        <div>支持mp3、wav格式，文件大小不超过3m</div>
                        <div v-if="params.fileName" style="display: flex;justify-content:space-between;align-items: center;">
                            <div>{{ params.fileName }}</div>
                            <div class="el-icon-close" style="cursor: pointer;" @click="handleRemove"></div>
                        </div>
                    </div>
                </el-upload>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="closed" v-if="!btnLoading">取消</el-button>
            <el-button type="primary" @click="saveData" :loading="btnLoading">保存</el-button>
        </span>
    </el-dialog>
</template>

<script>
import { uploadSoundFile} from "@/api/applicationMonitoring/modelTesting";
export default {
    props:{
        algorithmList:{
            type:Array,
            default:[]
        },
        currentObj:{
            type:Object,
            default:{}
        }
    },
    data() {
        return {
            dialogVisible:true,
            params:{
                id:'',
                file:'',
                fileName:'',
            },
            rules:{
                id: [{ required: true, message: "请选择关联算法", trigger: "change" }],
                fileName: [{ required: true, message: "请上传语音文件", trigger: "change" }],
            },
            fileList:[],
            btnLoading:false,
            tipText:'',
        };
    },
    created(){
        if(JSON.stringify(this.currentObj) != "{}"){
            console.log(this.currentObj.id)
            this.params.id = this.currentObj.id;
            this.params.fileName = this.currentObj.soundFile;
        }
    },
    methods:{
        handleDialogClose(){
            if(!this.btnLoading){
                this.$emit('closeAdd')
            }
        },
        closed(){
            this.$emit('closeAdd')
        },
        handleChange(file, fileList) {
            const isLimit = file.size / 1024 / 1024 < 3;
            if (!isLimit) {
                this.$message.error("上传视频大小不能超过3MB!");
                return;
            }
            console.log(file)
            let Arr = [];
            Arr.push(file)
            // this.fileList = Arr;
            this.params.fileName = file.name
            this.params.file = file.raw;
            // this.params.file = 
            this.$refs.form.validate()
        },
        handleRemove(){
            this.params.file = "";
            this.params.fileName = ""
            this.$refs.form.validate()
        },
        // 导入
        saveData(){
            this.btnLoading = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    // if(!this.params.file){
                    //     this.$emit('closeAdd');
                    //     return;
                    // }
                    let formData = new FormData();
                    formData.append("id", this.params.id);
                    if(this.currentObj.id){
                        if(this.params.id!= this.currentObj.id ||!this.params.file){
                            formData.append("oldId", this.currentObj.id);
                        }
                    }
                    if(this.params.file){
                        formData.append("file", this.params.file);
                    }
                    uploadSoundFile(formData).then(res=>{
                        this.tipText = "";
                        this.btnLoading = false;
                        if(res.code==0&&JSON.stringify(res.data) == "{}"){
                            this.$message.success('保存成功');
                            this.$emit('closeAdd')
                        }else{
                            this.tipText = res.data;
                        }
                        
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
};
</script>
<style scoped lang="scss">

</style>
