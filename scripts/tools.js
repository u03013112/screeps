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
};
module.exports = tools;