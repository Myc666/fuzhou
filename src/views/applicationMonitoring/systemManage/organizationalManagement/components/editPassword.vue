<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            title="修改密码"
            :visible.sync="dialogVisible"
            width="500px"
            @closed="closed"
        >
            <div style="font-size: 12px; color: #939393;margin-bottom: 10px;">修改密码将直接覆盖旧密码，请您妥善保管密码信息。</div>
            <el-form ref="form" :model="params" :rules="rules" label-width="80px">
                <el-form-item  label="账号名称">
                    <el-input v-model="currentName" disabled></el-input>
                </el-form-item>
                <el-form-item  label="账号密码" prop="password">
                    <el-input v-model="params.password"></el-input>
                    <div style="font-size: 12px; color: #939393;">8~26个字符,使用大小写字母、数字和特殊字符的组合</div>
                </el-form-item>
            </el-form>
            <div>
                <el-button type="primary" @click="saveData">保存</el-button>
                <el-button @click="closed">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { updatePassword } from "../api"
export default {
  props: {
    currentId: {
      type: String,
      default: null,
    },
    currentName:{
        type:String,
        default:''
    }
  },
  data() {
    return {
        dialogVisible: true,
        params: {
                password: "",
        },
        rules: {
            password: [
                { required: true, message: "请输入密码", trigger: "blur" },
                {
                    validator: function(rule, value, callback) {
                        const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,26}$/;
                        if (!regex.test(value)) {
                            callback(new Error('请输入正确格式的密码'));
                        } else {
                            callback();
                        }
                    },
                    trigger: 'blur',
                },
            ],
        },
    };
  },
  async created() {

  },
  methods: {
    // 新增
    saveData(){
        this.$refs.form.validate(async (valid) => {
            if (valid) {
                // let obj = {
                //     id:this.currentId,
                //     password: this.params.password,
                // }
                let formData = new FormData();
                formData.append("accountId", this.currentId);
                formData.append("password", this.params.password);
                const res = await updatePassword(formData);
                this.$message.success("保存成功")
                this.$emit("close");
            } else {
                return false;
            }
        });
    },
    // 关闭回调
    closed() {
      this.$emit("close");
    },
  },
};
</script>
<style scoped lang="scss">
</style>
