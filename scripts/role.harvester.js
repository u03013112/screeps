var source = require('ctrl.source');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(creep.store.getFreeCapacity() > 0) {
            var source0 = source.getSource2(creep);
            if(creep.harvest(source0) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source0, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    },
    /*
        大致逻辑：
        这个run会在每个tick被调用，每个tick都会执行一次。
        1、添加状态机，harvesting和transfering。
            harvesting状态下，如果能量满了，切换到transfering状态。
            transfering状态下，如果能量空了，切换到harvesting状态。
            默认是harvesting状态。切换状态时，say一下，方便查看状态转换。
        2、在状态切换的时候，寻找目标。
            harvesting状态下，寻找source。暂时简单负载，用名字的后缀数字进行离散。
            transfering状态下，寻找extension和spawn。找到最近有空间的extension或者spawn。
            保存目标id到creep的memory中。防止每个循环反复寻找目标。
        3、根据状态尝试与目标交互。如果交互失败（不包括ERR_NOT_IN_RANGE），重新寻找目标。如果重新找目标失败（没有任何目标），则休息5个tick。
    */
    run2: function(creep) {
        // 1. 添加状态机，兼容之前的代码，设置默认状态
        if (creep.memory.state === undefined) {
            creep.memory.state = 'harvesting';
        }

        // 2. 在状态切换的时候，寻找目标
        if (creep.memory.state === 'harvesting' && creep.store.getFreeCapacity() === 0) {
            creep.memory.state = 'transfering';
            delete creep.memory.harvestingTarget; // 清除原有的采集目标
            creep.say('⚡ transfer');
        } else if (creep.memory.state === 'transfering' && creep.store[RESOURCE_ENERGY] === 0) {
            creep.memory.state = 'harvesting';
            delete creep.memory.transferingTarget; // 清除原有的转移目标
            creep.say('🔄 harvest');
        }

        // 3. 根据状态尝试与目标交互
        if (creep.memory.state === 'harvesting') {
            // 先尝试从container中获取能量
            var containers = creep.room.find(FIND_STRUCTURES,{
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                }
            })
            if (containers.length > 0) {
                var container = creep.pos.findClosestByPath(containers);
                if (creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container);
                }
                return;
            }
            if (!creep.memory.harvestingTarget) { // 如果没有采集目标，寻找新的目标
                var source0 = source.getSource2(creep);
                if (!source0) {
                    creep.say('❌ no source');
                    return;
                }
                creep.memory.harvestingTarget = source0.id;
            }
            var target = Game.getObjectById(creep.memory.harvestingTarget);
            if (creep.harvest(target) === ERR_NOT_IN_RANGE) {
                creep.moveTo(target, { visualizePathStyle: { stroke: '#ffaa00' } });
            }
        } else if (creep.memory.state === 'transfering') {
            // 暂时不再存储transfer目标，每一个tick都重新寻找
            // 找到最近的有空间的extension或者spawn

            // 如果房间内有敌人，优先把能量转移到塔里
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
        }
    }
};

module.exports = roleHarvester;