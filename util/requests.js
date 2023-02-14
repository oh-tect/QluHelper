const getClassTable = async function(week, day, username, token) {
	getApp().globalData.isEnd = false;
	getApp().globalData.hasClass = true;
	try {
		return new Promise((resolve, reject) => {
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
						// this.$_tokens.mytoken.refreshToken();
					} else if (re.data[0] === null) {
						console.log("本学期结束了");
						getApp().globalData.isEnd = true;
						return;
					} else {
						let result = [];
						for (let item of re.data) {
							if (item['kcsj'][0] == day) {
								let list = [];
								list.push(item['kcmc']);
								let time = item['kssj'] + '-' + item['jssj'];
								list.push(time);
								list.push(item['jsmc']);
								result.push(list);
							}
						}

						getApp().globalData.classes = result;

						if (getApp().globalData.classes.length === 0) {
							getApp().globalData.hasClass = false;
						}
					}
					resolve();
				},
				complete: () => {

				}
			});
		});
	} catch (e) {
		console.log("token过期");
	}
}

const getPoem = async function() {
	return new Promise((resolve, reject) => {
		uni.request({
			url: 'https://v1.jinrishici.com/all.json',
			method: 'GET',
			success: (e) => {
				getApp().globalData.saying = e.data['content'];
				getApp().globalData.author = e.data['author'];
				getApp().globalData.origin = e.data['origin'];
				resolve();
			},
			fail: () => {
				getApp().globalData.saying = '请求错误，请稍后再试。';
				reject();
			},
			complete: (e) => {

			}
		});
	});
}

const getWeather = function() {
	new Promise((resolve, reject) => {
		uni.request({
			url: 'https://api.seniverse.com/v3/weather/daily.json',
			data: {
				'key': 'Sp7w-2_Jj1AdF1MHH',
				'location': '济南',
				'language': 'zh-Hans',
				'unit': 'c',
				'start': '0',
				'days': '2'
			},
			success: (re) => {
				for (let i of re.data['results'][0]['daily']) {
					let data = [];
					data.push(i.text_day);
					data.push(i.high);
					data.push(i.low);
					data.push(i.code_day);
					getApp().globalData.weather_data.push(data);
				}
				for (let i of getApp().globalData.weather_data) {
					getApp().globalData.weather.push(i[0]);
					getApp().globalData.high.push(i[1]);
					getApp().globalData.low.push(i[2]);
					getApp().globalData.code.push(i[3]);
				}
			}
		});
	});
}

module.exports = {
	getClassTable,
	getPoem,
	getWeather
}
