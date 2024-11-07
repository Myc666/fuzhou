<template>
  <div>
    <el-form ref="form2" :model="form2" label-width="180px">
      <el-form-item label="第三方接口地址">
        <el-input v-model="form2.reportPushUrl"></el-input>
        <div class="tip__text">
          请填写第三方http接口地址，仅支持post方式；例如：http://domain.com:port/api/alarm_data
        </div>
      </el-form-item>
      <el-form-item label="是否推送图片" prop="streamType">
        <el-radio v-model="form2.reportPushImage" label="false"
          >不启用</el-radio
        >
        <el-radio v-model="form2.reportPushImage" label="true">启用</el-radio>
        <div class="tip__text">注意，图片以base64字符串形式传递</div>
      </el-form-item>
      <!-- <el-divider></el-divider>
      <el-form-item label="是否推送企业微信群机器人" prop="weworkEnable">
        <el-radio v-model="form2.weworkEnable" label="false">不启用</el-radio>
        <el-radio v-model="form2.weworkEnable" label="true">启用</el-radio>
      </el-form-item>
      <el-form-item label="企业微信群机器人地址">
        <el-input v-model="form2.weworkUrl"></el-input>
        <div class="tip__text">
          请先开通企业微信群机器人，然后复制粘贴群地址，例如：https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=1111111-2222-3333-4444444
        </div>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="是否推送短信通知" prop="smsEnable">
        <el-radio v-model="form2.smsEnable" label="false">不启用</el-radio>
        <el-radio v-model="form2.smsEnable" label="true">启用</el-radio>
      </el-form-item>
      <el-form-item label="短信平台APP_KEY">
        <el-input v-model="form2.smsAppKey"></el-input>
        <div class="tip__text">
          当前仅支持云片网，请先在云片网进行注册以获取APP_KEY
        </div>
      </el-form-item>
      <el-form-item label="短信平台模板ID">
        <el-input v-model="form2.smsTplId"></el-input>
        <div class="tip__text">
          当前仅支持云片网，请先在云片网申请短信模板，然后获取模板ID
        </div>
      </el-form-item>
      <el-form-item label="短信推送手机号码">
        <div style="margin-bottom: 10px">
          <el-row :gutter="4">
            <el-col :span="6">
              <el-input v-model="phone"></el-input>
            </el-col>
            <el-col :span="6">
              <el-button @click.prevent="addPhone()">新增</el-button>
            </el-col>
          </el-row>
        </div>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column prop="phone" label="手机号码" width="180">
          </el-table-column>
          <el-table-column align="center" label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="deletePhone(scope.row)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item> -->
      <el-form-item>
        <el-button type="primary" @click="onSubmitForm('form2')"
          >提交</el-button
        >
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="推送数据范围">
        <!-- <el-table
        :data="listData"
        border
        style="width: 100%">
          <el-table-column prop="name" label="参数名称"></el-table-column>
          <el-table-column prop="illustrate" label="参数中文说明"></el-table-column>
          <el-table-column prop="type" label="参数类型"></el-table-column>
          <el-table-column prop="remarks" label="备注"></el-table-column>
        </el-table> -->
        <div style="cursor: pointer;color: #EB3A2F;" @click="DownloadFun()">示例文档下载</div>
      </el-form-item>
      <el-divider></el-divider>
      <el-form-item label="是否推送告警">
        <Tables
          :pagination="false"
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :rowSelection="rowSelection"
          :selections.sync="selectedRowKeys"
        >
          <template slot="index" slot-scope="{ $index }">
            {{ $index + 1 }}
          </template>
        </Tables>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveFun()"
          >保存</el-button
        >
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import {
  getListData as getPhoneList,
  deleteData as deletePhoneData,
  saveData as addPhone
} from "@/api/applicationMonitoring/messageManagement";
import {
  getInfo,
} from "@/api/applicationMonitoring/systemManagement";
import { saveAlarmPushConfig,listData,algorithmPush  } from "./api"
import Tables from "@/components/Table/index.vue";
export default {
  components:{
    Tables
  },
  props: {
    
  },
  data() {
    return {
      tableData: [],
      phone: "",
      form2: {
        reportPushUrl: "",
        reportPushImage: "false",
        weworkEnable: "false",
        weworkUrl: "",
        smsEnable: "false",
        smsAppKey: "",
        smsTplId: "",
      },
      listData:[
        {
          name:'cmpn_cd',
          illustrate:'公司标识',
          type:'string',
          remarks:'固定值TLB',
        },{
          name:'camera_id',
          illustrate:'摄像头id',
          type:'string',
          remarks:'',
        },{
          name:'camera_name',
          illustrate:'摄像头名称 ',
          type:'string',
          remarks:'',
        },{
          name:'algorithm_id',
          illustrate:'算法id',
          type:'string',
          remarks:'',
        },{
          name:'algorithm_name',
          illustrate:'算法名称',
          type:'string',
          remarks:'',
        },{
          name:'level',
          illustrate:'告警级别',
          type:'string',
          remarks:'固定值：F',
        },{
          name:'img_path',
          illustrate:'图片路径',
          type:'string',
          remarks:'',
        },{
          name:'img_ext',
          illustrate:'图片扩展名',
          type:'string',
          remarks:'',
        },{
          name:'img_name',
          illustrate:'图片名称',
          type:'string',
          remarks:'',
        },{
          name:'alarm_dt',
          illustrate:'告警时间',
          type:'string',
          remarks:'Yyyy-mm-dd hh:mm:ss',
        },{
          name:'report_id',
          illustrate:'告警id',
          type:'string',
          remarks:'http://domain:port/report/stream?id=report_id 图片地址',
        },{
          name:'params',
          illustrate:'告警位置坐标',
          type:'string',
          remarks:'JSON字符串',
        },{
          name:'webUrl',
          illustrate:'访问前缀',
          type:'string',
          remarks:'',
        },{
          name:'box_sn',
          illustrate:'盒子编号',
          type:'string',
          remarks:'',
        },{
          name:'box_id',
          illustrate:'盒子id',
          type:'string',
          remarks:'',
        },{
          name:'box_ip',
          illustrate:'盒子ip',
          type:'string',
          remarks:'',
        },{
          name:'alarm_count',
          illustrate:'报警框数量',
          type:'string',
          remarks:'',
        },
      ],
      rowSelection: {
        type: "checkbox",
        change: (selectedRowKeys, selectedRows) => {
          this.selectedRowKeys = selectedRowKeys;
          this.selectedRows = selectedRows;
        },
      },
      selectedRowKeys: [],
      selectedRows: [],
      loading: false,
      dataSource: [],
      columns: Object.freeze([
        {
          key: "avatar",
          title: "序号",
          align: "center",
          slot: "index",
          width:80,
        },
        {
          key: "name",
          title: "算法名称",
          align: "center",
          width:300,
        },
        {
          key:'marks',
          title: "算法描述",
          align: "center",
        }
      ]),
    };
  },
  async created() {
    await this.getALgorithmlist();
    this.getPhoneList();
    this.getInfo()
  },
  methods: {
    // 获取算法列表
    async getALgorithmlist(){
      this.loading = true;
      this.selectedRows = [];
      this.dataSource = [];
      const formData = new FormData();
      formData.append("hasLocalFile", 1);
      const res = await listData(formData);
      let newArr = [];
      let arrIndex = [];
      if(res.data && res.data.length>0){
        res.data.forEach((item,index) => {
          if(item.pushEnabled==1){
            newArr.push(item)
            arrIndex.push(index)
          }
        });
      }
      this.selectedRows = newArr;
      this.selectedRowKeys = arrIndex;
      this.dataSource = res.data;
      this.loading = false;
    },
    // 保存算法列表
    async saveFun(){
      console.log(this.selectedRows,"===========")
      if(this.selectedRows.length==0){
        this.$message.error("请选择算法");
        return
      }
      let ids = [];
      this.selectedRows.forEach(item=>{
        ids.push(item.id)
      })
      const res = await algorithmPush({algorithmIds:ids});
      this.$message.success('保存成功');
      this.getALgorithmlist();
    },
    DownloadFun(){
      var a = document.createElement('a') // 创建一个<a></a>标签
      a.href = '/static/third_part_data.docx' 
      a.download = 'third_part_data.docx' // 设置下载文件文件名
      a.style.display = 'none' // 隐藏a标签
      document.body.appendChild(a) // 将a标签追加到文档对象中
      a.click() // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
      a.remove() // 一次性的，用完就删除a标签
    },
    async getInfo(){
      const data = await getInfo();
      this.form2 = data.data.forms.form2 || {};
    },
    // 获取电话号码列表
    async getPhoneList() {
      this.loading = true;
      const data = await getPhoneList({});
      this.tableData = data.data;
      this.total = Number(data.count);
      this.loading = false;
    },
    async addPhone() {
      if (this.phone == null || this.phone == "") {
        this.$message.error("请填写手机号码");
        return;
      }
      const res = await addPhone({
        phone: this.phone,
      });
      if (res.code == 0) {
        this.$message.success("操作成功");
        await this.getPhoneList();
      }
    },
    async deletePhone(item) {
      this.$confirm(`确定删除该条数据?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const res = await deletePhoneData({ id: item.id });
          if (res.code == 0) {
            this.$message.success("删除成功");
            await this.getPhoneList();
          }
        })
        .catch(() => {});
    },
    onSubmitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          const data = await saveAlarmPushConfig(this.form2)
          this.$message.success('保存成功')
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
</style>
