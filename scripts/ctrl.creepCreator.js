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
            
            var components = [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
            // var components = [WORK,CARRY,MOVE];

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
    },
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
                    console.log('try to spawn: '+ newName + '>' + testIfCanSpawn);
                
                }
            }
        }
        var spawningSpawns = _.filter(Game.spawns, (spawn) => spawn.spawning != null);
        for (var spawningSpawn of spawningSpawns) {
            var spawningCreep = Game.creeps[spawningSpawn.spawning.name];
            spawningSpawn.room.visual.text(
                '🛠️' + spawningCreep.memory.role,
                spawningSpawn.pos.x + 1,
                spawningSpawn.pos.y,
                {align: 'left', opacity: 0.8});
        }
    },
    autoCreat2: function(){
        if (!Memory.creepCreator2){
            // 这是制造creep的结构，按照顺序制造
            Memory.creepCreator2 = [
                {
                    'role': 'harvester',
                    'maxCout': 4,
                    'components':[WORK,CARRY,MOVE],
                }
            ]
        }

        for (var a of Memory.creepCreator2){
            var role = a.role;
            var maxCout = a.maxCout;
            var components = a.components;
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
            var spawns = _.filter(Game.spawns, (spawn) => spawn.spawning == null);
            if(creeps.length < maxCout && spawns.length > 0) {
                var newName = nameManager.getName(role);
                if (newName == '') {
                    console.log('No name available for role: ' + role);
                    return;
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
                    return;
                }
            }
        }
    },
}

module.exports = creepCreator;