var harvest = require('ctrl.harvest');

// normal3 状态下的creep的update
var normal3 = {
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
                if (creep.memory.state === 'harvesting' && creep.store.getFreeCapacity(RESOURCE_ENERGY) === 0) {
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
                            // console.log('creep.withdraw error:'+ret);
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
                                // 不用补满
                                structure.store.getFreeCapacity(RESOURCE_ENERGY) > 800;
                        }
                    });
                    if(targets.length > 0){
                        // 找到能量最少的
                        targets.sort((a,b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY]);

                        var target = targets[0];
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
                        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                            // 找到最近的source
                            var sources = creep.room.find(FIND_SOURCES);
                            if (sources.length > 0){
                                var source = creep.pos.findClosestByPath(sources);
                                if (source && source.energy > 0){
                                    ret = creep.harvest(source);
                                    if (ret != OK){
                                        console.log('source2storage.harvest error:'+ret);
                                    }
                                }
                            }
                        }else{
                            // 如果自己满了，就去storage
                            var storage = creep.room.storage;
                            if (storage && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
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
                // Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE],'source2linkTmp',{memory:{role:'source2link'}})
                var source2linkPos = Memory.roomInfo[room.name]['source2linkPos']
                if(source2linkPos){
                    // 先判断是否已经在目标位置
                    if (creep.pos.x == source2linkPos.x && creep.pos.y == source2linkPos.y){
                        // 在目标位置，开始工作
                        // 如果自己还有空位，就去挖矿
                        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                            // 找到最近的source
                            var sources = creep.room.find(FIND_SOURCES);
                            if (sources.length > 0){
                                var source = creep.pos.findClosestByPath(sources);
                                if (source && source.energy > 0){
                                    ret = creep.harvest(source);
                                    if (ret != OK){
                                        console.log('source2link.harvest error:'+ret);
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
                                if (link && link.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
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
                // Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,MOVE],'link2storageTmp',{memory:{role:'link2storage'}})
                var link2storagePos = Memory.roomInfo[room.name]['link2storagePos']
                if(link2storagePos){
                    // 先判断是否已经在目标位置
                    if (creep.pos.x == link2storagePos.x && creep.pos.y == link2storagePos.y){
                        // 在目标位置，开始工作
                        // 如果自己还有空位，就去挖矿
                        if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                            // 找到最近的link
                            var links = creep.room.find(FIND_STRUCTURES,{
                                filter: (structure) => {
                                    return structure.structureType == STRUCTURE_LINK;
                                }
                            })
                            if (links.length > 0){
                                var link = creep.pos.findClosestByPath(links);
                                if (link && link.store.getUsedCapacity(RESOURCE_ENERGY) > 0){
                                    ret = creep.withdraw(link,RESOURCE_ENERGY);
                                    if (ret != OK){
                                        // console.log('creep.withdraw error:'+ret);
                                    }
                                }
                            }
                        }else{
                            // 如果自己满了，就去storage
                            var storage = creep.room.storage;
                            if (storage && storage.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                                ret = creep.transfer(storage,RESOURCE_ENERGY);
                                if (ret != OK){
                                    console.log('creep.transfer error:'+ret);
                                }
                            }
                        }
                    }else{
                        creep.moveTo(link2storagePos.x,link2storagePos.y);
                    }
                }else{
                    console.log('please set Memory.roomInfo["'+room.name+'"]["link2storagePos"] = {x:0,y:0} manually')
                }
            }
            if (creep.memory.role == 'storage2controller'){
                // 在正常3状态下，这个creep从linkTo2里面拿能量，linkTo2里面没有能量就等着就行了
                // Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE],'storage2controllerTmp',{memory:{role:'storage2controller'}})
                if(creep.memory.upgrading && creep.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.upgrading = false;
                    creep.say('🔄 harvest');
                }
                if(!creep.memory.upgrading && creep.store.getFreeCapacity(RESOURCE_ENERGY) == 0) {
                    creep.memory.upgrading = true;
                    creep.say('⚡ upgrade');
                }
        
                if(creep.memory.upgrading) {
                    if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
                else {
                    var linkTo2 = undefined;
                    var controller = creep.room.controller;
                    if(controller){
                        linkTo2 = controller.pos.findClosestByPath(FIND_STRUCTURES,{
                            filter: (structure) => {
                                return structure.structureType == STRUCTURE_LINK;
                            }
                        });
                    }
                    if (linkTo2 && linkTo2.store[RESOURCE_ENERGY] > 0){
                        ret = creep.withdraw(linkTo2,RESOURCE_ENERGY);
                        if (ret == ERR_NOT_IN_RANGE){
                            creep.moveTo(linkTo2, { visualizePathStyle: { stroke: '#ffaa00' } });
                        }else{
                            // console.log('creep.withdraw error:'+ret);
                        }
                    }
                }
                // creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            if (creep.memory.role == 'storage2builder'){
                if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
                    creep.memory.building = false;
                    creep.say('🔄 harvest');
                }
                if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
                    creep.memory.building = true;
                    creep.say('🚧 build');
                }
        
                if(creep.memory.building) {
                    var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
                    if(targets.length) {
                        if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
                else {
                    // var storage = creep.room.storage;
                    // if (storage && storage.store.getUsedCapacity() > 0){
                    //     ret = creep.withdraw(storage,RESOURCE_ENERGY);
                    //     if (ret == ERR_NOT_IN_RANGE){
                    //         creep.moveTo(storage, { visualizePathStyle: { stroke: '#ffaa00' } });
                    //     }else{
                    //         // console.log('creep.withdraw error:'+ret);
                    //     }
                    // }
                    harvest.harvest(creep);
                }
            }
        }

        var links = room.find(FIND_STRUCTURES,{
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK;
            }
        })
        if (links.length == 3){
            var linkFrom = undefined;
            var linkTo = undefined;
            // 离controller最近的link
            var linkTo2 = undefined;

            var source2linkPos = Memory.roomInfo[room.name]['source2linkPos']
            if(source2linkPos){
                linkFrom = new RoomPosition(source2linkPos.x,source2linkPos.y,room.name).findClosestByPath(links);
            }
            var link2storagePos = Memory.roomInfo[room.name]['link2storagePos']
            if(link2storagePos){
                linkTo = new RoomPosition(link2storagePos.x,link2storagePos.y,room.name).findClosestByPath(links);
            }
            var controller = room.controller;
            if(controller){
                linkTo2 = controller.pos.findClosestByPath(links);
            }

            if(linkFrom && linkTo && linkTo2){
                // 如果linkTo2有空位，就优先往linkTo2里面放
                if (linkFrom.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && linkTo2.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                    linkFrom.transferEnergy(linkTo2);
                }else if (linkFrom.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && linkTo.store.getFreeCapacity(RESOURCE_ENERGY) > 0){
                    linkFrom.transferEnergy(linkTo);
                } 
            }
        }
    },
};

module.exports = normal3;