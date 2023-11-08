var nameManager = require('data.nameManager');

var upgraderCreator = {
    create: function(maxCout) {
        var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
        if(upgraders.length < maxCout) {
            var newName = nameManager.getName('upgrader');
            if (newName == '') {
                console.log('No name available for role: upgrader');
                return;
            }
            console.log('Spawning new upgrader: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'upgrader'}});
        }
    }
}

module.exports = upgraderCreator;