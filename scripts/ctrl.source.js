var source = {
    // 暂时简单负载，即按照顺序的返回所有的source
    // 比如一共有2个source，第一次返回source[0]，第二次返回source[1]，第三次返回source[0]，以此类推
    getSource: function () {
        var sources = creep.room.find(FIND_SOURCES);
        var index = Memory.sourceIndex;
        if (index == undefined) {
            index = 0;
        }
        Memory.sourceIndex = (index + 1) % sources.length;
        return sources[index];
    }
}
moudle.exports = source;