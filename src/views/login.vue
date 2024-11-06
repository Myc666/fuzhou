<template>
  <div class="login">
    <!-- <div>
      <img src="@/assets/img3/logs.png" class="logs" alt="">
    </div> -->
    <!-- <div class="tags">
      <el-dropdown @command="handleCommand">
        <el-button>
          {{ currentTag }}<i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="默认">默认</el-dropdown-item>
          <el-dropdown-item command="智慧城管">智慧城管</el-dropdown-item>
          <el-dropdown-item command="智慧交通">智慧交通</el-dropdown-item>
          <el-dropdown-item command="智慧煤矿">智慧煤矿</el-dropdown-item>
          <el-dropdown-item command="智慧能源">智慧能源</el-dropdown-item>
          <el-dropdown-item command="智慧园区">智慧园区</el-dropdown-item>
          <el-dropdown-item command="智慧工业">智慧工业</el-dropdown-item>
          <el-dropdown-item command="智慧农业">智慧农业</el-dropdown-item>
          <el-dropdown-item command="智慧油站">智慧油站</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div> -->
    <div class="login-content">
      <div class="login-center">
        <div class="login-right">
          <!-- <div>
            <p>{{ tagList[currentTag].text1 }}</p>
            <p>{{ tagList[currentTag].text2 }}</p>
          </div> -->
        </div>
        <div class="login-line"></div>
        <div class="login-left">
          <div>
            <img class="logon" src="@/assets/img3/login_title.jpg" />
          </div>
          <!-- <ul class="tabs">
            <li :class="['tabItem',{active:!isRegister}]" @click="isRegister = false;">账户登录</li>
            <li :class="['tabItem',{active:isRegister}]" @click="isRegister = true">账户注册</li>
          </ul> -->
          <div style="width: 100%;margin-top: 50px;" v-if="!isRegister && !isForgot">
            <el-form
              ref="loginForm"
              label-position="left"
              label-width="0px"
              class="login-form"
            >
              <el-form-item prop="username">
                <el-input
                  type="text"
                  class="text"
                  auto-complete="off"
                  placeholder="用户名"
                  v-model="params.account"
                  style="margin-bottom: 65px;"
                  size="-"
                >
                  <i slot="prefix" class="el-input__icon el-icon-user" />
                </el-input>
              </el-form-item>
              <el-form-item prop="password">
                <!-- <el-input
                  type="password"
                  show-password
                  auto-complete="off"
                  placeholder="密码"
                  style="margin-bottom: 65px;"
                  v-model="params.password"
                  size="medium"
                >
                  <i slot="prefix" class="el-input__icon el-icon-lock" />
                </el-input> -->
                <el-input
                  :type="showPassword ? 'text':'password'"
                  auto-complete="off"
                  placeholder="密码"
                  style="margin-bottom: 65px;"
                  v-model="params.password"
                  size="medium"
                >
                  <i slot="prefix" class="el-input__icon el-icon-lock" />
                  <i slot="suffix" @click="changeIconState()">
                    <img v-if="showPassword" src="@/assets/images/login/open.png" class="open-icon"/>
                    <img v-else src="@/assets/images/login/close.png" class="close-icon"/>
                  </i>
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  :loading="loading"
                  type="primary"
                  class="login-btn"
                  style=""
                  @click.native.prevent="handleLogin"
                  @keyup.enter="keyDown(e)"
                >
                  <span v-if="!loading">登 录</span>
                  <span v-else>登 录 中...</span>
                </el-button>
                <!-- <div class="bottom-btn">
                  <div class="forgot" @click="forgotFun">忘记密码?</div>
                </div> -->
                <div style="width: 60px;float: right;text-align: right;margin-top: 10px;color: #606266;font-size: 14px;">
                  <el-popover
                    placement="right"
                    title="无法登录怎么办？"
                    width="400"
                    trigger="hover"
                  >
                    <div style="font-size: 14px;line-height: 22px;color: #606266;">
                      由于浏览器缓存机制，可能导致登录失败，请手动清除当前页面的缓存。<br/>
                      不同浏览器的缓存清除方法可能略有不同，但大致可分为以下几个步骤：<br/>
                      1.点按键盘的F12，开启开发者工具模式。（请提前开启此模式）<br/>
                      2.在浏览器的左上方找到“刷新”按钮，并右击此符号。<br/>
                      3.在下拉菜单中继续点击“清空缓存并硬性重新加载”<br/>
                      4.等待浏览器刷新后，重新点击“登录”即可。
                    </div>
                    <div slot="reference">无法登录</div>
                  </el-popover>
                </div>
              </el-form-item>
            </el-form>
          </div>
          <!-- 注册账号 -->
          <div v-if="isRegister" style="margin-top: 20px">
            <el-form
              :model="registerForm"
              :rules="registerRules"
              ref="registerForm"
              label-position="left"
              label-width="80px"
            >
              <el-form-item label="手机号" prop="phone">
                <el-input
                  type="text"
                  placeholder="请输入手机号"
                  v-model="registerForm.phone"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="codeNum">
                <el-input
                  type="text"
                  placeholder="请输入验证码"
                  v-model="registerForm.codeNum"
                >
                  <el-button
                    :disabled="codeCd"
                    size="mini"
                    slot="append"
                    style="
                      border-radius: unset !important;
                      height: 30px !important;
                      margin: 0px -20px !important;
                      background: #e5e7ea !important;
                    "
                    @click="handleCaptFun()"
                    >获取验证码
                    <span v-if="codeCd">({{ long }})</span>
                  </el-button>
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="用户名" prop="name">
                <el-input
                  type="text"
                  placeholder="请输入用户名"
                  v-model="registerForm.name"
                >
                </el-input>
              </el-form-item> -->
              <el-form-item label="密码" prop="passwordNum">
                <el-input
                  type="password"
                  show-password
                  auto-complete="off"
                  placeholder="密码"
                  v-model="registerForm.passwordNum"
                >
                </el-input>
              </el-form-item>
              <el-form-item>
                <div style="text-align: right">
                  <el-button @click="resetForm('registerForm')">取消</el-button>
                  <el-button type="primary" @click="submitForm('registerForm')"
                    >立即注册</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </div>
          <!-- 忘记密码 -->
          <div v-if="isForgot" style="margin-top: 20px">
            <el-form
              :model="forgotForm"
              :rules="forgotRules"
              ref="forgotForm"
              label-position="left"
              label-width="80px"
            >
              <el-form-item label="手机号" prop="phone">
                <el-input
                  type="text"
                  placeholder="请输入手机号"
                  v-model="forgotForm.phone"
                >
                </el-input>
              </el-form-item>
              <el-form-item label="验证码" prop="codeNum">
                <el-input
                  type="text"
                  placeholder="请输入验证码"
                  v-model="forgotForm.codeNum"
                >
                  <el-button
                    :disabled="codeCd"
                    size="mini"
                    slot="append"
                    style="
                      border-radius: unset !important;
                      height: 30px !important;
                      margin: 0px -20px !important;
                      background: #e5e7ea !important;
                    "
                    @click="handleResetFun()"
                    >获取验证码
                    <span v-if="codeCd">({{ long }})</span>
                  </el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="重置密码" prop="passwordNum">
                <el-input
                  type="password"
                  show-password
                  auto-complete="off"
                  placeholder="密码"
                  v-model="forgotForm.passwordNum"
                >
                </el-input>
              </el-form-item>
              <el-form-item>
                <div style="text-align: right">
                  <el-button @click="cancelFun('forgotForm')">取消</el-button>
                  <el-button type="primary" @click="submitFun('forgotForm')"
                    >重置密码</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import Axios from "axios";
import {
  login,
  getRegisterSms,
  register,
  getResetPswSms,
  resetPsw,
  checkAlgorithmVersion,
} from "@/api/common";
import { handlePublicUrl } from "@/utils/common";
export default {
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("手机号不能为空"));
      }
      // 使用正则表达式进行验证手机号码
      if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error("手机号格式不正确"));
      }
      // 自定义校验规则 需要调用callback()函数！
      callback();
    };
    return {
      activeName: "",
      isForgot: false,
      forgotForm: {
        phone: "",
        codeNum: "",
        passwordNum: "",
      },
      forgotRules: {
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        codeNum: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        passwordNum: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
      isRegister: false,
      registerForm: {
        phone: "",
        codeNum: "",
        // name:'',
        passwordNum: "",
      },
      registerRules: {
        phone: [{ required: true, validator: validatePhone, trigger: "blur" }],
        codeNum: [{ required: true, message: "请输入验证码", trigger: "blur" }],
        // name: [
        //   { required: true, message: '请输入用户名', trigger: 'blur' }
        // ],
        passwordNum: [
          { required: true, message: "请输入密码", trigger: "blur" },
        ],
      },
      codeCd: false,
      long: 60,
      loading: false,
      currentTag: "默认",
      tagList: {
        默认: {
          title: require("@/assets/images/login/title1.png"),
          bg: require("@/assets/images/login/bg1.png"),
          text1: "实现摄像头数字化改造",
          text2: "助力企业智能化升级",
        },
        智慧城管: {
          title: require("@/assets/images/login/title2.png"),
          bg: require("@/assets/images/login/bg2.png"),
          text1: "实现摄像头数字化改造",
          text2: "助力城市管理智能化升级 ",
        },
        智慧交通: {
          title: require("@/assets/images/login/title3.png"),
          bg: require("@/assets/images/login/bg3.png"),
          text1: "实现摄像头数字化改造",
          text2: "助力交通管理智能化升级",
        },
        智慧煤矿: {
          title: require("@/assets/images/login/title4.png"),
          bg: require("@/assets/images/login/bg4.png"),
          text1: "实现摄像头数字化改造",
          text2: "助力煤矿管理智能化升级",
        },
        智慧能源: {
          title: require("@/assets/images/login/title5.png"),
          bg: require("@/assets/images/login/bg5.png"),
          text1: "实现摄像头数字化改造",
          text2: "助力能源管理智能化升级",
        },
        智慧工业: {
          title: require("@/assets/images/login/title7.png"),
          bg: require("@/assets/images/login/bg7.png"),
          text1: "实现摄像头数字化改造",
          text2: "助力工业智能化升级",
        },
        智慧农业: {
          title: require("@/assets/images/login/title8.png"),
          bg: require("@/assets/images/login/bg8.png"),
          text1: "实现摄像头数字化改造",
          text2: "助力农业智能化升级",
        },
        智慧油站: {
          title: require("@/assets/images/login/title9.png"),
          bg: require("@/assets/images/login/bg9.png"),
          text1: "实现摄像头数字化改造",
          text2: "助力油站智能化升级",
        },
      },
      params: {
        account: "",
        password: "",
      },
      appInfo: {},
      showPassword:false,
    };
  },
  created() {},
  mounted() {
    window.addEventListener("keydown", this.keyDown);
  },
  methods: {
    changeIconState(){
      this.showPassword = !this.showPassword;
    },
    keyDown(e) {
      // 回车则执行登录方法 enter键的ASCII是13
      if (e.key == "Enter") {
        this.handleLogin(); // 定义的登录方法
        e.preventDefault(); // 去掉默认的换行
      }
    },
    async handleLogin() {
      if (!this.params.account || !this.params.password) {
        return this.$message.error("账号密码不能为空");
      }
      const data = await login(this.params);
      Cookies.set(data.data.tokenName, data.data.tokenValue);
      this.$store.state.cookies = data.data.tokenValue;
      this.$message.success("登录成功");
      //this.$router.push("/");
      localStorage.setItem("nickname", this.params.account);
      localStorage.setItem("pw", this.params.password);
      sessionStorage.setItem('VocieSwitch',true);
      const path = sessionStorage.getItem("path");
      // if(path){
      //   this.$router.replace(path);
      // }else{
        this.$router.push("/bigScreen");
      // }
      // this.checkVersion()
    },
    handleCommand(val) {
      this.currentTag = val;
    },
    // 注册账号
    registerFun() {
      this.isRegister = true;
    },
    // 获取验证码
    async handleCaptFun() {
      this.$refs.registerForm.validateField("phone", async (valid) => {
        if (!valid) {
          // 获取验证码
          await getRegisterSms({ phone: this.registerForm.phone });
          this.startCountdown();
        }
      });
    },
    // 开始计时
    startCountdown() {
      this.codeCd = true; // 禁用按钮
      this.timer = setInterval(() => {
        this.long--;
        if (this.long === 0) {
          this.stopCountdown();
        }
      }, 1000);
    },
    //  终止计时
    stopCountdown() {
      clearInterval(this.timer); // 清除计时器
      this.codeCd = false; // 重新启用按钮
      this.long = 60; // 重置倒计时时长
    },
    // 取消注册
    resetForm(formName) {
      this.$refs[formName].resetFields();
      this.isRegister = false;
      this.stopCountdown();
    },
    // 立即注册
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.saveFun();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async saveFun() {
      let obj = {
        phone: this.registerForm.phone,
        code: this.registerForm.codeNum,
        name: this.registerForm.phone,
        password: this.registerForm.passwordNum,
      };
      await register(obj);
      this.$message.success("注册成功");
      this.isRegister = false;
    },
    // 忘记密码
    forgotFun() {
      this.isForgot = true;
    },
    // 重置密码-获取验证码
    async handleResetFun() {
      this.$refs.forgotForm.validateField("phone", async (valid) => {
        if (!valid) {
          // 获取验证码
          await getResetPswSms({ phone: this.forgotForm.phone });
          this.startCountdown();
        }
      });
    },
    // 取消
    cancelFun(formName) {
      this.$refs[formName].resetFields();
      this.isForgot = false;
      this.stopCountdown();
    },
    // 重置密码
    submitFun(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitData();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    async submitData() {
      let obj = {
        phone: this.forgotForm.phone,
        code: this.forgotForm.codeNum,
        password: this.forgotForm.passwordNum,
      };
      await resetPsw(obj);
      this.$message.success("重置密码成功");
      this.isForgot = false;
    },
    // checkVersion(){
    //   // const res = await checkAlgorithmVersion();
    //   // this.$message({
    //   //     message: res.data,
    //   //     type: 'warning'
    //   //   });
    //   Axios({
    //     url: handlePublicUrl('/algorithm/checkAlgorithmVersion'),
    //     method:'post',  //默认get方法，可以不写
    //     headers:{
    //       'X-Token':Cookies.get('X-Token'),
    //       'Access-Control-Allow-Origin': '*',
    //       'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    //       'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    //     }
    //   }).then(res=>{
    //     if(res.data&&res.data.data){
    //       this.$message({
    //         message: res.data.data,
    //         type: 'warning'
    //       });
    //     }
    //   })
    // }
  },
  destroyed() {
    // 销毁事件
    window.removeEventListener("keydown", this.keyDown, false);
  },
};
</script>
<style scoped lang="scss">
.close-icon{
  width: px2rem(32px);
  margin-top: px2rem(10px);
}
.open-icon{
  width: px2rem(26px);
  margin-top: px2rem(10px);
}
.logs{
  width: px2rem(190px);
  height: px2rem(42px);
  position: absolute;
  top: px2rem(43px);
  left: px2rem(40px);
}
.tabs {
  width: 100%;
  padding: 0;
  display: flex;
  justify-content: space-between;
  text-align: center;
  margin: px2rem(98px) 0 px2rem(93px);
  .tabItem {
    width: 50%;
    color: #B3B3B3;
    font-size: px2rem(20px);
    padding-bottom: px2rem(14px);
    border-bottom: 2px solid #E5E5E5;
    cursor: pointer;
  }
  .active{
    font-weight: 500;
    color: #EB3A2F;
    border-bottom-color: #FF6C47;
  }
}

li {
  outline: none;
  list-style: none;
}
.login {
  position: relative;

  overflow: hidden;

  width: 100vw;
  height: 100vh;

  background: url("~@/assets/img3/logbg.png") no-repeat center center;
  background-size: cover;

  .tags {
    position: fixed;
    top: px2rem(20px);
    right: px2rem(20px);
    z-index: 2;
  }
  .logo {
    position: relative;

    display: flex;
    align-items: center;

    height: 9%;
    padding-left: 40px;

    color: #2099fa;

    font-size: 32px;
    font-weight: bold;
    line-height: 9%;

    & > img {
      margin-right: 10px;
    }
    .title {
      height: 30px;
      margin-left: 10px;
      padding-left: 20px;
      border-left: 2px solid #2099fa;
      line-height: 30px;
    }
  }
  .login-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    .login-left {
      .logon{
        width: px2rem(263px);
        height: px2rem(41px);
      }
      display: flex;
      align-content: center;
      justify-content: center;
      flex-wrap: wrap;
      width: px2rem(426px);
      border-radius: 8px 0px 0px 8px;
      background: #fff;

      .login-form {
        position: relative;
        width: 100% !important;
        .title {
          height: px2rem(20px);
          margin-bottom: px2rem(60px);
          text-align: center;
          color: #061640;
          font-size: px2rem(20px);
          font-weight: 500;
          line-height: px2rem(30px);
        }
        .title::after {
          position: absolute;
          top: px2rem(60px);
          left: px2rem(184px);
          width: px2rem(40px);
          height: 2px;
          content: "";
          border-radius: 2px;
          background: #2099fa;
        }
        .el-input {
          height: px2rem(50px);

          input {
            height: px2rem(50px);
          }
          ::v-deep .el-input__inner {
            height: px2rem(50px) !important;
          }
        }

        .input-icon {
          width: px2rem(14px) !important;
          height: px2rem(49px) !important;
          margin-left: 2px;
        }
        .login-btn {
          width: 100%; height: px2rem(50px) !important;background: linear-gradient(34deg, #FF6C47, #EB3A2F);
border-radius: 5px;
        }
        .register {
          margin-top: px2rem(20px) !important;

          text-align: center !important;

          font-size: 14px !important;
          .thereIsNoAccount {
            color: #061640 !important;
          }
          .freeSignup {
            cursor: pointer !important;

            color: #2099fa !important;
          }
        }
      }
      .login-code {
        float: right !important;

        width: 33%;
        height: px2rem(38px);

        img {
          width: px2rem(140px);
          height: 100%;

          cursor: pointer;
          vertical-align: middle;
        }
      }
    }
    .login-center {
      display: flex;
      width: px2rem(1464px);
      height: px2rem(833px);
      background: white;
      align-items: center;
      justify-content: center;
      .login-right {
        width: px2rem(655px);
        height: px2rem(458px);
        color: #fff;
        font-size: px2rem(24px);
        font-weight: bold;
        letter-spacing: px2rem(12px);
        text-align: center;
        border-radius: 0px 8px 8px 0px;
        background: url("~@/assets/img3/leftbg.png") no-repeat center center;
        background-size: 100% 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        .title {
          height: px2rem(45px);
          margin: px2rem(56px) 0px px2rem(20px) px2rem(40px);

          color: #ffffff;

          font-size: px2rem(32px);
          font-weight: 600;
          line-height: px2rem(45px);
        }
        .slogan {
          height: 28px;
          margin-left: px2rem(40px);

          color: #ffffff;

          font-size: px2rem(20px);
          font-weight: 600;
          line-height: px2rem(28px);
        }
        .aiImg {
          display: flex;
          justify-content: center;

          width: px2rem(508px);
          img {
            width: px2rem(508px);
            height: px2rem(596px);
            display: block;
            object-fit: cover;
          }
        }
      }
      .login-line {
        width: 1px;
        height: 100%;
        background: #f7cc7e;
        opacity: 0.3;
        margin-left: px2rem(97px);
        margin-right: px2rem(100px);
      }
    }
  }
  .copyright {
    position: absolute;
    bottom: px2rem(17px);

    width: 100%;

    text-align: center;

    color: #ffffff;

    font-size: 12px;
    font-weight: 400;
  }
}
.loginCode {
  display: flex !important;
  justify-content: space-between !important;
  .el-input {
    width: 63% !important;
    height: px2rem(42px);

    input {
      height: px2rem(42px);
    }
    & >>> .el-input__inner {
      width: 270px !important;
    }
  }
}

.bottom-btn {
  color: #2099fa;
  color: #2099fa;
  display: flex;
  justify-content: space-between;
  padding-top: px2rem(15px);
  cursor: pointer;
  font-size: 12px;
  .forgot{
    font-weight: 400;
    font-size: px2rem(18px);
    color: #B3B3B3;
  }
}
</style>
