const refreshToken = function() {
	// 3 秒就判定超时
	// const timeout = function() {
	// 	return new Promise((resolve, reject) => {
	// 		setTimeout(() => {
	// 			reject(0);
	// 		}, 2000);
	// 	});
	// }
	// 刷新用函数
	// const refresh = function() {
	console.log("[开始刷新token...]");
	let username = uni.getStorageSync('username');
	let password = uni.getStorageSync('password');
	if (username && password) {
		// return new Promise((resolve, reject) => {
		uni.request({
			url: 'http://jwxt.qlu.edu.cn/app.do',
			method: 'GET',
			data: {
				'method': 'authUser',
				'xh': username,
				'pwd': password
			},
			success: (re) => {
				console.log("刷新成功");
				console.log("新token是" + re.data['token']);
				uni.setStorageSync('token', re.data['token']);
			},
			fail: () => {}
		});
		// });
	} else {
		console.log("[刷新失败,找不到username和password]");
	}
	// }
	// Promise.race([refresh, timeout]).then(
	// 	function(d) {
	// 		console.log("true");
	// 	},
	// 	function(e) {

	// 		console.log("false");
	// 	}
	// );
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
