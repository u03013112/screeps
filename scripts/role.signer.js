// 签名者，一般都是一次性的
// 建立就不再写代码里，临时生成就好
// 生成代码如下
// Game.spawns['Spawn1'].spawnCreep( [MOVE], 'Signer1', { memory: { role: 'signer', sign: '新手上路 Newbie on the road' } } );

var signer = {
    run: function(creep) {
        if(creep.room.controller) {
            if(creep.signController(creep.room.controller, creep.memory['sign']) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    }
};
module.exports = signer;