// 所有的名字都在这里选，目前就是简单的顺序挑选

harvesterNameList = ['harvester1', 'harvester2', 'harvester3', 'harvester4'];
upgraderNameList = ['upgrader1', 'upgrader2', 'upgrader3', 'upgrader4'];

var nameManager = {
    /** @param {string} role :类似 harvester or upgrader**/ 
    getName: function(role) {
        if (role == 'harvester') {
            for (var name in harvesterNameList) {
                if (!Game.creeps[name]) {
                    return name;
                }
            }
        }
        if (role == 'upgrader') {
            for (var name in upgraderNameList) {
                if (!Game.creeps[name]) {
                    return name;
                }
            }
        }

        console.log('No name available for role: ' + role);
        return '';
    },
}

module.exports = nameManager;