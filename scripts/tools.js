var tools = {
    creeps: function(){
        var roles = {};
        for(var name in Game.creeps) {
            var creep = Game.creeps[name];
            var role = creep.memory.role;
            if(!roles[role]){
                roles[role] = [];
            }
            roles[role].push(name);
        }
        for(var role in roles){
            console.log(role + ": [" + roles[role].join(", ") + "]");
        }
        return OK;
    },
    energy: function(){
        for(var name in Game.rooms){
            var room = Game.rooms[name];
            console.log(name + ": " + room.energyAvailable + "/" + room.energyCapacityAvailable);
        }
        return OK;
    },
    struct:function(){
        // debug，打印所有的Game.structures，id和type
        for(var name in Game.structures){
            var structure = Game.structures[name];
            console.log(structure.id + ": " + structure.structureType);
        }
    },
    resetMiner: function(){
        // 重置矿工的targetId
        var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        for(var miner of miners){
            console.log('miner: ' + miner.name)
            console.log('targetId: ' + miner.memory.targetId);
            delete miner.memory.targetId;
        }
    },
    status: function(){
        // 打印所有的Game.structures，id和type
        for(var name in Game.structures){
            var structure = Game.structures[name];
            console.log(structure.id + ": " + structure.structureType);
        }
        // 打印所有的Game.creeps，id和role
        for(var name in Game.creeps){
            var creep = Game.creeps[name];
            console.log(creep.id + ": " + creep.memory.role);
        }
        for(var name in Game.rooms){
            var room = Game.rooms[name];
            console.log(name + ": " + room.energyAvailable + "/" + room.energyCapacityAvailable);
        }
        // var miners = _.filter(Game.creeps, (creep) => creep.memory.role == 'miner');
        // for(var miner of miners){
        //     console.log('miner: ' + miner.name + 'targetId: ' + miner.memory.targetId);
        // }

        // 打印所有container的能量
        var containers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES,{
            filter: (structure) => {
                return structure.structureType == STRUCTURE_CONTAINER;
            }
        })
        for(var container of containers){
            console.log(container.id + ": " + container.store.getUsedCapacity(RESOURCE_ENERGY));
        }

        return OK;
    },
};
module.exports = tools;