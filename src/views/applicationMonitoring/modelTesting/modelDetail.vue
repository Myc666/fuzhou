<template>
    <div class="alg-detail">
        <div class="top-bg">
            <div style="width: 50%;">
                <div @click="goBack()" class="go-back">
                    <span class="el-icon-back"></span>
                    <span style="padding: 0px 32px 0px 5px;">返回查看更多模型</span>
                </div>
                <div class="alg-name">{{ params.name }}</div>
                <div class="tag-flex">
                    <div class="tag-item" v-for="(item,index) in tagNameList" :key="index">{{ item }}</div>
                </div>
                <div class="tip-cont">{{ params.description }}</div>
                <div class="button-flex">
                    <!-- <div class="btn-sty" @click="modelFun">
                        <span class="el-icon-magic-stick"></span>
                        <span style="padding-left: 5px;">{{ isShow?'模型使用':'查看算法边界' }}</span>
                    </div> -->
                    <el-tooltip content="请扫码屏幕右侧二维码" placement="top-start">
                        <div class="btn-sty">
                            <span class="el-icon-phone-outline"></span>
                            <span style="padding-left: 5px;">联系我们</span>
                        </div>
                    </el-tooltip>
                </div>
            </div>
            <div class="right-txt">
                <div class="base-txt" style="margin-right: 50px;">
                    <div style="padding-bottom: 16px;">
                        <span style="padding-right: 5px;">基础准确率</span>
                        <span class="el-icon-warning-outline"  @mouseenter="onHover(1)"  @mouseleave="hideMessage()"></span>
                    </div>
                    <div style="font-size: 24px;">{{ detailMap.basePrecision ? detailMap.basePrecision : '' }}</div>
                    <div class="base-tip" v-if="isBase">
                        <div class="tip-title">基础准确率</div>
                        <div class="tip-txt">复用现有模型进行测试，可达到的识别准确率.</div>
                    </div>
                </div>
                <div class="base-txt paddL">
                    <div style="padding-bottom: 16px;">
                        <span style="padding-right: 5px;">场景优化准确率</span>
                        <span class="el-icon-warning-outline"  @mouseenter="onHover(2)"  @mouseleave="hideMessage()"></span>
                    </div>
                    <div style="font-size: 24px;">{{detailMap.scenePrecision ? detailMap.scenePrecision : ''}}</div>
                    <div class="base-tip" v-if="isOptimize">
                        <div class="tip-title">场景优化准确率</div>
                        <div class="tip-txt">基于具体场景定制优化后，可支持的识别准确率.</div>
                    </div>
                </div>
            </div>
        </div>
        <Upload v-if="params.nameEn" :nameEn="params.nameEn" :id="params.id"></Upload>
        <!-- v-if="isShow" -->
        <div class="illustrate">
            <div v-if="JSON.stringify(detailMap) != '{}'">
                <div class="effective">
                    <div class="title">有效的拍摄方式</div>
                    <div class="demand-tip">摄像头分辨率需要满足1920*1080，支持rstp传输协议</div>
                    <div class="effective-cont">
                       {{ detailMap.trueText }}
                    </div>
                    <div class="img-flex">
                        <div v-for="(item,ind) in detailMap.trueImage" :key="ind" class="img-item">
                            <el-image :src="VUE_APP_API_BASE_URL+`/algorithm/picStream?file=${item}`" style="width: 100%;height: 200px;"></el-image>
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
                            <el-image :src="VUE_APP_API_BASE_URL+`/algorithm/picStream?file=${item}`" style="width: 100%;height: 200px;"></el-image>
                        </div>
                    </div>
                </div>
            </div>
            <el-empty v-else></el-empty>
        </div>
        <!-- <Upload v-else :nameEn="params.nameEn" :id="params.id"></Upload> -->
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
    background: #fff;
    border-radius: 8px;
    // min-height: 100%;
    min-height:calc(100vh - 120px);
    .top-bg{
        min-height: 200px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
        // background: linear-gradient(270deg, #48C6EF 0.02%, #6F86D6 149.35%);
        background: url("@/assets/images/modelTesting/bg.png") no-repeat;
        background-size: cover;
        padding: 16px;
        color: #FFFFFF;
        display: flex;
        .go-back{
            cursor: pointer;
            font-size: 14px;
        }
        .alg-name{
            font-size: 36px;
            line-height: 28px;
            font-weight: 500;
            margin-top: 24px;
        }
        .tag-flex{
            display: flex;
            padding: 16px 0px;
        }
        .tag-item{
            width: 85px;
            background: #DCDCDC;
            color: black;
            font-size: 14px;
            text-align: center;
            border-radius: 80px;
            letter-spacing: 1px;
        }
        .tag-item:nth-child(n+2){
            margin-left: 16px;
        }
        .tip-cont{
            display: flex;
            font-size: 14px;
        }
        .right-txt{
            width: 50%;
            padding-right: 55px;
            padding-bottom: 50px;
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
                bottom: 65px;
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
            margin-top: 15px;
            .btn-sty{
                // width: 150px;
                background: #000;
                font-size: 12px;
                text-align: center;
                border-radius: 30px;
                padding: 6px 16px;
                cursor: pointer;
            }
        }
    }
    .illustrate{
        padding: 24px 16px;
        .title{
            font-size: 22px;
        }
        .demand-tip{
            font-size: 14px;
            line-height: 22px;
        }
        .effective-cont{
            padding: 16px 0px 24px 0px;
            font-size: 14px;
            color: #606266;
            line-height: 22px;
            white-space: pre-line;
        }
        .img-flex{
            // display: flex;
            display: grid;
            grid-template-columns: repeat(auto-fill, 24%);
            justify-content: space-between;
            // justify-content: space-around;
            .img-item{
                width: 100%;
            }
        }
        .invalid{
            margin-top: 32px;
        }
    }
}
</style>
  