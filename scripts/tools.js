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
};
module.exports = tools;