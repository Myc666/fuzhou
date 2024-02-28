<template>
  <div class="tab-wrap">
    <el-form :model="form" :rules="rules" ref="ruleForm">
      <el-form-item prop="issue">
        <el-select v-model="form.issue" multiple filterable allow-create placeholder="请选择或输入标签" style="width: 100%">
          <el-option label="精度太低" value="精度太低"></el-option>
          <el-option label="标签错误" value="标签错误"></el-option>
          <el-option label="漏标" value="漏标"></el-option>
          <el-option label="标注错误" value="标注错误"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="text">
        <el-input v-model="form.text" type="textarea" placeholder="请输入新问题" maxlength="64"></el-input></el-form-item>
    </el-form>
    <el-button v-if="$route.query.type == 2" type="primary" @click="submit">驳回</el-button>
  </div>
</template>

<script>
export default {
  props: {
    currentImgId: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      form: {
        issue: [],
        text: ''
      },
      rules: {
        issue: [{ required: true, message: '请选择或输入标签', trigger: 'blur' }]
      }
    };
  },
  watch: {
    currentImgId: {
      immediate: true,
      deep: true,
      handler(val) {
        if (this.formData?.comment) {
          const formData = JSON.parse(this.formData.comment);
          Object.assign(this.form, formData);
        } else {
          this.$nextTick(() => {
            this.$refs.ruleForm.resetFields();
          });
        }
      }
    }
  },

  methods: {
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.$emit('submit', this.form);
        }
      });
    }
  }
};
</script>
<style scoped lang="scss">
.tab-wrap {
  padding: 20px;

  .issue-list {
    line-height: 24px;
    font-size: 14px;
    margin-top: 20px;

    li {
      border-top: 1px #c6c7c9 solid;
      padding: 10px;
      cursor: pointer;

      &.active {
        background: rgba($color: #2099fa, $alpha: 0.2);
      }
    }
  }
}
</style>
