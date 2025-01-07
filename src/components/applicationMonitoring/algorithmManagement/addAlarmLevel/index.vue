<template>
	<div>
		<el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" width="600px"
			@closed="closed">
			<div>
				<el-form ref="form" :model="params" :rules="rules" label-width="120px">
					<el-form-item label="告警等级名称" prop="name">
						<el-input v-model="params.name"></el-input>
					</el-form-item>

					<el-form-item label="告警等级颜色" prop="showColor">
						<el-color-picker v-model="params.showColor" :predefine="predefineColors">
						</el-color-picker>
					</el-form-item>
					<el-form-item label="告警展示方式" prop="nameEn">
						<el-checkbox-group v-model="params.showTypes">
							<el-checkbox v-for="item in alarmShowTypes" :label="item.code" :key="item.code">
								{{item.text}}
							</el-checkbox>
						</el-checkbox-group>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="saveAlarmLevelData">提交</el-button>
			</span>
		</el-dialog>
	</div>
</template>
<script>
	import {
		saveAlarmLevel,
		getAlarmLevel,
		getAlarmShowTypeList
	} from "@/api/applicationMonitoring/algorithmManagement";
	export default {
		props: {
			currentId: {
				type: String,
				default: "",
			},
		},
		data() {
			return {
				loading: false,
				title: this.currentId ? "编辑告警等级" : "新增告警等级",
				dialogVisible: true,
				params: {
					id: this.currentId,
					name: "",
					showColor: "#ff4500",
					showTypes: []
				},
				alarmShowTypes: [],
				rules: {
					name: [{
						required: true,
						message: "请输入告警等级名称",
						trigger: "blur"
					}]
				},
				predefineColors: [
					'#ff4500',
					'#ff8c00',
					'#ffd700',
					'#90ee90',
					'#00ced1',
					'#1e90ff',
					'#c71585'
				]

			};
		},
		async created() {
			await this.listAlarmShowTypes();
			await this.getAlarmLevelInfo();
		},
		methods: {
			//
			async listAlarmShowTypes() {
				const data = await getAlarmShowTypeList({
					id: this.currentId
				});
				this.alarmShowTypes = data.data;
			},
			//
			async getAlarmLevelInfo() {
				const data = await getAlarmLevel({
					id: this.currentId
				});
				//
				if (Object.keys(data.data).length > 0) {
					this.params = data.data;
				}
			},
			//
			saveAlarmLevelData() {
				this.$refs.form.validate(async (valid) => {
					if (valid) {
						await saveAlarmLevel(this.params);
						this.$message.success(this.currentId ? "编辑成功" : "新增成功");
						this.dialogVisible = false;
					} else {
						return false;
					}
				});
			},
			// 关闭回调
			closed() {
				this.$emit("close");
			}
		},
	};
</script>
<style scoped lang="scss">
</style>