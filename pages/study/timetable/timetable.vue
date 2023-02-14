<template>
	<view>
		<view class="timetable">
			<chenmushan-weekCalendar :prevActive="true" :nextActive="true" @changeDate="change">

			</chenmushan-weekCalendar>
			<view v-if="isEnd">
				<view class="">
					<u-col justify="center" align="center" style="height: 400px;">
						<text style="color: rgb(94, 121, 135);">本学期已结束 (≧▽≦)</text>
					</u-col>
				</view>
			</view>
			<view v-if="!hasClass">
				<u-col justify="center" align="center" style="height: 400px;">
					<text style="color: rgb(94, 121, 135);">今天没有课，休息一下吧</text>
				</u-col>
			</view>
			<view v-else class="u-flex" style="margin: 0 10x 0 10px;" v-for="(item, index) in classes" :key="index">
				<view :class="{'skeleton_loading': isLoading, 'skeleton': !isLoading}">
					<u-skeleton rows="3" :loading="isLoading" :title="false" :animate="true" style="">
						<classCard v-bind:subject="item[0]" v-bind:time="item[1]" v-bind:position="item[2]">
						</classCard>
					</u-skeleton>
				</view>
				<!-- <classCard v-bind:subject="item[0]" v-bind:time="item[1]" v-bind:position="item[2]"></classCard> -->
			</view>
		</view>
	</view>
</template>

<script>
	import classCard from "../../../components/classCard/classCard.vue"
	var that = this;
	export default {
		data() {
			return {
				//选中日期
				date: '',
				//选中日期是第几周
				week: '',
				//选中日期是星期几
				day: '',
				//保存课程的list
				classes: [],
				username: '',
				token: '',
				//学期是否结束
				isEnd: false,
				hasClass: true,
				//是否开启骨架屏渲染
				isLoading: true,
			}
		},
		components: {
			classCard
		},
		onShow() {
			let dates = new Date();
			this.date = this.$mydate.getNowFormatDate(dates);
			this.week = this.$mydate.getWeek(this.date);
			this.day = this.$mydate.getDay(this.date);
			console.log("现在是第" + this.week + "周");
			uni.setNavigationBarTitle({
				title: '第' + this.week + '周'
			});
			this.username = uni.getStorageSync("username");
			this.token = uni.getStorageSync("token");
			this.getClassTable(this.week, this.day, this.username, this.token);
		},
		methods: {
			change: function(e) {
				let arr = String(e.ym);
				this.date = e.y + '-' + arr.substring(4) + '-' + e.d;
				console.log(this.date);
				this.week = this.$mydate.getWeek(this.date);
				console.log(this.week);
				uni.setNavigationBarTitle({
					title: '第' + this.week + '周'
				});
				this.day = this.$mydate.getDay(this.date);
				console.log(this.day);
				this.classes = [];
				this.getClassTable(this.week, this.day, this.username, this.token);

			},
			getClassTable: function(week, day, username, token) {
				var a = this;
				this.isEnd = false;
				this.hasClass = true;
				this.isLoading = true;
				console.log(this.isLoading);
				try {
					new Promise((resolve, reject) => {
						uni.request({
							url: "http://jwxt.qlu.edu.cn/app.do",
							method: "GET",
							data: {
								"xh": username,
								"method": "getKbcxAzc",
								"xnxqid": "2022-2023-2",
								"zc": week
							},
							header: {
								"token": token
							},
							success: (re) => {
								console.log(re);
								if (JSON.stringify(re).includes('token')) {
									console.log("token过期");
									this.$_tokens.mytoken.refreshToken();
								} else if (re.data[0] === null) {
									console.log("本学期结束了");
									this.isEnd = true;
									return;
								} else {
									for (let item of re.data) {
										if (item['kcsj'][0] == day) {
											let list = [];
											list.push(item['kcmc']);
											let time = item['kssj'] + '-' + item['jssj'];
											list.push(time);
											if (item['jsmc'] == null) {
												list.push("操场");
											} else {
												list.push(item['jsmc']);
											}
											a.classes.push(list);
										}
									}
									if (this.classes.length === 0) {
										this.hasClass = false;
									}
								}
							},
							complete: () => {
								this.isLoading = false;
							},
						});
					});
				} catch (e) {
					console.log("token过期");
				}
			}
		}
	}
</script>

<style>
	@import "@/static/iconfont.css";

	.timetable {
		/* margin: 10px 15px 0 15px; */
	}

	.skeleton_loading {
		border-radius: 15px;
		margin: 0 10px 10px 10px;
		padding: 0 0 0 0;
	}

	.skeleton {
		border-radius: 15px;
		padding: 0 0 0 0;
	}
</style>
