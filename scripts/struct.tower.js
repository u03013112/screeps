var tower = {
    run: function(tower) {
        // 简单版本，目前抄https://raw.githubusercontent.com/screeps/tutorial-scripts/master/section5/main.js

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }

        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    },
};
module.exports = tower;