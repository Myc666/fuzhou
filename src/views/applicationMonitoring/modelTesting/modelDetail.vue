<template>
    <div class="alg-detail">
        <div class="top-bg">
            <div @click="goBack()" class="go-back">
                <span class="el-icon-back"></span>
                <span style="padding: 0px 32px 0px 5px;">返回</span>
            </div>
            <div style="display: flex; align-items: flex-start;margin-top: 32px;">
                <div style="width: 50%;">
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
                    <div class="button-flex">
                        <!-- <div class="btn-sty" @click="modelFun">
                            <span class="el-icon-magic-stick"></span>
                            <span style="padding-left: 5px;">{{ isShow?'模型使用':'查看算法边界' }}</span>
                        </div> -->
                        <el-tooltip content="请扫码屏幕右侧二维码" placement="top-start">
                            <div class="btn-sty">
                                <span class="el-icon-service"></span>
                                <span style="padding-left: 10px;">联系我们</span>
                            </div>
                        </el-tooltip>
                    </div>
                </div>
                <div class="right-txt">
                    <div class="base-txt" style="margin-right: 50px;">
                        <div style="font-size: 32px;margin-bottom: 62px;">{{ detailMap.basePrecision ? detailMap.basePrecision : '' }}</div>
                        <div>
                            <span style="padding-right: 5px;">基础准确率</span>
                            <span class="el-icon-warning-outline"  @mouseenter="onHover(1)"  @mouseleave="hideMessage()"></span>
                        </div>
                        <div class="base-tip" v-if="isBase">
                            <div class="tip-title">基础准确率</div>
                            <div class="tip-txt">复用现有模型进行测试，可达到的识别准确率.</div>
                        </div>
                    </div>
                    <div class="base-txt">
                        <div style="font-size: 32px;margin-bottom: 62px;">{{detailMap.scenePrecision ? detailMap.scenePrecision : ''}}</div>
                        <div>
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
                <div class="icon"><i class="el-icon-notebook-1"></i></div>
                <div class="cont">算法边界</div>
            </div>
            <div class="flex-box" v-if="JSON.stringify(detailMap) != '{}'">
                <div class="effective">
                    <div class="title">有效的拍摄方式</div>
                    <div class="demand-tip">摄像头分辨率需要满足1920*1080，支持rstp传输协议</div>
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
            this.$router.go(-1);
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
    background: #F1F5FB;
    // background: #fff;
    // border-radius: 8px;
    // min-height: 100%;
    // min-height:calc(100vh - 120px);
    .top-bg{
        // min-height: 200px;
        border-radius: 8px;
        background: linear-gradient(270deg, #48C6EF 0%, #6F86D6 100%);
        // background: url("@/assets/images/modelTesting/bg.png") no-repeat;
        // background-size: cover;
        padding: 32px;
        color: #FFFFFF;
        .go-back{
            cursor: pointer;
            font-size: 14px;
        }
        .alg-flex{
            display: flex;
            align-items: center;
        }
        .alg-name{
            font-size: 32px;
            line-height: 28px;
            font-weight: 500;
        }
        .alg-nameEn{
            font-size: 12px;
            line-height: 22px;
            color: rgba(255, 255, 255, 0.60);
            margin-top: 8px;
        }
        .tag-flex{
            display: flex;
        }
        .tag-item{
            background: #FFFFFF;
            color: #409EFF;
            font-size: 12px;
            padding: 2px 10px;
            border-radius: 30px;
            margin-left: 16px;
        }
        // .tag-item:nth-child(n+2){
        //     margin-left: 16px;
        // }
        .tip-cont{
            display: flex;
            font-size: 14px;
            line-height: 22px;
            margin-top: 32px;
        }
        .right-txt{
            margin-bottom: 62px;
            margin-left: 85px;
            display: flex;
            justify-content: end;
            align-items: end;
        }
        .base-txt{
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
        .button-flex{
            display: flex;
            margin-top: 32px;
            .btn-sty{
                // width: 150px;
                background: #000;
                font-size: 14px;
                text-align: center;
                line-height: 22px;
                // border-radius: 30px;
                padding: 5px 16px;
                cursor: pointer;
            }
        }
    }

    .illustrate{
        padding: 32px;
        border-radius: 8px;
        border: 1px solid #E4E7ED;
        background: #F5F7FA;
        margin: 16px 0;

        .headline{
            display: flex;
            margin-bottom: 16px;
            align-items: center;
            
            .icon{
                width: 28px;
                height: 28px;
                border-radius: 50%;
                color: white;
                background: linear-gradient(270deg, #48C6EF 0%, #6F86D6 100%);
                display: flex;
                justify-content: center;
                align-items: center;
                margin-right: 8px;
            }
            .cont{
                color: rgba(0, 0, 0, 0.90);
                font-size: 18px;
                font-style: normal;
                font-weight: bold;
            }
        }

        .flex-box{
            display: flex;
            justify-content: space-between;
            
            >div{
                width: 49.5%;
                border-radius: 4px;
                background: #FFF;
                padding: 16px;

            }

            .title{
                font-size: 22px;
                color: rgba(0, 0, 0, 0.90);
                font-size: 14px;
                font-weight: bold;
                display: inline-block;
            }
            .demand-tip{
                font-size: 14px;
                line-height: 22px;
                display: inline-block;
                margin-left: 40px;
            }
            .effective-cont{
                padding: 8px 0px 16px 0px;
                font-size: 14px;
                color: #606266;
                line-height: 22px;
                white-space: pre-line;
            }
            .img-flex{
                // display: flex;
                // justify-content: space-around;
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
  