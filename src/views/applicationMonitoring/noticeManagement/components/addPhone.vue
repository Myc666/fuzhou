<template>
    <div>
        <el-dialog :close-on-click-modal="false" title="新增手机号" :visible.sync="dialogVisible" width="600px" @closed="closed">
			<div>
				<el-form ref="form" :model="params" :rules="rules" label-width="120px">
					<el-form-item label="手机号" prop="phone">
						<el-input v-model="params.phone"></el-input>
					</el-form-item>
					<el-form-item label="关联告警等级" prop="levelId">
						<el-select
                            v-model="params.levelId"
                            placeholder="请选择告警等级"
                            style="width: 100%"
                            >
                            <el-option
                                v-for="(item, index) in alarmLevelList"
                                :key="index"
                                :label="item.name"
                                :value="item.id"
                            ></el-option>
                        </el-select>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="saveAlarmLevelData" :loading="loading">提交</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import { savePhone } from "@/api/applicationMonitoring/voiceManagement";
export default {
    props:{
        alarmLevelList:{
            type:Array,
            default:[]
        },
        detailObj:{
            type:Object,
            default:{}
        }
    },
    data() {
        return {
            dialogVisible:true,
            params: {
                phone: "",
                levelId: "",
            },
            rules: {
                phone: [
                    {required: true,message: "请输入手机号",trigger: "blur"},
                    {
                        pattern:/^1[3456789]\d{9}$/,
                        message: "请输入正确的手机号",
                        trigger: "blur",
                    },
                ],
                levelId: [{required: true,message: "请选择告警等级",trigger: "blur"}],
            },
            loading:false,
        };
    },
    created() {
        if(this.detailObj.id){
            this.params = {
                id: this.detailObj.id,
                phone: this.detailObj.phone,
                levelId: this.detailObj.levelId,
            }
        }
    },
    methods: {
        
        closed(){
            this.$emit('close')
        },
        // 提交
        saveAlarmLevelData(){
            this.loading = true;
            this.$refs.form.validate((valid) => {
                if (valid) {
                    savePhone(this.params).then(res=>{
                        this.$message.success('保存成功')
                        this.loading = false;
                        this.$emit('close')
                    })
                } else {
                    this.loading = false;
                    return false;
                }
            });
        }
    },
};
</script>
<style scoped lang="scss">
</style>
  