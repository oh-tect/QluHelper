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
							<text>当前总绩点</text>
						</view>
						<view class="number">
							<u-count-to :startVal="0" decimals="2" :endVal="getGenaralGPA()" fontSize="50px">
							</u-count-to>
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
	let that = this;
	export default {
		data() {
			return {
				year: [],
				grades: [],
				semester: '2022-2023-1'
			}
		},
		onLoad() {
			let token = uni.getStorageSync('token');
			let username = uni.getStorageSync('username');
			let semesters = this.semester;

			console.log(semesters);
			console.log(token);
			console.log("获取token成功");
			let that = this;
			try {
				//获取所有学期
				new Promise((resolve, reject) => {
					uni.request({
						url: 'http://jwxt.qlu.edu.cn/app.do',
						method: 'GET',
						data: {
							'method': 'getCjcx',
							'xh': username
						},
						header: {
							'token': token
						},
						success: (re) => {
							if (JSON.stringify(re).includes('token')) {
								console.log('token过期');
								this.$_tokens.mytoken.refreshToken();
							} else {
								let set = new Set();
								for (let item of re.data) {
									set.add(item['xqmc']);
								}
								let list = Array.from(set);
								for (let items of list) {
									this.year.push(items);
								}
								console.log(that.year);
								resolve();
							}
						},
						fail: () => {
							console.log("获取失败");
							reject();
						}
					});
				});
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
							if (JSON.stringify(re).includes('token')) {
								console.log('token过期');
								this.$_tokens.mytoken.refreshToken();
							} else {
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
							}
						},
						fail: () => {
							console.log("获取失败");
							reject();
						}
					});
				});
			} catch (e) {
				//TODO handle the exception
				console.log('token过期');
			}
		},
		computed: {
			all_grades: function() {
				return this.grades.length;
			}
		},
		methods: {
			//监听选择器事件
			change: function(e) {
				this.semester = e.value;
				this.getGrades(e.value);
				console.log(this.semester);
			},
			getGPA: function(e) {
				if (e > 95) {
					return 5.0;
				} else if (e >= 60) {
					return e / 10.0 - 4.5;
				} else {
					return 0;
				}
			},
			getGenaralGPA: function() {
				//sum为学分总和
				let sum = 0;
				//sumGPA为绩点乘学分总和
				let sumGPA = 0;
				if (this.grades.length == 0) {
					return 0;
				} else {
					for (let item of this.grades) {
						if (item[1] !== '公选') {
							sum += item[3];
							let GPA = this.getGPA(Number(item[2]));
							sumGPA += GPA * item[3];
						}
					}
					console.log("学分总和为 " + sum);
					//保留一位小数
					return (sumGPA / sum).toFixed(1);
				}
			},
			getGrades: function(semester) {
				let token = uni.getStorageSync('token');
				let username = uni.getStorageSync('username');
				let semesters = this.semester;
				this.grades = [];
				console.log(semesters);
				console.log(token);
				console.log("获取token成功");
				let that = this;
				try {
					//获取所有学期
					new Promise((resolve, reject) => {
						uni.request({
							url: 'http://jwxt.qlu.edu.cn/app.do',
							method: 'GET',
							data: {
								'method': 'getCjcx',
								'xh': username,
								'xnxqid': semester
							},
							header: {
								'token': token
							},
							success: (re) => {
								if (JSON.stringify(re).includes('token')) {
									console.log('token过期');
									this.$_tokens.mytoken.refreshToken();
								} else {
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
								}
							},
							fail: () => {
								console.log("获取失败");
								reject();
							}
						})
					});
				} catch (e) {
					//TODO handle the exception
					console.log('token过期');
				}
			},

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
