<template>
    <div>
        <el-dialog
        :close-on-click-modal="false"
        :title="title"
        :visible.sync="dialogVisible"
        width="600px"
        @closed="closed"
      >
        <div>
          <el-form ref="form" :model="params" :rules="rules" label-width="80px">
            <el-form-item label="部门名称" prop="name">
                <el-input v-model="params.name"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveFun">提交</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script>
import { saveData,detailData } from "../api"
export default {
    props:{
        parentId:{
            type:String,
            default:''
        },
        currentId:{
            type:String,
            default:'',
        }
    },
    data() {
        return {
            dialogVisible:true,
            title: this.currentId ? "编辑部门" : "新增部门",
            params:{
                name:'',
            },
            rules: {
                name: [{ required: true, message: "请输入部门名称", trigger: "blur" }],
            },
        };
    },
    created() {
        if(this.currentId){
            this.getDetail();
        }
    },
    methods: {
        closed(){
            this.$emit('close')
        },
        // 获取详情
        getDetail() {
            detailData({id:this.currentId}).then(res=>{
                Object.assign(this.params, {
                    id: res.data.id,
                    name: res.data.name,
                    parentId: res.data.parentId,
                });
            })
        },
        // 保存
        saveFun(){
            this.$refs.form.validate(async (valid) => {
                if (valid) {
                    
                    let obj = {
                        ...this.params
                    }
                    if(!this.currentId){
                        obj.parentId = this.parentId=='0'?0:this.parentId;
                    }
                    const res = await saveData(obj);
                    this.$message.success("保存成功")
                    this.$emit("close");
                } else {
                    return false;
                }
            });
        }
    },
};
</script>
<style scoped lang="scss">
</style>
  