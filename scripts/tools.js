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
};
module.exports = tools;