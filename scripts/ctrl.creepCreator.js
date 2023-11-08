var nameManager = require('data.nameManager');

var creepCreator = {
    create: function(maxCout,role) {
        var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
        var spawns = _.filter(Game.spawns, (spawn) => spawn.spawning == null);

        if(creeps.length < maxCout && spawns.length > 0) {
            var newName = nameManager.getName(role);
            if (newName == '') {
                console.log('No name available for role: ' + role);
                return;
            }
            
            var components = [WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];

            var testIfCanSpawn = spawns[0].spawnCreep(components, newName,
                {
                    memory: {role: role},
                    dryRun: true
                });

            if (testIfCanSpawn == OK) {
                console.log('Try to spawning: ' + newName);
                spawns[0].spawnCreep(components, newName,
                    {
                        memory: {role: role}
                    });
            }
        }
    }
}

module.exports = creepCreator;