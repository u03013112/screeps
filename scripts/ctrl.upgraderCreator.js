var nameManager = require('data.nameManager');

var upgradeCreator = {
    create: function(maxCout) {
        var upgrades = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrade');
        if(upgrades.length < maxCout) {
            var newName = nameManager.getName('upgrade');
            if (newName == None) {
                console.log('No name available for role: upgrade');
                return;
            }
            console.log('Spawning new upgrade: ' + newName);
            Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName, 
                {memory: {role: 'upgrade'}});
        }
    }
}

module.exports = upgradeCreator;