var tower = {
    run: function(tower) {
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
        // 保留100的能量
        if(damagedStructs.length > 0 && tower.store[RESOURCE_ENERGY] > 100){
            tower.repair(damagedStructs[0]);
            return;
        }
    },
};
module.exports = tower;