const refreshToken = async function() {
	console.log("[开始刷新token...]")
	let username = uni.getStorageSync('username');
	let password = uni.getStorageSync('password');
	if (username && password) {
		uni.request({
			url: 'http://jwxt.qlu.edu.cn/app.do',
			method: 'GET',
			data: {
				'method': 'authUser',
				'xh': this.username,
				'pwd': this.password
			},
			success: (re) => {
				console.log("请求成功");
				uni.setStorageSync('token', re.data['token']);
			},
			fail: () => {
				console.log("失败");
			}
		});
	} else {
		console.log("刷新失败");
	}
}

const getToken = function() {
	return uni.getStorageSync('token');
}

let mytoken = {
	'refreshToken': refreshToken,
	'getToken': getToken
}

module.exports = {
	mytoken
}
