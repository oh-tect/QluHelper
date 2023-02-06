<template>
	<view>
		<uni-section title="设置查询时间" type="circle"></uni-section>
		<uni-card :is-shadow='false' is-full :border="false">
			<lb-picker :list="list" mode="unlinkedSelector" @confirm="handleChange" v-model="value">
				<uni-list>
					<uni-list-item title="日期和时间 " :rightText="originDate + ' ' + orginTime + '节'">
					</uni-list-item>
				</uni-list>
			</lb-picker>
			<uni-card is-full :border="false" :is-shadow="false" padding="10px 0 0 0" style="margin-top: 10px;">
				<u-row>
					<u-col span="12">
						<u-radio-group v-model="radiovalue1" @change="radiochange">
							<u-radio label="长清校区" name="长清校区" style="margin-right: 10px;">
							</u-radio>
							<u-radio label="历城校区" name="历城校区" style="margin-right: 10px;">
							</u-radio>
							<u-radio label="彩石校区" name="彩石校区" style="margin-right: 10px;">
							</u-radio>
						</u-radio-group>
					</u-col>
				</u-row>
			</uni-card>
		</uni-card>

		<uni-card class="card">
			<template v-slot:title>
				<uni-section type="line" :title="originDate + ' ' + orginTime + '节'"></uni-section>
			</template>
			<uni-section type="circle" title="1号公教楼"></uni-section>
			<view v-for="(item, index) in firstTeachingBuilding" :key="Math.random()" class="tag">
				<uni-tag :text="item" size="mini" type="primary"></uni-tag>
			</view>
			<uni-section type="circle" title="2号公教楼"></uni-section>
			<view v-for="(item, index) in secondTeachingBuilding" :key="Math.random()" class="tag">
				<uni-tag :text="item" size="mini" type="primary"></uni-tag>
			</view>
		</uni-card>
	</view>
</template>

<script>
	import LbPicker from '@/components/lb-picker'
	export default {
		data() {
			return {
				//星期+时间的形式
				list: [],
				//星期列表，从今天开始
				day_list: [],
				value: [],
				//yyyy-MM-dd形式日期
				date: "",
				//时间（1-2）
				idleTime: "",
				//原始形式的时间
				orginTime: '1-2',
				//原始形式的星期
				originDate: '',
				emptyClassroomList: [],
				choosen: '长清校区',
				radioList: [{
						name: '长清校区',
						disabled: 'false'
					},
					{
						name: '历城校区',
						disabled: 'false'
					},
					{
						name: '彩石校区',
						disabled: 'false'
					}
				],
				radiovalue1: '长清校区',
				firstTeachingBuilding: [],
				secondTeachingBuilding: [],
			}
		},
		components: {
			LbPicker
		},
		onLoad() {
			let day = this.$mydate.getDay(getApp().globalData.date);
			console.log(day);
			let days = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];
			let day_list = [];
			for (let i = day - 1; i < day + 6; i++) {
				day_list.push(days[i % 7]);
			}
			this.day_list = day_list;
			let classes = ['1-2', '3-4', '5-6', '7-8', '9-10'];
			this.list.push(day_list);
			this.list.push(classes);
			this.value.push(this.list[0][0]);
			this.value.push(this.list[1][0]);
			this.originDate = this.list[0][0];
			let dates = new Date(getApp().globalData.date);
			this.date = this.$mydate.getNowFormatDate(dates);
			this.idleTime = '0102';
			let token = uni.getStorageSync('token');
			this.getAllClassroom(token);
		},
		methods: {
			handleChange: function(item) {
				let time1 = String(item.item[1])[0];
				let time2 = String(item.item[1]).substring(2);
				this.orginTime = item.item[1];
				this.originDate = item.item[0];
				if (time2.length === 2) {
					this.idleTime = '0' + time1 + time2;
				} else {
					this.idleTime = '0' + time1 + '0' + time2;
				}
				console.log(this.idleTime);
				//获取选择的日期是几天过后
				let afterDays = 0;
				for (let i = 0; i < 7; i++) {
					if (this.day_list[i] == this.originDate) {
						afterDays = i;
						break;
					}
				}
				let dates = new Date(getApp().globalData.date);
				dates.setDate(dates.getDate() + afterDays);
				this.date = this.$mydate.getNowFormatDate(dates);
				console.log(this.date);
				let token = uni.getStorageSync('token');
				this.getAllClassroom(token);
			},
			radiochange: function(e) {
				this.choosen = e;
			},
			getAllClassroom: function(token) {
				var that = this;
				this.firstTeachingBuilding = [];
				this.secondTeachingBuilding = [];
				this.emptyClassroomList = [];
				new Promise((resolve, reject) => {
					try {
						uni.request({
							url: "http://jwxt.qlu.edu.cn/app.do",
							method: 'GET',
							data: {
								"method": "getKxJscx",
								"time": that.date,
								"idleTime": that.idleTime
							},
							header: {
								"token": token
							},
							success: (re) => {
								console.log(re);
								if (JSON.stringify(re.data).includes("token")) {
									console.log("token过期");
								} else {
									for (let item of re.data) {
										if (String(item['jxl']) === '长清校区-1号公教楼' || String(item[
												'jxl']) ===
											'长清校区-2号公教楼') {
											for (let items of item['jsList']) {
												that.emptyClassroomList.push(items['jsmc']);
											}
										}
									}
									for (let item of that.emptyClassroomList) {
										if (String(item).includes("1号公教楼")) {
											that.firstTeachingBuilding.push(String(item).substring(
												5));
										} else {
											that.secondTeachingBuilding.push(String(item)
												.substring(
													5));
										}
									}
								}
							}
						})
					} catch (e) {
						//TODO handle the exception
					}
				});
			}
		}
	}
</script>

<style>
	.show {}

	.tag {
		display: inline-block;
		margin-top: 5px;
		margin-left: 5px;
	}

	.card {
		border-radius: 15px;
	}
</style>
