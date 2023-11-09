// 签名者，一般都是一次性的
// 建立就不再写代码里，临时生成就好
// 生成代码如下
// Game.spawns['Spawn1'].spawnCreep( [MOVE], 'Signer1', { memory: { role: 'signer', sign: '新手上路 Newbie on the road' } } );

var signer = {
    run: function(creep) {
        if(creep.room.controller) {
            ret = creep.signController(creep.room.controller, creep.memory['sign']);
            if(ret == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            if(ret == OK) {
                creep.say('📝 sign OK');
                // 已经没用了，自杀
                creep.suicide();
            }
        }
    }
};
module.exports = signer;