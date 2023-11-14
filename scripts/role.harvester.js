var harvest = require('ctrl.harvest');

var roleHarvester = {
    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.state === undefined) {
            creep.memory.state = 'harvesting';
        }

        if (creep.memory.state === 'harvesting' && creep.store.getFreeCapacity() === 0) {
            creep.memory.state = 'transfering';
            creep.say('⚡ transfer');
        } else if (creep.memory.state === 'transfering' && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.state = 'harvesting';
            creep.say('🔄 harvest');
        }

        if (creep.memory.state === 'harvesting') {
            harvest.harvest(creep);
        }else if (creep.memory.state === 'transfering') {
            var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            if(hostiles.length == 0) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if(targets.length > 0){
                    var target = creep.pos.findClosestByPath(targets);
                    if (target) {
                        ret = creep.transfer(target, RESOURCE_ENERGY);
                        if (ret == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                        }
                        return;
                    }
                }
            }

            // 找不到存储目标，找塔
            targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0){
                var target = creep.pos.findClosestByPath(targets);
                if (target) {
                    ret = creep.transfer(target, RESOURCE_ENERGY);
                    if (ret == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                    return;
                }
            }

            // 找不到存储目标，找storage
            var storage = creep.room.storage;
            if (storage && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                ret = creep.transfer(storage, RESOURCE_ENERGY);
                if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return;
            }
        }
    },

};

module.exports = roleHarvester;