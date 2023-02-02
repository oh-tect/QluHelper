<template>
	<view>
		<u-tabbar :value="value1" @change="change1" :fixed="true" :placeholder="false" :safeAreaInsetBottom="false">
			<u-tabbar-item text="首页" icon="home" @click="click1"></u-tabbar-item>
			<u-tabbar-item text="功能" icon="photo" @click="click1"></u-tabbar-item>
			<u-tabbar-item text="我的" icon="account" @click="click1"></u-tabbar-item>
		</u-tabbar>

		<uni-card title="">
			<template v-slot:title>
				<uni-list>
					<uni-section title="学习" type="line"></uni-section>
				</uni-list>
			</template>
			<view class="grid">
				<u-grid :border="true" @click="click" col="3">
					<u-grid-item v-for="(baseListItem,baseListIndex) in baseList1" :key="baseListIndex">
						<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="baseListItem.name" :size="22"></u-icon>
						<text class="grid-text">{{baseListItem.title}}</text>
					</u-grid-item>
				</u-grid>
				<u-toast ref="uToast" />
			</view>
		</uni-card>
		<uni-card>
			<template v-slot:title>
				<uni-list>
					<uni-section title="生活" type="line"></uni-section>

				</uni-list>
			</template>

			<u-grid :border="true" @click="click" col="3">
				<u-grid-item v-for="(baseListItem,baseListIndex) in baselist2" :key="baseListIndex">
					<u-icon :customStyle="{paddingTop:20+'rpx'}" :name="baseListItem.name" :size="22"></u-icon>
					<text class="grid-text">{{baseListItem.title}}</text>
				</u-grid-item>
			</u-grid>
			<u-toast ref="uToast" />
		</uni-card>
	</view>
</template>

<script>
	import gradeCard from "../../components/gradeCard/gradeCard.vue"
	export default {
		data() {
			return {
				value1: 1,
				baseList1: [{
						name: '/static/icon/grade.png',
						title: '成绩查询'
					},
					{
						name: '/static/icon/classroom.png',
						title: '空教室'
					},
					{
						name: '/static/icon/classtable.png',
						title: '课程表'
					},
					{
						name: '/static/icon/time.png',
						title: '考试安排'
					},
					{
						name: '/static/icon/library.png',
						title: '图书馆预约'
					},
					{
						name: '',
						title: ''
					}
				],
				baselist2: [{
						name: '/static/icon/feedback.png',
						title: '意见反馈'
					},
					{
						name: '/static/icon/expect.png',
						title: '敬请期待'
					}
				]
			}
		},
		onLoad() {
			uni.hideTabBar();
			console.log("是否登录:" + getApp().globalData.isLogin);
		},
		methods: {
			change1: function(e) {
				if (e == 0) {
					uni.switchTab({
						url: '/pages/index/index'

					});
				} else if (e == 2) {
					if (uni.getStorageSync('isLogin') !== 1) {
						uni.switchTab({
							url: '/pages/login/login'

						});
					} else {
						uni.switchTab({
							url: '/pages/userInfo/userInfo'

						});
					}
				}
			},
			click1: function() {},
			click: function(e) {
				switch (e) {
					case 0: {
						if (uni.getStorageSync('isLogin') != 1) {
							uni.showToast({
								title: '请先登录',
								duration: 3000,
								icon: "error"
							});
						} else {
							uni.navigateTo({
								url: "/pages/study/queryGrades/queryGrades"
							});
						}
						break;
					}
					case 1: {
						if (uni.getStorageSync('isLogin') != 1) {
							uni.showToast({
								title: '请先登录',
								duration: 3000,
								icon: "error"
							});
						} else {
							uni.navigateTo({
								url: "/pages/study/empty-classroom/empty-classroom"
							});
						}
						break;
					}
					case 2: {
						// if (getApp().globalData.isLogin == 0) {
						// 	uni.showToast({
						// 		title: '请先登录',
						// 		duration: 3000,
						// 		icon: "error"
						// 	});
						// } else {
						if (uni.getStorageSync('isLogin') != 1) {
							uni.showToast({
								title: '请先登录',
								duration: 3000,
								icon: "error"
							});
						} else {
							uni.navigateTo({
								url: "/pages/study/timetable/timetable"
							});
						}
						break;
					}
					case 3: {
						break;
					}
					case 4: {
						break;
					}
				}
			}
		},
		components: {
			gradeCard
		}
	}
</script>

<style>
	.grid-text {
		font-size: 13px;
		color: #909399;
		padding: 13rpx 0 20rpx 0rpx;
		/* #ifndef APP-PLUS */
		box-sizing: border-box;
		/* #endif */
	}
</style>
