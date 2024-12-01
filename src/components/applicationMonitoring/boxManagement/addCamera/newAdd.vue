<template>
    <div>
        <el-dialog
            :close-on-click-modal="false"
            title="编辑摄像头"
            :visible.sync="dialogVisible"
            width="1400px"
            top="5vh"
            @closed="closed"
            append-to-body
        >
            <div class="tip-txt">在添加摄像头之前，请确保您已知晓该摄像机的品牌、型号，后台账号、密码和所在局域网内的IP地址。</div>
            <div ref="dialogCont">
                <el-form :model="detail" :rules="rules" ref="detailForm" label-width="130px" class="camera-dialog">
                    <div class="camera-left">
                        <el-form-item label="摄像头名称" prop="name">
                            <el-input
                                placeholder="请输入，建议以实际位置命名"
                                v-model="detail.name"
                            ></el-input>
                        </el-form-item>
                        <el-form-item prop="rtspUrl">
                            <template slot="label">
                                <span style="margin-right: 5px;">RTSP流地址</span>
                                <el-popover
                                placement="top-start"
                                width="400"
                                trigger="hover"
                                >
                                <div style="font-size: 14px; color: 606266;">
                                    <div style="font-weight: bold;font-size: 16px;color: #303133;line-height: 26px;margin-bottom: 10px;">如何正确填写摄像机的RTSP？</div>
                                    <div style="line-height: 22px;">实时流媒体协议（RTSP）用于摄像机的实时数据传输，许多摄像机品牌支持RTSP。 请确保您已知晓该摄像机的品牌型号，账号、密码和所在局域网内的IP地址。</div>
                                    <div style="font-weight: bold;line-height: 22px; margin: 10px 0px;">填写示例：使用英文方式输入字符，无空格</div>
                                    <div style="line-height: 22px; ">rtsp://用户名:密码@摄像头设备IP地址:端口号/码流类型</div>
                                    <div style="line-height: 22px; margin: 20px 0px;">
                                        <div style="font-weight: bold;">海康威视</div>
                                        <div>rtsp://admin:passwor@192.168.1.203:554/Streaming/Channels/101</div>
                                        <div style="font-weight: bold;">大华</div>
                                        <div>rtsp://admin:admin@192.168.1.118:554/cam/realmonitor?channel=1&subtype=0</div>
                                        <div style="font-weight: bold;">天地伟业</div>
                                        <div>rtsp://admin:admin@192.168.1.70:554/video1</div>
                                    </div>
                                    <div style="font-weight: bold;line-height: 22px;">其他摄像机品牌自行搜索填写规范。</div>

                                </div>
                                <span class="el-icon-question" slot="reference"></span>
                                </el-popover>
                            </template>
                            <el-input
                                placeholder="请输入，点击左侧 '?' 符号查看填写教程。"
                                v-model="detail.rtspUrl"
                                type="textarea"
                                :rows="2"
                            ></el-input>
                        </el-form-item>
                        <el-form-item>
                            <template slot="label">
                                <span style="margin-right: 5px;">画面预览(可选)</span>
                                <el-popover
                                placement="top-start"
                                width="400"
                                trigger="hover"
                                >
                                    <div style="font-size: 14px; color: 606266;">
                                        <div style="font-weight: bold;font-size: 16px;color: #303133;line-height: 26px;margin-bottom: 10px;">拍照取图失败？</div>
                                        <div style="line-height: 22px; margin: 20px 0px;">
                                            <div>1.拼写是否正确？检查RTSP地址是否正确，使用英文方式输入字符，无空格。ls/101</div>
                                            <div>2.摄像机品牌型号是否限制RTSP连接数量？</div>
                                            <div>3.若您使用GB28181协议转出的视频流，请检查服务端推流是否正常？</div>
                                            <div>4.若您使用本地模拟推流视频，如live555、fffmpeg，需要使用H264格式视频推流。</div>
                                            <div>5.若您使用4G sim卡摄像机推流，请检查其网络状态是否稳定。</div>
                                        </div>
                                        <div>若一切正常，您也可以跳过“拍照取图”，直接提交使用。</div>

                                    </div>
                                    <span class="el-icon-question" slot="reference"></span>
                                </el-popover>
                            </template>
                            <div class="take-btn" @click="takePhoto">
                                <span class="el-icon-picture-outline"></span>
                                <span style="padding-left: 10px;">拍照取图</span>
                            </div>
                            <div class="image-box" v-loading="photoLoading">
                                <div v-if="detail.fileName" :style="{height:imageHeight?imageHeight+'px':'auto'}">
                                    <MarkDetail
                                    ref="markDetail"
                                    :fileUrl="$common.handleCameraImgUrl(detail.fileName)"
                                    :dataListAll="dataListAll"
                                    :disabled="drawDisabled"
                                    @getHeight="getHeight"
                                    pageType="add"
                                />
                                </div>
                                <div class="img-cont" v-if="!detail.fileName&&isHide">
                                    <img src="@/assets/images/no-data.png" style="width: 290px;margin-bottom: 24px;">
                                    <div style="color: #909399;line-height: 22px; font-size: 12px;">暂无摄像机截图</div>
                                </div>
                            </div>
                        </el-form-item>
                        <div class="flex-item">
                            <el-form-item label="识别间隔(秒)" prop="intervalTime">
                                <el-input-number v-model="detail.intervalTime" :min="0.05" :precision="2" :step="5"></el-input-number>
                                <div class="tip-item">控制算法抽帧计算间隔</div>
                            </el-form-item>
                            <el-form-item label="告警间隔(秒)" style="margin-left: 20px;" prop="alarmInterval">
                                <el-input-number v-model="detail.alarmInterval" :min="1" :precision="2" :step="5"></el-input-number>
                                <div class="tip-item">控制您接收告警信息间隔，需大于<br/>等于识别间隔。</div>
                            </el-form-item>
                        </div>
                        <el-form-item label="关联音柱(可选)">
                            <el-select v-model="detail.soundColumnId" clearable placeholder="请选择" style="width: 100%;">
                                <el-option
                                v-for="item in soundColumnList"
                                :key="item.id"
                                :label="item.sn"
                                :value="item.id">
                                </el-option>
                            </el-select>
                            <div class="tip-item">控制现场音柱播放警报音频</div>
                        </el-form-item>
                        <!-- <el-form-item label="关联计算资源" v-if="pageType == 'channel'" prop="locationId"> -->
                        <el-form-item label="关联计算资源">
                            <el-select v-model="detail.locationId" clearable placeholder="请选择">
                                <el-option
                                v-for="item in groupingOptions"
                                :key="item.id"
                                :label="item.ipAddr"
                                :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                    <div class="camera-right">
                        <el-form-item style="display: flex;flex-direction: column;" prop="algorithmvos">
                            <template slot="label">
                                <span style="color: red;">*</span>
                                <span style="margin: 0px 5px;">算法关联</span>
                                <el-popover
                                placement="top-start"
                                width="400"
                                trigger="hover"
                                >
                                    <div style="font-size: 14px; color: 606266;">
                                        <div style="font-size: 18px;color: #303133;line-height: 26px;margin-bottom: 10px;">算法版本切换提醒</div>
                                        <div style="line-height: 22px;">您可在【视频预览】页，单击“本地算法总览”查看当前边缘盒子的所有算法使用情况。</div>
                                        <div style="font-weight: bold;line-height: 22px; margin: 10px 0px;">首次下载算法模型</div>
                                        <div style="line-height: 22px; ">当您首次下载完成并启用后，系统将以首次提交的版本进行计算。</div>
                                        <div style="font-weight: bold;line-height: 22px; margin: 10px 0px;">再次下载新版本算法模型</div>
                                        <div style="line-height: 22px; ">再次下载新版本后，您修改摄像头参数后将仍以首次提交的版本进行计算</div>
                                        <div style="line-height: 22px; "> 若您希望更改此边缘盒子的算法版本，可前往【算法商城】单击具体算法卡片上的“算法升级”进行版本切换。</div>
                                    </div>
                                    <span class="el-icon-question" slot="reference"></span>
                                </el-popover>
                            </template>
                            <div class="tip-item" style="margin-bottom: 16px;">
                                为保证系统的稳定运行，建议最多关联2-3种算法模型。
                            </div>
                            <el-table
                                :data="tableData"
                                border
                                v-loading="loading"
                                height="500"
                            >
                            <el-table-column label="算法名称" prop="name"  align="center"></el-table-column>
                            <el-table-column label="使用开关" width="80" align="center">
                                <template slot-scope="scope">
                                    <el-switch v-model="scope.row.checked"></el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column align="center">
                                <template slot="header" slot-scope="scope">
                                    <span style="margin-right: 5px;">灵敏度</span>
                                    <el-popover
                                    placement="top-start"
                                    width="400"
                                    trigger="hover"
                                    >
                                        <div style="font-size: 14px; color: 606266;">
                                            <div style="font-size: 16px;color: #303133;line-height: 26px;margin-bottom: 10px;">如何配置灵敏度？</div>
                                            <div style="line-height: 22px;">算法模型识别判断并展示正确识别对象的边界。请根据实际场景与拍摄角度进行灵活调整。</div>
                                            <div style="line-height: 22px; margin: 10px 0px;">
                                                高：无屏蔽，会出现较多识别对象。<br/> 中：推荐使用数值为0.65左右，可避免误报或漏报。<br/> 低：严格的识别判断机制，会大量减少告警数据。
                                            </div>

                                        </div>
                                        <span class="el-icon-question" slot="reference"></span>
                                    </el-popover>
                                </template>
                                <template slot-scope="scope">
                                    <el-slider v-model="scope.row.confidence" :max="100" :format-tooltip="tooltipText"></el-slider>
                                    <div style="display: flex;justify-content: space-between;align-items: center; font-size: 12px; line-height: 20px;color: #909399;">
                                        <div>高</div>
                                        <div>中</div>
                                        <div>低</div>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="90" align="center">
                                <template slot="header" slot-scope="scope">
                                    <span style="margin-right: 5px;">识别区域</span>
                                    <el-popover
                                    placement="top-start"
                                    width="300"
                                    trigger="hover"
                                    >
                                        <div style="font-size: 14px; color: 606266;">
                                            <div style="font-size: 16px;color: #303133;line-height: 26px;margin-bottom: 10px;">如何绘制识别区域？</div>
                                            <div style="line-height: 22px;">同一算法模型支持绘制多个区域，可对指定具体区域进行识别计算。过滤无需检测区域的信息，减少误报信息</div>
                                        </div>
                                        <span class="el-icon-question" slot="reference"></span>
                                    </el-popover>
                                </template>
                                <template slot-scope="scope">
                                    <el-button type="text" @click="drawFun(scope.row)">{{ scope.row.markPoints?'已绘制':'绘制' }}</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column width="90" align="center">
                                <template slot="header" slot-scope="scope">
                                    <span style="margin-right: 5px;">告警时段</span>
                                    <el-popover
                                    placement="top-start"
                                    width="300"
                                    trigger="hover"
                                    >
                                        <div style="font-size: 14px; color: 606266;">
                                            <div style="font-size: 16px;color: #303133;line-height: 26px;margin-bottom: 10px;">如何设置告警时段？</div>
                                            <div style="line-height: 22px;">平台在设置时间段内可推送告警数据。同一算法模型支持多个时段配置。</div>
                                        </div>
                                        <span class="el-icon-question" slot="reference"></span>
                                    </el-popover>
                                </template>
                                <template slot-scope="scope">
                                    <el-button type="text" @click="setFun(scope.row)">{{ scope.row.alarmTimes.length>0?'已设置':'设置' }}</el-button>
                                </template>
                            </el-table-column>
                            </el-table>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <!-- 绘制弹窗 -->
            <DrawDialog :detailObj="detail" :dataList="dataList" :nameEn="nameEn" :algorithmId="algorithmId" v-if="innerVisible" @close="closeHandle"/>
            <!-- 告警时段 -->
            <TimeInfo v-if="timeVisible" :alarmTimeList="alarmTimeList" :algorithmId="algorithmId"  @close="timeClose"/>

            <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveFun" :loading="btnLoading">提交</el-button>
            </span>
        </el-dialog>

        <div class="data-tip">
            <el-dialog
            :visible.sync="dataVisible"
            width="280px"
            top="40vh"
            :show-close="false"
            append-to-body
            >
                <div v-if="dataVisible">
                    <div v-if="isError">
                    <div>提交失败,是否重试？</div>
                    <div style="margin-top: 15px;text-align: right;">
                        <el-button @click="closeTip(1)">取消</el-button>
                        <el-button type="primary" @click="closeTip">重试</el-button>
                    </div>
                    </div>
                    <div v-else>数据处理中，请稍等</div>
                </div>
            </el-dialog>
        </div>
    </div>
  </template>
  <script>
  import MarkDetail from "./markDetail.vue";
  import DrawDialog from "./drawDialog";
   import TimeInfo from "./timeInfo.vue"
  import {
    getAlgorithmListData,
    getListDataDetail,
    saveCameraDetail,
    cameraInfo,
    submitCamera,
    takePhoto,
  } from "@/api/applicationMonitoring/cameraManagement";
  import { listData } from "@/api/applicationMonitoring/soundColumnManagement"
  import { listPage } from '@/api/applicationMonitoring/casketManagement'
  export default {
    name: 'AddCamera',
    components: {
        MarkDetail,
        DrawDialog,
        TimeInfo
    },
    props: {
        currentId: {
            type: String,
            default: "",
        },
        currentData: {
            type: Object,
            default: () => {},
        },
        channelObj:{
            type: Object,
            default: () => {},
        },
        pageType:{
            type:String,
            default:''
        }
    },
    data() {
        return {
            loading: false,
            btnLoading:false,
            photoLoading: false,
            dialogVisible: true,
            params: {
            cameraId: this.currentId,
            limit: 10,
            page: 1,
            },
            detail: {},
            currentAlgorithmId: "",
            tableData: [],
            dataList: [],
            dataListAll:[],
            drawDisabled: true,
            innerVisible:false,
            algorithmId:'',
            nameEn:'',
            soundColumnList:[],
            rules:{
                name: [
                    { required: true, message: '请输入摄像头名称', trigger: 'blur' },
                ],
                rtspUrl:[
                    { required: true, message: '请输入RTSP流地址', trigger: 'blur' },
                ],
                intervalTime:[
                    { required: true, message: '请输入识别间隔', trigger: 'blur' },
                ],
                alarmInterval:[
                    { required: true, message: '请输入告警间隔', trigger: 'blur' },
                ],
                locationId:[
                    { required: true, message: '请选择关联算法服务', trigger: 'change' },
                ]
            },
            alarmTimeList:[],
            timeVisible:false,
            imageHeight:null,
            isHide:true,
            dataVisible:false,
            isError:false,
            groupingOptions:[]
        };
    },
    async created() {
        await this.getAlgorithmListData();
        if (this.currentId) {
            await this.getListDataDetail();
        }
        if(this.pageType == "channel"){
            this.$set(this.detail, 'rtspUrl', this.channelObj.rtspUrl);
            this.$set(this.detail, 'channelId', this.channelObj.channelId);
            // this.getTable();
        }
        this.getTable();
        this.getSoundColumnList();
    },
    methods: {
        // 获取盒子列表
        async getTable(){
            let obj = {
                limit: 999,
                page: 1,
            }
            const { data } = await listPage(obj)
            this.groupingOptions = data
        },
        // 获取图片高度
        getHeight(num){
            if(num){
                this.imageHeight = num;
            }
        },
        // 获取音柱列表
        async getSoundColumnList(){
            const res = await listData();
            this.soundColumnList = res.data;
        },
        // 获取摄像头详情
        async getListDataDetail() {
            let formData = new FormData();
            formData.append("id", this.currentId);
            const data = await cameraInfo(formData);
            this.detail = data.data;
            this.detail.soundColumnId = (!this.detail.soundColumnId||this.detail.soundColumnId=='0')?"":this.detail.soundColumnId
            let algorithmsArr = this.detail.algorithms;
            if(algorithmsArr&&algorithmsArr.length>0){
                algorithmsArr.forEach((item,index)=>{
                    this.tableData.forEach(ite=>{
                        if(ite.id == item.algorithmId){
                            ite.alarmTimes = item.alarmTimes;
                        }
                    })

                })
            }
        },
        // 获取关联算法列表
        async getAlgorithmListData(str) {
            this.loading = true;
            const data = await getAlgorithmListData(this.params);
            this.loading = false;
            this.dataListAll = [];
            data.data.forEach((item) => {
            item.status = 1;
            item.alarmTimes = [];
            if(item.nameEn=="helmet"){//安全帽
                item.confidence = item.confidence?item.confidence * 100 : 75;
            }else if(item.nameEn=="object"){//占道
                item.confidence = item.confidence?item.confidence* 100 : 55;
            }else if(item.nameEn=="fire"){//烟火
                item.confidence = item.confidence?item.confidence* 100 : 70;
            }else{
                item.confidence = item.confidence?item.confidence* 100 : 50;
            }
            if(item.markPoints){
                let mArr = JSON.parse(item.markPoints);
                let newArr = [];
                mArr.forEach((item) => {
                let pointText = "";
                item.forEach((i) => {
                    pointText = pointText + ` ${i.x},${i.y}`;
                });
                newArr.push({
                    pointList: item,
                    pointText: pointText,
                });
                });
                if(item.lineMarkPoints){
                let lArr = JSON.parse(item.lineMarkPoints);
                lArr.forEach((item) => {
                    let pointText = "";
                    item.forEach((i) => {
                    pointText = pointText + ` ${i.x},${i.y}`;
                    });
                    newArr.push({
                    pointList: item,
                    pointText: pointText,
                    });
                });
                }
                let r = Math.floor(Math.random() * 256)
                let g = Math.floor(Math.random() * 256)
                let b = Math.floor(Math.random() * 256)
                let obj = {
                markPoints:newArr,
                name:item.name,
                color: 'rgb('+r+','+g+','+b+')',
                r:r,
                g:g,
                b:b,
                }
                this.dataListAll.push(obj)
            }
            });

            this.tableData = data.data;
        },
        saveFun(){
            console.log(this.detail,"===========this.detail")
            this.$refs.detailForm.validate((valid) => {
                if (valid) {
                    this.saveData();
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        // 保存摄像头数据
        saveData() {
            // 处理缩放参数
            this.btnLoading = true;
            this.dataVisible = true;
            let arr = [];
            this.tableData.forEach((item) => {
                if (item.checked) {
                    arr.push({
                        alarmTimes: item.alarmTimes,
                        algorithmConf: item.confidence?item.confidence/100:0,
                        algorithmId: item.id,
                        algorithmNameEn: item.nameEn,
                        drawBoxs: item.markPoints?JSON.parse(item.markPoints):[],
                        drawLines: item.lineMarkPoints?JSON.parse(item.lineMarkPoints):[],
                    })
                }
            });
            this.detail.algorithms = arr;
            this.detail.locationId = this.detail.locationId ? this.detail.locationId : this.currentData.id
            submitCamera(this.detail).then((data)=>{
                if(data.data) {
                    this.$message.success("保存成功");
                    this.dataVisible = false;
                    this.dialogVisible = false;
                    this.btnLoading = false;
                } else {
                    this.btnLoading = false;
                    this.isError = true;
                }
            }).catch(() => {
                this.btnLoading = false;
                this.dataVisible = false;
                //this.isError = true;
            });

        },
        closeTip(type){
            this.dataVisible = false;
            this.isError = false;
            if(type == 1){
                this.dialogVisible = false;
                return
            }
            this.saveData();
        },
        // 拍照
        async takePhoto() {
            this.photoLoading = true;
            const data = await takePhoto({ rtspUrl: this.detail.rtspUrl });
            this.detail.fileName = data.data;
            this.photoLoading = false;
            this.$message.success("拍照成功");
            setTimeout(()=>{
                this.isHide = false
            },100)
        },
        clickNewMark() {
            this.$refs.markDetail.resetting();
        },
        clickSaveMark() {
            let a = this.$refs.markDetail.save();
            this.tableData.forEach((item) => {
            if (item.id == this.currentAlgorithmId) {
                const markPoints = [];
                a.forEach((i) => {
                markPoints.push(i.pointList);
                });
                item.markPoints = JSON.stringify(markPoints);
            }
            });
        },
        clickClearMark() {
            this.$refs.markDetail.clear();
        },

        // 关闭回调
        closed() {
            this.$emit("close");
        },
        //展示绘制弹窗
        async drawFun(obj){
            // if(!this.detail.id){
            // this.$message.warning("请先保存再绘制");
            // return;
            // }
            this.tableData.forEach((item) => {
            item.status = 1;
            if (item.id == obj.id) {
                this.dataList = obj.markPoints ? JSON.parse(obj.markPoints) : [];
                if(obj.lineMarkPoints){
                this.dataList.push(JSON.parse(obj.lineMarkPoints)[0])
                }
                this.algorithmId = obj.id;
                this.nameEn = obj.nameEn
            }
            });
            this.innerVisible = true;
        },
        //关闭弹窗回调
        closeHandle(item){
            this.$data.innerVisible = false;
            if(item){
                this.dataListAll = [];
                this.tableData.forEach(ite=>{
                    if(ite.id == item.algorithmId){
                        ite.lineMarkPoints = (item.lineMarkPoints&&item.lineMarkPoints.length>0)?JSON.stringify(item.lineMarkPoints):'';
                        ite.markPoints = (item.markPointsArr && item.markPointsArr.length>0)?JSON.stringify(item.markPointsArr):'';
                    }
                })
                this.getDraw();
            }
        },
        getDraw(){
            this.dataListAll = [];
            this.tableData.forEach((item) => {
                if(item.markPoints){
                    let mArr = JSON.parse(item.markPoints);
                    let newArr = [];
                    mArr.forEach((item) => {
                    let pointText = "";
                    item.forEach((i) => {
                        pointText = pointText + ` ${i.x},${i.y}`;
                    });
                    newArr.push({
                        pointList: item,
                        pointText: pointText,
                    });
                    });
                    if(item.lineMarkPoints){
                    let lArr = JSON.parse(item.lineMarkPoints);
                    lArr.forEach((item) => {
                        let pointText = "";
                        item.forEach((i) => {
                        pointText = pointText + ` ${i.x},${i.y}`;
                        });
                        newArr.push({
                        pointList: item,
                        pointText: pointText,
                        });
                    });
                    }
                    let r = Math.floor(Math.random() * 256)
                    let g = Math.floor(Math.random() * 256)
                    let b = Math.floor(Math.random() * 256)
                    let obj = {
                    markPoints:newArr,
                    name:item.name,
                    color: 'rgb('+r+','+g+','+b+')',
                    r:r,
                    g:g,
                    b:b,
                    }
                    this.dataListAll.push(obj)
                }
            });
        },
        tooltipText(value) {
            return value / 100;
        },
        //  设置时段
        setFun(row){
            this.alarmTimeList = row.alarmTimes;
            this.algorithmId = row.id;
            this.timeVisible = true;
        },
        // 关闭设置时段
        timeClose(item){
            this.timeVisible = false;
            this.alarmTimeList = [];
            this.algorithmId = "";
            if(item){
                this.tableData.forEach(ite=>{
                    if(ite.id == item.algorithmId){
                        ite.alarmTimes = item.alarmTimeArr
                    }
                })
            }
        }
    },
  };
  </script>
  <style scoped lang="scss">
  .tip-txt{
    color: #606266;
    font-size: 12px;
    line-height: 22px;
    margin-bottom: 12px;
  }
  .camera-dialog {
    width: 100%;
    display: flex;

    .camera-left {
      width: 650px;
      margin-right: 20px;
      flex-shrink: 0;
      border-radius: 4px;
      border: 1px solid #E4E7ED;
      padding: 16px;
    }

    .camera-right {
        flex: 1;
        border-radius: 4px;
        border: 1px solid #E4E7ED;
        padding: 16px;
        :deep(.el-form-item__label){
            text-align: left !important;
        }
        :deep(.el-form-item__content){
            margin-left: 0px !important;
        }
        :deep(.el-table__header tr th){
            border-right: 1px solid #EBEEF5 !important;
        }
    }
    .take-btn{
        border: 1px solid #DCDFE6;
        border-radius: 22px;
        height: 22px;
        line-height: 22px;
        padding: 5px 16px;
        width: 86px;
        text-align: center;
        font-size: 14px;
        color: #606266;
        margin-bottom: 12px;
        cursor: pointer;
    }
    .flex-item{
        display: flex;
        justify-content: space-between;
        // align-items: center;
    }
    .tip-item{
        color: #86909C;
        font-size: 12px;
        line-height: 20px;
    }
  }

  .image-box {
    // width: 100%;
    min-height: 290px;
    border: 1px solid #EBEEF5;
  }
  .img-cont{
    width: 100%;
    text-align: center;
    padding: 24px 0px;
  }

  .image {
    width: 100%;
    height: auto;
    display: block;
  }

  .btn-list {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
  }
  </style>
  <style lang="scss">
  .input-num{
    // width: 380px;
    .el-input__inner{
      text-align: left !important;
    }
  }
  .data-tip{
    :deep(.el-dialog__header){
        padding: 0px;
    }
  }
  </style>