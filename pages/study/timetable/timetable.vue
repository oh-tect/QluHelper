<template>
	<view>
		<view class="timetable">
			<chenmushan-weekCalendar :prevActive="true" :nextActive="true" @changeDate="change">

			</chenmushan-weekCalendar>
			<view v-if="isEnd">
				<view class="u-demo-block__content">
					<u-col justify="center" align="center" style="height: 400px;">
						<text style="color: rgb(94, 121, 135);">本学期已结束 (≧▽≦)</text>
					</u-col>
				</view>
			</view>
			<view v-if="!hasClass">
				<view class="u-demo-block__content">
					<u-col justify="center" align="center" style="height: 400px;">
						<text style="color: rgb(94, 121, 135);">今天没有课~ 休息一下吧</text>
					</u-col>
				</view>
			</view>
			<view v-else class="u-flex" style="margin: 0 10x 0 10px;" v-for="(item, index) in classes" :key="index">
				<classCard v-bind:subject="item[0]" v-bind:time="item[1]" v-bind:position="item[2]"></classCard>
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
				date: '2022-11-22',
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
				hasClass: true
			}
		},
		components: {
			classCard
		},
		onLoad() {

			this.date = this.$mydate.getNowFormatDate();
			this.week = this.$mydate.getWeek(this.date);
			this.day = this.$mydate.getDay(this.date);
			console.log("现在是第" + this.week + "周");
			this.username = uni.getStorageSync("username");
			this.token = uni.getStorageSync("token");

			this.getClassTable(this.week, this.day, this.username, this.token);
			// try {
			// 	new Promise((resolve, reject) => {
			// 		uni.request({
			// 			url: "http://jwxt.qlu.edu.cn/app.do",
			// 			method: "GET",
			// 			data: {
			// 				"xh": username,
			// 				"method": "getKbcxAzc",
			// 				"xnxqid": "2022-2023-1",
			// 				"zc": that.week
			// 			},
			// 			header: {
			// 				"token": token
			// 			},
			// 			success: (re) => {
			// 				console.log(re);
			// 				for (let item of re.data) {
			// 					if (item['kcsj'][0] == that.day) {
			// 						let list = [];
			// 						list.push(item['kcmc']);
			// 						let time = item['kssj'] + '-' + item['jssj'];
			// 						list.push(time);
			// 						list.push(item['jsmc']);
			// 						that.classes.push(list);
			// 					}
			// 				}
			// 				console.log(that.class);
			// 			}

			// 		})
			// 	});
			// } catch (e) {

			// }
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
			// //获取给定日期相对于开学日期的周数
			// getWeek: function(date) {
			// 	let before = new Date(getApp().globalData.start_date).getTime();
			// 	let after = new Date(date).getTime();
			// 	return parseInt((after - before) / (1000 * 60 * 60 * 24 * 7)) + 1;
			// },
			// //获取给定日期是星期几
			// getDay: function(date) {
			// 	let re = new Date(date).getDay();
			// 	return re === 0 ? 7 : re;
			// },
			// //获取yyyy-MM-dd格式的时间
			// getNowFormatDate: function() {
			// 	let date = new Date(),
			// 		year = date.getFullYear(), //获取完整的年份(4位)
			// 		month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
			// 		strDate = date.getDate() // 获取当前日(1-31)
			// 	if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
			// 	if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0

			// 	return `${year}-${month}-${strDate}`;
			// },
			getClassTable: function(week, day, username, token) {
				var a = this;
				this.isEnd = false;
				this.hasClass = true;
				try {
					new Promise((resolve, reject) => {
						uni.request({
							url: "http://jwxt.qlu.edu.cn/app.do",
							method: "GET",
							data: {
								"xh": username,
								"method": "getKbcxAzc",
								"xnxqid": "2022-2023-1",
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
											list.push(item['jsmc']);
											a.classes.push(list);
										}
									}
									if (this.classes.length === 0) {
										this.hasClass = false;
									}
								}
							}
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

	.card {}
</style>
