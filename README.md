# screeps
for screeps

刚在steam下载了游戏，发现他支持直接通过github来上传代码，于是就有了这个仓库。

目前还在测试。github完成代码后，是需要在游戏中手动点一下同步的。第一次同步成功后会有记忆仓库与路径，下一次直接点一下同步即可。

发现只要提交到github的主分支上就自动同步到游戏，还是很方便的。

## vscode 环境搭建

npm config set registry https://registry.npm.taobao.org
npm install @types/screeps @types/lodash@3.10.1

由于我的vscode是有coplit插件的，所以把库引入的必要性不是那么大，但是还是做了，在代码不足的时候还是依赖库来提示的。

## 记录代码思路

2023-11-08
从教程贴了代码进来，开始了最初的版本。
决定稍作修改。

1、自动制作收割者的数量，保持在N个。但是命名要改一下，在我的命名库中寻找，如果没有可用名字就不制作了。

2、自动制作升级者，需求与收割者一样。

3、采矿的算法修改，目前是都去sources[0]，要均衡一下。在每个可以采集的creep中（收割者或升级者）的内存中维护目前的采集目标ID。在main中定期的进行均衡。

这个游戏好复杂，研究了1个多小时什么都不明白。

思路貌似是先造一些creep，然后造spawn扩展，造更厉害的creep。

更厉害的creep需要更复杂的逻辑控制，明天有空再写吧

2023-11-12

harvester的逻辑需要重写，目前是每个creeper存储目标，会导致目的重复。可以暂时简单的改为每个tick进行判断，之后再做全局统筹

## 临时console命令

```js
Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE],'builderTmp',{memory:{role:'builder'}})
Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE],'upgraderTmp',{memory:{role:'upgrader'}})
```


```js
Memory.roomInfo["E38S47"]["link2storagePos"] = {x:28,y:22}
Memory.roomStatus["E38S47"] = '低消耗'
```

