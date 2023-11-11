var tower = {
    run: function(tower) {
        // 简单版本，目前抄https://raw.githubusercontent.com/screeps/tutorial-scripts/master/section5/main.js

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }

        // 优先修复container
        var damagedContainers = _.filter(damagedStructs, (structure) => {
            return structure.structureType == STRUCTURE_CONTAINER && structure.hits < structure.hitsMax;
        })
        if(damagedContainers.length > 0){
            tower.repair(damagedContainers[0]);
            return;
        }

        // 修复除了rampart和wall以外的其他建筑
        var damagedStructs = _.filter(damagedStructs, (structure) => {
            return structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART && structure.hits < structure.hitsMax;
        })
        if(damagedStructs.length > 0){
            tower.repair(damagedStructs[0]);
            return;
        }

        // 修复rampart和wall
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }
    },
};
module.exports = tower;