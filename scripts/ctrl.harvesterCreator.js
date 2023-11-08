var nameManager = require('data.nameManager');

var harvesterCreator = {
    create: function(maxCout) {
        var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
        if(harvesters.length < maxCout) {
            var newName = nameManager.getName('harvester');
            if (newName == None) {
                console.log('No name available for role: harvester');
                return;
            }
            console.log('Spawning new harvester: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'harvester'}});
        }
    }
}

module.exports = harvesterCreator;