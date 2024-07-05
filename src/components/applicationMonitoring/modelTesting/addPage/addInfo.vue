<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            title="导入算法完整包"
            :visible.sync="dialogVisible"
            width="500px"
            append-to-body
            :before-close="handleDialogClose"
        >
            <el-form ref="form" :model="params" :rules="rules" label-width="80px">
                <div class="title-sty">算法信息</div>
                <el-form-item label="算法名称" prop="name">
                    <el-input v-model="params.name"></el-input>
                </el-form-item>
                <el-form-item label="算法英文" prop="nameEn">
                    <el-input v-model="params.nameEn" @blur="blurCheck" :class="[isExist?'color-red':'']"></el-input>
                    <div v-if="isExist" style="color: #F56C6C; font-size: 12px;position: absolute;top: 30px;">算法英文名称已存在，请勿重复添加</div>
                </el-form-item>
                <el-form-item label="所属平台" prop="platform">
                    <el-select
                        v-model="params.platform"
                        placeholder="请选择所属平台"
                        style="width: 100%"
                    >
                        <el-option
                            v-for="(item, index) in platformList"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <div class="title-sty">卡片信息（可选）</div>
                <el-form-item label="卡片图片">
                    <el-upload
                        ref="upload"
                        class="upload-demo"
                        action=""
                        :on-change="handleChange"
                        :on-remove="handleRemove"
                        :limit="1"
                        :file-list="fileList"
                        accept=".png"
                        :auto-upload="false">
                        <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
                        <div slot="tip" class="el-upload__tip">
                            图片为PNG格式，分辨率为325*180，大小不超过1m
                        </div>
                    </el-upload>
                </el-form-item>
                <el-form-item label="卡片文案">
                    <el-input v-model="params.marks" type="textarea" :rows="3" maxlength="30" placeholder="可选，建议字数不超过30字"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="closed" v-if="!btnLoading">取消</el-button>
                <el-button type="primary" @click="saveData" :loading="btnLoading">创建卡片</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { checkNameEn, } from "@/api/applicationMonitoring/algorithmManagement";
import { saveOrUpdate } from "@/api/applicationMonitoring/modelTesting"
export default {
    data(){
        return{
            dialogVisible:true,
            platformList:[
                {
                    name:'英伟达',
                    id:'nvidia',
                },
                {
                    name:'登临',
                    id:'denglin',
                },
                {
                    name:'灵汐',
                    id:'lynxi',
                },
            ],
            params:{
                name:'',
                nameEn:'',
                platform:'',
                imageFile:'',
                marks:'',
            },
            rules:{
                name: [{ required: true, message: "请输入算法名称", trigger: "blur" }],
                nameEn: [{ required: true, message: "请输入算法英文", trigger: "blur" }],
                platform: [{ required: true, message: "请选择所属平台", trigger: "change" }]
            },
            fileList:[],
            btnLoading:false,
            tipText:'',
            isExist:false,
        }
    },
    created(){

    },
    methods:{
        handleDialogClose(){
            if(!this.btnLoading){
                this.$emit('closeHandel')
            }
        },
        closed(){
            this.$emit('closeHandel')
        },
        handleChange(file, fileList) {
            const isLimit = file.size / 1024 / 1024 < 1;
            if (!isLimit) {
                this.$message.error("上传图片大小不能超过1MB!");
                this.$refs.upload.clearFiles() // 清除前端显示的文件列表
            }else{
                let Arr = [];
                Arr.push(file)
                this.fileList = Arr;
                this.params.imageFile = file.raw;
            }
        },
        handleRemove(file, fileList){
            this.params.imageFile = "";
            this.fileList = [];
        },
        // 算法英文名失去焦点时，判断此算法是否存在
        blurCheck(){
            if(!this.params.nameEn){
                this.isExist = false;
                return
            }
            let obj = {
                id:this.currentId,
                nameEn:this.params.nameEn
            }
            checkNameEn(obj).then(res=>{
                this.isExist = res.data
            })
        },
        // 导入
        saveData(){
            this.btnLoading = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let formData = new FormData();
                    formData.append("name", this.params.name);
                    formData.append("nameEn", this.params.nameEn);
                    formData.append("platform", this.params.platform);
                    formData.append("imageFile", this.params.imageFile);
                    formData.append("marks", this.params.marks);
                    saveOrUpdate(formData).then(res=>{
                        this.btnLoading = false;
                        this.$message.success('创建成功');
                        this.$emit('closeHandel',true)
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
<style scoped lang="scss">
.title-sty{
    font-size: 14px;
    color: #606266;
    font-weight: bold;
    margin-bottom:20px;
}
</style>