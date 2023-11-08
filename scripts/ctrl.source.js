var source = {
    // 暂时简单负载，即按照顺序的返回所有的source
    // 比如一共有2个source，第一次返回source[0]，第二次返回source[1]，第三次返回source[0]，以此类推
    getSource: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var index = Memory.sourceIndex;
        if (index == undefined) {
            index = 0;
        }
        Memory.sourceIndex = (index + 1) % sources.length;
        return sources[index];
    },
    // 简单的负载放哪，直接用creep的id进行离散（直接取模），这种方案的好处是creep不用存储目标id
    // 也不存在走在路上资源没有了的问题。
    // 但是目前这个方案并不均衡，改为用名字后缀的数字进行离散 
    getSource2: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var lastChar = creep.name.slice(-1); // 获取名字的最后一个字符
        var index = parseInt(lastChar, 10); // 尝试将字符转换为数字
        if (isNaN(index)) { // 如果转换失败，将index设为0
            index = 0;
        }
        index = index % sources.length;
        return sources[index];
    },
}
module.exports = source;