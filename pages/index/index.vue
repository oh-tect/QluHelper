<template>
	<view>
		<!-- <image class="logo" src="/static/logo.png"></image> -->
		<!--用于显示模态框 -->
		<u-modal :show="show" @cancel="cancel" @confirm="refresh" :content='content' :showCancelButton="true"></u-modal>
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
				2024年考研倒计时
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
				<!--只有今天有课，已登录并且当前时间有课-->
				<view v-if="hasClass && token != -1 && nowHasClass == true">
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
				<!--没有登录的情况-->
				<view v-else-if="(token == -1 || token == null || token == ' ')">
					<view style="text-align: center; margin: 20px 0 20px 0;">
						<text>登录后获取信息....</text>
					</view>
				</view>
				<view v-else-if="nowHasClass == false" style="text-align: center; margin: 20px 0 20px 0;">
					<text>今天没有课咯~ (≧ω≦)</text>
				</view>
				<view v-else-if="day != dayBeforeUpdate" style="text-align: center; margin: 20px 0 20px 0;">
					<text>课表需要更新，请连接校园网后更新。</text>
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
				date: '',
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
				//更新课表前的日期，用于判断是否课表数据是否过期（非wifi环境无法更新课表）
				dayBeforeUpdate: '',
				//学期是否结束
				isEnd: false,
				//是否有课
				hasClass: Boolean,
				nowHasClass: false,
				//是否显示模态框
				show: false,
				//模态框显示内容
				content: "Token更新失败，请连接校园网后点击“确定”重试。"
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
			var network = '';
			//判定token是否过期
			if (new Date().getTime() - uni.getStorageSync("updateTime") > 0 && uni.getStorageSync('isLogin')) {
				console.log("[token过期，尝试更新token]");
				//获取当前网络状态
				uni.getNetworkType({
					success: (re) => {
						network = re.networkType;
					}
				});
				console.log(network);
				//网络不是wifi则判定没有连接校园网（忽略连接热点情况）
				if (network == 'wifi') {
					this.show = false;
					this.$_tokens.mytoken.refreshToken();
					uni.showToast({
						title: "token更新成功",
						duration: 3000,
						icon: 'none'
					});
					setTimeout(() => {
						//更新时间更新,在当前时间基础上再加一天
						uni.setStorageSync("updateTime", new Date().getTime() +
							24 * 60 * 60 * 1000);
					}, 6000);
				} else {
					this.show = true;
					console.log("token过期,已弹出模态框");
				}
			} else if (uni.getStorageSync('isLogin') && new Date().getTime() - uni.getStorageSync("updateTime") < 0) {
				uni.getNetworkType({
					success: (re) => {
						network = re.networkType;
					}
				});
				console.log(network);
				console.log("token还没过期");
			}

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
			let dates = new Date();
			this.date = this.$mydate.getNowFormatDate(dates);
			console.log("今天是" + this.date);
			this.week = this.$mydate.getWeek(this.date);
			console.log(this.week + "周");
			this.day = this.$mydate.getDay(this.date);
			this.token = uni.getStorageSync('token');
			//如果token为-1（过期）或没有登录
			if (this.token == -1 || uni.getStorageSync('isLogin') == 0) {
				console.log("没有登录或token过期");
				getApp().globalData.isLogin = 0;
			} else {
				this.username = uni.getStorageSync('username');
				//如果当前环境是校园网，可以进行课表更新。
				if (network == 'wifi') {
					await this.$requests.getClassTable(this.week, this.day, this.username, this.token);
					console.log(uni.getStorageSync("todayClasses"));
					//更新课表更新时间。
					this.dayBeforeUpdate = this.day;
				}
				//获取下一节课信息
				console.log("今天课数 " +
					uni.getStorageSync("todayClasses").length);
				this.hasClass = getApp().globalData.hasClass;
				//如果课程列表里不为空，则说明有课。
				if (uni.getStorageSync("todayClasses") != null) {
					this.nowHasClass = false;
					//遍历当日课表，寻找距离最近的下一节课
					console.log(uni.getStorageSync("todayClasses"));
					console.log(getApp().globalData.classes);
					for (let item of uni.getStorageSync("todayClasses")) {
						let start = String(item[1]).slice(0, 5);
						let date = this.date.slice(0, 10) + ' ' + start;
						let startTimeStamp = new Date(date).getTime();
						if (new Date().getTime() - startTimeStamp < 0) {
							this.nextClassName = item[0];
							this.nextClassTime = item[1];
							this.nextClassPosition = item[2];
							this.hasClass = true;
							this.nowHasClass = true;
							break;
						}
					}
					console.log(this.nowHasClass);
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
			},
			//弹出模态框后的刷新token
			refresh: async function() {
				var re = this.$_tokens.mytoken.refreshToken();
				let network = '';
				uni.getNetworkType({
					success: (re) => {
						network = re.networkType;
					}
				});
				console.log(network);
				if (network == 'wifi') {
					this.show = false;
					this.$_tokens.mytoken.refreshToken();
					uni.showToast({
						title: "token更新成功",
						duration: 3000,
						icon: 'none'
					});
					setTimeout(() => {
						//更新时间更新
						uni.setStorageSync("updateTime", new Date().getTime() +
							24 * 60 * 60 * 1000);
					}, 6000);
				} else {
					this.show = false;
					uni.showToast({
						title: "请确定是否连接校园网，或者退出重新登录",
						duration: 3000,
						icon: 'none'
					});
				}
			},
			cancel: function() {
				this.show = false;
			},

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
