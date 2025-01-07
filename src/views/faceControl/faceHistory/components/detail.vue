<template>
  <el-dialog
    :title="'修改分组'"
    :visible.sync="visible"
    width="30%"
    @update:visible="val => $emit('update:visible', val)"
    append-to-body>
    <div style="overflow: hidden;"> 
      <el-form label-position="right" :model="formatData" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="姓名" prop="name">
          <el-input :disabled="disabled" v-model="formatData.name"></el-input>
        </el-form-item>
        <el-form-item label="所属分组" prop="groupId">
          <!-- <el-input :disabled="disabled" v-model="formatData.groupId"></el-input> -->
          <el-select class="pr10" style="width: 291px;" :disabled="disabled" v-model="formatData.groupId" placeholder="请选择">
            <el-option
              v-for="item in graps"
              :key="item.id"
              v-if="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        
      </el-form>
      <span slot="footer" class="footer">
        <el-button size="mini" :disabled="disabled" type="primary" @click="save()">确 定</el-button>
        <el-button size="mini"  @click="closeDialog">取 消</el-button>
      </span>
    </div>
  </el-dialog>
</template>
<script>
import { save,groupListData } from '../api' 
export default {
  components: {
  },
  props:{
    visible:Boolean,
    currentItme:Object,
    currentState:String
  },
  data() {
    return {
      formatData:{
        files:[]
      },
      rules: {
          name: [
            { required: true, message: '请输入', trigger: 'blur' }
          ],
          groupId:[
            { required: true, message: '请选择', trigger: 'blur' }
          ]
      },
      graps:[],
    };
  },
  computed:{
    title(){
      if(this.currentState == 'see'){
        return '查看'
      } else if(this.currentState == 'add') {
        return '新增'
      } else {
        return '编辑'
      }
    },
    disabled(){
      if(this.currentState == 'see'){
        return true
      } else {
        return false
      }
    }
  },
  created(){
    this.int()
  },
  methods: {
    int(){
      this.getTable()
      //this.getDetail()
    },
    async getTable(){
      const { data,count } = await groupListData()
      this.graps = data

    },
    // async getDetail(){
    //   if(this.currentItme.id){
    //     const { data,count } = await detail({id:this.currentItme.id})
    //     this.formatData = data
    //   }
      
    // },
    closeDialog() {
      this.$emit('update:visible', false)
      this.$emit('close', false)
    },

    validatePhoneNumber(phone) {
    // 定义手机号格式的正则表达式
        var regExp = /^1[3456789]\d{9}$/;
        
        if (regExp.test(phone)) {
            return true; // 符合手机号格式要求
        } else {
            return false; // 不符合手机号格式要求
        }
    },
    async save(){
      // if(!this.validatePhoneNumber(this.formatData.tel)){
      //   this.$message.error("手机号错误")
      //   return
      // }

      // const fd=new FormData()
      // fd.append('name',this.formatData.name)
      // fd.append('tel',this.formatData.tel)
      // fd.append('remark',this.formatData.remark)
      // fd.append('groupId',this.formatData.groupId)
      // console.log(this.formatData)
      const { code,data } =await save({...this.formatData,reportId:this.currentItme.id})
      if(code == 0) {
        this.$message.success('修改成功')
        this.closeDialog()
      }

    },
    changes(val){
      this.formatData.nameEn =  val.replace(/[^a-zA-Z]/g,'')
    },
    handleUploadFile (value) {
      const files = value.target.files || {}
      console.log('debug===>获取上传文件',files)
     // const formData = new FormData()
      // Array.from(files).forEach((item: any) => {
      //   formData.append('files', item)
      // })
      //TODO调用后端接口，传入文件参数
      //const { data , code } = await API.fetchImageURl(formData)
      // if(code == 200){
      //   //TODO
      // }
      this.formatData.files = Object.values(files)
      this.$forceUpdate()
    },
    handleAddImg(){
    const input = document.querySelector('#upload')
    input.click()
  }
  },
  
};
</script>
<style scoped lang="scss">
.bg {
  background: white;
}
.wh{
  width: 100%;
  height: 100%;
}
.footer{
  float: right;
}
.iptcontent{
  position: relative;
  .img-input{
    opacity: 0;
  }
}
</style>