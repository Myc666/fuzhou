<template>
    <div class="alg-detail">
        <div class="top-bg">
            <div @click="goBack()" class="go-back">
               <img src="@/assets/images/modelTesting/back-icon.png" style="width: 20px;"/>
            </div>
            <div style="display: flex; align-items: flex-start;margin-top: 12px;">
                <div style="width: 40%;">
                    <div class="alg-flex">
                        <div class="alg-name">{{ params.name }}</div>
                        <div class="tag-flex">
                            <div class="tag-item" v-for="(item,index) in tagNameList" :key="index">{{ item }}</div>
                        </div>
                    </div>
                    <div class="alg-nameEn">
                        <span>{{ params.nameEn }}</span>
                        <span style="margin-left: 5px;">最近更新 {{ $moment(params.updatedAt).format("YYYY-MM-DD") }}</span>
                    </div>
                    <div class="tip-cont">{{ params.description }}</div>
                    <!-- <div class="button-flex">
                        <el-tooltip content="请扫码屏幕右侧二维码" placement="top-start">
                            <div class="btn-sty">
                                <span class="el-icon-service"></span>
                                <span style="padding-left: 10px;">联系我们</span>
                            </div>
                        </el-tooltip>
                    </div> -->
                </div>
                <div class="right-txt">
                    <div class="base-txt" style="margin-right: 50px;">
                        <div class="base-precision">{{ detailMap.basePrecision ? detailMap.basePrecision : '' }}</div>
                        <div style="color: #333333;font-size: 16px;">
                            <span style="padding-right: 5px;">基础准确率</span>
                            <span class="el-icon-warning-outline"  @mouseenter="onHover(1)"  @mouseleave="hideMessage()"></span>
                        </div>
                        <div class="base-tip" v-if="isBase">
                            <div class="tip-title">基础准确率</div>
                            <div class="tip-txt">复用现有模型进行测试，可达到的识别准确率.</div>
                        </div>
                    </div>
                    <div class="scene-txt">
                        <div class="scene-precision">{{detailMap.scenePrecision ? detailMap.scenePrecision : ''}}</div>
                        <div style="color: #333333;font-size: 16px;">
                            <span style="padding-right: 5px;">场景优化准确率</span>
                            <span class="el-icon-warning-outline"  @mouseenter="onHover(2)"  @mouseleave="hideMessage()"></span>
                        </div>
                        <div class="base-tip" v-if="isOptimize">
                            <div class="tip-title">场景优化准确率</div>
                            <div class="tip-txt">基于具体场景定制优化后，可支持的识别准确率.</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- <Upload v-if="params.nameEn" :nameEn="params.nameEn" :id="params.id"></Upload> -->
        <div class="illustrate">
            <div class="headline">
                <!-- <div class="icon"><i class="el-icon-notebook-1"></i></div> -->
                <div class="cont">算法边界</div>
            </div>
            <div class="flex-box" v-if="JSON.stringify(detailMap) != '{}'">
                <div class="effective">
                    <div class="title">有效的拍摄方式</div>
                    <div class="demand-tip">摄像头分辨率需要满足1920*1080，支持RTSP传输协议</div>
                    <div class="effective-cont">
                       {{ detailMap.trueText }}
                    </div>
                    <div class="img-flex">
                        <div v-for="(item,ind) in detailMap.trueImage" :key="ind" class="img-item">
                            <el-image :src="VUE_APP_API_BASE_URL+`/algorithm/picStream?file=${item}`" style="width: 100%;height: 190px;border-radius: 3px;"></el-image>
                        </div>
                    </div>
                </div>
                <div class="invalid">
                    <div class="title">无效的拍摄方式</div>
                    <div class="effective-cont">
                        {{ detailMap.falseText }}
                    </div>
                    <div class="img-flex">
                        <div v-for="(item,ind) in detailMap.falseImage" :key="ind" class="img-item">
                            <el-image :src="VUE_APP_API_BASE_URL+`/algorithm/picStream?file=${item}`" style="width: 100%;height: 190px;border-radius: 3px;"></el-image>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import { detail,getTagListData } from "@/api/applicationMonitoring/modelTesting";
import Upload from "@/components/applicationMonitoring/modelTesting/upload.vue";
export default {
    // props:{
    //     id:{
    //         type:String,
    //         default:''
    //     },
    //     tagList:{
    //         type:Array,
    //         default:'',
    //     }
    // },
    data() {
        return {
            params:{},
            detailMap:{},
            tagNameList:[],
            isBase:false,
            isOptimize:false,
            // isShow:true,
            VUE_APP_API_BASE_URL,
            id:'',
            tagList:[],
        };
    },
    created() {
        this.id = this.$route.query.id
        console.log(this.tagList,"----------")
        this.getTagListData()
        this.getDetail()
    },
    methods: {
        // 获取行业列表
        async getTagListData() {
            this.tagList = [];
            const data = await getTagListData({ type: 1 });
            this.tagList = [
                ...data.data
            ];
        },
        async getDetail(){
            const res = await detail({id:this.id})
            let arr = res.data.tagIds;
            let newArr =[];
            this.tagList.map(item => {
                arr.map(items => {
                    if(item.id == items){
                        newArr.push(item.name)
                    }
                })
            });
            this.tagNameList = newArr;
            this.params = res.data;
            this.detailMap = res.data.detailMap;
        },
        // 返回上一级
        goBack(){
            // this.$emit('close')
            // this.$router.go(-1);
            this.$router.replace("/algorithmManagement/modelTesting");
        },
        // 鼠标移入
        onHover(type){
            if(type==1){
                this.isBase = true;
                this.isOptimize = false;
            }else{
                this.isBase = false;
                this.isOptimize = true;
            }
        },
        // 鼠标移出
        hideMessage(){
            this.isBase = false;
            this.isOptimize = false;
        },
        // modelFun(){
        //     this.isShow=!this.isShow;
        // },
        
    },
    components: {
        Upload,
    },
};
</script>
<style scoped lang="scss">
.alg-detail{
    .top-bg{
        border-radius: 8px;
        background: url("@/assets/images/modelTesting/bg1.png")  no-repeat center center;
        background-size: cover;
        padding: 26px;
        color: #FFFFFF;
        .go-back{
            cursor: pointer;
        }
        .alg-flex{
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }
        .alg-name{
            font-family: youhei;
            font-weight: 400;
            font-size: 30px;
            color: #333333;
        }
        .alg-nameEn{
            font-size: 14px;
            color: #666666;
            margin-top: 8px;
        }
        .tag-flex{
            display: flex;
            flex-wrap: wrap;
        }
        .tag-item{
            color: #EB3A2F;
            background: #FFE6E1;
            font-size: 12px;
            padding: 5px 10px;
            border-radius: 30px;
            margin-left: 16px;
            margin-bottom: 5px;
        }
        .tag-item:nth-child(even){
            color: #F05924 !important;
            background: #f3c696  !important;
        }
        .tip-cont{
            display: flex;
            // font-size: 22px;
            color: #333333;
            font-size: 14px;
            line-height: 30px;
            margin-top: 15px;
        }
        .right-txt{
            margin-bottom: 62px;
            margin-left: 85px;
            display: flex;
            justify-content: end;
            align-items: end;
        }
        .base-txt,.scene-txt{
            position: relative;
            .base-tip{
                width: 240px;
                background: #FFFFFF;
                padding: 16px;
                border-radius: 6px;
                font-size: 12px;
                position: absolute;
                bottom: 25px;
                right: 0px;
                box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
                .tip-title{
                    color: #000;
                    margin-bottom: 5px;
                    font-weight: bold;
                }
                .tip-txt{
                    color:rgba(0, 0, 0, 0.60);
                    line-height: 20px;
                }
            }
        }
        .base-precision,.scene-precision{
            font-family: youhei;
            font-size: 28px;
            margin-bottom: 39px;
        }
        .base-precision{
            color: #EB3A2F;
        }
        .scene-precision{
            color: #EFA04C;
        }
        .button-flex{
            display: flex;
            margin-top: 20px;
            .btn-sty{
                // width: 150px;
                background: #F05924;
                font-size: 14px;
                text-align: center;
                line-height: 22px;
                border-radius: 6px;
                padding: 5px 16px;
                cursor: pointer;
            }
        }
    }

    .illustrate{
        .headline{
            margin: 30px 0px;
            .cont{
                color: #202B3D;
                font-size: 18px;
                font-style: normal;
                font-weight: bold;
            }
        }

        .flex-box{
            display: flex;
            justify-content: space-between;
            background: #FFF;
            padding: 23px 29px;
            >div{
                width: 47%;
            }

            .title{
                font-size: 22px;
                color: #202B3D;
                font-size: 14px;
                font-weight: bold;
                display: inline-block;
                margin-bottom: 15px;
            }
            .demand-tip{
                font-size: 14px;
                line-height: 22px;
                color: #999999;
                line-height: 30px;
            }
            .effective-cont{
                font-weight: 500;
                font-size: 14px;
                color: #999999;
                line-height: 25px;
                margin-bottom: 20px;
                white-space:pre-line
            }
            .img-flex{
                display: grid;
                grid-template-columns: repeat(2, 49%);
                justify-content: space-between;
                .img-item{
                    width: 100%;
                    margin-bottom: 10px;
                }
            }
        }
    }
}
</style>
  