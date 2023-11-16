// normal2 状态下的creep的update
var normal2 = {
    update:function(room){
        if (Memory.roomInfo == undefined){
            Memory.roomInfo = {};
        }
        if (Memory.roomInfo[room.name] == undefined){
            Memory.roomInfo[room.name] = {};
        }

        var creeps = room.find(FIND_MY_CREEPS);
        for(var creep of creeps){
            if (creep.memory.role == 'storage2spawn'){
                // Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,MOVE],'storage2spawnTmp',{memory:{role:'storage2spawn'}})
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
                    // 找到最近的storage
                    var storage = creep.room.storage;
                    if (storage && storage.store[RESOURCE_ENERGY] > 0){
                        ret = creep.withdraw(storage,RESOURCE_ENERGY);
                        if (ret == ERR_NOT_IN_RANGE){
                            creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }else{
                            console.log('creep.withdraw error:'+ret);
                        }
                    }
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
                                continue;
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
                            continue;
                        }
                    }
                }
            }
            if (creep.memory.role == 'source2storage'){
                // 临时测试创建一个的串口命令
                // Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE],'source2storageTmp',{memory:{role:'source2storage'}})

                // 先找到位置，找到一个临近source，又临近storage的位置
                // 这里可以手动指定，没必要那么自动化
                
                var source2storagePos = Memory.roomInfo[room.name]['source2storagePos']
                if(source2storagePos){
                    // 先判断是否已经在目标位置
                    if (creep.pos.x == source2storagePos.x && creep.pos.y == source2storagePos.y){
                        // 在目标位置，开始工作
                        // 如果自己还有空位，就去挖矿
                        if (creep.store.getFreeCapacity() > 0){
                            // 找到最近的source
                            var sources = creep.room.find(FIND_SOURCES);
                            if (sources.length > 0){
                                var source = creep.pos.findClosestByPath(sources);
                                if (source){
                                    ret = creep.harvest(source);
                                    if (ret != OK){
                                        console.log('creep.harvest error:'+ret);
                                    }
                                }
                            }
                        }else{
                            // 如果自己满了，就去storage
                            var storage = creep.room.storage;
                            if (storage && storage.store.getFreeCapacity() > 0){
                                ret = creep.transfer(storage,RESOURCE_ENERGY);
                                if (ret != OK){
                                    console.log('creep.transfer error:'+ret);
                                }
                            }
                        }
                    }else{
                        creep.moveTo(source2storagePos.x,source2storagePos.y);
                    }
                }else{
                    console.log('please set Memory.roomInfo["'+room.name+'"]["source2storagePos"] = {x:0,y:0} manually')
                }
            }
            if (creep.memory.role == 'source2link'){
                var source2linkPos = Memory.roomInfo[room.name]['source2linkPos']
                if(source2linkPos){
                    // 先判断是否已经在目标位置
                    if (creep.pos.x == source2linkPos.x && creep.pos.y == source2linkPos.y){
                        // 在目标位置，开始工作
                        // 如果自己还有空位，就去挖矿
                        if (creep.store.getFreeCapacity() > 0){
                            // 找到最近的source
                            var sources = creep.room.find(FIND_SOURCES);
                            if (sources.length > 0){
                                var source = creep.pos.findClosestByPath(sources);
                                if (source){
                                    ret = creep.harvest(source);
                                    if (ret != OK){
                                        console.log('creep.harvest error:'+ret);
                                    }
                                }
                            }
                        }else{
                            // 如果自己满了，就去link
                            var links = creep.room.find(FIND_STRUCTURES,{
                                filter: (structure) => {
                                    return structure.structureType == STRUCTURE_LINK;
                                }
                            })
                            if (links.length > 0){
                                var link = creep.pos.findClosestByPath(links);
                                if (link && link.store.getFreeCapacity() > 0){
                                    ret = creep.transfer(link,RESOURCE_ENERGY);
                                    if (ret != OK){
                                        console.log('creep.transfer error:'+ret);
                                    }
                                }
                            }
                        }
                    }else{
                        creep.moveTo(source2linkPos.x,source2linkPos.y);
                    }
                }else{
                    console.log('please set Memory.roomInfo["'+room.name+'"]["source2linkPos"] = {x:0,y:0} manually')
                }
            }
            if (creep.memory.role == 'link2storage'){

            }
            if (creep.memory.role == 'storage2controller'){

            }
        }
    },
};

module.exports = normal2;