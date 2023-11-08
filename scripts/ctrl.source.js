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
    getSource2: function (creep) {
        var sources = creep.room.find(FIND_SOURCES);
        var lastThreeChars = creep.id.slice(-3); // 获取字符串的最后3个字符
        var idAsInt = parseInt(lastThreeChars, 16); // 将16进制字符串转换为整数
        var index = idAsInt % sources.length;
        console.log(creep.name + " [" + idAsInt + "] " + ":" + index)
        return sources[index];
    },
}
module.exports = source;