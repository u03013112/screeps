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
        } else if (creep.memory.state === 'transfering') {
            var hostiles = creep.room.find(FIND_HOSTILE_CREEPS);
            if (hostiles.length == 0) {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN) &&
                            structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
                });
                if (targets.length > 0) {
                    var target = creep.pos.findClosestByPath(targets);
                    if (target) {
                        var ret = creep.transfer(target, RESOURCE_ENERGY);
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
            if (targets.length > 0) {
                var target = creep.pos.findClosestByPath(targets);
                if (target) {
                    var ret = creep.transfer(target, RESOURCE_ENERGY);
                    if (ret == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, { visualizePathStyle: { stroke: '#ffffff' } });
                    }
                    return;
                }
            }

            // 找不到存储目标，找storage
            var storage = creep.room.storage;
            if (storage && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                var ret = creep.transfer(storage, RESOURCE_ENERGY);
                if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return;
            }

            // 如果所有存储目标都已满，进入空闲状态
            if (creep.store[RESOURCE_ENERGY] > 0) {
                creep.memory.state = 'idle';
                creep.say('😴 idle');
            }
        } else if (creep.memory.state === 'idle') {
            // 空闲状态下检查是否有新的存储目标
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_EXTENSION || structure.structureType === STRUCTURE_SPAWN || structure.structureType === STRUCTURE_TOWER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            var storage = creep.room.storage;
            if (targets.length > 0 || (storage && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0)) {
                creep.memory.state = 'transfering';
                creep.say('⚡ transfer');
            } else {
                // 移动到空闲位置
                creep.moveTo(Game.flags.IdleFlag, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        }
    },
};

module.exports = roleHarvester;
