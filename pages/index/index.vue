<template>
	<view>
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<u-tabbar :value="value1" @change="change1" :fixed="true" :placeholder="false" :safeAreaInsetBottom="true">
			<u-tabbar-item text="首页" icon="home" @click="click1"></u-tabbar-item>
			<u-tabbar-item text="功能" icon="photo" @click="click1"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account" @click="click1"></u-tabbar-item>
		</u-tabbar>
		<uni-card class="card">
			<template v-slot:title>
				<uni-section title="考研倒计时" type="line"></uni-section>
			</template>
			<view class="kaoyan_text">
				距离2023年考研还有:
			</view>

			<!-- 24 * 60 * 60 * 1000 * 365 24924673000-->
			<view class="countdown">
				<u-count-down :time="getDate" format="DD:HH:mm:ss" autoStart millisecond @change="onChange">
					<view class="time">
						<view class="time_custom">
							<text class="time__item">{{ timeData.days }}</text>
						</view>
						<text class="time_text">天</text>
						<view class="time_custom">
							<text class="time__item">{{timeData.hours>=10?timeData.hours:'0'+timeData.hours}}</text>
						</view>
						<text class="time_text">时</text>
						<view class="time_custom">
							<text class="time__item">{{timeData.minutes}}</text>
						</view>
						<text class="time_text">分</text>
						<view class="time_custom">
							<text class="time__item">{{timeData.seconds}}</text>
						</view>
						<text class="time_text">秒</text>
					</view>
				</u-count-down>
			</view>
		</uni-card>

		<view class="next_class">
			<uni-card class="card">
				<template v-slot:title>
					<uni-section title="下一节课" type="line"></uni-section>
				</template>
				<view v-if="hasClass && token != -1">
					<u-row class="">
						<u-col span="7">
							<uni-section v-bind:title="nextClassName" v-bind:subTitle="nextClassTime"
								subTitleFontSize='15px' type="circle">
							</uni-section>
						</u-col>
						<u-col align="center" justify="center" span="5">
							{{nextClassPosition}}
						</u-col>
					</u-row>
				</view>
				<view v-else-if="(token == -1 || token == null || token == ' ')">
					<view style="text-align: center; margin: 20px 0 20px 0;">
						<text>登录后获取信息....</text>
					</view>
				</view>
				<view v-else style="text-align: center; margin: 20px 0 20px 0;">
					<text>今天没有课咯~ (≧ω≦)</text>
				</view>
			</uni-card>
		</view>

		<view class="saying">
			<uni-card class="card">
				<template v-slot:title>
					<uni-section title="每日诗词" type="line"></uni-section>
				</template>
				<view class="saying">
					<text>{{saying}}</text>
				</view>
				<view class="from">
					<text>{{author}} 《{{origin}}》</text>
				</view>
			</uni-card>
		</view>

		<view class="weather">
			<uni-card class="card">
				<template v-slot:title>
					<uni-section title="今明天气" type="line"></uni-section>
				</template>
				<view class="split">
					<view class="item">
						<view class="icon_class">
							<image :src="bindIcon(code[0])" style="width: 30px; height: 30px;"></image>
						</view>

						<view class="weather_text">
							<text>{{weather[0]}}</text>
							<text>\n{{low[0]}}℃</text>
							至
							<text>{{high[0]}}℃</text>
						</view>
					</view>
					<view class='item'>
						<view class="icon_class">
							<image :src="bindIcon(code[1])" style="width: 30px; height: 30px;"></image>
						</view>
						<view class="weather_text">
							<text>{{weather[1]}}</text>
							<text space="nbsp" decode="true">\n{{low[1]}}℃ &nbsp;</text>
							至
							<text space="nbsp" decode="true">{{high[1]}}℃ </text>
						</view>
					</view>
				</view>
			</uni-card>
		</view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				title: '测试',
				tabbar: '',
				value1: 0,
				//时间数据
				timeData: {},
				//诗词
				saying: '',
				author: '',
				//来源
				origin: '',
				//天气
				weather: [],
				//高气温
				high: [],
				//低气温
				low: [],
				//天气代码
				code: [],
				//天气数据
				weather_data: [],
				getDate: '',
				//当前日期，测试在这里修改
				date: '2022-11-22 10:45',
				//当前日期是第几周
				week: '',
				//当前日期是星期几
				day: '',
				//保存课程的list
				classes: [],
				username: '',
				token: '',
				//下一节课开始时间
				ClassStartTime: [],
				//下一节课名称，以下同理
				nextClassName: '',
				nextClassTime: '',
				nextClassPosition: '',
				//学期是否结束
				isEnd: false,
				//是否有课
				hasClass: Boolean,
			}
		},
		computed: {
			isLogin: function() {
				return uni.getStorageSync('isLogin');
			}
		},
		async onShow() {
			uni.hideTabBar();
			console.log("是否登录:" + uni.getStorageSync('isLogin'));
			this.getDate = this.$mydate.getKaoyan_date('2023');
			this.saying = '加载中...';
			//加载诗词
			await this.$requests.getPoem();
			this.saying = getApp().globalData.saying;
			this.author = getApp().globalData.author;
			this.origin = getApp().globalData.origin;
			//加载天气
			this.$requests.getWeather();
			this.weather = getApp().globalData.weather;
			this.high = getApp().globalData.high;
			this.low = getApp().globalData.low;
			this.code = getApp().globalData.code;
			this.weather_data = getApp().globalData.weather_data;
			//加载下一节课及初始化
			// this.date = this.$mydate.getNowFormatDate();
			this.week = this.$mydate.getWeek(this.date);
			this.day = this.$mydate.getDay(this.date);
			this.token = uni.getStorageSync('token');
			console.log(this.token);
			if (this.token == -1 || uni.getStorageSync('isLogin') == 0) {
				console.log("没有登录");
				getApp().globalData.isLogin = 0;
			} else {
				this.username = uni.getStorageSync('username');

				await this.$requests.getClassTable(this.week, this.day, this.username, this.token);
				console.log(getApp().globalData.classes);
				//获取下一节课信息
				console.log(getApp().globalData.classes.length)
				this.hasClass = getApp().globalData.hasClass;
				if (getApp().globalData.classes != null) {
					for (let item of getApp().globalData.classes) {
						let start = String(item[1]).slice(0, 5);
						let date = this.date.slice(0, 10) + ' ' + start;
						let startTimeStamp = new Date(date).getTime();
						if (new Date(this.date).getTime() - startTimeStamp < 0) {
							this.nextClassName = item[0];
							this.nextClassTime = item[1];
							this.nextClassPosition = item[2];
							this.hasClass = true;
							break;
						}
					}
					if (!getApp().globalData.hasClass) {
						console.log("没有课啦")
					} else {
						console.log(this.nextClassName);
					}
				}
			}
			console.log("hasClass: " + this.hasClass);
		},
		methods: {
			cli: function() {
				console.log('测试');
			},

			click1: function(e) {
				if (e === 1) {
					uni.switchTab({
						url: '/pages/function/function',
					});

				} else if (e == 2) {
					if (uni.getStorageSync('isLogin') !== 1) {
						uni.switchTab({
							url: '/pages/login/login'
						});
					} else {
						uni.switchTab({
							url: "/pages/userInfo/userInfo"
						});
					}
				}
			},
			onChange: function(e) {
				this.timeData = e;
			},
			bindIcon: function(icon) {
				return '../../static/weather/' + icon + '.svg';
			},
			//获取yyyy-MM-dd hh:mm时间
			getTime: function() {
				var now = new Date();
				var year = now.getFullYear(); //得到年份
				var month = now.getMonth(); //得到月份
				var date = now.getDate(); //得到日期
				var day = now.getDay(); //得到周几
				var hour = now.getHours(); //得到小时
				var minu = now.getMinutes(); //得到分钟
				var sec = now.getSeconds(); //得到秒
				month = month + 1;
				if (month < 10) month = "0" + month;
				if (date < 10) date = "0" + date;
				if (hour < 10) hour = "0" + hour;
				if (minu < 10) minu = "0" + minu;
				if (sec < 10) sec = "0" + sec;
				var time = "";
				//精确到天
				time = year + "-" + month + "-" + date + " " + hour + ":" + minu;
				// return time;
				console.log(time)
				return time
			}
		}
	}
</script>

<style>
	.kaoyan_text {
		color: #2f3640;
		font-size: 15px;
		font-weight: bold;
		text-align: center;
	}

	.countdown {
		display: flex;
		text-align: center;
		justify-content: center;
		align-items: center;
		margin-top: 15px;
		margin-bottom: 15px;
	}

	.time {
		display: flex;
		align-items: center;
	}

	.time_custom {
		display: flex;
		justify-content: center;
		align-items: center;
		color: #f5f6fa;
		background-color: rgb(94, 121, 135);
		/*#54a0ff */
		font-size: 18px;
		width: 40px;
		height: 40px;
		border-radius: 4px;
	}

	.time_text {
		color: #2f3640;
		font-weight: bold;
		padding-left: 5px;
		padding-right: 5px;
	}

	.split {
		display: flex;
		flex-direction: row;
	}

	.item {
		flex: 1;
		padding-top: 10px;
	}

	.icon_class {
		height: 30px;
		text-align: center;
		align-items: center;
		justify-content: center;
	}

	.weather_text {
		display: block;
		text-align: center;
		margin-top: 10px;
	}

	.card {
		border-radius: 15px !important;
	}

	.weather_number {
		display: inline-block;
		margin-left: 5px;
		margin-right: 5px;
	}

	.saying {
		color: #2f3640;
	}

	.from {
		margin-top: 10px;
		color: #2f3640;
		text-align: end;
	}
</style>
