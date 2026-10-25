# Memos 浏览器验收固定假数据（未 seed）

只用于一次性本地 SQLite 实例。通过正常 UI 创建合成管理员与两条 PUBLIC memo；账号不预置真实邮箱或凭据。两段代码块分别为完整 memo 正文，保留换行。这里只保存待验输入，不声称编辑器实际渲染路径已核实。

## Memo A：block 列表与焦点消费者

```markdown
# Synthetic block checklist

- [x] BLOCK_DONE
- [x] BLOCK_CONTEXT
  - [ ] BLOCK_CHILD_OPEN
- [ ] FOCUS_PARENT
  - [ ] FOCUS_CHILD_OPEN
- [ ] BLOCK_OPEN

Synthetic tail: preserve this exact text.
```

开启过滤应隐藏 BLOCK_DONE，保留 BLOCK_CONTEXT 及其未完子项。实际键盘将 FOCUS_PARENT 勾成完成后，父项仍应显示且复选框保持焦点。该勾选是主动编辑，应允许正常 memo 写入；阅读开关本身不得发起写入。

## Memo B：含第二段／代码块的 raw 列表

````markdown
# Synthetic raw checklist

- [x] RAW_DONE

  A second paragraph belonging to RAW_DONE.

- [x] RAW_CONTEXT
  - [ ] RAW_CHILD_OPEN
- [ ] RAW_OPEN

  ```text
  synthetic code stays verbatim
  ```

Synthetic tail: preserve this exact text.
````

开启过滤应隐藏 RAW_DONE 及其第二段，保留 RAW_CONTEXT、RAW_CHILD_OPEN、RAW_OPEN 和代码块。关闭过滤、打开编辑器或分享图片 UI 后，应恢复所有完成项；导出图像也需实际查看。
