var tower = {
    run: function(tower) {
        // 简单版本，目前抄https://raw.githubusercontent.com/screeps/tutorial-scripts/master/section5/main.js

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        console.log('closestHostile',closestHostile);
        if(closestHostile) {
            tower.attack(closestHostile);
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