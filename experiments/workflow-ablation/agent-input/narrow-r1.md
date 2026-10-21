R1：实现 stream_driver.py 的 run(source, handler)，仅使用 Python 3.11+ 标准库。
source 是有限的单次迭代器（iter(source) is source），带不抛异常的 close()。handler 被调用一次，接收一个迭代器并可消费任意前缀；其返回值忽略。run 返回 list，包含本次经传入流成功取出的全部值，顺序和重复值不变。handler 正常提前返回时继续排空 source；完整消费和空源也正常返回。无论正常结束或异常，source.close() 恰好调用一次，且之后不再请求源值。handler 或 source 抛出的异常原实例传播，不继续排空；StopIteration 仅在迭代结束处表示耗尽。R1 不要求实现 Cancel 的特殊分支，它按普通异常传播。
改实现，可添加自己的测试，但不要修改已有公开测试或本需求。运行 python3 public_tests.py --round r1，报告结果和未验证部分。只交代码、测试和说明，不联网、不安装依赖、不读项目以外文件。
