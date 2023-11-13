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
                Memory.creepCreator.maxCout.harvester = 6;
                Memory.creepCreator.maxCout.upgrader = 6;
                return;
            }
        }

    }
};

module.exports = status;
