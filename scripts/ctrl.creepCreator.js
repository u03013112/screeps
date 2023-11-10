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
    autoCreat: function(){
        // 读取memory中的配置，自动创建
        // 在Memory.creepCreator中配置
        // 兼容旧版本，初始化配置
        if (!Memory.creepCreator){
            Memory.creepCreator = {
                'maxCout':{
                    'harvester': 4,
                    'upgrader': 4,
                    'builder': 4
                },
                'components':[WORK,CARRY,MOVE]
            };
        }
        for(var role in Memory.creepCreator.maxCout){
            var maxCout = Memory.creepCreator.maxCout[role];
            var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role);
            var spawns = _.filter(Game.spawns, (spawn) => spawn.spawning == null);
            if(creeps.length < maxCout && spawns.length > 0) {
                var newName = nameManager.getName(role);
                if (newName == '') {
                    console.log('No name available for role: ' + role);
                    return;
                }
                var components = Memory.creepCreator.components;
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