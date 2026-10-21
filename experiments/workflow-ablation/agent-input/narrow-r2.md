R2：在给定的 R1 实际产物上新增 Cancel 退出路径。
当 handler 抛出 stream_driver.Cancel（含其子类）时，run 不向外抛出 Cancel，而返回已经成功消费的前缀 list；取消发生后绝不再调用 source.__next__，包括首值前取消。正常提前返回仍须继续排空 source，返回全部值；完整消费、空源、返回格式、值顺序与重复值、其他异常原实例传播、source.close() 恰好一次及 close 后不再读的 R1 契约全部保留。source 本身不发出 Cancel；它仍可抛其他异常，按 R1 传播。handler 仍只调用一次。
两组收到同样的 R1 源码、测试与公开检查结果；保留继承失败，不替换成参考实现。改实现，可添加自己的测试，但不要修改已有公开测试或需求。运行 python3 public_tests.py --round r2，报告结果和未验证部分。只交代码、测试和说明，不联网、不安装依赖、不读项目以外文件。
