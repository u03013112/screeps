var nameManager = require('data.nameManager');

var creepCreator = {
    update: function(room){
        var creatorList = Memory.roomCreepCreator[room.name]
        for (var creator of creatorList){
            var role = creator.role;
            var maxCout = creator.maxCout;
            var components = creator.components;
            var creeps = room.find(FIND_MY_CREEPS, {
                filter: (creep) => {
                    return creep.memory.role == role;
                }
            });
            var spawns = room.find(FIND_MY_SPAWNS, {
                filter: (spawn) => {
                    return spawn.spawning == null;
                }
            });
            if(creeps.length < maxCout && spawns.length > 0) {
                var newName = nameManager.getName(role);
                if (newName == '') {
                    console.log('No name available for role: ' + role);
                    break;
                }
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
                    break;
                }else{
                    console.log('try to spawn: '+ newName + ',' + testIfCanSpawn);
                    break;
                }
            }
        }
        var spawningSpawns = room.find(FIND_MY_SPAWNS, {
            filter: (spawn) => {
                return spawn.spawning != null;
            }
        });
        for (var spawningSpawn of spawningSpawns) {
            var spawningCreep = Game.creeps[spawningSpawn.spawning.name];
            spawningSpawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawningSpawn.pos.x + 1,
                spawningSpawn.pos.y,
                {align: 'left', opacity: 0.8});
        }
    },
}

module.exports = creepCreator;