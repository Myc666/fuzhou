<template>
  <div>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="人脸对比" name="first">
        <el-row :gutter="10" v-if="activeName == 'first'">
          <el-col :span="16">
            <el-row :gutter="10">
              <el-col :span="12">
                <div class="upload-demo">
                  <el-upload
                    ref="fileLeft"
                    style="width: 100%;height: 100%;"
                    accept=".jpg,.jpeg,.png"
                    :limit="1"
                    :show-file-list="false"
                    :http-request="httpRequestLeft"
                  >
                    <div class="upload-demo">
                      <img width="100%" height="100%" :src="fileLeft.src" v-if="fileLeft.src" alt="">
                      <i v-else class="el-icon-upload"></i>
                    </div>
                  </el-upload>
                  <div class="upload-bottom">
                    <span style="line-height: 30px">
                      {{ fileLeft.name }}
                    </span>
                    <span style="float: right;">
                      <!-- <el-button size="mini" type="primary">重新上传</el-button> -->
                      <el-button size="mini" @click="del('fileLeft')">删除</el-button>
                    </span>
                  </div>
                </div>
              </el-col>
              <el-col :span="12">
                <div class="upload-demo">
                  <el-upload
                    action=""
                    style="width: 100%;height: 100%;"
                    ref="fileRight"
                    accept=".jpg,.jpeg,.png"
                    :limit="1"
                    :show-file-list="false"
                    :http-request="httpRequestRight"
                  >
                    <div class="upload-demo">
                      <img width="100%" height="100%" :src="fileRight.src" v-if="fileRight.src" alt="">
                      <i v-else class="el-icon-upload"></i>
                    </div>
                  </el-upload>
                  <div class="upload-bottom">
                    <span style="line-height: 30px">
                      {{ fileRight.name }}
                    </span>
                    <span style="float: right;">
                      <!-- <el-button size="mini" type="primary">重新上传</el-button> -->
                      <el-button size="mini" @click="del('fileRight')">删除</el-button>
                    </span>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div style="padding-top: 30px">
              <span style="color: #c0c4cc">
                图片格式：JPEG、JPG、PNG、BMP。图片小大：小于3M
              </span>
              <el-button style="float: right" size="mini" @click="faceCompare()" type="primary"
                >开始比对</el-button
              >
            </div>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>识别结果</span>
              </div>
              <div class="text item" >
                <span v-if="detail">两图同为一人的概率为 {{ (detail.similiarity * 100).toFixed(2) }}%</span>
                <el-empty v-else class="empty" :image-size="100" description="数据为空"></el-empty>
              </div>
            </el-card>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>结果代码</span>
              </div>
              <div class="text item">
                <div class="text item">
                <span v-if="detail">
                  {{ detail }}
                </span>
                <el-empty v-else class="empty" :image-size="100" description="数据为空"></el-empty>
              </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="人脸检索" name="second">
        <el-row :gutter="10" v-if="activeName == 'second'">
          <el-col :span="8">
            <div class="upload-demo">
              <el-upload
                    ref="fileLeft"
                    style="width: 100%;height: 100%;"
                    action=""
                    :limit="1"
                    accept=".jpg,.jpeg,.png"
                    :show-file-list="false"
                    :http-request="httpRequestLeft"
                  >
                    <div class="upload-demo">
                      <img width="100%" height="100%" :src="fileLeft.src" v-if="fileLeft.src" alt="">
                      <i v-else class="el-icon-upload"></i>
                    </div>
                  </el-upload>
              <div class="upload-bottom">
                <span style="line-height: 30px">
                  {{ fileLeft.name }}
                </span>
                <span style="float: right;">
                  <!-- <el-button size="mini" type="primary">重新上传</el-button> -->
                  <el-button size="mini" @click="del('fileLeft')">删除</el-button>
                </span>
              </div>
            </div>
            <div style="padding-top: 60px;">
              <el-button style="float: right;" size="mini" @click="faceRecognize()" type="primary">开始检索</el-button>
            </div>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>识别结果</span>
              </div>
              <div class="text item">
                <div v-if="faceImage">
                  <img width="100%" height="400px" v-if="faceImage.userId" :src="VUE_APP_API_BASE_URL+'/face/image/avatar?userId='+faceImage.userId" alt="">
                  <div>ID {{ faceImage.userId }}</div>
                </div>
                <div v-if="detail">
                  <div v-for="(item,index) in detail.faces" :key="index">
                    <div v-if="item.similiarity < 0.5">
                      <div>未找到匹配的人脸数据，请核实</div>
                    </div>
                    <div v-else> 
                      <div>两图同为一人的概率</div>
                      <div>{{ (item.similiarity * 100).toFixed(2)}}%</div>
                    </div>
                  </div>
                  <div v-if="detail.status == 2">
                    <div>未找到匹配的人脸数据，请核实</div>
                  </div>
                </div>
                <el-empty class="empty" :image-size="100" v-else description="数据为空"></el-empty>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>结果代码</span>
              </div>
              <div class="text item">
                <div v-if="detail && detail.status != 2">
                  <span v-html="faceImage"></span>
                  <div>
                    <span v-html="detail"></span>
                  </div>
                </div>
                <el-empty class="empty" :image-size="100" v-else description="数据为空"></el-empty>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { faceCompare,faceRecognize } from './api'
export default {
  components: {},
  data() {
    return {
      activeName: "first",
      imgUrlLeft: "",
      imgUrlRight: "",
      fileLeft:{
        src:""
      },
      fileRight:{
        src:''
      },
      detail: null,
      faceImage:null,
      VUE_APP_API_BASE_URL
    };
  },
  props: {},
  created() {},
  mounted() {},
  methods: {
    handleClick() {
      this.detail = null
      this.faceImage = null
      this.fileLeft = {
        src:''
      }
      this.fileRight = {
        src:''
      }
      this.$refs.fileLeft.clearFiles()
      this.$refs.fileRight.clearFiles()
    },
    httpRequestLeft(files){
      const file = files.file;
      console.log(files)
      const windowURL = window.URL || window.webkitURL;
      this.fileLeft.src = windowURL.createObjectURL(file);
      this.fileLeft.name = file.name
      this.fileLeft.file = file
    },
    httpRequestRight(files){
      const file = files.file;
      console.log(files)
      const windowURL = window.URL || window.webkitURL;
      this.fileRight.src = windowURL.createObjectURL(file);
      this.fileRight.name = file.name
      this.fileRight.file = file
    },
    async faceCompare(flag){
      let form = new FormData();
      if(!this.fileLeft.file || !this.fileRight.file){
        this.$message.error('请上传两张图片后在进行比对')
        return  
      }
      form.append("file", this.fileLeft.file);
      form.append("file2", this.fileRight.file);
      const {code,data} = await faceCompare(form);
      if(code == 0){
        if(data){
          this.detail = JSON.parse(data)
          console.log(this.detail)
        }
      } else {
        this.detail = null
      }
      
      
    },
    async faceRecognize(){
      let form = new FormData();
      form.append("file", this.fileLeft.file);
      const {code,data} = await faceRecognize(form);
      //console.log(data)
      if(code == 0){
        if(data && data.json){
          this.detail = JSON.parse(data.json)
          console.log(this.detail,">>>")
        }

        this.faceImage = data.faceImage
      } else {
        this.detail = null
        this.faceImage = null
      }
      
    },
    del(r){
      this[r] = {
        src:''
      }
      console.log(this.$refs[r])
      this.$refs[r].clearFiles()
      this.detail = null
      this.faceImage= null
    }
  },
};
</script>
<style scoped lang="scss">
.upload-demo {
  width: 100%;
  height: 500px;
  background-color: #fff;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.el-icon-upload {
  font-size: 67px;
  color: #c0c4cc;
  margin: 40px 0 16px;
  line-height: 200px;
}
.upload-bottom {
  margin-top: 10px;
}
.empty{
  padding: 0;
}
::v-deep .el-upload--text{
  width: 100%;
}
.text{
  text-align: center;
}
</style>
