<template>
	<view>
		<view class="main">
			<uni-section title='设置' type="line"></uni-section>
			<view class="setting">
				<view class="label">
					<text>学期:</text>
				</view>
				<view class="picker">
					<hpy-form-select title="请选择" :dataList="year" v-bind:value="1" @change="change" value="0">
					</hpy-form-select>
				</view>
			</view>
			<uni-section title='查询结果' type="line"></uni-section>
			<view class="result_info">
				<view class="all">
					<uni-card class="card" margin="8px" :is-shadow="false">
						<view class="title">
							<text>当前成绩总数</text>
						</view>
						<view class="number">
							<u-count-to :startVal="0" :endVal="grades.length" fontSize="50px"></u-count-to>
						</view>
					</uni-card>
				</view>
				<view class="credit">
					<uni-card class="card" margin="8px" :is-shadow="false">
						<view class="title">
							<text>当前学分</text>
						</view>
						<view class="number">
							<u-count-to :startVal="0" decimals="1" :endVal="4.9" fontSize="50px"></u-count-to>
						</view>
					</uni-card>
				</view>
			</view>
			<view class="grade" v-for="(item, index) in grades" :key="index">
				<gradeCard v-bind:subject="item[0]" v-bind:grade="item[2]" v-bind:credit="item[3]"
					v-bind:type="item[1]">
				</gradeCard>
			</view>
		</view>
	</view>
</template>

<script>
	import gradeCard from '../../../components/gradeCard/gradeCard.vue'
	export default {
		data() {
			return {
				year: ['2020-2021-1', '2020-2021-2', '2021-2022-1', '2021-2022-2'],
				grades: [],
				semester: '2022-2023-1'
			}
		},
		onLoad() {
			let token = uni.getStorageSync('token');
			let username = uni.getStorageSync('username');
			let semesters = this.semester;
			console.log(semesters);
			console.log("获取token成功");
			let that = this;
			new Promise((resolve, reject) => {
				uni.request({
					url: 'http://jwxt.qlu.edu.cn/app.do',
					method: 'GET',
					data: {
						'method': 'getCjcx',
						'xh': username,
						'xnxqid': that.semester
					},
					header: {
						'token': token
					},
					success: (re) => {
						console.log(re);
						for (let item of re.data) {
							let list = [];
							list.push(item['kcmc']);
							list.push(item['kclbmc']);
							list.push(item['zcj']);
							list.push(item['xf']);
							that.grades.push(list);
						}
						console.log(that.grades);
						resolve();
					},
					fail: () => {
						console.log("获取失败");
						reject();
					}
				})
			})
		},
		computed: {
			all_grades: function() {
				return this.grades.length;
			}
		},
		methods: {
			change: function(e) {
				console.log(e.value)
			}
		},
		components: {
			gradeCard,
		},
	}
</script>

<style>
	.main {
		margin: 0 15px 0 15px;
	}

	.setting {
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
	}

	.label {
		flex: 1;
		justify-content: center;
		text-align: center;
		align-items: center;
	}

	.picker {
		flex: 3;
	}

	.result_info {
		display: flex;
		flex-direction: row;
	}

	.all {
		flex: 1;
	}

	.credit {
		flex: 1;
	}

	.card {
		height: 120px;
	}

	.title {
		text-align: center;
	}

	.number {
		text-align: center;
		font-size: 50px;
		margin-top: 30px;
	}
</style>
