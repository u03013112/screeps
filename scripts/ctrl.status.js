var normal2 = require('role.normal2');
var normal3 = require('role.normal3');

var status = {
    // 还是习惯将每个tick调用的函数命名为update
    update: function(){
        if(Memory.status == undefined){
            Memory.status = '正常';
        }
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        var containers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,{
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        })
        if(Memory.status == '正常'){
            // 检查是否有过多的矿工和收割者，如果过多，切换到低消耗状态
            if(harvesters.length == 0 || miners.length == 0){
                Memory.status = '低消耗';
                console.log('状态切换到低消耗');
                Memory.creepCreator.components = ['work','carry','move'];
                Memory.creepCreator.maxCout.harvester = 4;
                Memory.creepCreator.maxCout.upgrader = 0;
                return;
            }
        }
        if(Memory.status == '低消耗'){
            // 检查是否有足够的矿工和收割者，如果足够，切换到正常状态
            if(harvesters.length >= Memory.creepCreator.maxCout.harvester && miners.length >= containers.length){
                Memory.status = '正常';
                console.log('状态切换到正常');
                Memory.creepCreator.components = ['work','work','carry','carry','carry','carry','move','move','move'];
                Memory.creepCreator.maxCout.harvester = 4;
                Memory.creepCreator.maxCout.upgrader = 6;
                return;
            }
        }

    },
    // 每个房间都有一个独立的状态
    update2: function(room){
        if(Memory.roomStatus == undefined){
            Memory.roomStatus = {};
        }
        if(Memory.roomStatus[room.name] == undefined){
            Memory.roomStatus[room.name] = '低消耗';
            Memory.roomCreepCreator = {};
            Memory.roomCreepCreator[room.name] = [
                {
                    'role': 'harvester',
                    'maxCout': 4,
                    'components':[WORK,CARRY,MOVE],
                }
            ]
        }
        // 状态切换
        var creeps = room.find(FIND_MY_CREEPS);

        if(Memory.roomStatus[room.name] != '低消耗'){
            // creep的寿命大概是1500tick，也就是30min到1h，所以最差的情况是循环失败后1h进入低消耗状态
            if(creeps.length == 0){
                Memory.roomStatus[room.name] = '低消耗';
                console.log('状态切换到低消耗');
                Memory.roomCreepCreator[room.name] = [
                    {
                        'role': 'harvester',
                        'maxCout': 4,
                        'components':[WORK,CARRY,MOVE],
                    }
                ]
                return;
            }
        }

        var containers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,{
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        })
        var links = room.find(FIND_STRUCTURES,{
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK;
            }
        })
        var storage = room.storage;
        var links = room.find(FIND_STRUCTURES,{
            filter: (structure) => {
                return structure.structureType == STRUCTURE_LINK;
            }
        })
        if (Memory.roomStatus[room.name] == '低消耗' && creeps.length >= 4 && containers.length == 0 && !storage && links.length == 0) {
            Memory.roomCreepCreator[room.name] = [
                {
                    'role': 'harvester',
                    'maxCout': 4,
                    'components': [WORK, CARRY, MOVE],
                },
                {
                    'role': 'upgrader',
                    'maxCout': 2,
                    'components': [WORK, CARRY, MOVE],
                }
            ];

            // 检查是否有需要建造的建筑
            var constructionSites = room.find(FIND_CONSTRUCTION_SITES);
            // 如果有需要建造的建筑，添加一个 builder
            if (constructionSites.length > 0) {
                Memory.roomCreepCreator[room.name] = [
                    {
                        'role': 'harvester',
                        'maxCout': 4,
                        'components': [WORK, CARRY, MOVE],
                    },
                    {
                        'role': 'upgrader',
                        'maxCout': 2,
                        'components': [WORK, CARRY, MOVE],
                    },
                    {
                        'role': 'builder',
                        'maxCout': 1,
                        'components': [WORK, CARRY, MOVE],
                    }
                ];
            }

        }
        // if(Memory.roomStatus[room.name] == '低消耗' && creeps.length >= 4){
        //     // 如果有storage,link,那么就是正常状态2
        //     var storage = room.storage;
        //     var links = room.find(FIND_STRUCTURES,{
        //         filter: (structure) => {
        //             return structure.structureType == STRUCTURE_LINK;
        //         }
        //     })
        //     // 暂时这么写，之后3个link都建好了再改
        //     if(storage && links.length ==2){
        //         Memory.roomStatus[room.name] = '正常2';

        //         Memory.roomCreepCreator[room.name] = [
        //             {
        //                 'role': 'source2storage',
        //                 'maxCout': 1,
        //                 'components':[WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
        //             },{
        //                 'role': 'storage2spawn',
        //                 'maxCout': 2,
        //                 'components':[CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
        //             },{
        //                 'role': 'source2link',
        //                 'maxCout': 1,
        //                 'components':[WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
        //             },{
        //                 'role': 'link2storage',
        //                 'maxCout': 1,
        //                 'components':[CARRY,MOVE],
        //             },{
        //                 'role': 'storage2controller',
        //                 'maxCout': 4,
        //                 'components':[WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        //             },{
        //                 'role':'storage2builder',
        //                 'maxCout': 0,
        //                 'components':[WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        //             }
        //         ]
        //     }
        //     if(storage && links.length ==3){
        //         Memory.roomStatus[room.name] = '正常3';

        //         Memory.roomCreepCreator[room.name] = [
        //             {
        //                 'role': 'source2storage',
        //                 'maxCout': 1,
        //                 'components':[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
        //             },{
        //                 'role': 'storage2spawn',
        //                 'maxCout': 1,
        //                 'components':[CARRY,CARRY,CARRY,CARRY,MOVE,MOVE],
        //             },{
        //                 'role': 'source2link',
        //                 'maxCout': 1,
        //                 'components':[WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
        //             },{
        //                 'role': 'link2storage',
        //                 'maxCout': 1,
        //                 'components':[CARRY,MOVE],
        //             },{
        //                 'role': 'storage2controller',
        //                 'maxCout': 2,
        //                 'components':[WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,MOVE],
        //             },{
        //                 'role':'storage2builder',
        //                 'maxCout': 0,
        //                 'components':[WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE],
        //             },{
        //                 'role':'clear',
        //                 'maxCout': 1,
        //                 'components':[CARRY,CARRY,MOVE],
        //             }
        //         ]
        //     }
        // }

        // // 对应状态update
        // if(Memory.roomStatus[room.name] == '正常2'){
        //     normal2.update(room);
        // }
        // if(Memory.roomStatus[room.name] == '正常3'){
        //     normal3.update(room);
        // }
    },
};

module.exports = status;
