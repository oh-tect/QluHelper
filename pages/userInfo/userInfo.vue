<template>
	<view>
		<u-tabbar :value="value1" @change="change1" :fixed="true" :placeholder="false" :safeAreaInsetBottom="false">
			<u-tabbar-item text="首页" icon="home" @click="click1"></u-tabbar-item>
			<u-tabbar-item text="功能" icon="photo" @click="click1"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account" @click="click1"></u-tabbar-item>
		</u-tabbar>
		<view class="userinfo">
			<uni-card :is-shadow='false' is-full :border="false">
				<template v-slot:title>
					<uni-list>
						<uni-section title="登录信息" type="line"></uni-section>
					</uni-list>
				</template>
				<uni-list>
					<uni-list-item title='姓名:'>
						<text slot="footer">{{studentName}}</text>
					</uni-list-item>
					<uni-list-item title='学号:'>
						<text slot="footer">{{studentID}}</text>
					</uni-list-item>
					<uni-list-item title='学院:'>
						<text slot="footer">{{department}}</text>
					</uni-list-item>
					<uni-list-item title='专业:'>
						<text slot="footer">{{major}}</text>
					</uni-list-item>
					<uni-list-item title=''>
						<text slot="footer"></text>
					</uni-list-item>
				</uni-list>
				<button type="primary" @click="logout">退出登录</button>
				<!-- <view class="items">
					<view class="item">
						<view class="label">
							<text>姓名：</text>
						</view>
						<view class="text">
							素数筛
						</view>
					</view>
					<view class="item">
						<view class="label">
							<text>姓名：</text>
						</view>
						<view class="text">
							素数筛
						</view>
					</view>
				</view> -->
			</uni-card>
			<uni-card :is-shadow="false" is-full :border="false">
				<uni-list>
					<uni-list-item showArrow="true" title="关于此软件"></uni-list-item>
				</uni-list>
			</uni-card>
			<uni-card :is-shadow="false">
				<template v-slot:title>
					<uni-list>
						<uni-section title="注意事项" type="line"></uni-section>
					</uni-list>
				</template>
				1.本软件系个人业余完成项目，更新时间不定。
				2.如果数据获取与齐鲁工业大学教务系统有偏差，以齐鲁工业大学教务系统为准。
			</uni-card>
		</view>
	</view>
</template>

<script>
	import {
		getKaoyan_date
	} from '../../util/date';
	export default {
		data() {
			return {
				value1: 2,
				studentID: '加载中...',
				department: '加载中...',
				studentName: '加载中...',
				major: '加载中...'
			}
		},
		onLoad() {
			console.log("是否登录:" + getApp().globalData.isLogin);
			let username = uni.getStorageSync("username");
			let token = uni.getStorageSync('token');
			let that = this;
			if (username && token) {
				new Promise((resolve, reject) => {
					uni.request({
						url: 'http://jwxt.qlu.edu.cn/app.do',
						method: 'GET',
						data: {
							'method': 'getUserInfo',
							'xh': username
						},
						header: {
							'token': token
						},
						success: (re) => {
							console.log(re);
							if (JSON.stringify(re).includes('token')) {
								console.log('token过期');
								this.$_tokens.mytoken.refreshToken();
							} else {
								this.studentName = re.data['xm'];
								that.studentID = re.data['xh'];
								that.department = re.data['yxmc'];
								that.major = re.data['zymc'];
							}

						}
					});

				});
			} else {
				console.log("获取信息失败,没有username和password");
			}


		},
		methods: {
			change1: function(e) {
				if (e == 0) {
					uni.redirectTo({
						url: "/pages/index/index"
					});
				} else if (e == 1) {
					uni.redirectTo({
						url: '/pages/function/function'
					})
				}
			},
			logout: function() {
				uni.removeStorageSync('token');
				getApp().globalData.isLogin = 0;
				uni.showToast({
					title: "注销成功！",
					duration: 3000
				});
				uni.redirectTo({
					url: '/pages/login/login'
				});
			}
		}
	}
</script>

<style>
	.userinfo {}

	.items {
		display: flex;
		flex-direction: column;
	}

	.item {
		display: flex;
		font-size: 15px;
		flex: 1;
	}

	.item .text {
		flex: 3;
		display: inline-block;
		text-align: center;
	}

	.item .label {
		flex: 1;
		text-align: center;
	}
</style>
