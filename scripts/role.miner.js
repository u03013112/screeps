var nameManager = require('data.nameManager');

var miner = {
    autoCreat: function(){
        // 自动填充，自动创建
        // 保持每个container都有一个miner
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var containers = _.filter(Game.structures, (structure) => structure.structureType == STRUCTURE_CONTAINER);
        if (miners.length < containers.length) {
            var newName = nameManager.getName('miner');
            var components = [WORK,WORK,WORK,WORK,WORK,MOVE];
            var testIfCanSpawn = Game.spawns['Spawn1'].spawnCreep(components, newName,
                {
                    memory: {role: 'miner'},
                    dryRun: true
                });
            console.log('testIfCanSpawn: ' + testIfCanSpawn);
            if (testIfCanSpawn == OK) {
                console.log('Try to spawning: ' + newName);
                Game.spawns['Spawn1'].spawnCreep(components, newName,
                    {
                        memory: {role: 'miner'}
                    });
            }
        }
    },
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

        // 防止溢出浪费
        if(target.store.getFreeCapacity(RESOURCE_ENERGY) == 0){
            creep.say('❌ full');
            delete creep.memory.targetId;
            return;
        }

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