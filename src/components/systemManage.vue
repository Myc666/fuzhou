<template>
    <div class="system-item">
        <!-- <div class="icon-warp"> -->
            <img :src="url" class="icon">
        <!-- </div> -->
        <div class="iconName">{{name}}</div>
        <div class="system-item-num">{{num}}个</div>
    </div>
</template>
<script>
    export default {
        name: 'systemManage',
        components: {},
        props: {
            url: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: ''
            },
            num: {
                type: Number,
                default: 0
            },

        },
        data() {
            return {}
        },
        methods: {}
    }
</script>
<style lang="scss" scoped>
    .system-item {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 150px;
        justify-content: space-around;
        align-items: center;
        .iconName {
            font-size: 14px;
            color: #fff;
        }
        .icon {
            width: 100px;
            height: 120px;
        }
        .system-item-num {
            color: #3ed6ff;
        }
    }
</style>
