# P127：直接调用 Box2D 的高速触发区对照

2026-10-23 UTC。已编译运行原版 C 库，无 Unity／Unreal、渲染、模型或自写碰撞替身。

**同一圆穿过同一静止触发区，3.1.1 不报事件，3.2.0 报 begin 后下一步报 end；此时物体早已离开。** 这项升级可省部分路径检测，但事件列表不能当作步末占据事实。[实验；适用范围仅下述配置]

## 固定条件与原始结果

- 官方 [3.1.1](https://github.com/erincatto/box2d/tree/8c661469c9507d3ad6fbd2fea3f1aa71669c2fe3)／[3.2.0](https://github.com/erincatto/box2d/tree/178495ba35695aefe9c321e569d2277f06db3b90)，MIT 许可；不修改或提交第三方源码／二进制。
- 米、秒；零重力，默认连续检测开启，默认最高线速度 400 m/s；动态圆、`isBullet=false`，固定步长 1/60 s、`subStepCount=1`，无额外任务线程。其余采用各版本默认参数，不声称两版求解器完全相同。
- 静止盒中心 (0,0)、半宽 0.05 m、半高 1 m；圆半径 0.05 m，起点 (-0.2,0)。高速 24 m/s，一步从 -0.2 到 +0.2，前后都不重叠；低速正对照 3 m/s。同几何普通 solid 为阻挡对照。
- sensor／visitor 双方开启 `enableSensorEvents`；solid 组双方开启 `enableContactEvents`。每组独立世界，记录初始化和 12 次 world step 后的数据；速度、几何、步长在首次运行前固定，运行后未修改。
- 原创[驱动](p127-sensor-crossing.c)只调用上游 API；版本宏仅适配传感器数据读取函数名及检查库版本。`geometric_overlap` 是该圆／盒沿 x 轴的观测，不参与检测或事件生成。

| 场景 | 3.1.1 | 3.2.0 |
|---|---|---|
| 高速 sensor | 12 步均无 begin／end | step 1：x=0.2、begin=1、sensor_data=1；step 2：x=0.6、end=1、sensor_data=0 |
| 低速 sensor | begin／end 各 1 | begin／end 各 1 |
| 高速 solid | step 1 阻挡在 x=-0.095；step 2 contact_begin=1 | step 1 阻挡在 x=-0.095；step 2 contact_begin=1 |

完整 CSV：[3.1.1](p127-box2d-311.csv)／[3.2.0](p127-box2d-320.csv)。记录时间为模拟步末，不是 CPU 耗时或实际接触时刻。solid 的几何小穿入属于本次求解观测，不把“阻挡”写成零穿入。

**接收含义：** 按事件处理一次穿越可以采用新能力；按 `begin` 到 `end` 的间隔计算停留伤害、或把 `sensor_data` 当当前空间占据，必须另核玩法语义。本例没有测试移动 sensor、旋转刀刃、两高速目标、事件关闭、密集场景或性能；没有测 Unity 是否集成该功能。

## 重跑

需要 C17 编译器、CMake ≥3.22、make。原运行：GCC 14.2.0、CMake 4.4.4、Linux x86_64、Release。先自行取备这两个官方 tag 到临时目录，核 SHA；以下构建关闭 samples、单元测试、benchmark、文档与 profiler，不下载图形依赖：

```sh
set -eu
git clone --depth 1 --branch v3.1.1 https://github.com/erincatto/box2d.git /tmp/p127-box2d-311
git clone --depth 1 --branch v3.2.0 https://github.com/erincatto/box2d.git /tmp/p127-box2d-320
test "$(git -C /tmp/p127-box2d-311 rev-parse HEAD)" = 8c661469c9507d3ad6fbd2fea3f1aa71669c2fe3
test "$(git -C /tmp/p127-box2d-320 rev-parse HEAD)" = 178495ba35695aefe9c321e569d2277f06db3b90
for v in 311 320; do
  minor=1; [ "$v" = 320 ] && minor=2
  cmake -S /tmp/p127-box2d-$v -B /tmp/p127-build-$v \
    -DCMAKE_BUILD_TYPE=Release -DBOX2D_SAMPLES=OFF -DBOX2D_UNIT_TESTS=OFF \
    -DBOX2D_BENCHMARKS=OFF -DBOX2D_DOCS=OFF -DBOX2D_PROFILE=OFF
  cmake --build /tmp/p127-build-$v -j 4
  cc -std=c17 -O2 -Wall -Wextra -Werror -DP127_MINOR=$minor \
    -I/tmp/p127-box2d-$v/include experiments/p127-sensor-crossing.c \
    /tmp/p127-build-$v/src/libbox2d.a -lm -o /tmp/p127-run-$v
  /tmp/p127-run-$v > /tmp/p127-box2d-$v.csv
  cmp experiments/p127-box2d-$v.csv /tmp/p127-box2d-$v.csv
done
```

驱动针对库版本、实际默认 continuous/cap、有限坐标、预定穿越位移、逐步高速 begin/end/data 时刻及三组事件计数／阻挡设断言式退出码；失败输出保留，不自动调参。同编译环境可字节比较，其他平台浮点末位差异须解释，不把本例当跨平台确定性证明。

负例：传入多余参数退出 2；漏定义 `P127_MINOR` 编译失败；用 3.1.1 header／宏编译却链接 3.2.0 库，因已改名的查询符号未定义而链接失败。原运行均已验证。上游单元测试未运行；本例不是整库质量或玩家体验验证。
