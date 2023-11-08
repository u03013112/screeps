// 输入role，名字就简单的按照role+数字的方式来命名
// 其中数字从1开始，尽可能的小，这样可以保证用名字来做离散比较均匀

var nameManager = {
    /** @param {string} role :类似 harvester or upgrader**/ 
    getName: function(role) {
        // 暂时只支持到100个
        for (var i = 1; i < 100; i++) {
            var name = role + i;
            if (!Game.creeps[name]) {
                return name;
            }
            
        }

        console.log('No name available for role: ' + role);
        return '';
    },
}

module.exports = nameManager;