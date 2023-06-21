

/**
 * 时间问候语
 * @param param 当前时间，new Date() 格式
 * @description param 调用 `formatAxis(new Date())` 输出 `上午好`
 * @returns 返回拼接后的时间字符串
 */
export function formatAxis(param) {
    let hour = new Date(param).getHours();
    if (hour < 6) return '凌晨好';
    else if (hour < 9) return '早上好';
    else if (hour < 12) return '上午好';
    else if (hour < 14) return '中午好';
    else if (hour < 17) return '下午好';
    else if (hour < 19) return '傍晚好';
    else if (hour < 22) return '晚上好';
    else return '夜里好';
}

export function formatDate(date, format) {
    let we = date.getDay(); // 星期
    let z = getWeek(date); // 周
    let qut = Math.floor((date.getMonth() + 3) / 3).toString(); // 季度
    const opt = {
        'Y+': date.getFullYear().toString(), // 年
        'm+': (date.getMonth() + 1).toString(), // 月(月份从0开始，要+1)
        'd+': date.getDate().toString(), // 日
        'H+': date.getHours().toString(), // 时
        'M+': date.getMinutes().toString(), // 分
        'S+': date.getSeconds().toString(), // 秒
        'q+': qut, // 季度
    };
    // 中文数字 (星期)
    const week = {
        '0': '日',
        '1': '一',
        '2': '二',
        '3': '三',
        '4': '四',
        '5': '五',
        '6': '六',
    };
    // 中文数字（季度）
    const quarter = {
        '1': '一',
        '2': '二',
        '3': '三',
        '4': '四',
    };
    if (/(W+)/.test(format))
        format = format.replace(RegExp.$1, RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '星期' + week[we] : '周' + week[we]) : week[we]);
    if (/(Q+)/.test(format)) format = format.replace(RegExp.$1, RegExp.$1.length === 4 ? '第' + quarter[qut] + '季度' : quarter[qut]);
    if (/(Z+)/.test(format)) format = format.replace(RegExp.$1, RegExp.$1.length === 3 ? '第' + z + '周' : z + '');
    for (let k in opt) {
        let r = new RegExp('(' + k + ')').exec(format);
        // 若输入的长度不为1，则前面补零
        if (r) format = format.replace(r[1], RegExp.$1.length === 1 ? opt[k] : opt[k].padStart(RegExp.$1.length, '0'));
    }
    return format;
}

export function getWeek(dateTime) {
    let temptTime = new Date(dateTime.getTime());
    // 周几
    let weekday = temptTime.getDay() || 7;
    // 周1+5天=周六
    temptTime.setDate(temptTime.getDate() - weekday + 1 + 5);
    let firstDay = new Date(temptTime.getFullYear(), 0, 1);
    let dayOfWeek = firstDay.getDay();
    let spendDay = 1;
    if (dayOfWeek !== 0) spendDay = 7 - dayOfWeek + 1;
    firstDay = new Date(temptTime.getFullYear(), 0, 1 + spendDay);
    let d = Math.ceil((temptTime.valueOf() - firstDay.valueOf()) / 86400000);
    return Math.ceil(d / 7);
}

