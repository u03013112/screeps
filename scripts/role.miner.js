var miner = {
    run:function(creep) {
        if (!creep.memory.targetId) {
            var containers = creep.room.find(FIND_STRUCTURES,{
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            })
            var lastChar = creep.name.slice(-1); // 获取名字的最后一个字符
            var index = parseInt(lastChar, 10); // 尝试将字符转换为数字
            
            if (length(containers) > (index + 1)) {
                creep.memory.targetId = containers[index].id;
            }else{
                creep.say('❌ no target');
                return;
            }
        }
        var target = Game.getObjectById(creep.memory.targetId);
        if (!target) {
            delete creep.memory.targetId;
            return;
        }
        if(creep.pos.isEqualTo(target.pos)){
            var sources = creep.room.find(FIND_SOURCES);
            if (length(sources) > 0) {
                var source = target.pos.findClosestByPath(sources);
                creep.harvest(source);
            }
        }else{
            creep.moveTo(target);
        }
    },
};
module.exports = miner;