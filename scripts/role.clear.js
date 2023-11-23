var clear = {
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
            // 按照以下优先级进行清理
            // 墓碑、掉落的资源、container的资源
            var target = undefined;

            // 墓碑
            target = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                filter: (tombstone) => {
                    return tombstone.store.getUsedCapacity() > 0;
                }
            });

            // 掉落的资源
            if (!target) {
                target = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
            }

            // container的资源
            if (!target) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType === STRUCTURE_CONTAINER &&
                            structure.store.getUsedCapacity() > 0;
                    }
                });
            }

            if (target) {
                if (creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
                }
                return;
            }
        }else if (creep.memory.state === 'transfering') {
            var storage = creep.room.storage;
            if (storage) {
                ret = creep.transfer(storage, RESOURCE_ENERGY);
                if (ret == ERR_NOT_IN_RANGE) {
                    creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffffff' } });
                }
                return;
            }
        }
    }
};

module.exports = clear;