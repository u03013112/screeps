var harvest = {
    harvest: function(creep) {
        // 先尝试找到container，或者tombstone，进行采集
        // 暂时就近采集，负载之后再说吧
        var tombstones = creep.room.find(FIND_TOMBSTONES, {
            filter: (tombstone) => {
                return tombstone.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        })
        var containers = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        })
        var target = null;
        if (tombstones.length > 0) {
            var tombstone = creep.pos.findClosestByPath(tombstones);
            if (tombstone) {
                target = tombstone;
            }
        }
        if (containers.length > 0 && !target) {
            var container = creep.pos.findClosestByPath(containers);
            if (container) {
                target = container;
            }
        }
        if (target) {
            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            return;
        }
        // 如果creep拥有work部件，就去找source
        if (creep.getActiveBodyparts(WORK) > 0) {
            // 如果没有container，就去找source
            var sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
                var lastChar = creep.name.slice(-1); // 获取名字的最后一个字符
                var index = parseInt(lastChar, 10); // 尝试将字符转换为数字
                if (isNaN(index)) { // 如果转换失败，将index设为0
                    index = 0;
                }
                index = index % sources.length;
                var source = sources[index];
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                return;
            }
        }
        
        // 如果连source都没有，就找storage,理论上不会出现这种情况
        var storages = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.structureType == STRUCTURE_STORAGE &&
                    structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
            }
        })
        if (storages.length > 0) {
            var storage = creep.pos.findClosestByPath(storages);
            if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage);
            }
            return;
        }
    },
};

module.exports = harvest;