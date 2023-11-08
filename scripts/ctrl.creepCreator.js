var nameManager = require('data.nameManager');

var creepCreator = {
    create: function(maxCout,role) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        if(harvesters.length < maxCout) {
            var newName = nameManager.getName(role);
            if (newName == '') {
                console.log('No name available for role: harvester');
                return;
            }
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: role}});
        }
    }
}

module.exports = creepCreator;