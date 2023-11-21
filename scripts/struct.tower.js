var tower = {
    run: function(tower) {
        // 简单版本，目前抄https://raw.githubusercontent.com/screeps/tutorial-scripts/master/section5/main.js


        var hostiles = tower.room.find(FIND_HOSTILE_CREEPS);
        if(hostiles.length > 0) {
            // 优先攻击有治疗能力的敌人
            var healer = _.filter(hostiles, (creep) => creep.getActiveBodyparts(HEAL) > 0);
            if(healer.length > 0){
                tower.attack(healer[0]);
                return;
            }else{
                // 随机攻击一个敌人
                var index = Math.floor(Math.random() * hostiles.length);
                tower.attack(hostiles[index]);
                return;
            }

            return;
        }

        // 优先修复血量最低的建筑
        var damagedStructs = tower.room.find(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < (structure.hitsMax - 800)
        });
        damagedStructs.sort((a,b) => a.hits - b.hits);
        if(damagedStructs.length > 0){
            tower.repair(damagedStructs[0]);
            return;
        }
    },
};
module.exports = tower;