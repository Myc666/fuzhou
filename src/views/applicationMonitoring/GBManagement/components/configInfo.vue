<template>
    <el-dialog
        :close-on-click-modal="false"
        title="配置信息"
        :visible.sync="dialogVisible"
        width="80%"
        @close="closed"
        append-to-body
    >
        <div class="config-cont">
            <el-form ref="form" :model="params" label-width="60px">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-form-item label="编号:">
                            {{ params.id }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="域:">
                            {{ params.domain }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="IP:">
                            {{ params.ip }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="端口:">
                            {{ params.port }}
                        </el-form-item>
                    </el-col>
                    <el-col :span="8">
                        <el-form-item label="密码:">
                            {{ params.password }}
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            
        </div>
    </el-dialog>
</template>
<script>
import { getConfigInfo } from "../api"
export default {
    props:{
        currentId:{
            type:String,
            default:""
        }
    },
    data() {
        return {
            dialogVisible:true,
            params:{},
        };
    },
    created() {
        this.getConfig()
    },
    methods: {
        // 获取数据
        getConfig(){
            this.loading = true;
            getConfigInfo().then(res=>{
                this.params = res.data;
                this.loading = false;
            }).catch(()=>{
                this.loading = false;
            })
        },
        closed(){
            this.$emit("close")
        }
    },
};
</script>
<style scoped lang="scss">

</style>
  