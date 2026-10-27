# Star-Rush 本机完赛保存接入

**🧪 Star-Rush 先复用已有本机记录和最快幽灵，只补读写结果；不为存档增加中局续玩。** [自包含模块](local-race-save.mjs)从案例的 `ranking.js`／`race-features.js` 抽出原键名、最近 100 条记录和按赛道保最快幽灵的规则。原实现分别吞掉写入异常，公路结算又统一显示本机保存说明；存储不可用时，能继续驾驶并不能证明成绩已保存。模块让结算区分成绩成功、幽灵成功、保留旧最佳和失败；读到坏 JSON／无效结构时保原字节，不用空列表覆盖。

**接线只改既有保存接缝。** 将 `local-race-save.mjs` 复制到案例根目录，在 `build.mjs` 的客户端 `intro` 导入 `createLocalRaceSave`、`localRaceSaveMessage`；`ranking.js` 初始化一个所有者：

```js
const raceSave = createLocalRaceSave({
  storage: () => window.localStorage,
  roadDriving, drivingRevision, trackIds: Object.keys(TRACKS),
});
```

| 既有消费者 | 接入方式与必须保留的行为 |
|---|---|
| `localRuns()`／本机榜单 | `raceSave.readRuns()` 返回 `{ok,status,value}`；成功读 `value`。失败可用空列表继续显示，但 `rankStatus` 要显示读取失败，不写成“还没有成绩”，也不触发保存。 |
| `getBestGhost()`／新局准备 | `raceSave.readGhost(activeTrackId)`；失败返回 `null` 令本局不显示幽灵，并显示本机记录不可用提示。原 `ghostKey()` 若被测试／调试引用可保留，只剩一个实际写入者。 |
| `finish()` | 保原 `state==='finished'` 防重复与 DNF 判定；建立原 `pendingRun` 后，调用下方 `finish` 一次，保存回执再画结算。 |
| `saveLocalRun()`、`completeRaceFeatures()` | 移除这两处的重复存储写入；后者仍负责结果排行、HUD、DNF 与 coach。若别处调用 `saveLocalRun`，改为返回 `raceSave.appendRun(run, profile.name)`，调用者必须处理结果。 |
| 最后设置 `resultNote` 的位置 | 在 `completeRaceFeatures()` 和公路文案之后用回执追加／替换保存提示。公路原“成绩与幽灵仅保存在本机”改成“公路记录不参与旧版街机在线榜单”，再显示回执；`submitRun` 的上传 catch 也不能仍写“本机成绩已保存”，须读取独立保存回执。 |

```js
const saved = raceSave.finish({
  run: pendingRun, name: profile.name, dnf: raceDNF,
  ghost: !net.room && raceMode === 'circuit' && ghostPoints.length > 10
    ? {time: raceClock(), points: ghostPoints, splits: raceSplits,
        laps: lapTimes, date: Date.now()}
    : null,
});
// 保原结算／DNF／公路或旧街机说明；最后再显示该保存回执。
$('resultNote').textContent += ' ' + localRaceSaveMessage(saved);
```

在原公路分支将 `pendingRun=null` 之前，结算所有者保住本次 `run`／`ghost` 的独立快照、ID 和回执；下一局清空。存储恢复后只重试失败项，不调用整个玩法 `finish()`：记录走 `appendRun`，幽灵走 `saveBestGhost`。`invalid-data` 是旧数据异常，保原数据后调查；`invalid-input`／`id-conflict` 是调用或身份问题，不让玩家反复点击重试。`appendRun` 对最近 100 条内同 ID／同成绩返回 `already-saved`，不同成绩返回 `id-conflict`；幽灵相等或更慢返回 `not-faster`。此模块不保留长期去重账本。

**旧数据保持原格式与原作用域。** `road-v2` 仍使用 `star-rush-runs-road-v2`、`star-rush-best-reborn-road-v2-<track>`；旧街机和 `road-v1` 只有显式选择各自 profile 才读取，不迁移、不删除。设置、昵称、涂装、音量、最远距离和分数键不在本包写入范围。旧记录须含原生产代码写出的 ID、模式、赛道、种子、里程、毫秒用时、分数与名字；幽灵须含有限数值的时间、五元素姿态采样、分段、圈时与日期，至少两点且时间递增。旧测试里只有 `timeMs` 的占位数据需换成真实完整 DTO，不能为让占位通过放行会破坏消费者的数据。

**成绩与幽灵仍是两个独立键，不是同代事务。** 一个成功、一个失败就分别显示，不回滚成功项，也不删旧档腾空间。`saved` 只表示 Web Storage 调用成功，不承诺断电耐久；同源多个标签页没有本包提供的写锁，当前只适用于单个活动写入者。需要跨键一致提交、跨设备恢复或并发合并时，再沿项目已有事务存储设计，不用此包冒充。

从 a1dbv 根运行：

```sh
node --test experiments/local-race-save/local-race-save.test.mjs
node experiments/local-race-save/probe-star.mjs ../Star-Rush-Reborn
```

第二条参数替换成可读的 Star 仓库目录，需要拥有上述固定提交；不修改该仓库。单元测试覆盖旧格式、新所有者重读、三种 profile 隔离、100 条保留、重试、坏档、getter／读／写失败和部分成功。探针读取固定版本真实 `finish`、`completeRaceFeatures` 和幽灵插值函数，在内存应用上表接缝；跑正常、仅记录失败、仅幽灵失败、双失败、DNF，核原防重复、最终提示及新所有者读档后的实际插值。另以未修改原函数断言双写失败仍出现保存说明的反例。DOM 与绘制是 stub，**这是接缝预验证，不是实际案例接线或浏览器验收**。

案例 owner 仍须接入实际 `finish`／榜单／幽灵消费者，按案例原 `npm test`、构建和浏览器验收走完“正常完赛→榜单→再玩、存储失败→真实提示→可继续驾驶”。两套 profile 都须保原流程；探针目前只跑公路结算。未跑浏览器重载或 Unity／UE，不标成案例已采用。

依据：[一手：现有实现] Star-Rush-Reborn 固定 `997d0a83` 的 [记录读写](https://github.com/dbvv1/Star-Rush-Reborn/blob/997d0a83b1d25adff9fff2f71826486d21d4df97/ranking.js)、[幽灵读写](https://github.com/dbvv1/Star-Rush-Reborn/blob/997d0a83b1d25adff9fff2f71826486d21d4df97/race-features.js)、[结算调用](https://github.com/dbvv1/Star-Rush-Reborn/blob/997d0a83b1d25adff9fff2f71826486d21d4df97/race.js)；[官方] [Web Storage 失败与无跨窗口锁契约](https://html.spec.whatwg.org/multipage/webstorage.html#dom-storage-setitem)；[经验] 本包相关 Node 测试。核实 2026-10-27。
