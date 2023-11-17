var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var signer = require('role.signer');
var miner = require('role.miner');

var tower = require('struct.tower');
var creepCreator = require('ctrl.creepCreator');
var status = require('ctrl.status');

module.exports.loop = function () {

    // status.update();

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // creepCreator.autoCreat();
    // miner.autoCreat();

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        // if(creep.memory.role == 'upgrader') {
        //     roleUpgrader.run(creep);
        // }
        if(creep.memory.role == 'builder'){
            roleBuilder.run(creep)
        }
        if(creep.memory.role == 'signer'){
            signer.run(creep)
        }
        // if(creep.memory.role == 'miner'){
        //     miner.run(creep)
        // }
    }

    var towers = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_TOWER;
        }
    });
    for(var name in towers){
        tower.run(towers[name]);
    }

    var rooms = Game.rooms;
    for(var roomName in rooms){
        var room = rooms[roomName];
        status.update2(room);
        creepCreator.update(room);
    }

    
}