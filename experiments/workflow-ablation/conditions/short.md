项目测试命令：在项目根目录运行 python3 -m unittest discover -s tests -v。
修 bug 时在 tests/ 添加回归测试；不能删除、跳过或削弱已有断言。确认新测试在原始缺陷版本上失败，在修复版本上通过。
