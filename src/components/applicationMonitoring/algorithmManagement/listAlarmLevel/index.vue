<template>
	<div>
		<el-dialog :close-on-click-modal="false" :title="title" :visible.sync="dialogVisible" width="600px"
			@closed="closed" style="padding-top: 0px;">
			<div style="padding-bottom: 10px; margin-top: -15px;">
				<el-button type="primary" icon="el-icon-plus" @click="addNewAlarmLevel">新增</el-button>
			</div>
			<div>
				<el-table :data="tableData" border style="width: 100%">
					<el-table-column align="center" prop="name" label="告警等级名称" width="100">
					</el-table-column>
					<el-table-column align="center" prop="showColor" label="告警等级颜色" width="100">
						<template slot-scope="scope">
							<span class="show-color" :style="{ backgroundColor: scope.row.showColor }"></span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="showTypeNames" label="告警展示方式">
					</el-table-column>
					<el-table-column align="center" label="操作" width="100">
						<template slot-scope="scope">
							<el-button type="text" @click="editAlarmLevelData(scope.row)">编辑</el-button>
							<el-button type="text" class="danger" @click="deleteAlarmLevelData(scope.row)">删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<!-- <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
			</span> -->
		</el-dialog>

		<AddAlarmLevel v-if="addNewAlarmLevelVisible" :currentId="currentId"
			@close="(addNewAlarmLevelVisible = false), listAlarmLevel()" />
	</div>
</template>
<script>
	import {
		getAlarmLevelList,
		deleteAlarmLevel
	} from "@/api/applicationMonitoring/algorithmManagement";
	import AddAlarmLevel from "@/components/applicationMonitoring/algorithmManagement/addAlarmLevel";
	export default {
		components: {
			AddAlarmLevel
		},
		data() {
			return {
				loading: false,
				title: "告警等级列表",
				dialogVisible: true,
				tableData: [],
				addNewAlarmLevelVisible: false,
				currentId: "",
			};
		},
		async created() {
			await this.listAlarmLevel();
		},
		methods: {
			// 获取行业列表
			async listAlarmLevel() {
				const data = await getAlarmLevelList();
				this.tableData = data.data;
			},
			addNewAlarmLevel() {
				this.currentId = "";
				this.addNewAlarmLevelVisible = true;
			},
			editAlarmLevelData(item) {
				this.currentId = item.id;
				this.addNewAlarmLevelVisible = true;
			},
			async deleteAlarmLevelData(item) {
				this.$confirm(`删除后，已配置的告警等级将被清空`, "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning",
					})
					.then(async () => {
						const res = await deleteAlarmLevel({
							id: item.id
						});

						if (res.code == 0) {
							this.$message.success("删除成功");
							await this.listAlarmLevel();
						}
					})
					.catch(() => {});
			},
			// 关闭回调
			closed() {
				this.$emit("close");
			}
		},
	};
</script>
<style scoped lang="scss">
	.show-color {
		padding: 6px 25px;
		border-radius: 4px;
	}
</style>