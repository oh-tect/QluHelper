//获取考研日期
const getKaoyan_date = (date) => {
	return Date.parse(new Date(date + '-11-08')) - Date.parse(new Date());
}

//获取季度
const getSeasonTime = (month) => {
	return (month / 3) + 1;
}

//获取yyyy-MM-dd格式的时间
const getNowFormatDate = () => {
	let date = new Date(),
		year = date.getFullYear(), //获取完整的年份(4位)
		month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
		strDate = date.getDate() // 获取当前日(1-31)
	if (month < 10) month = `0${month}` // 如果月份是个位数，在前面补0
	if (strDate < 10) strDate = `0${strDate}` // 如果日是个位数，在前面补0

	return `${year}-${month}-${strDate}`;
}

//获取给定日期是星期几
const getDay = (date) => {
	let re = new Date(date).getDay();
	return re === 0 ? 7 : re;
}

//获取给定日期相对于开学日期的周数
const getWeek = (date) => {
	let before = new Date(getApp().globalData.start_date).getTime();
	let after = new Date(date).getTime();
	return parseInt((after - before) / (1000 * 60 * 60 * 24 * 7)) + 1;
}

module.exports = {
	getKaoyan_date,
	getSeasonTime,
	getDay,
	getWeek,
	getNowFormatDate
};
