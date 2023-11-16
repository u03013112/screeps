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
             
            }
            if (creep.memory.role == 'source2storage'){
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
                            if (storage){
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
                    console.log('please set Memory.roomInfo['+room.name+']["source2storagePos"] manually,like this: {x:0,y:0}')
                }
            }
        }
    },
};

module.exports = normal2;