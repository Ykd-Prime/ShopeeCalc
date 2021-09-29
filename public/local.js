// 简单封装的localstorage
let ls = {
    get: function (key) {
        return JSON.parse(localStorage.getItem(key))
    },

    //Todo版 默认为空数组
    getTodo: function (key) {
        return JSON.parse(localStorage.getItem(key) || "[]")
    },

    set: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value))
    },

    remove: function (key) {
        localStorage.removeItem(key)
    }
}

export default ls;

// 备忘例子
// let test = 2 
//存入
// ls.set("test",test)
//获取
// ls.get("test")