# Yarn 选项异步交接：核实候选与渠道覆盖

**先读固定两源与六场景证据，再读跨引擎和项目侧契约；替代引擎、中文资料只作对照。** 本文件是 B-CORE-YARN-CHOICE-HANDOFF-20261106 的来源清单：从本轮 505 个去重候选中筛出 343 个与「选项组呈现 → 语言切换/重排 → 一次点击 → VM 消费 → 下一组」直接相关或可作对照的条目，按任务决定排序，并标出最值得深挖的前几项。不新增任何未核实的链接，所有链接都来自本轮收集与核对清单。

固定基线是 YarnSpinner@5b3a4ff 的 [Dialogue.cs](https://github.com/YarnSpinnerTool/YarnSpinner/blob/5b3a4ff2d24e4f727e3f90fee5d8ce637474c305/YarnSpinner/Dialogue.cs#L99-L175) 与 [VirtualMachine.cs](https://github.com/YarnSpinnerTool/YarnSpinner/blob/5b3a4ff2d24e4f727e3f90fee5d8ce637474c305/YarnSpinner/VirtualMachine.cs#L389-L424)，以及 YarnSpinner-Unity@bfc5b6a 的 [DialogueRunner.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/DialogueRunner/DialogueRunner.cs#L881-L1025)、[OptionsPresenter.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/OptionsPresenter.cs#L165-L370)、[OptionItem.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/OptionItem.cs#L143-L159)（v3.2.8）。两个固定提交根目录的 `LICENSE.md` 均为 MIT（核心 5b3a4ff、Unity bfc5b6a）；YSPL 只覆盖部分新产品，不适用于这两个开源包。3.3 async-vm 与新版文档单列为「下一版方向」，不写进 3.2.8 接口。本单元未运行 Unity/.NET，未做按钮或输入实测；文中「框架保证」指固定源码或官方文档可读到的契约，「项目必须保」指候选理由指向、尚待非作者按固定源码复核的项目侧责任。

本产物在「接入者结论」给出最小接口草案与六组可执行输入/期望；它们按固定源码推导、尚未在 Unity 工程运行，六场景的最终断言仍是待执行项。

## 接入者结论（六场景与最小接口）

**先给结论：框架的核心保证是四件事——一组选项的并发派发、单个 OptionItem 的单次提交、按本组下标校验、运行中 Stop 并发等待全部 presenter 的 `OnDialogueCompleteAsync`（DialogueRunner.cs L603-L631）；固定源码还保证选项文本在 presenter 前逐项 await（L908-L927）与 `allowOptionFallthrough`（L985-L996）。项目要保的是隐藏/灰显/重排策略、跨组身份、旧按钮与焦点清理、未运行 Stop、Builtin 资产取消。** 下面每个场景三行：框架保证什么（固定行号）、第一步做什么、什么时候不需要或不该这样做。全部按固定源码推导，未在 Unity 工程运行。

**旧组残留按钮会不会选到新组同下标：会。** 默认 OptionsPresenter 复用同一批 `OptionItem`；新组同下标仍是合法 ID，VM 只查等待态和范围，点旧位置就会提交新组该下标。第一步是切组时清旧按钮、焦点和 onclick，并优先销毁或重建本组按钮；若必须复用同一批 OptionItem，切组后至少一帧禁用交互或丢弃排队输入，再重新绑定到本组 `DialogueOption` 对象。`OptionItem` 的单次提交与 token 检查只在按钮仍绑着旧组时挡住；一旦同一按钮被重绑到新组，旧意图的点击会被当成新组点击，不能替代切组时的输入隔离。

### 六场景速查

**1. 旧组延迟点击**

- **框架已保证：** `OptionItem.InvokeOptionSelected` 在点击当下查 `IsInteractable()`，并用 `hasSubmittedOptionSelection` + `completionToken.IsCancellationRequested` 保证同一个按钮只 `TrySetResult` 一次（OptionItem.cs L143-L159）；任一 presenter 返回非 null 后 Runner 取消本组 token（DialogueRunner.cs L940-L945）。但 Runner 不知道按钮属于哪一组，也不会撤销旧按钮上的 onClick；默认 OptionsPresenter 复用的是同一批 `OptionItem`，新组会把 `Option`、`OnOptionSelected`、`completionToken` 覆盖成本组值（OptionsPresenter.cs L217-L232）。
- **第一步：** 切组时先清旧按钮、焦点和 onClick，优先销毁或新建本组按钮；若复用同一批 OptionItem，切组后至少一帧禁用交互或丢弃排队输入，再重新绑定。回调里先判 `token.NextContentToken.IsCancellationRequested`，取消就返回 null。按本文件最小接口实现的 presenter 在 `RunOptionsAsync` 入口 `ClearViews()` 后新建本组按钮，旧引用再调用 `InvokeOptionSelected()` 时对象已 inactive 且 `OnOptionSelected` 为 null，不会提交。
- **不需要/不该这样做：** 如果每组都销毁重建 UI、且不会留下上一帧排队的输入事件，可以省掉显式清 onClick；一旦复用同一批 OptionItem（默认 OptionsPresenter 的路线），只清旧 onClick 不够——已经排队、在重绑后才派发的点击会落到新组同位置，必须加一帧交互禁用或输入消费。

**2. 新组复用同数值 ID**

- **框架已保证：** `Option.ID` 就是本组 `currentOptions` 的下标（核心 VirtualMachine.cs L703-L716；Dialogue.cs L110-L170）；`SetSelectedOption` 只查 `WaitingOnOptionSelection` 和 `0..count-1` 范围（VirtualMachine.cs L389-L424），不校验这个数值来自哪一组，也不校验 `IsAvailable`。
- **第一步：** 保存本组返回的 `DialogueOption` 对象（含 `DialogueOptionID`、`TextID`、`Line`），显示层重排只改按钮顺序，提交时用对象的 `DialogueOptionID`；不要把按钮序号、上次选中下标或跨组保存的索引当身份。重排时维护「显示序号 → 本组原对象」映射。
- **不需要/不该这样做：** 本组不重排、不隐藏、不池化，点击后立即在同一回调提交时，按钮序号与 `Option.ID` 相同；一旦跨组保存下标或复用按钮，这个等式不再成立。

**3. 关闭对白后回调**

- **框架已保证：** 运行中 `Stop()` 取消 token → `Dialogue.Stop()` 触发 `DialogueCompleteHandler`（核心 VirtualMachine.cs L382-L387）→ Runner 并发调用全部 presenter 的 `OnDialogueCompleteAsync` 并 `await WhenAll` 后才完成（DialogueRunner.cs L603-L631；`Stop` 的等待在 L530-L536）。默认 `OptionsPresenter.OnDialogueCompleteAsync` 只把 canvasGroup 设为 alpha=0、不可交互（OptionsPresenter.cs L86-L96），但它的 `RunOptionsAsync` 在选中/取消返回前会对全部 `optionViews` 执行 `SetActive(false)`（OptionsPresenter.cs L356-L360），Stop 取消 token 后这条路径会执行。未运行时 `CancelDialogue()` 早退（L568-L583），但 `Stop()` 仍新建并 await 一个无人完成的 `dialogueCancellationCompletion`（L532-L535），直接 `await Stop()` 会永久挂起；3.3 async-vm 才在 Stop 里加未运行/正在取消早退（L390-L398）。
- **第一步：** 自定义 presenter 在 `OnDialogueCompleteAsync` 里停协程、清 completion source、禁用或回收自己的子视图；内置 presenter 的路径不需要项目再清 `OptionItem`——`RunOptionsAsync` 返回前会自行禁用（OptionsPresenter.cs L356-L360）。调用方先判 `IsDialogueRunning` 再 await Stop，或给 Stop 加超时；外部异步（本地化、语音）用 `destroyCancellationToken` 或本组代次过滤迟到回调。
- **不需要/不该这样做：** 内置 presenter 不需要项目在 `OnDialogueCompleteAsync` 里补禁用子视图；项目责任只留给自定义 presenter，以及 Stop 只等 `OnDialogueCompleteAsync`、不等 `RunOptionsAsync` 而可能残留的那一帧。如果每次关闭都销毁 presenter 与 UI、没有池化子视图和外部异步，可以省掉代次；但不要在未运行时无保护地 `await Stop()`。

**4. 双击**

- **框架已保证：** OptionItem 的 `hasSubmittedOptionSelection` + token 检查保证同一按钮只提交一次（OptionItem.cs L143-L159）；LineAdvancer 只在 hurry-up 入口丢弃内容到达同帧的输入：行的 `RequestLineHurryUpInternal`（LineAdvancer.cs L452）与选项的 `RequestOptionHurryUp`（L548）都会在 `frameContentReceived == Time.frameCount` 时返回。`OnInputNextContent`（L645）走 `RequestNextLine`（L575-L586），没有这个同帧检查；它在选项期间之所以无效，只是因为 `DialogueRunner.RequestNextLine` 找不到 `currentLineCancellationSource` 而早退（DialogueRunner.cs L1115-L1122），在行上下文同一帧调用会真的取消当前行。
- **第一步：** 输入层把 Submit/Click 归一到一次 down（或 down-up 仲裁），用 `TrySetResult` 而非 `SetResult`；提交后立刻禁用本组所有按钮。
- **不需要/不该这样做：** 只有鼠标点一个按钮、且没有 DialogueAdvanceInput/LineAdvancer 同时接管时，框架两道守卫已够；一旦键盘/手柄与按钮并存，仍要在输入层去重（#241）。

**5. 翻译异步晚到**

- **框架已保证：** Runner 在调用 presenter 前逐项 `await GetLocalizedLineAsync(opt.Line, groupToken)`，全部取完才并发调 presenter（DialogueRunner.cs L908-L927）；UnityLocalisedLineProvider 的文本与资产加载都把 token 传给 `WaitForAsyncOperation`（UnityLocalisedLineProvider.Installed.cs L99-L150）。Builtin 的 asset 路径不接 token（BuiltinLocalisedLineProvider.cs L136-L153）；它的 #344 locale 键错配在固定 3.2.8 已改用 `_assetLocaleCode`，是历史问题而非当前缺口。
- **第一步：** 缺译/`InvalidLine` 时给占位文本并记录，不要让整组永远不返回；切语言时重开本组或按代次丢弃旧译文；用 Builtin 时语音/资源加载由项目自己包一层可取消加载。
- **不需要/不该这样做：** 只做文本、不切语言、不加载语音资源时，文本路径的 token 已覆盖；不要指望框架有「重译当前已显示选项组」的 API，3.2.8 没有这个通道。

**6. 没有可用项**

- **框架已保证：** 内置 OptionsPresenter 在全部 `IsAvailable == false` 时直接返回 null（OptionsPresenter.cs L167-L180）；Runner 在 `allowOptionFallthrough == true` 时调用 `SetSelectedOption(NoOptionSelected)` 并继续，关闭时 `LogError` 并 return（DialogueRunner.cs L985-L996）；不可用项仍会派发给 presenter（VirtualMachine.cs L703-L716；Dialogue.cs L152-L170）。
- **第一步：** 先决定策略（隐藏不可用项，还是灰显禁用）；若本组可能全空，先判 `Any(IsAvailable)`，按项目政策返回 null，由 Runner 按 `allowOptionFallthrough` 决定继续或停住；不要让 presenter 自己调 `SetSelectedOption(NoOptionSelected)`，也不要默认选第 0 项。
- **不需要/不该这样做：** 每步至少一个可用项、且有剧情兜底时，可以只灰显不特判；一旦允许「条件全不满足」的选项组出现，就必须显式处理，否则关闭 fallthrough 时对话会停住。

### 最小接口草案

沿官方 `DialoguePresenterBase.RunOptionsAsync(DialogueOption[], LineCancellationToken)`、`YarnTaskCompletionSource` 和 `OptionItem`，不另造 VM 或 runner 状态机。以下为骨架（未在 Unity 编译；字段名按固定 3.2.8）：

```csharp
using System.Collections.Generic;
using UnityEngine;
using Yarn.Unity;

public sealed class GroupedOptionsPresenter : DialoguePresenterBase
{
    [SerializeField] private OptionItem optionPrefab;
    [SerializeField] private RectTransform container;

    private readonly List<OptionItem> views = new();
    private int generation;

    public override YarnTask OnDialogueStartedAsync() => YarnTask.CompletedTask;

    public override YarnTask OnDialogueCompleteAsync()
    {
        generation++;      // 让在途回调失效
        ClearViews();      // 清 onclick、停动画、销毁本组视图
        return YarnTask.CompletedTask;
    }

    public override YarnTask RunLineAsync(LocalizedLine line, LineCancellationToken token)
        => YarnTask.CompletedTask;

    public override async YarnTask<DialogueOption?> RunOptionsAsync(
        DialogueOption[] options, LineCancellationToken token)
    {
        if (token.NextContentToken.IsCancellationRequested)
        {
            return null;   // 已取消，别再建 UI 或注册
        }

        if (System.Array.Exists(options, o => o.IsAvailable) == false)
        {
            return null;   // 全不可用，交给 Runner 的 allowOptionFallthrough
        }

        int thisGroup = ++generation;
        ClearViews();      // 先清旧按钮、焦点和 onclick，再建本组

        var completion = new YarnTaskCompletionSource<DialogueOption?>();
        using var cancelRegistration = token.NextContentToken.Register(
            static state =>
                ((YarnTaskCompletionSource<DialogueOption?>)state!).TrySetResult(null),
            completion);

        foreach (var option in options)
        {
            if (!option.IsAvailable) continue;   // 或生成禁用项，策略由项目定
            var view = Instantiate(optionPrefab, container);
            views.Add(view);
            view.Option = option;                 // 本组对象，ID 只在组内有效
            view.OnOptionSelected = completion;
            view.completionToken = token.NextContentToken;
        }

        var selected = await completion.Task;
        if (thisGroup != generation) return null;          // 已关闭或已切组
        ClearViews();                                      // 返回前清本组
        return token.NextContentToken.IsCancellationRequested ? null : selected;
    }

    private void ClearViews()
    {
        foreach (var view in views)
        {
            if (view == null) continue;
            view.OnOptionSelected = null;
            view.gameObject.SetActive(false);
            Destroy(view.gameObject);   // 本组结束即销毁，避免旧引用被下一组复用
        }
        views.Clear();
    }
}
```

三个必须点：每次返回前检查 `NextContentToken`，取消后只返回 null；`ClearViews` 同时清 `OnOptionSelected` 并禁用/销毁视图，否则旧引用仍会响应；presenter 只返回选中的 `DialogueOption` 或 null，不要在 presenter 内直接调 `SetSelectedOption`——Runner 会在所有 presenter 返回后统一提交（L1001/L989），二次提交会抛 `DialogueException`。`generation` 只负责「关闭/切组后不提交」，不替代 Runner 的 token。

### 六组可执行输入/期望

以下共用两段测试节点。`handoff` 用来观察两组选项与最终路由；`none_available` 用来观察全不可用。

```yarn
title: handoff
---
<<declare $route = "none" as String>>
-> 旧组 A
    <<set $route = "g1_a">>
-> 旧组 B
    <<set $route = "g1_b">>
第二组
-> 新组 A
    <<set $route = "g2_a">>
-> 新组 B
    <<set $route = "g2_b">>
<<if $route == "g2_a">>
走了新组 A
<<elseif $route == "g2_b">>
走了新组 B
<<else>>
路由: {$route}
<<endif>>
===
```

```yarn
title: none_available
---
<<declare $hasKey = false as Bool>>
<<declare $route = "none" as String>>
-> 开锁 <<if $hasKey>>
    <<set $route = "key">>
-> 撬锁 <<if $hasKey>>
    <<set $route = "pick">>
<<set $route = "fallthrough">>
路由: {$route}
===
```

1. **旧组延迟点击**：运行 `handoff`，等第二组可见后，用第一组时保存的 `OptionItem` 引用调用 `InvokeOptionSelected()`。默认 OptionsPresenter 下预期 `$route == "g2_a"`（旧引用就是被复用的新组 0 号按钮，说明框架不会凭「旧组」身份拒绝）；用上面草案 presenter 时，旧引用已随上一组销毁或至少 `OnOptionSelected` 为 null，调用不会提交（访问已销毁对象会得到 `MissingReferenceException`），对话仍停在第二组，再点第二组 B 才得到 `$route == "g2_b"`。
2. **新组复用同数值 ID**：运行 `handoff`，测试 presenter 把第一组显示顺序倒置为「旧组 B、旧组 A」，点第一个可见按钮。预期 `$route == "g1_b"`，且提交的 `DialogueOptionID == 1`；若代码提交显示序号 0，则得到 `$route == "g1_a"`，即失败。第二组出现后，默认 OptionsPresenter 会 `Select()` 聚焦第一个可用按钮（OptionsPresenter.cs L242-L270），这是焦点不是提交，`$route` 在玩家确认前保持 `g1_b`；自定义 presenter 不主动聚焦时则第二组无选中。
3. **关闭对白后回调**：运行 `handoff`，用上面草案 presenter（token 取消时立刻 `TrySetResult(null)`），在第一组显示时 `await runner.Stop()`。预期 Stop 在数帧内返回、presenter 的 `OnDialogueCompleteAsync` 恰好调用一次、`$route` 仍为 `"none"`。是否出现 `DialogueException` 不能预设：Stop 在 `OnDialogueCompleteAsync` 末尾才清空 `dialogueCancellationSource`（DialogueRunner.cs L637-L643），而 `RunOptionsAsync` 的 continuation 早于或晚于这次清理取决于 YarnTask 后端与调度；晚于清理时 L979 的取消检查落空，null 会按默认开启的 `allowOptionFallthrough` 走 fallthrough，对已停止的 VM 调 `SetSelectedOption(NoOptionSelected)`（L985-L989）并抛异常，测试必须记录实际分支。要稳定断言「不提交」，把 `allowOptionFallthrough` 设为 false（此时 null 只 `LogError` 并 return），或只断言 `$route` 不变并允许记录异常。默认 OptionsPresenter 下另断言 canvasGroup `alpha == 0` 且不可交互；Stop 只等 `OnDialogueCompleteAsync`、不等 `RunOptionsAsync`，默认 presenter 在取消返回时会 `SetActive(false)` 子视图（OptionsPresenter.cs L356-L360），但 Stop 返回时该清理可能尚未执行——若要 Stop 返回即确定清理，使用自定义 presenter 并在 `OnDialogueCompleteAsync` 禁用其自己的子视图，不能要求默认 presenter 的这一层。再让测试 presenter 无视 token、Stop 后 10 帧才 `TrySetResult(null)`：预期 Stop 仍返回（它只等 `OnDialogueCompleteAsync`，不等 `RunOptionsAsync`），但延迟返回时 `dialogueCancellationSource` 已清空并落入上面的 fallthrough 分支，预期抛出/记录 `DialogueException`（`wasn't waiting for a selection`）——这正说明「取消后立刻返回 null」是项目责任，不能把 Stop 当兜底。未运行场景：`IsDialogueRunning == false` 时 `await runner.Stop()` 加 1 秒超时，预期 3.2.8 超时（挂起），3.3 async-vm 立即返回。
4. **双击**：运行 `handoff`，同一帧对第一组同一个按钮连续调用 `OnSubmit` 与 `OnPointerClick`（或两次 `InvokeOptionSelected()`）。预期只提交一次、`$route == "g1_a"`；第二次调用因 `hasSubmittedOptionSelection` 不再触发 `TrySetResult`（提交源只完成一次），无 `Dialogue wasn't waiting for a selection` 异常。再验证同帧抑制：在行内容到达同帧调用 `LineAdvancer.OnInputHurryUpLines()`（L644 调 `RequestLineHurryUpInternal`，L452 的 `frameContentReceived` 守卫在状态检查之前 return），预期本行没有被快进或推进；同一调用在选项组内还会被 `PresentationStatus.OptionsBegan` 的状态检查挡住，两条路径分开记录。若要断言 next-content 在选项期间无效，调用 `OnInputNextContent()`（L645 → `RequestNextLine`，L575-L586）——它不是被同帧守卫抑制，而是 `DialogueRunner.RequestNextLine` 因 `currentLineCancellationSource == null` 早退（DialogueRunner.cs L1115-L1122）；同一调用在行上下文同一帧会真的取消当前行。
5. **翻译异步晚到**：运行 `handoff`，用测试 `ILineProvider` 把选项行的 `GetLocalizedLineAsync` 延迟 3 帧并记录调用次数。预期第 1 帧 presenter 的 `RunOptionsAsync` 尚未进入（计数 0）；`handoff` 第一组有两条选项，`OnOptionsReceivedAsync` 对每个选项顺序 `await GetLocalizedLineAsync`（DialogueRunner.cs L908-L927），第二条要等第一条完成后才开始，因此每条延迟 3 帧时 presenter 约第 7 帧才进入并显示本组两个选项按钮，而不是第 4 帧。若只想断言第 4 帧，改用单选项节点并明确延迟实现，或让测试 provider 整组只延迟 3 帧。若第 1 帧就 `Stop`，预期不产生有效选择、不 Continue（`$route` 仍为 `"none"`）；是否命中 L979-L983 的提前 return 取决于取消回调与 Stop 清理的先后，是 3.2.8 的竞态，测试要记录实际分支与是否出现 `DialogueException`，不能预设「一定提前 return」。缺译变体：provider 对一条选项返回 `InvalidLine`，预期日志含 `Failed to get a localised line`，presenter 仍收到该项（显示错误占位文本），整组不永久卡住。Builtin 资产变体：资产延迟返回时 Stop，预期资产回调仍执行（该路径不接 token），项目必须自行丢弃迟到显示。
6. **没有可用项**：运行 `none_available`，`$hasKey` 保持 false。预期 presenter 收到 2 个 `IsAvailable == false` 的 `DialogueOption`；`allowOptionFallthrough == true` 时内置 presenter 返回 null，Runner 提交 `NoOptionSelected` 并继续，最终 `$route == "fallthrough"`、无异常。把 `allowOptionFallthrough` 关掉重跑，预期 `Debug.LogError` 含 `fallthrough is disabled`，对话仍 `IsDialogueRunning == true` 且 `$route` 不变（停住，需要项目自己避免）。自定义 presenter 只返回 null，不要自己调 `SetSelectedOption(NoOptionSelected)`：固定 Runner 在所有 presenter 返回后还会在 L989 再提交一次，直接提交会让第二次调用落在非等待态并抛异常。



| 渠道 | 实际看了什么、怎么取 | 得到候选 | 读不到及原因 |
|---|---|---:|---|
| 官方固定源码 | git trees API 取两个固定提交的全量文件树后本地检索；raw.githubusercontent.com 读 Dialogue.cs、VirtualMachine.cs、DialogueRunner.cs、OptionsPresenter.cs、OptionItem.cs、CHANGELOG、CI 与 Presenter 模板；blob 页核行号 | 26 | GitHub 未认证 REST 多次 60 次/小时耗尽；gh CLI 未安装。见下「按原因归类」 |
| 官方文档/API | docs.yarnspinner.dev 的 sitemap、llms.txt、3.1 的 .md 端点与 API 页；新站 yarnspinner.dev/docs 的 Unity/Godot/Unreal；YSDocs 仓库 markdown | 55 | changelog 页是 JS 壳（正文约 1.9k 字符）；多个 DocFX 成员页 404；旧路径迁到新站 |
| 官方样例与测试 | YarnSpinner-Unity-Samples（部分克隆与 raw）；Tests/DialogueViewTests、DialogueRunnerMockUI；docs 的 Make Options Timeout、PhoneChat | 16 | 主包 `Samples~` 直链 404（隐藏目录/编码）；3.x 起样例拆成独立 Asset Store 包 |
| 官方博客/发布文/月报 | yarnspinner.dev/blog 的 3.1、3.2、3 beta、月报、Saliency、Why no AI；hey.paris 的 3.1 发布文 | 12 | 无 |
| GitHub issue/PR/discussions | YarnSpinnerTool 各仓库的 issue/PR HTML、org 仓库列表、IssuesDiscussion；评论与 cross-reference 读页面 | 64 | 未认证 REST 限流；无 gh CLI；Discord 引用的讨论需登录；少数 issue（如 IssuesDiscussion #33）评论未取 |
| GitHub release/commit/分支 | releases/tag、commit 页、async-vm 分支、固定 SHA raw | 16 | 部分 timeline/cross-referenced 端点仅 API 可见，可能漏掉事件；个别分页未取 |
| 跨引擎官方实现 | YarnSpinner-Godot（C#）、YarnSpinner-Godot-GDScript、Unreal/Rust/Console 仓库；双 runtime 文档 | 30 | Unreal 最新文档页只是 stub；Discord 讨论需登录 |
| 中文社区 | 博客园、B站（搜索/视频/评论 API）、indienova（UA 直连）、lunarconcerto、fasty97、asiagamemaster、ippclub、rd163、dramafork、CSDN、掘金、AtomGit | 23 | 知乎 403；公众号验证码；B站部分页 412；CSDN 521；掘金无 YarnSpinner 结果（属该站无内容，不是读取失败） |
| 替代/商业引擎 | Naninovel、Pixel Crushers、Fungus、ink、Dialogic、Ren'Py、ScenarioFlow、Yarn-Pile、Utage4、YarnFlow、Dora-Story、Loreline | 39 | Asset Store 描述/评论由 JS 渲染；pixelcrushers 首页空正文；Wol 仓库 404；yarnspinner.itch.io TLS 失败 |
| Unity/async 通用契约 | UniTask、Unity Awaitable、destroyCancellationToken、Localization Scripting、Input System、uGUI | 10 | Unity Discussions 403；个别 ScriptReference 页 404 |
| 项目侧 generation/cancellation 契约 | FUI、Moyuta、jishuzhan/Juejin、UnityScreenNavigator、JEngine Skills、CreateLinkedTokenSource | 18 | 知乎/公众号 403；CSDN 521；部分文章只读到摘要 |
| 英文从业者/演讲 | Adam Learns、Secret Lab、GDC 2022 文字稿与视频、radiator dev log、GodotFest | 6 | YouTube 视频未播放；media.ccc.de 连接重置 |
| 列表/市场/发现入口 | awesome 列表、Asset Store、GitHub topics、VS Code 扩展、gamedev-skills、try.yarnspinner.dev | 27 | Asset Store 评论页 JS；publisher 页只显示 Loading |
| 许可/其它 | YSPL | 1 | 无 |

计数按来源类型粗分，同一候选只归一类，与下文的优先级分组不一一对应。

**去重与筛选。** 505 个候选 URL 都做了本轮 Verify 阶段的链接核对；其中约 20 条返回 412/521/000 或因 JS 渲染/登录不可读，已在下表按原因列出，不能宣称全部可达。343 个与任务相关并进入下表，162 个剔除：161 个是 AI 编码 harness／沙箱／Agent Skills 生态候选（与本任务六场景无关，来自同一接收器其他任务口径），1 个是测试保护工具误入。剔除不是资料缺失，是范围筛选。

**读不到的渠道，按原因归类**（只表示该渠道未取到，不作为「那里没有相关信息」的判断）：

- **GitHub REST API / gh CLI（约 38 条）。** 未认证 60 次/小时在共享出口 IP 多次耗尽（core 与 code search 均受影响），本机 PATH 没有 `gh`。改用 github.com HTML、raw.githubusercontent.com、codeload 与局部 `git clone` 继续；少数只能由 timeline API 列全的评论、star/pushed_at 实时值未复核。
- **WebSearch 配额（约 7 条）。** 本会话 200/200 用尽，后段无法再做 site: 或中文关键词扩展，只能沿已知页面的链接、sitemap、GitHub 搜索与 HN Algolia 推进。
- **官方文档路径与 JS 壳（约 17 条）。** docs.yarnspinner.dev/changelog 是 JS 壳；DocFX 成员页（requesthurryupoption、dialoguepresenterbase.runoptionsasync、localizedline.textwithoutcharactername 等）404；旧 YSDocs 路径 404 后迁到新站；llms.txt 与 sitemap 只暴露 2.x 路径，3.1/sitemap.xml 404；Unreal 页面是 stub。
- **Discord（约 8 条）。** yarnspinner 邀请制且无公开归档，PR #250/#285/#184 与 Godot #86 引用的频道消息需登录，只能采用 issue/PR 中的转述。
- **Reddit、Unity Discussions（约 8 条）。** reddit.com/search.json 返回空或 000，redlib 镜像 socket closed；discussions.unity.com 搜索返回 `Crawler is not allowed!`，`/t/<id>.json` 403。
- **中文平台（约 11 条）。** 知乎问题与专栏正文 403（translate.goog、RSSHub 也不可达）；微信公众号返回「当前环境异常」验证页；B站部分视频页验证码/412（搜索、视频、评论 API 可用）；CSDN 三篇 521+JS 反爬。
- **Asset Store 与商店评论（约 7 条）。** 主包页只显示少量评分、无文字评论；headless reviews 路径返回 HTML 外壳；publisher 页商品列表由 JS 渲染。
- **媒体、视频与 itch.io（约 4 条）。** media.ccc.de 的 GodotFest 2026 视频页连接被重置；YouTube GDC 演讲与快速入门 TLS/连接被关闭；yarnspinner.itch.io 两个付费页 TLS 握手失败。
- **其它 403/000/安全校验（约 8 条）。** npmjs 403、JetBrains 博客 403、arstechnica 403、Medium 000、Hugging Face 000、x.ai/cli 000、conductor.build 403、momentic.ai 域名安全校验失败；部分改用原站 API、HN 帖或 GitHub 仓库交叉确认。
- **无相关内容，不是读取失败。** Stack Overflow API 搜 `yarn spinner` 为 0 条；掘金搜索无 YarnSpinner 结果（全是 yarn 包管理器）；少数派未找到相关文章；即刻无公开检索入口；Lobsters 的 search.json 返回 400，站点检索不可用，只经 WebSearch 间接看到 1 条无关帖。

## 排序标准

1. **先固定源，后外延。** 能直接给出固定提交行号、或官方文档明确写出契约的排在前面；「下一版」「跨引擎」「项目侧经验」排在后面，避免把 3.3 的 API 写进 3.2.8。
2. **直接命中六场景优先。** 旧组延迟点击、新组复用同数值 ID、关闭对白后回调、双击、翻译异步晚到、没有可用项，各自单列；只有选型、安装、语法介绍、且不触及异步交接的降到背景。
3. **区分框架保证与项目责任。** 官方源码/文档能证明的「保证」与 issue/PR 暴露的「缺口」分开呈现；项目侧 generation/cancellation 经验只作为补丁参考，不冒充官方契约。
4. **可执行输入优先于观点。** 官方样例、测试替身、真实复现 issue 优先于二手总结；样例本身漏取消的，按反例标注。
5. **跨引擎只作对照。** Godot/Unreal/Rust 的实现能说明哪些行为是契约、哪些只是 Unity 默认 UI 的细节；不把它们当 Unity 3.2.8 的行为。
6. **中文与替代引擎降级。** 中文资料版本断层明显，替代引擎有商业立场；保留作反证和交叉核对，不作为主结论。

## 最值得深挖的前几项

1. **[DialogueRunner.OnOptionsReceivedAsync 真实派发顺序](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/DialogueRunner/DialogueRunner.cs#L881-L1025)（P0.0）。** 这是固定源里最完整的一处调用链：一组选项建立 linked CTS → 逐项 await 本地化 → 并发调用所有 presenter → 先返回的非 null 触发 `currentOptionsCancellationSource.Cancel()`（L939-L945）；「第一个胜出」依赖其余 presenter 在 token 取消后尽快返回 null，固定代码没有顺序/覆盖保护，后到的非 null 仍会覆盖 `selectedOption`（L939-L945）。所有 presenter 返回后：null 仅在 `allowOptionFallthrough` 开启时转成 `NoOptionSelected` 并继续，关闭则 `LogError` 并 return（L985-L996）；等待期间对话已取消则在 Continue 前返回（L979-L983、L1010-L1018）。六个场景的每条断言都要先在这段里定位「谁在等、谁取消谁、返回值何时被丢弃」；不读它，后面的接口草案就只是猜。
2. **[DialoguePresenterBase.RunOptionsAsync 的 XML 契约](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/DialoguePresenterBase.cs#L84-L132) 与 [官方 Presenter 模板](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Editor/Templates/DialoguePresenterTemplate.txt#L67-L92)（P0.0）。** 官方注释和模板要求 token 取消后尽快返回 null，并称返回值不会被使用；但固定实现 L939-L945 仍会采纳后到的非 null 并覆盖先到的选择，所以接口要自己保证「取消后只返回 null」。最小接口草案应直接照此写，不要再造一套 runner 状态机；这是「沿官方 Presenter、不另造 VM」的最短路径。
3. **[OptionItem 的防双击双保险](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/OptionItem.cs#L143-L159) 与 [commit 60a1f31](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/60a1f31bd8a1c156c9209a493b0b112bb1763efc)（P0.0/P0.1）。** `hasSubmittedOptionSelection` + `completionToken.IsCancellationRequested` 是框架对双击和旧组点击的现成防线；但 #199/#230 说明 `Interactable`/CanvasGroup 和旧 onclick 仍要展示层处理。这一组最能划清「框架保证到哪、项目补到哪」。
4. **[内置 OptionsPresenter](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/OptionsPresenter.cs#L165-L370) + [VirtualMachine.SetSelectedOption](https://github.com/YarnSpinnerTool/YarnSpinner/blob/5b3a4ff2d24e4f727e3f90fee5d8ce637474c305/YarnSpinner/VirtualMachine.cs#L389-L424) + [OptionSet.Option](https://github.com/YarnSpinnerTool/YarnSpinner/blob/5b3a4ff2d24e4f727e3f90fee5d8ce637474c305/YarnSpinner/Dialogue.cs#L99-L175)（P0.0）。** 默认实现展示最小接口：全不可用 return null（L167-L180）、completion source 链接 NextContentToken（L191-L196）、选中后取消内部源（L341）、返回前再查取消并返回 null（L364-L366）；VM 只校验等待态与 ID 范围，`Option.ID` 是本组下标且不可用项仍会派发。三处合起来才能说明「新组复用同数值 ID」为什么危险。
5. **[IssuesDiscussion #160](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/160) + [PR #354](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/354) + [#161](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/161)/[#163](https://github.com/YarnSpinnerTool/YarnSpinner/issues/163)（P0.1/P0.2）。** 3.2.8 的真实复现：第二组选项出现时手柄焦点丢失；上一组选中下标被带到下一组。它们把「重排/复用」从理论风险变成可复现输入，并指出 EventSystem 先清旧选择这一层责任。
6. **[IssuesDiscussion #154](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/154)/[#155](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/155)/[#129](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/129) + [#262](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/262)/[#7](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/7)/[#184](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/184)（P0.3）。** 关闭对白后的回调不是单一 bug：completion source 先于状态清理、null 取消字段被当成已取消、Stop 留下 pending UniTask，以及默认 OptionsPresenter 的 `OnDialogueCompleteAsync` 只隐藏 canvasGroup（子视图要等 `RunOptionsAsync` 取消返回时才 `SetActive(false)`）。3.2.8 的 Stop 会并发等待全部 presenter 的 `OnDialogueCompleteAsync`（DialogueRunner.cs L603-L631），但取消责任仍留给调用方，async-vm 才修未运行早退；这是「项目必须保 generation/cancellation」的最强证据组。
7. **[TimeoutOptionsView](https://github.com/YarnSpinnerTool/YarnSpinner-Unity-Samples/blob/main/Samples~/OptionsThatTimeout/Scripts/TimeoutOptionsView.cs) 与 [Make Options Timeout](https://yarnspinner.dev/docs/unity/07-samples/09-options-that-timeout/)（P0.0/P0.7）。** 官方可执行样例：timeout 与点击竞争、后到的 `TrySetResult` 无效、取消时返回 null；源码注释还自述「多个选项同时高亮」的真实 bug。可直接改造成六场景的输入模板，比读 API 页更快落地。
8. **[UnityLocalisedLineProvider](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/LineProviders/UnityLocalisedLineProvider.Installed.cs#L99-L150) + [BuiltinLocalisedLineProvider](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/LineProviders/BuiltinLocalisedLineProvider.cs#L57-L155) + [#344](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/344)/[#296](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/296)/[#91](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/91)/[#88](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/88)（P0.0/P0.5）。** 选项文本在 presenter 之前 await；Builtin 的 asset 路径不接 token，UnityLocalisedLineProvider 的资产加载传 token；#344 的 locale 键错配在固定 3.2.8 已用 `_assetLocaleCode` 修复，不再当现行缺口。另有重复 PrepareForLines、无前置行崩溃。翻译异步晚到的接缝在 LineProvider 而不是 Presenter。
9. **[GDScript dialogue_runner 的 run_id/line_epoch](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript/blob/8753e94d7ef285780e2c9af9cf31415aff0a8769/addons/yarn_spinner/dialogue_runner.gd#L643-L700) 与 [GDScript OptionsPresenter 的 wind-down](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript/blob/8753e94d7ef285780e2c9af9cf31415aff0a8769/addons/yarn_spinner/ui/options_presenter.gd#L142-L205)（P0.2/P1.1）。** 同一官方团队在 Godot 里把 generation guard 写成显式代码（`_run_id` 见 L643-L656，`_line_epoch` 字段在 L178）：旧 run 的协程回来不得碰新 run 状态，stop 时取消 token 并清空选项（L643-L700 覆盖 run 自增、`if run != _run_id` 检查、stop 与清状态）。它是 Unity 侧接口草案最干净的正面样本，但不在固定 Unity 源码内，不能当 3.2.8 的保证。
10. **[新站 Unity 3.3 文档](https://yarnspinner.dev/docs/unity/04-showing-dialogue/07-building-your-own-presenter/) 与 [async-vm 源码](https://github.com/YarnSpinnerTool/YarnSpinner/blob/async-vm/YarnSpinner/AsyncVirtualMachine.cs)（P1.1）。** 只作「下一版方向」：`HandleOptions` 返回 ID、Runner 变 responder、共享 content 取消源。不能写进 3.2.8；但能帮助判断哪些 3.2.8 的项目侧补丁会在 3.3 变成框架内建。

## 六场景读法（断言已写出，执行未验）

下表把候选按场景归位，并写明「要证明什么」。所有断言都要回到固定源码行或官方文档；表中「现有证据倾向」只复述候选理由，未在本轮运行验证。

| 场景 | 先读 | 要证明的断言 | 现有证据倾向 | 责任边界（候选理由所述） |
|---|---|---|---|---|
| 旧组延迟点击 | P0.0 OptionItem/OptionsPresenter/DialogueRunner；P0.1 #63/#230/PR #64/#199/PR #250 | 旧组点击到达时 Runner 是否仍处于 WaitingOnOptionSelection；展示层是否已清按钮、焦点和旧 onclick | OptionItem 有单次提交与 token 检查；旧组按钮若未清且新组仍是同下标，VM 不拒；v2.0.0 曾修「旧组按钮串到新组」 | 框架保证：单次提交守卫、等待态与范围校验。项目必须保：清旧按钮/焦点/onclick、复用同批按钮时切组一帧内禁用或消费旧输入、保本组代次、自定义 presenter 每次返回前检查 NextContentToken；框架不提供选项组状态查询 |
| 新组复用同数值 ID | P0.0 VirtualMachine/DialogueOption；P0.2 #161/#163/PR #354/PR #269 | 提交的是本组 `Option.ID` 还是按钮序号/旧 ID；重排后是否仍映射到原选项 | `Option.ID` 是本组下标；VM 只查等待态与范围；#161 记录上一组下标被带到下一组 | 框架保证：按本组下标校验。项目必须保：提交原 ID/原对象，不用按钮序号或旧 ID；重排时把显示序号映射回原选项 |
| 关闭对白后回调 | P0.3 #154/#155/#129/#262/#7/#184/#347；P1.1 GDScript run_id | Stop 后 pending await 是否还会提交/推进；Stop 是否等待清理、是否关闭 views | 3.2.8 的 Stop 会并发等待全部 presenter 的 `OnDialogueCompleteAsync`（L603-L631），默认 OptionsPresenter 的 `OnDialogueCompleteAsync` 只隐藏 canvasGroup，但 `RunOptionsAsync` 在取消返回前会 `SetActive(false)` 全部子 `OptionItem`（OptionsPresenter.cs L356-L360）；#154/#155 称 async-vm 修复；#184 是 2022 年 v2 时代答复，不作 3.2.8 契约 | 框架保证：运行中 Stop 取消并并发等待 `OnDialogueCompleteAsync`（DialogueRunner.cs L530-L536、L603-L631），默认 OptionsPresenter 只隐藏 canvasGroup（OptionsPresenter.cs L86-L96）；未运行时 3.2.8 的 `await Stop` 可能永不完成（L532-L535 等一个无人完成的源，L568-L583 早退）。项目必须保：自定义 presenter 在 OnDialogueCompleteAsync 清自己的视图/回调（内置 presenter 会自行禁用）、先判 IsDialogueRunning 或加超时、用 destroyCancellationToken/代次隔离迟到回调 |
| 双击 | P0.0 OptionItem/LineAdvancer；P0.4 #147/#241/#95/#213/PR #355 | 同一次按下是否被按钮与 advance 各消费一次；内容到达同帧的输入是否被抑制 | OptionItem 有 hasSubmitted + token 检查；LineAdvancer 抑制同帧输入；输入层仍可能重复 | 框架保证：OptionItem 单次提交、LineAdvancer 同帧抑制。项目必须保：输入层去重/down-up 仲裁、timeScale=0 与自定义视图 |
| 翻译异步晚到 | P0.0 UnityLocalisedLineProvider/Builtin/LineProviderBase；P0.5 #344/#296/#91/#88 | 译文或资源晚到/缺失时本组是否还能提交；取消是否传播到资源加载 | 文本 await 在 presenter 前；Builtin 的 asset 加载不接 token；#344 的 locale 键错配已在固定 3.2.8 修复（历史问题） | 框架保证：文本取译文带 token、在 presenter 前 await。项目必须保：asset 加载取消、缺译/占位符/切语言的显示策略与代次 |
| 没有可用项 | P0.0 OptionsPresenter；P0.6 #1/#265/#364/3.1.1/fallthrough | 全部不可用时返回 null 还是默认选 0；Runner 是否 fallthrough | 3.1 起全不可用返回 null，Runner 的 allowOptionFallthrough 继续；`IsAvailable` 仍会派发 | 框架保证：全不可用返回 null、allowOptionFallthrough。项目必须保：隐藏/禁用/重排策略；presenter 只返回 null，由 Runner 决定 fallthrough（不要在 presenter 内直接 SetSelectedOption） |

所有自定义 presenter 的共同责任：每次返回前检查 `NextContentToken`，取消后只返回 null。固定代码没有「已选则忽略后到结果」的保护，后到的非 null 会覆盖先到的选择（DialogueRunner.cs L939-L945）；只靠「第一个胜出」的注释写 presenter 会踩这个覆盖。

## 候选清单（按任务决定排序）

以下 343 项分为 P0（必读：固定源、六场景证据、官方契约与样例）、P1（重要对照：跨引擎、项目侧契约、替代引擎、英文实践）、P2（背景：中文社区、列表与发现入口）。每项保留原始链接与收集理由；清单内同一链接只出现一次，上文的深挖项与六场景表会回指同一链接。

### P0.0 固定源锚点（20 项）

本组先把「谁拥有本组选项、等待状态、取消入口、按钮提交守卫」的框架侧事实钉在固定提交上；后续各节都以这些行为基线。

- [YarnSpinner-Unity CHANGELOG 3.1：Options Can Now Be Hurried Up And Cancelled](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/CHANGELOG.md#L182) — 官方 3.1 变更说明原文，明确选项从单一取消 token 拆成 hurry-up 与 next 两个 token，是「等待状态/取消入口归谁」的第一手设计依据。
- [DialogueRunner.OnOptionsReceivedAsync 真实派发顺序](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/DialogueRunner/DialogueRunner.cs#L881-L1025) — 一组选项的完整链路：新建 linked CTS、逐项 await 本地化、并发调用所有 presenter；先返回的非 null 触发取消（L940-L945），但后到的非 null 会覆盖 `selectedOption`；null 只在 `allowOptionFallthrough` 开启时 fallthrough（L985-L996），取消则在 Continue 前返回（L979-L983）。这是调用顺序的权威源码锚点。
- [DialoguePresenterBase.RunOptionsAsync 的 XML 契约](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/DialoguePresenterBase.cs#L84-L132) — 官方注释写明 token 取消后「返回值不会被使用、应尽快返回」，并标出旧的 CancellationToken 重载已 obsolete；但固定实现仍会采纳后到的非 null 并覆盖先到选择（DialogueRunner.cs L939-L945），接口草案不能只依赖注释。
- [OptionItem 防双击/防迟到点击的双保险](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/OptionItem.cs#L143-L159) — 内置按钮用 hasSubmittedOptionSelection + completionToken.IsCancellationRequested 才提交，注释直言「runner 不期待时提交选项是错误」；这是框架侧对双击与旧组点击的现成保证。
- [内置 OptionsPresenter 的取消与无可用项处理](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/OptionsPresenter.cs#L165-L370) — 官方默认实现：全不可用直接 return null（L167-L180）；completion source 链接 NextContentToken（L191-L196）；选中后取消内部源（L341）；返回前再查一次取消并返回 null（L364-L366）。可作为最小接口的样板。
- [UnityLocalisedLineProvider 选项文本在呈递前 await](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/LineProviders/UnityLocalisedLineProvider.Installed.cs#L99-L120) — 选项每行在 presenter 之前用组 token await StringDatabase 条目取译文，缺条目替换为 "!! Error: Missing localisation..." 文本；说明 Unity 侧不存在「译文异步晚到再补 UI」的官方通道。
- [VirtualMachine.cs 固定版：按当前组下标校验 SetSelectedOption（L389-L424）](https://github.com/YarnSpinnerTool/YarnSpinner/blob/5b3a4ff2d24e4f727e3f90fee5d8ce637474c305/YarnSpinner/VirtualMachine.cs#L389-L424) — Option.ID 就是 currentOptions 下标；非 WaitingOnOptionSelection 抛 DialogueException，越界抛 ArgumentOutOfRangeException，NoOptionSelected=-1 走 fallthrough；旧组数值 ID 若在新组仍合法，会被当成新组同下标分支。
- [LineAdvancer 的同帧输入抑制与 RequestOptionHurryUp](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/LineAdvancer.cs#L448-L660) — LineAdvancer 只在两个 hurry-up 入口用 `frameContentReceived` 抑制内容到达同帧的输入：行的 `RequestLineHurryUpInternal`（L452）与选项的 `RequestOptionHurryUp`（L546 入口、L548 守卫）；`OnInputNextContent`/`RequestNextLine`（L645/L575-L586）没有该守卫，选项期间仅因 `DialogueRunner.RequestNextLine` 找不到 `currentLineCancellationSource` 而 no-op（DialogueRunner.cs L1115-L1122）。这是「一次点击不会顺带推进下一组」的框架保证来源。
- [官方 Presenter 模板：RunOptionsAsync 契约](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Editor/Templates/DialoguePresenterTemplate.txt#L67-L92) — 模板明确 `IsNextContentRequested` 时必须尽快结束选项并返回 null，默认实现也返回 null，可直接作为自定义 Presenter 的最小契约。
- [提交 30ad162：选项 hurry-up/取消的原始实现](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/30ad1624d26e67c7478e7ca0d9e45537b3fa6c0a) — 3.1 引入选项 hurry-up 的原始提交：新增 `RunOptionsAsync(LineCancellationToken)`、NextContentToken/IsNextContentRequested、RequestHurryUpOption，并让 Runner 在任一 Presenter 返回选择后取消其他 Presenter。
- [ILineProvider 的异步与取消契约](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/LineProviders/LineProviderBase.cs#L40-L70) — `GetLocalizedLineAsync(Line, CancellationToken)` 与 `PrepareForLinesAsync` 都带取消令牌，翻译异步晚到时项目必须沿此契约返回 InvalidLine 或响应取消。
- [BuiltinLocalisedLineProvider.cs 固定提交源码（资源加载不可取消）](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/LineProviders/BuiltinLocalisedLineProvider.cs#L57-L155) — GetLocalizedLineAsync 收 token，但内部 GetLocalizedAssetAsync 不接收也不检查 token，翻译/语音资源晚到无法随对白停止取消，是“翻译异步晚到”的真实缺口。
- [YarnSpinner-Unity Runtime/Views/LinePresenterButtonHandler.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/LinePresenterButtonHandler.cs) — 继续按钮点击直接调用 `dialogueRunner.RequestNextLine()`，是 OptionItem 之外的第二条推进入口，用于核对按钮与输入是否重复提交。
- [YarnSpinner-Unity Runtime/Views/LinePresenter.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/LinePresenter.cs) — 默认行 Presenter 完整消费 `LineCancellationToken` 的显示/收尾流程，可作为 OptionsPresenter 同构实现的对照基线。
- [YarnSpinner-Unity IAsyncTypewriter.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/Typewriter/IAsyncTypewriter.cs) — 官方异步打字机接口把 hurry-up token 传入 `RunTypewriter`，说明行内快进与选项快进共享同一套取消语义。
- [YarnSpinner-Unity LetterTypewriter.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/Typewriter/LetterTypewriter.cs) — 默认打字机实现展示收到取消后如何收尾而不抛异常，是自定义 Presenter 处理快进/取消的可照抄样板。
- [YarnSpinner-Unity LocalizedLine.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/LineProviders/LocalizedLine.cs) — 选项按钮文本由 `TextWithoutCharacterName` 提供，明确点击时能拿到什么文本、哪些说话人与替换信息不在选项标签里。
- [YarnSpinner-Unity VoiceOverPresenter.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/Views/VoiceOverPresenter.cs) — 语音播放结束会触发推进/快进，是自动推进与玩家点击竞争的另一来源，补上“关闭对白后回调”的并发场景。
- [核心 OptionSet.Option 的 ID/IsAvailable/Line 三元契约](https://github.com/YarnSpinnerTool/YarnSpinner/blob/5b3a4ff2d24e4f727e3f90fee5d8ce637474c305/YarnSpinner/Dialogue.cs#L99-L175) — option ID 只是本组下标、不可用项仍会派发，这三条契约解释了新组复用同数值 ID 和灰显项为何必须由项目保身份。
- [Unity DialogueOption 的 DialogueOptionID/TextID/Line](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Runtime/DialogueRunner/DialogueOption.cs#L9-L31) — 提交用 DialogueOptionID（数值、组内有效），查译文用 TextID（行 ID），两者在 OnOptionsReceivedAsync 中从 OptionSet 拷贝。

### P0.1 旧组延迟点击（12 项）

旧组按钮/事件未被清理、复用后仍可提交的证据；用来区分展示层责任与 VM 的等待态检查。

- [YarnSpinner-Unity #63：跳到只含 shortcut 的新节点时旧选项仍可见](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/63) — 旧组按钮未清空且点“残留”选项会让 Runner 卡住，直接对应旧组延迟点击/旧组视觉残留场景。
- [YarnSpinner-Unity PR #286：为 DialogueViewBase 增加 DismissOptions](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/286) — 旧选项组的显式清理入口，可核项目在关闭对白或切组时是否必须额外调用；是否已进入固定 3.2.8 需回提交链确认。
- [YarnSpinner-Unity #266：选项出现时不要 DismissLine](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/266) — 涉及选项展示与上一行/上一组状态的保留，可核本组选项呈现时谁负责清理上一条内容与 LastLine 边界。
- [YarnSpinner 核心 #230：复用按钮残留旧 onclick，SetSelectedOption 在非等待态抛异常](https://github.com/YarnSpinnerTool/YarnSpinner/issues/230) — Reused button 带旧 onclick，触发 SetSelectedOption 时 Dialogue 已不在等待选择，抛“Dialogue wasn't waiting for a selection”；用户自述根因，说明点击源必须随选项组失效。
- [YarnSpinner-Unity commit 60a1f31：点击当下检查 IsInteractable 并只提交一次](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/60a1f31bd8a1c156c9209a493b0b112bb1763efc) — 修复 #199：Selectable 子类不会自动继承 CanvasGroup 的可交互性，必须在点击当下 IsInteractable()；同时保留“Runner 不期待时提交是错误”的单次提交守卫。
- [IssuesDiscussion #160：3.2.8 上第二组选项出现时手柄焦点丢失](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/160) — Unity 6.6 + Yarn Spinner 3.2.8，连续两组 options 的第二组无可见选中项；报告者判断 EventSystem 要先清掉旧选择，正是复用同一批按钮时的 stale focus。
- [YarnSpinner-Unity PR #250：选项淡出后仍 active，隐藏的自定义脚本继续跑](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/250) — v2 时代 `OptionsListView` 的历史修复：选项列表淡出后子 OptionView 未禁用，自定义脚本仍可动画/播音；PR 在 alpha 到 0 和 DialogueCompleted 时禁用全部视图。这是 v2 `OptionsListView` 的缺口，不能当 3.2.8 内置 `OptionsPresenter` 的现状——后者在 `RunOptionsAsync` 取消返回前会 `SetActive(false)` 全部子 `OptionItem`（OptionsPresenter.cs L356-L360）。
- [YarnSpinner-Unity #261：没有公开的 isOptionRunning/onOptions 状态查询](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/261) — 请求公开“当前是否在选项组”的布尔值或事件被拒；维护者称旧 OnLine/OnOptions 事件造成 spaghetti，建议自定义 DialogueView，说明框架不提供选项组状态查询，项目需自己保 generation。
- [YarnSpinner-Unity v2.0.0 release：旧组选项按钮串到新组、同帧选择抛异常](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/releases/tag/v2.0.0) — 发布说明明确修过“option buttons from previous option prompts could re-appear in later prompts”，并记录同帧 SetSelectedOption 现在抛异常、未启用 dialogue view 仍被等待；是旧组残留与同帧提交的历史基线。
- [#64 修复旧选项残留（PR）](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/64) — 维护者确认根因是 invalid options 功能上线后未隐藏剩余按钮，补了遍历隐藏；残留点击属展示层职责而非 VM。
- [#199 Interactable=false 的选项仍可点击](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/199) — 2.2.1 中选项变灰但点击仍提交，父 CanvasGroup 禁用也不生效；修复是在交互瞬间查 `IsInteractable()` 并只提交一次，说明可用性检查必须在点击时做。
- [YarnSpinner-Unity PR #285：被关闭的 onOptionSelected 事件](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/285) — 该 PR 把 `onOptionSelected` 事件放在 `Dialogue.SetSelectedOption` 之前触发，作者在 Discord 讨论后改口建议 DismissOptions 并关闭，记录了“回调先于 VM 状态变更”这一顺序取舍。

### P0.2 新组复用同数值ID与重排（11 项）

Option.ID 是本组下标而不是跨组身份；重排、池化、记住上次下标都会把旧值带进新组，必须保原 ID 与代次。

- [Yarn Spinner IssuesDiscussion #161：始终高亮第一项而非记住上次索引](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/161) — 2026-09 仍开放的复现：OptionsPresenter 会把上一组选中下标带到下一组，直接对应“新组复用同数值 ID”与键盘误确认；a1dbv 未覆盖。
- [Yarn Spinner #163：选择第一项后后续选项自动选中](https://github.com/YarnSpinnerTool/YarnSpinner/issues/163) — 历史复现同一“保存 index”问题并要求 RunOptions 选后清除，说明该行为跨版本存在，需按固定 3.2.8 复核。
- [YarnSpinner-Unity PR #354：选项复用时修复 gamepad focus](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/354) — 2026-10-20 仍开放的修复，说明选项组复用会沿用或丢失焦点状态，对应新组出现时按钮焦点与可用性检查。
- [官方 API：Option.ID](https://github.com/YarnSpinnerTool/YSDocs/blob/main/docs/api/csharp/yarn.optionset.option.id.md) — 官方文档明确 `Option.ID` 就是传给 `SetSelectedOption` 的值，但没有承诺跨组稳定，支持“同一数值 ID 在新组是另一个选项”的判断。
- [官方 API：Dialogue.SetSelectedOption](https://github.com/YarnSpinnerTool/YSDocs/blob/main/docs/api/csharp/yarn.dialogue.setselectedoption.md) — 文档要求 OptionSet 之后、Continue 之前调用并传 Option.ID，未提任何去重或防迟到机制，说明这是调用方必须守的契约。
- [YarnSpinner-Unity PR #146：把 line metadata 暴露到 LocalizedLine](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/146) — 让 presenter 能从 YarnProject/LocalizedLine 读到 #lastline 等行元数据，是 #88/#319 在 Unity 侧的配套改动。
- [YarnSpinner-Unity PR #335：RunOptionsAsync 增加 DialogueRunner 参数](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/335) — 让同一 presenter 服务多个 runner，直接关系“谁拥有本组选项”；但固定 3.2.8 与当前 main 签名都没有该参数，接入前必须核实际分支。
- [YarnSpinner-Unity PR #269：选项编号与按码选择](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/269) — 开放 PR 给选项加显示编号并按 1-5 键选择，展示显示序号到选项 ID 的映射需求。
- [Godot C# OptionsPresenter 的同契约实现](https://github.com/YarnSpinnerTool/YarnSpinner-Godot/blob/b0abe886cf3ac721ec15779ff635057c97396a77/addons/YarnSpinner-Godot/Runtime/Async/OptionsPresenter.cs#L186-L280) — 同契约的另一实现：仍用旧 CancellationToken 重载、总是聚焦第一个可用项、无可见项返回 NoOptionSelected，可与 Unity 的记 index 行为对照。
- [GDScript dialogue_runner 的 run_id/line_epoch generation guard](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript/blob/8753e94d7ef285780e2c9af9cf31415aff0a8769/addons/yarn_spinner/dialogue_runner.gd#L643-L700) — 显式 run_id/line_epoch guard（`_line_epoch` 字段在 L178）：`_run_id += 1` 后各协程检查 `run != _run_id`（L643-L656），`stop_dialogue` 取消当前 line/options token 并清空选项（L670-L700）。
- [GDScript YarnCancellationToken 实现](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript/blob/8753e94d7ef285780e2c9af9cf31415aff0a8769/addons/yarn_spinner/core/cancellation_token.gd#L20-L80) — HURRY_UP/NEXT_CONTENT 两级 token 的可读实现，含幂等 request、escalate 与 wait_for_next_content 契约。

### P0.3 关闭对白后回调（23 项）

Stop、销毁、重入时在途 presenter、completion source、pending task 的收尾证据；固定 3.2.8 与 async-vm 的修复分列。

- [IssuesDiscussion #35：LocalizedLine.Source 标识来源 Runner](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/35) — 官方用 `LocalizedLine.Source` 解决一个 Presenter 服务多个 Runner 时不知道当前对白来源的问题，适用于关闭/重启后回调归属判断。
- [IssuesDiscussion #154：await DialogueTask 后立刻 StartDialogue 会在上一轮 teardown 中重入并停住](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/154) — 第二轮首行后不再请求内容且 IsDialogueRunning 仍为 true；根因是 completion source 先于状态清理发信号、continuation 同步恢复，null 取消字段又被当成已取消；维护者称已在 async-vm 分支修复（3.3）。
- [IssuesDiscussion #155：Stop() 可能留下 pending UniTask，取消路径未收尾](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/155) — 3.2.1 上对象销毁时调用 Stop()，退出 Play Mode 仍有 pending UniTask；提议用 completion source 等待取消处理，维护者称已在 async-vm 分支修复，涉及“关闭对白后回调是否还会跑”。
- [IssuesDiscussion #129：Unity 所有返回 YarnTask 的方法缺可选 CancellationToken](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/129) — 开放提案要求 StartDialogue 等 YarnTask API 接受可选 token 并链接 object-destruction token；说明 3.2.8 仍把取消责任留给调用方，项目需自建 generation/cancellation 契约。
- [IssuesDiscussion #116：命令结束时嵌套 VirtualMachine.Continue 被丢弃，可永久挂起](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/116) — 标题写 >= 3.10、正文写 3.1/3.2（存在版本笔误）；命令完成时 isContinuing 仍为 true，嵌套 Continue 直接返回，循环随后退出没人再唤醒；workaround 是等一帧再 Continue，开放未修。
- [YarnSpinner-Rust #219：每次交互新建 DialogueRunner 后再选 option 报 not running](https://github.com/YarnSpinnerTool/YarnSpinner-Rust/issues/219) — 报错“Can't select option 1: the dialogue is currently not running”；维护者明确 DialogueRunner 应复用而不是每次交互新建，选项选择必须指向仍存活的 runner 生命周期。
- [#262 Stop 后 LineView 继续推进抛 No node has been selected](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/262) — 2.4.0 调 `Runner.Dialogue.Stop()` 后 Auto Advance 仍在约半秒后推进，抛“Cannot continue running dialogue. No node has been selected”；关闭对白后回调的典型事故。
- [#7 Stop 不停止视图，用户用空节点绕过](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/7) — 2018–2023 持续有人报告 `Stop()` 不关闭当前视图、无法从外部中断对话，workaround 是 DismissLine 后 StartDialogue 空节点；取消入口长期缺失。
- [#297 等待选项时 StartDialogue 抛异常](https://github.com/YarnSpinnerTool/YarnSpinner/issues/297) — 用户自动推进时想中断当前节点，发现 VM 处于 WaitingOnOptionSelection 时 StartDialogue 抛“Still waiting on option selection”，必须先 `Stop()`；选项等待态与新对话交接的直接冲突。
- [#18 在 Yarn 命令里 StartDialogue 导致 UI 消失](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/18) — 1.2.6 在命令执行中重启对话，runner 被中断后新节点不继续，维护者标 wontfix 并给 Stop→Start 或协程等待的 workaround；重入启动的早期证据。
- [#231 命令中切换 YarnProject 丢行且少一个选项](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/231) — 2.2.4 里 Stop/Clear/SetProject/StartDialogue 后第一、三行被跳过，选项也少一项；关闭为 not planned，说明换项目时选项组可能不完整。
- [提交 79ed3f7：对话完成时清理取消/完成源](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/79ed3f765b045bbb8f8971c6bd9ac0d43b573756) — 在对话完成时清理取消/完成源，属于关闭对白后回调不落到新会话的基础修复，可与 #154 的残留顺序问题对照。
- [YarnSpinner-Unity #130：事件驱动 minimal runner 提案](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/130) — 把 node start/stop/continue/option selection 定义为四个输入、把推进时机交给调用方，是“谁拥有等待状态”的另一套官方讨论。
- [YarnSpinner-Unity PR #174：minimal runner 示例实现](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/174) — #130 的落地示例，展示完全事件驱动的 line/option 呈现与选择接口，可作为 presenter 之外的第二条交接路径参考。
- [IssuesDiscussion #101（第二次 await StartDialogue 被跳过）](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/101) — 确认连续 await 两次 StartDialogue 会跳过第二次，维护者称需重做核心异步侧，后于 async-vm 修复。
- [IssuesDiscussion #32（Stop 后立刻 Start 的异步重叠）](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/32) — 复现两条 RunLineAsync 同时运行；官方结论是 Stop/Start 现已异步，调用方必须 await 清理，并给出“async aware” commit 0bce73e。
- [YarnSpinner-Godot #86（Stop/Start 触发两次 RunLineAsync）](https://github.com/YarnSpinnerTool/YarnSpinner-Godot/issues/86) — 跨引擎复现同一 Stop→Start 重入，PR #108 未彻底修复后重开，可对照 Unity #32/#154 的失败路径。
- [PR #8: Make LocalisedLine contain line state, not views](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/8) — 把行的运行状态从各 view 收进行对象并区分 Interrupted/Delivered，是 #95 时序讨论的架构前身。
- [YarnSpinner-Unity #91：缺音频导致 CurrentLine 变 null](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/91) — 被 #95 显式引用，说明行状态若由视图决定会在缺资源时丢当前行，是“谁拥有本组选项/行状态”的直接反例。
- [修复提交 010611a（Stop 时 LineView 取消在途行）](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/010611ab6acf1db32612b4a58490160c59df1655) — #262 的实际修复，给出“关闭对白后回调仍继续推进”的取消契约形态。
- [修复提交 96fbbd9（快速连按不再 Stack empty）](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/96fbbd9ba44a80430a5a30fc2c703567b87bdc80) — #213 的修复提交，是双击/快速推进幂等性的唯一代码证据。
- [YarnSpinner-Unity #184（2022 年 v2 时代答复）：Stop 与完成事件](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/184) — 当时的社区答复称 Stop 只停 runner、不关闭 views、不触发 DialogueComplete；不能当 3.2.8 契约：固定 3.2.8 的 Stop 会并发等待全部 presenter 的 `OnDialogueCompleteAsync`（DialogueRunner.cs L603-L631），默认 OptionsPresenter 的 `OnDialogueCompleteAsync` 只把 canvasGroup 隐藏并设为不可交互（OptionsPresenter.cs L86-L96），其 `RunOptionsAsync` 在取消返回前会 `SetActive(false)` 全部子 `OptionItem`（L356-L360）；子视图清理只对自定义 presenter 才是项目责任。
- [Yarn Spinner for Unity PR #347：OnLineDisplayComplete 异步化](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/347) — 展示行显示完成回调改为异步的具体改动，对应“关闭对白后回调”的时序责任。

### P0.4 双击与重复输入（16 项）

一次输入被按钮与推进各消费一次、同帧提交、key down/up 双触发的证据；框架只保证其中一部分。

- [YarnSpinner-Unity #147：一次按键触发两次 Skip 并可能自动选选项](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/147) — 双击/重复输入的实测线索（v2.0.2 环境），用于区分输入层重复与框架提交守卫；需按固定版本复核。
- [YarnSpinner-Unity #80：选项回调必须延迟一帧](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/80) — 同一帧直接回调 onOptionSelected 会静默停住，是同步交接与异步等待边界的历史证据（v2 API，固定版本不复现，只作线索）。
- [#213 快速连按推进导致 VM 栈空崩溃](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/213) — 鼠标和键盘同时推进最后一行时 `UserRequestedViewAdvancement()` 被调两次，VoiceOverView 在 DismissLine 里把 VM 栈弹空抛 `InvalidOperationException: Stack empty`；双击/重复回调的真实崩溃样本。
- [#279 两个选项仍抛 ID 越界 + Still waiting](https://github.com/YarnSpinnerTool/YarnSpinner/issues/279) — 用户只有两个按钮却持续报 `ArgumentOutOfRangeException` 和“Cannot continue… Still waiting on option selection”，同日关闭无解释；可作“症状相同但根因未定”的未决样本。
- [v3.0.0-beta2：修复多个选项同时被选中](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/releases/tag/v3.0.0-beta2) — 发布说明记录“Fixed a bug that could cause multiple option items to be selected at once”，证明选项视图层确实出现过一组内多项同时选中。
- [#95 集中时序：一行不应在一帧内改变两次状态](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/95) — 提案指出 `automaticallyContinueLines` 常因竞态出错、`CurrentLine` 可能在循环中被置 null，并要求同一帧不重复改状态；正是双击/迟到回调类问题的框架内部视角。
- [#172 OptionsListView 不处理“推进”，只有“选哪个”](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/172) — 用户给 OptionsListView 加 DialogueAdvanceInput 按 E 无效，维护者解释选项视图没有 next 概念、只能自定义；键盘/手柄提交需自行接管。
- [#217 timeScale=0 时 LineView/OptionView 冻结](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/217) — 内置预制体用 deltaTime/WaitForSeconds，暂停菜单里选项不出现也不可点，官方建议自定义视图；暂停场景下点击交接会失效。
- [YarnSpinner-Unity #241：同一按键按下选选项、抬起推进对话](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/241) — 记录一次操作被消费两次的冲突，后来给 DialogueAdvanceInput 增加 key/button down 与 up 的选择；是双击/自动推进问题最直接的历史证据。
- [Yarn Spinner 核心 PR #319：自动标记选项前的 #lastline](https://github.com/YarnSpinnerTool/YarnSpinner/pull/319) — 编译期在选项前一行自动加 #lastline 元数据，条件分支/命令会阻止识别且不校验手写标签；这是上一行与选项组衔接的官方机制。
- [YarnSpinner-Unity PR #139：line/interrupt 状态从 runner 移到 view](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/139) — 由 view 决定输入是打断还是推进，解释 v2 时代一次按键产生双重效果的结构性原因，也说明输入归属的演变。
- [YarnSpinner-Unity PR #355（unscaled time）](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/355) — 给内置 presenter 增加 unscaled time 开关，影响选项超时、淡入淡出在暂停和 timeScale 变化下的计时。
- [LineAdvancer API](https://docs.yarnspinner.dev/3.1/api/csharp/yarn.unity/yarn.unity.lineadvancer.md) — 把重复输入映射为 hurry/advance/cancel（multiAdvanceIsCancel、advanceRequestsBeforeCancellingLine），是双击、连按的官方处理入口。
- [Unity Input System Interactions](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.11/manual/Interactions.html) — 原生 Tap/Hold/MultiTap/Press 交互及参数，是博客手写双击/长按逻辑的引擎级替代。
- [Unity Input System UI Support](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.11/manual/UISupport.html) — 说明 Submit 调 ISubmitHandler、Click 走 pointer 输入，解释 #172 中 Space 可用而自定义 E 键不可用的原因。
- [uGUI IPointerClickHandler API](https://docs.unity3d.com/Packages/com.unity.ugui@2.0/api/UnityEngine.EventSystems.IPointerClickHandler.html) — OptionItem 的点击最终落到 OnPointerClick，给出该接口的事件契约与触发条件说明。

### P0.5 翻译异步晚到（22 项）

选项文本在 presenter 之前 await；资源加载、缺译、切语言时的接缝与缺口，重点在 LineProvider 层。

- [官方 LineProviderBehaviour.GetLocalizedLineAsync：异步取译文带 CancellationToken](https://docs.yarnspinner.dev/api/csharp/yarn.unity/yarn.unity.lineproviderbehaviour/yarn.unity.lineproviderbehaviour.getlocalizedlineasync) — Line Provider 的异步取译文入口带取消参数；配套 PrepareForLinesAsync 只是提前通知、不保证会跑，翻译晚到/语言切换的框架接缝在这里而不在 Presenter。
- [YarnSpinner-Unity #344：GetLocalizedAssetAsync 用 sourceLineID 查 locale，异步本地化资源取错](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/344) — 当时 BuiltinLocalisedLineProvider.GetLocalizedAssetAsync 在资源路径用 sourceLineID 调 GetLocalization、文本路径却用 _textLocaleCode；修复为 asset locale id。固定 3.2.8 已是修复后的 `_assetLocaleCode`，这条只作「异步取资源的键错配」历史案例。
- [YarnSpinner-Unity #296：AudioLineProvider 在跳回当前节点时重复 PrepareForLines 注册同一 key](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/296) — 同一节点跳回自身时异步预取表重复 Add，抛 duplicate key 并停止对话；修复改用 TryAdd，提醒异步预取必须对节点重入幂等。
- [IssuesDiscussion #91：运行期加载玩家自制翻译的开放提案](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/91) — 希望在启动时检测外部翻译文件并加入 locale，维护者表示愿意做 API 设计；说明 3.2.8 还没有正式的“译文晚到/后加载”契约，项目需自留接缝。
- [YarnSpinner-Unity #99：节点直接以 options 开始时 lastSeenLine 为空导致崩溃](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/99) — 没有前置行时 options UI 仍尝试显示 lastSeenLine，抛 NullReferenceException；修复加 null check，说明选项组不一定有前置行，交接不能依赖 line 回调先到。
- [YarnSpinner-Unity #88：无法预知行后是否跟 options，最终用 #lastLine 标签交项目处理](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/88) — 希望 RunLine 完成后自动展示 options，维护者解释条件分支使 Runner 无法预知下一内容类型；最终加 #lastLine 手动标签（PR #319/#146），是“行→选项组”边界职责的官方取舍。
- [#104 [select] 只从基础语言取替换值](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/104) — 法语译文里加的 `[select value={$neighbourGender}]` 因基础英文没用该变量，`LocalizedLine.Substitutions` 不含值，译文渲染不出来；翻译晚到/新增占位符的典型缺口。
- [#330 未设置 Asset Table 就运行对话报空表引用](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/330) — 3.0.1 只要用 Unity Localization，Asset Table 为 None 也会访问并抛“Empty Table Reference”，社区给出 IsEmpty 判断；没配语音的项目第一行就炸。
- [#205 assetTable 非 null 但为空仍报错](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/205) — 2.2.2 实验性 UnityLocalisedLineProvider 只判 null 不判 IsEmpty，空表直接异常；与 #330 同属“表存在但没内容”的缺失数据问题。
- [#240 本地化表未标脏，构建缺行触发空引用](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/240) — 2.3.0-beta2 导入后表和元数据不标 dirty，构建中缺行/缺元数据导致 NRE；译文没进包时运行期才炸。
- [#154 播放中重导入 YarnProject 把字符串表存空](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/154) — 2.0.2 在 Play Mode 编辑并保存脚本会把持久字符串表写空，已有译文丢失；本地化数据在开发期就可能整表消失。
- [#287 无法添加 pt-br/en-PH 等区域语言](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/287) — 2.4.2 语言下拉只允许 neutral culture，选了也加载不到字符串表，非程序员只能填错语言码绕过；区域化语言在运行期直接缺表。
- [#5 运行中切换语言：Clear 被拒](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/5) — 用户想在对话运行中清空并重载字符串表，得到“You cannot clear the dialogue system while a dialogue is running”，最终靠 Line Providers 换语言；切换瞬间已显示的选项/行如何处理没有说明。
- [Voice Over and Localisation 示例指南](https://docs.yarnspinner.dev/3.1/yarn-spinner-for-unity/samples/sample-guide-voice-over-and-localisation) — 展示 ILineProvider/IAssetProvider 如何按行 ID 匹配语音与本地化资产，是翻译异步晚到场景的上游读法。
- [Unity Localization 集成（Yarn Spinner 3.1）](https://docs.yarnspinner.dev/3.1/yarn-spinner-for-unity/assets-and-localization/unity-localization.md) — 说明 string/asset table、Base Language 与运行时 locale 切换，对应“翻译晚到/切语言”场景。
- [Dialogue Wheel add-on](https://docs.yarnspinner.dev/3.1/yarn-spinner-for-unity/unity-add-ons/dialogue-wheel.md) — 另一种选项呈现（最多六段/自动布局），付费且要求 Unity 2022.3+，可作为自定义选项 UI 的对照。
- [Unity Localization 1.4 Scripting 文档](https://docs.unity3d.com/Packages/com.unity.localization@1.4/manual/Scripting.html) — 修改表后必须 SetDirty(table) 与 SetDirty(SharedData)，是 #240 构建缺行的官方修法。
- [Unity 论坛：如何用脚本设置本地化字符串](https://discussions.unity.com/threads/localization-how-to-set-strings-via-scripting.1349855/) — 说明 AddEntry 可原地更新、编辑期用 LocalizedStringTable，佐证 #240 的 workaround 与运行时边界。
- [Line Provider 组件文档](https://docs.yarnspinner.dev/components/line-provider) — 给出 GetLocalizedLineAsync 与 PrepareForLinesAsync 的异步/取消职责，用于翻译晚到与资源准备场景。
- [Yarn Spinner Unity Localization 集成文档](https://docs.yarnspinner.dev/yarn-spinner-for-unity/assets-and-localization/unity-localization) — 说明本地化行与资源如何解析，翻译异步晚到必须沿这条实现，而不是只看 Option.ID。
- [Yarn Spinner IssuesDiscussion #33：Unity Localization 元数据行位置](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/33) — 记录 Unity Localization 插入行时无法保持源码行序，补 lineID 与本地化表写入顺序的边界。
- [Yarn Spinner for Unity #187：Localization Processors](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/issues/187) — 官方本地化处理器扩展点提案，标出翻译进入 Yarn 管线的位置。

### P0.6 没有可用项（17 项）

fallthrough、NoOptionSelected、IsAvailable 灰显与跳过的官方语义，以及“全不可用时返回 null 还是默认选 0”的边界。

- [Yarn Spinner IssuesDiscussion #1：全部选项不可用时跳过 OptionSet](https://github.com/YarnSpinnerTool/IssuesDiscussion/issues/1) — 记录“没有可用项”的提案与取舍，是 3.1 fallthrough 的来源，可核 allowOptionFallthrough 的框架边界。
- [Yarn Spinner #265：显示不可用选项的提案](https://github.com/YarnSpinnerTool/YarnSpinner/issues/265) — 解释 IsAvailable 只影响可选性、不移除选项的设计取舍，是“没有可用项”与灰显按钮行为的规格背景。
- [YarnSpinner 核心 #364：#once/#final 提案，一次性选项与全部耗尽后的 fallback](https://github.com/YarnSpinnerTool/YarnSpinner/issues/364) — 讨论一次性选项如何避免作者手写布尔旗标；#once 进入 3.0，但 #final/自动 fallthrough 未在该页确认，区分了作者层“消耗选项”和 Runner 层“无可用项跳过”。
- [3.1.1 发布说明：选项可 hurry/cancel、无可用项 fallthrough](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/releases/tag/v3.1.1) — 官方说明 options 现在有独立 hurry-up/next 令牌、OptionsPresenter 无可用项返回 null、runner 可 fallthrough，旧 `RunOptionsAsync(…, CancellationToken)` 已 obsolete；3.2.8 接线须按这套契约。
- [3.2 旧站文档：Dialogue Runner 的 Allow Option Fallthrough](https://docs.yarnspinner.dev/components/dialogue-runner) — 与固定包同代的 3.2 文档说明 `Allow Option Fallthrough` 在全部选项不可用时继续，可避免把 3.3 新站的 timeout 等新行为误当成 3.2.8 已有。
- [新站 Unity：Options Presenter 的等待与无可用项](https://yarnspinner.dev/docs/unity/04-showing-dialogue/03-options-presenter/) — 新站说明内置 Presenter 会一直等待选择、超时选项必须自定义 Presenter，且全部不可用时不显示任何项、由 Runner 的 fallthrough 决定后续。
- [新站 Unity：Dialogue Runner 的第一选择与 fallthrough](https://yarnspinner.dev/docs/unity/04-showing-dialogue/01-dialogue-runner/) — 新站说明选项发给所有 Presenter 并采用第一个返回的选择，fallthrough 关闭时无人选择会报错停住，是“谁拥有本组”的官方表述。
- [提交 21693b6：无可用选项的 fallthrough 实现](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/21693b6d08fff1644c82d706536eddfe3e20fdcf) — 无可用选项 fallthrough 的实现提交：新增 allowOptionFallthrough，OptionsPresenter 全不可用返回 null，Runner 用 `Dialogue.SetSelectedOption(Dialogue.NoOptionSelected)` 继续。
- [Yarn Spinner API：DialogueRunner.NoOptionSelected](https://docs.yarnspinner.dev/api/csharp/yarn.unity/yarn.unity.dialoguerunner/yarn.unity.dialoguerunner.nooptionselected) — 静态 YarnTask<DialogueOption?> 哨兵，超时或无可用项的自定义 presenter 用它表达“没有选择”，是返回约定的一部分。
- [Yarn Spinner API：DialogueOption.IsAvailable](https://docs.yarnspinner.dev/api/csharp/yarn.unity/yarn.unity.dialogueoption/yarn.unity.dialogueoption.isavailable) — 说明不可用选项仍会被传给 presenter，隐藏还是禁用由视图决定，直接关系到可用性检查放在哪一层。
- [DialogueRunner.NoOptionSelected](https://docs.yarnspinner.dev/3.1/api/csharp/yarn.unity/yarn.unity.dialoguerunner/yarn.unity.dialoguerunner.nooptionselected.md) — 无可用选项或取消时返回的哨兵 YarnTask<DialogueOption?>，是“没有可用项”场景必须区分的返回值。
- [Yarn Spinner commit d482dd1：选项可用性标志](https://github.com/YarnSpinnerTool/YarnSpinner/commit/d482dd18715d7aa4e65a840161a3ca2ed36dbef5) — 把选项末尾条件改为可用性标志的核心提交，确认 `IsAvailable` 的数据来源与 VM 侧语义。
- [YSDocs #85：YarnAsync.NoOptionSelected 文档不存在](https://github.com/YarnSpinnerTool/YSDocs/issues/85) — 官方文档写 YarnAsync.NoOptionSelected 但代码里不存在，实际是 DialogueRunner.NoOptionSelected，契约文档与实现不一致。
- [YarnSpinner-Godot v0.3.20 release：allowOptionFallthrough 与 onDialogueComplete 重复发出修复](https://github.com/YarnSpinnerTool/YarnSpinner-Godot/releases/tag/v0.3.20) — 跨引擎对照：允许无选择继续（allowOptionFallthrough）、修复 onDialogueComplete 发两次、showUnavailableOptions 显示但禁用、IAsyncTypewriter；说明关闭回调与无可用项在两个 runtime 都发生过。
- [YarnSpinner-Godot PR #118（allowOptionFallthrough 与重复完成信号修复）](https://github.com/YarnSpinnerTool/YarnSpinner-Godot/pull/118) — 新增 allowOptionFallthrough 并修复 onDialogueComplete 重复发出，提供跨引擎的“无可用项”和关闭回调对照。
- [YarnSpinner-Godot issue #120（重复 onDialogueComplete）](https://github.com/YarnSpinnerTool/YarnSpinner-Godot/issues/120) — 重复完成信号的最小复现，用于核对关闭对白回调只发一次的场景。
- [Yarn Spinner GDScript Options Presenter 文档](https://yarnspinner.dev/docs/godot/gdscript/04-showing-dialogue/03-options-presenter/) — 有内置 Option Timeout、option_selected(index, option) 与 Allow Option Fallthrough，展示另一运行时如何区分展示下标与选项对象。

### P0.7 官方契约、样例与测试（56 项）

可直接照抄的 Presenter 模板、Timeout/PhoneChat 样例与测试写法；样例也会漏取消，按反例标注。

- [官方文档：Custom Dialogue Presenters](https://github.com/YarnSpinnerTool/YSDocs/blob/main/docs/yarn-spinner-for-unity/components/dialogue-view/custom-dialogue-views.md) — 官方成文契约：不要跨行缓存 LineCancellationToken（每组/每行新建）；第一个非 null 选项返回后 runner 取消其余 token；没 presenter 返回则永远等待。
- [官方文档：Asynchronous Programming（Unity）](https://github.com/YarnSpinnerTool/YSDocs/blob/main/docs/yarn-spinner-for-unity/components/asynchronous-programming.md) — 官方示范用 YarnTaskCompletionSource 把按钮回调桥成 await，并明说默认 OptionsPresenter 就是这样实现；同时列出 Task/Awaitable/UniTask 三种后端的取舍。
- [官方样例指南：Make Options Timeout](https://github.com/YarnSpinnerTool/YSDocs/blob/main/docs/yarn-spinner-for-unity/samples/make-options-timeout.md) — 官方给出的「超时自动选择」完整做法：completion source + 链接取消源 + 取消时 TrySetResult(null)；正是延迟点击/取消交接的现成参考。
- [官方样例源码：TimeoutOptionsView.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity-Samples/blob/main/Samples~/OptionsThatTimeout/Scripts/TimeoutOptionsView.cs) — 可直接读的第一方实现，含 LineCancellationToken 用法、CancelSourceWhenDialogueCancelled，并注释记录了「配置选项项中途被点击导致两个按钮同时高亮」的真实 bug 与规避。
- [官方迁移文档：从 Yarn Spinner 2 升级](https://github.com/YarnSpinnerTool/YSDocs/blob/main/docs/changelog/upgrading-from-yarn-spinner-2.md) — 官方说明改 async presenter 的动机：把呈现、取消与清理集中到 token，替代过去分散的回调方法，可作为「为什么不是回调」的背景依据。
- [官方文档：Options Presenter（Unity）](https://github.com/YarnSpinnerTool/YSDocs/blob/main/docs/yarn-spinner-for-unity/components/dialogue-view/options-presenter.md) — 官方列出 Show Unavailable Options 的含义：不可用项可显示但不可选或直接隐藏，是「可用性检查与是否重排」由项目决定的成文依据。
- [Yarn Spinner 官方文档：Asynchronous Programming](https://docs.yarnspinner.dev/components/asynchronous-programming) — 官方 async 模型（awaiter、如何取消被 await 的代码、completion source）是判断六个点击交接场景哪些由框架保证、哪些要项目自保的第一手依据；a1dbv 现有文档未引此页。
- [Yarn Spinner 官方文档：Options Presenter](https://docs.yarnspinner.dev/components/dialogue-view/options-presenter) — 说明 Options Presenter 显示一组选项、等待用户选择再回传 Runner，是划分“谁拥有本组选项/等待状态”的官方职责描述；a1dbv 只引了源码文件，未引此页。
- [Yarn Spinner 官方文档：Custom Dialogue Presenters](https://docs.yarnspinner.dev/components/dialogue-view/custom-dialogue-views) — 给出实现 RunOptionsAsync 的官方基类与返回契约，直接支撑任务要求的“沿官方 Presenter、不另造 VM”接口草案。
- [Yarn Spinner 官方文档：Dialogue View 概览](https://docs.yarnspinner.dev/components/dialogue-view) — 说明一个 Runner 可挂多个 Presenter、行与选项由 Presenter 竞争呈现，是判断本组选项归属与多 Presenter 取消的总览页。
- [Yarn Spinner 官方样例：Make Options Timeout](https://docs.yarnspinner.dev/yarn-spinner-for-unity/samples/make-options-timeout) — 官方自定义 Presenter 样例，超时后在隐藏项/默认项/当前高亮项三种策略中自动选择，是最接近“旧组延迟点击/超时选择”的可执行参照。
- [YarnSpinner-Unity-Samples 官方样例仓库](https://github.com/YarnSpinnerTool/YarnSpinner-Unity-Samples) — 官方 feature tour 与 timeout 样例的真实工程入口，可作为任务要求的六个可执行输入/期望的落点；a1dbv 未引。
- [Yarn Spinner Dialogue Wheel 官方文档](https://docs.yarnspinner.dev/yarn-spinner-for-unity/unity-add-ons/dialogue-wheel) — 官方付费 Unity 选项转盘 add-on（不在开源包内），是另一套选项呈现所有权与输入路由的实例，a1dbv 未覆盖。
- [官方示例 Make Options Timeout 记录多选项同时高亮](https://docs.yarnspinner.dev/3.1/yarn-spinner-for-unity/samples/make-options-timeout) — 官方超时选项示例自述“multiple options can be flagged as highlighted at once”，并演示取消时把 completion source 置空；可直接当异步选项取消/高亮竞态的已知坑。
- [官方 API：RunOptionsAsync(LineCancellationToken)](https://github.com/YarnSpinnerTool/YSDocs/blob/main/docs/api/csharp/yarn.unity.dialoguepresenterbase.runoptionsasync-2.md) — API 文档给出推荐的 `RunOptionsAsync(DialogueOption[], LineCancellationToken)` 重载，并保留已过时的 CancellationToken 重载，迁移时容易只重写旧签名而丢掉 hurry/next 区分。
- [新站 Unity：Building Your Own Presenter](https://yarnspinner.dev/docs/unity/04-showing-dialogue/07-building-your-own-presenter/) — 新站（标注 Unity 3.3 预发布）写清“最早的返回值获胜、Runner 取消其他 presenter、其余应返回 null”，并给出 completion source + NextContentToken 的标准写法。
- [新站 Unity：Async and Cancellation](https://yarnspinner.dev/docs/unity/05-connecting-to-your-game/08-async-and-cancellation/) — 新站把 hurry-up 与 next-content 的语义、选中选项会触发其他 presenter 的 next-content、以及不得让 OperationCanceledException 逃逸写成明确契约。
- [新站 Unity：Line Presenter / Line Advancer 同帧输入](https://yarnspinner.dev/docs/unity/04-showing-dialogue/02-line-presenter/) — 新站明确“内容到达同帧的输入会被忽略，防止选择选项的键同时推进下一行”，是六场景中一次点击交接的直接文档依据。
- [新站 Unity：A Different Kind of Presenter 的取消示例](https://yarnspinner.dev/docs/unity/04-showing-dialogue/08-a-different-kind-of-presenter/) — 新站给出另一种自定义 Presenter 的完整 RunOptionsAsync：用 `token.NextContentToken.Register(() => chosen.TrySetResult(null))` 处理取消，可直接借作六场景的测试输入模板。
- [PhoneChat 样例：未接取消令牌的自定义选项实现](https://github.com/YarnSpinnerTool/YarnSpinner-Unity-Samples/blob/e06ec66fc7d24757f36f0e6a400ebe3ca71616c8/Samples~/PhoneChat/Scripts/ChatDialogueView.cs#L205-L252) — 官方 PhoneChat 样例的 RunOptionsAsync 只 await 点击 completion source、完全不看 LineCancellationToken，也不过滤 IsAvailable，可作为“自定义 Presenter 漏掉取消/可用性”的反例。
- [DialogueRunnerMockUI：忽略取消令牌的测试替身](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Tests/Runtime/DialogueRunnerTests/DialogueRunnerMockUI.cs) — 官方 DialogueRunner 测试替身的 RunOptionsAsync 同样忽略取消令牌与可用性，仅轮询选中下标，照抄它做测试不会覆盖取消/无可用项。
- [LineViewTests：LineCancellationToken 的官方测试写法](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/Tests/Runtime/DialogueViewTests/LineViewTests.cs#L124-L150) — 官方唯一直接用 LineCancellationToken 构造并 Cancel 的测试样本（针对 LinePresenter），可借其结构为选项六场景补测试；当前没有对应 OptionsPresenter 测试。
- [Yarn Spinner 官方文档：Line Advancer](https://docs.yarnspinner.dev/components/dialogue-view/dialogue-advance-input) — 列出 hurry up/next/cancel 三种请求及 Multi Advance Is Cancel、Advance Count 配置，用来核对一次按键是否会被当成多次推进或取消。
- [Yarn Spinner 官方文档：Upgrading from Yarn Spinner 2](https://docs.yarnspinner.dev/changelog/upgrading-from-yarn-spinner-2) — 记录 DialogueViewBase 回调到 DialoguePresenterBase async 的映射，以及 DismissLine/InterruptLine/UserRequestedViewAdvancement 的移除，解释旧资料为何不能照搬到 v3。
- [Yarn Spinner API：DialoguePresenterBase.RunOptionsAsync](https://docs.yarnspinner.dev/api/csharp/yarn.unity/yarn.unity.dialoguepresenterbase/yarn.unity.dialoguepresenterbase.runoptionsasync-2) — 签名为 YarnTask<DialogueOption?>，确认返回值可空，但 API 页本身没写取消语义，可用来区分“类型保证”和“文档未承诺”。
- [Yarn Spinner API：LineCancellationToken](https://docs.yarnspinner.dev/api/csharp/yarn.unity/yarn.unity.linecancellationtoken) — 区分 HurryUpToken（加速）与 NextLineToken/NextContentToken（停止当前内容），是判断一次点击是“加速”还是“结束本组”的字段依据。
- [Yarn Spinner for Godot（C#）：Options Presenter](https://docs.yarnspinner.dev/yarn-spinner-for-godot/godot-csharp/components/dialogue-presenters/options-presenter) — 同一 presenter 契约在另一运行时的对应实现，可用来判断哪些行为是跨引擎保证、哪些只是 Unity 默认 UI 的细节。
- [Yarn Spinner 官方样例源码：TimeoutBar.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity-Samples/blob/main/Samples~/OptionsThatTimeout/Scripts/TimeoutBar.cs) — async YarnTask 循环逐帧用 Time.deltaTime 递减并在 CancellationToken 取消时退出，展示超时计时如何被对话取消打断。
- [OptionsPresenter.RunOptionsAsync API（官方）](https://docs.yarnspinner.dev/api/csharp/yarn.unity/yarn.unity.optionspresenter/yarn.unity.optionspresenter.runoptionsasync.md) — 给出精确签名 RunOptionsAsync(DialogueOption[], LineCancellationToken) → YarnTask<DialogueOption?>，是异步选项交接的官方契约入口。
- [官方示例：Create a Phone Chat View](https://docs.yarnspinner.dev/yarn-spinner-for-unity/samples/page-1) — RunOptionsAsync 每次先清旧按钮再逐项创建 YarnTaskCompletionSource，可对照旧组延迟点击与按钮复用问题。
- [Yarn Spinner 3.1 发布说明](https://yarnspinner.dev/blog/yarn-spinner-3-1-release/) — 记录 async StartDialogue/Stop、选项 fallthrough、选项 hurry-up/next 取消 token 的引入，是“异步点击交接”能力起点。
- [Yarn Spinner for Unity v3.2.4 release](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/releases/tag/v3.2.4) — VoiceOverPresenter 改用 IRequestLineCancellation、DialogueRunner 实现该接口，补上行/对白结束的取消链路。
- [Yarn Spinner 3.2 发布说明](https://yarnspinner.dev/blog/yarn-spinner-3-2-release/) — 官方称 3.3 将重写 VM 修异步行为 bug，并修复 awaitable 命令注册；这是固定 3.2.8 源码之后必须知道的状态。
- [Yarn Spinner Unity《Options That Timeout》样例](https://yarnspinner.dev/docs/unity/07-samples/09-options-that-timeout/) — 给出用同一个 YarnTaskCompletionSource 让玩家点击与超时竞争、后到的 TrySetResult 无效、token 取消时提前返回的完整样例，可直接改造成“旧组延迟点击”测试。
- [Custom Dialogue Presenters（Yarn Spinner 3.1 官方文档）](https://docs.yarnspinner.dev/3.1/components/dialogue-view/custom-dialogue-views.md) — 给出 RunOptionsAsync 的交接契约：多个 presenter 只取第一个非 null 结果并取消共享 token，无人返回则对话永久卡住，直接对应 #95/#172 的讨论。
- [DialoguePresenterBase API](https://docs.yarnspinner.dev/3.1/api/csharp/yarn.unity/yarn.unity.dialoguepresenterbase.md) — 列出 RunLineAsync(LineCancellationToken) 与 RunOptionsAsync 两个重载的签名，是判断“框架已保证什么”时必须核的接口面。
- [Options Presenter 官方文档](https://docs.yarnspinner.dev/3.1/components/dialogue-view/options-presenter.md) — 说明内置选项列表如何生成 Option View、Show Unavailable Options 与选中后隐藏，是 #199/#172 行为的上游设计依据。
- [Line Presenter 官方文档](https://docs.yarnspinner.dev/3.1/components/dialogue-view/line-presenter.md) — 明确 RequestHurryUpLine 与 RequestNextLine 是两种不同请求，可用来区分“加速”与“下一行”。
- [LineCancellationToken API](https://docs.yarnspinner.dev/3.1/api/csharp/yarn.unity/yarn.unity.linecancellationtoken.md) — HurryUpToken/NextLineToken/IsNextContentRequested 的语义是异步推进与取消的核心信号，比旧版 CancellationToken 更细。
- [OptionItem API](https://docs.yarnspinner.dev/3.1/api/csharp/yarn.unity/yarn.unity.optionitem.md) — OptionItem 继承 Selectable 并实现 ISubmitHandler/IPointerClickHandler，暴露 completionToken 与 OnOptionSelected，解释 #199 的 Interactable 失效面。
- [DialogueRunner.Stop API](https://docs.yarnspinner.dev/3.1/api/csharp/yarn.unity/yarn.unity.dialoguerunner/yarn.unity.dialoguerunner.stop.md) — Stop 是 async YarnTask，会立即停止并取消正在运行的 presenter，是关闭对白后回调场景的官方边界。
- [YarnTaskCompletionSource API](https://docs.yarnspinner.dev/3.1/api/csharp/yarn.unity/yarn.unity.yarntaskcompletionsource-1.md) — 官方示例用它把一次按钮点击 TrySetResult 交接给 presenter，是“一次点击只消费一次”的实现原语。
- [Dialogue.SetSelectedOption API](https://docs.yarnspinner.dev/3.1/api/csharp/yarn/yarn.dialogue/yarn.dialogue.setselectedoption.md) — 必须在 Continue() 之前用 OptionSet.Option.ID 调用，是“新组复用同数值 ID”场景的核心入口。
- [Phone Chat View 官方示例](https://docs.yarnspinner.dev/3.1/yarn-spinner-for-unity/samples/page-1) — 选项用 YarnTaskCompletionSource 等待点击并在切换前清旧按钮；其 CancellationToken 未参与等待，是可引用的反例。
- [Yarn Spinner Samples PhoneChat ChatDialogueView.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity-Samples/blob/main/Samples~/PhoneChat/Scripts/ChatDialogueView.cs) — 官方 Phone Chat 用 `YarnTaskCompletionSource` 为每个选项建按钮，`TrySetResult` 天然防重复完成，但 `RunOptionsAsync` 完全没用 cancellationToken，正好是“框架现成保证 vs 项目需补”的实例。
- [Yarn Spinner Samples ChatDialogueViewOptionsButton.cs](https://github.com/YarnSpinnerTool/YarnSpinner-Unity-Samples/blob/main/Samples~/PhoneChat/Scripts/ChatDialogueViewOptionsButton.cs) — 选项按钮只暴露 `OnClick` 委托，把点击到完成 source 的最短链路固定下来，便于做最小双击复现输入。
- [YSDocs theming-default-views.md](https://github.com/YarnSpinnerTool/YSDocs/blob/main/docs/yarn-spinner-for-unity/samples/theming-default-views.md) — 官方不改代码、只换默认 Presenter 皮肤的样例说明，是“自定义 Presenter vs 默认 Presenter”两条路线的分界。
- [Yarn Spinner 文档 Phone Chat 样例页](https://yarnspinner.dev/docs/unity/07-samples/08-phone-chat/) — 官方说明该样例如何清空旧按钮、每选项一个按钮并返回所选 DialogueOption，且示例忽略 token 可作为反例。
- [Yarn Spinner 官方 Release Notes](https://yarnspinner.dev/docs/readme/) — 逐版本发布说明用于确认 3.2/3.3 是否改动选项或取消行为，避免把旧行号当现行为。
- [Yarn Spinner 官方 Changelog](https://yarnspinner.dev/docs/changelog/) — 官方版本时间线，可定位选项相关改动落在 3.1 还是后续版本。
- [Try Yarn Spinner 文档](https://yarnspinner.dev/docs/try/) — 浏览器内试跑 Yarn，可生成最小选项脚本作为复现输入，不依赖 Unity。
- [Yarn Spinner Editor 文档](https://yarnspinner.dev/docs/yarn-spinner-editor/) — 官方 VS Code 编辑器/预览说明，用于编写和本地验证固定 Yarn 输入。
- [Yarn Spinner for Unity Samples 包（Asset Store）](https://assetstore.unity.com/packages/slug/319418) — 3.x 起示例已拆成独立包，TimeoutOptionsView 与 Option Item 的完整源码在这里而不是主包。
- [官方 Unity Add-Ons 页（Dialogue Wheel/Speech Bubbles/Text Animator）](https://docs.yarnspinner.dev/3.1/yarn-spinner-for-unity/unity-add-ons) — 列出官方付费 presenter 变体，说明选项交接不止 OptionsListView 一种实现。
- [Unity Samples TimeoutOptionsView（超时自动选择）](https://github.com/YarnSpinnerTool/YarnSpinner-Unity-Samples/blob/e06ec66fc7d24757f36f0e6a400ebe3ca71616c8/Samples~/OptionsThatTimeout/Scripts/TimeoutOptionsView.cs#L178-L270) — 官方超时自动选择样例的完整实现（#default/hidden fallback/last highlighted），是 timeout+cancellation 的可执行参考。
- [DialogueRunner 组件文档（3.1）](https://docs.yarnspinner.dev/3.1/components/dialogue-runner.md) — 官方说明 Allow Option Fallthrough 与 Run Selected Options as Lines 两个开关，直接决定“没有可用项”和“选项当行播放”两条路径。

### P0.8 官方发布与博客（10 项）

版本时间线与能力起点；固定 3.2.8 之后 3.3 尚未正式发布。

- [3.1 发布文：We released Yarn Spinner 3.1（Paris Buttfield-Addison）](https://hey.paris/posts/yarnspinner31/) — Yarn Spinner 共同作者的一手发布说明，确认 3.1 的 async runner、选项 fallthrough 与选项 hurry/cancel，可与 CHANGELOG 互证。
- [官方博客：Yarn Spinner in 2026](https://yarnspinner.dev/blog/yarn-spinner-in-2026/) — 团队自述时间线：3.1（2025-12）已交付 async runner 与 option fallthrough，2026 计划中无相关重做；用于判断固定版本之后是否还有语义变化。
- [Yarn Spinner Monthly Update May '26：VM 改原生 async，开发 interruptible dialogue](https://www.yarnspinner.dev/blog/monthly_may_26/) — 官方月报：VM 正重写为“properly, natively async”，目标是让对话等待游戏事件而不阻塞；同时开发 Yarn Spinner+ 的 interruptible dialogue（挂起后精确恢复，带切断/接回台词），会改变现有交接契约。
- [Yarn Spinner Monthly Update Sep '26：Unity VM 重写完成，3.3 计划 2026-10 发布](https://www.yarnspinner.dev/blog/monthly_sep_26/) — 官方月报：Unity VM 重写完成、计划 3.3（2026-10）发布，启用 custom functions 与 cancellable commands，邀请测试 async-vm 分支并提醒备份；截至本次检索未见 3.3 正式发布确认，固定 3.2.8 结论有时效。
- [Yarn Spinner for Unity 3.2 release：awaitable command 注册修复，为 3.3 VM 重写铺路](https://www.yarnspinner.dev/blog/yarn-spinner-3-2-release/) — 3.2 以 bugfix/QoL 为主：修复部分 awaitable commands 未正确注册、增加本地化排序、为 3.3 VM 重写做准备，没有选项交接改动，可作为 3.2.8 现状边界。
- [Saliency and State Mutation](https://yarnspinner.dev/blog/saliency-and-state-mutation/) — 说明候选 storylet 条件会被全部求值，条件内改状态会让后续可用性判断互相污染，对应选项资格求值时序。
- [Yarn Spinner Monthly Update Oct '26](https://yarnspinner.dev/blog/monthly_oct_26/) — 确认 async VM 随 3.3 发布、lines/options/commands 皆为 async 且命令可取消，提醒 3.2.8 的结论不能直接外推到 3.3。
- [Yarn Spinner 3 beta 发布说明（async views 与后端顺序）](https://yarnspinner.dev/blog/yarn-spinner-3-beta-1/) — 官方说明 async dialogue views 与 UniTask→Awaitable→Task 后端顺序；注意它写 Awaitable 需 2023.3，而 async-and-cancellation 文档写 2023.1。
- [Yarn Spinner: Why we don't use AI](https://yarnspinner.dev/blog/why-we-dont-use-ai/) — 上游团队明确不接受生成式内容贡献并说明理由，影响向 Yarn Spinner 上游提交或依赖其源码的策略。
- [Yarn Spinner Monthly Update Oct '26](https://www.yarnspinner.dev/blog/monthly_oct_26/) — 截至 2026-10-31 3.3 仍未发布，但 VM 已全面 async、命令可取消，纠正 Sep '26“计划 10 月发布”的时间线；与上条为同一页面的 www 镜像，因两轮收集分别命中而保留。

### P0.9 仓库与贡献流程（5 项）

为什么这类行为主要写在 CHANGELOG/PR 而不是设计文档；core DLL 如何处理版本号不一致。

- [YarnSpinner-Unity CI：test.yml 组合矩阵](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/.github/workflows/test.yml) — 官方自证测试面：Unity 2022.3/2023.2/6000.x × Unity Localisation 开关 × UniTask 开关，EditMode+PlayMode；说明 UniTask 是一等异步后端，但矩阵里没有选项交接的专项用例。
- [YarnSpinner-Unity PR 模板](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/.github/PULL_REQUEST_TEMPLATE.md) — 官方贡献门槛：必须补测试、文档与 CHANGELOG，并说明是否破坏性变更；可解释为何这类交接行为主要靠变更日志而非设计文档披露。
- [YarnSpinner-Unity CI：update_dlls.yml](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/.github/workflows/update_dlls.yml) — 证明 Unity 包里的核心 DLL 是从 YarnSpinner core 重新构建且在 core 测试通过后才提 PR；解释「core 提交号与 Unity 插件版本号不一致」是设计而非笔误。
- [YarnSpinner-Unity CONTRIBUTING](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/bfc5b6a2e8bc8978e777caeea3a827a0d408cc7d/CONTRIBUTING.md) — 官方声明志愿者维护、开发直接在 main、不提供支持承诺；提醒不要把「官方仓库里没写」读成「框架保证不这样做」。
- [YarnSpinnerTool/IssuesDiscussion 仓库](https://github.com/YarnSpinnerTool/IssuesDiscussion) — 官方 bug、提案与关注点的总入口，是追 Yarn 选项交接后续讨论的索引。

### P1.1 跨引擎官方实现（33 项）

同一契约在 Godot/Unreal/Rust 的写法；GDScript 的 run_id/line_epoch 是 generation guard 的正面样本，但不属于 Unity 固定源。

- [官方 Godot GDScript DialogueRunner 的代际守卫与 stall 告警](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript/blob/main/addons/yarn_spinner/dialogue_runner.gd#L1325-L1363) — 同一官方团队在 Godot 实现里用 _run_id/_line_epoch 判旧回调、并对超 5 秒未返回的 presenter 点名告警；可作 generation/cancellation 契约的正面样本，但不在固定 Unity 源码内。
- [官方 Godot 文档：Async and Cancellation](https://yarnspinner.dev/docs/godot/gdscript/05-connecting-to-your-game/08-async-and-cancellation/) — 官方写明每行/每组选项都拿到新 token、hurry up 与 next content 的区别、stop_dialogue 先发 dialogue_cancelled 再发 dialogue_completed；注意其 5 秒告警在 Unity 3.2.8 中不存在。
- [YarnSpinner-Godot #53：fade time 为 0 时选项列表不可交互](https://github.com/YarnSpinnerTool/YarnSpinner-Godot/issues/53) — 跨引擎证据：选项按钮可用性与淡入完成/可点击状态耦合，提醒 Presenter 层可用性检查不能只看 IsAvailable。
- [核心 async-vm：IDialogueResponder.HandleOptions 契约](https://github.com/YarnSpinnerTool/YarnSpinner/blob/8da3b69debb52997cb54a72e8d88a86a08845143/YarnSpinner/AsyncVirtualMachine.cs#L40-L60) — 3.3 alpha 的 async-vm 把选项组交给 `HandleOptions(OptionSet, CancellationToken)` 并直接返回所选 ID（-1 表示跳过），从接口上消除了 `SetSelectedOption` 的二次提交窗口，是判断框架下一代契约的基准。
- [核心 async-vm：Dialogue.Responder 取代 SetSelectedOption](https://github.com/YarnSpinnerTool/YarnSpinner/blob/8da3b69debb52997cb54a72e8d88a86a08845143/YarnSpinner/Dialogue.cs#L450-L470) — async-vm 的 Dialogue 只保留 `Responder` 转发（HandleOptions 等），全树已无 `SetSelectedOption`，说明 3.3 把等待和选择状态收进 await 调用而非回调。
- [Unity async-vm：DialogueRunner.Stop 早退](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/4daca7feaa1af47084858657e1cf3fb7ecc88e8a/Runtime/DialogueRunner/DialogueRunner.cs#L390-L411) 与 [HandleOptions 选项流程](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/blob/4daca7feaa1af47084858657e1cf3fb7ecc88e8a/Runtime/DialogueRunner/DialogueRunner.cs#L711-L847) — 3.3 alpha 的 Runner 在 Stop 里对未运行/正在取消直接返回（L393-L400），并在 await Dialogue.Stop 后才清源（L406-L410）；HandleOptions 在每个本地化 await 前检查取消、返回 `DialogueOptionID` 而非 SetSelectedOption（L846），对应 #154/#155 与翻译晚到。
- [Unity async-vm 架构提交 c25e3e0](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/c25e3e0e5554da968ea8ae8bf7d73c0e14dce383) — 提交说明列出 3.3 的关键重构：Runner 变成 responder、取消源从按内容类型改为共享 content 源、RunDialogue 取代 StartDialogue，可用来划清 3.2.8 与 3.3 的 API 边界。
- [Godot GDScript：OptionsPresenter 的 wind-down 契约](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript/blob/8753e94d7ef285780e2c9af9cf31415aff0a8769/addons/yarn_spinner/ui/options_presenter.gd#L142-L205) — GDScript 官方实现用 `token.next_content_requested` 一次性回调执行 wind-down（隐藏按钮、清池、返回 -1），并在进入/退出时重置 `_selected_index`，是取消交接的完整参考实现。
- [Godot GDScript：OptionItem 防重复提交与复用 reset](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript/blob/8753e94d7ef285780e2c9af9cf31415aff0a8769/addons/yarn_spinner/ui/option_item.gd#L106-L140) — GDScript 的 OptionItem 用 `_has_submitted_selection` + `reset()` 防重复提交并清理复用状态，可与 Unity OptionItem 的两道保险对照。
- [Godot GDScript 文档：Building Your Own Presenter 的 run_options](https://yarnspinner.dev/docs/godot/gdscript/04-showing-dialogue/07-building-your-own-presenter/) — GDScript 文档明确 run_options 返回选项下标、第一个返回者获胜、其他 Presenter 收到停止后返回 -1，并给出 token 取消时返回 -1 的示例。
- [Godot GDScript 文档：Dialogue Runner 的 Option Timeout/Fallthrough](https://yarnspinner.dev/docs/godot/gdscript/04-showing-dialogue/01-dialogue-runner/) — GDScript 文档说明 Option Timeout、Allow Option Fallthrough、Show Selected Option as Line 三个 Runner 级开关，是 Unity 3.2 没有内置超时时的替代参考。
- [Yarn Spinner 2.2 文档：Community Projects](https://docs.yarnspinner.dev/2.2/about/community-projects) — 收录 GDYarn（GDScript 重实现）和 Wol（Godot 移植）等第三方实现，可作为 options 信号/交接方式的对照；其中 Wol 的仓库链接当前 404。
- [YarnSpinner-Godot PR #56：fadeTime=0 时创建 option view 前等一帧](https://github.com/YarnSpinnerTool/YarnSpinner-Godot/pull/56) — 选项列表在零淡入时创建当帧就被标记 submitted 而不可交互，修复为延迟一帧；与 Unity #80 同类的“同帧交接”坑。
- [YarnSpinner-Unity async-vm 分支](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/tree/async-vm) — #154、#155、#101 的修复都称落在该分支，是核对下一版异步 VM 行为的直接源码入口。
- [YarnSpinner-Godot PR #118（NextFrame 绕法）](https://github.com/YarnSpinnerTool/YarnSpinner-Godot/pull/118/changes) — 命令完成后先 await YarnTask.NextFrame() 再 Continue，是 #116 嵌套 Continue 被丢弃的实际绕行实现。
- [Yarn Spinner for Godot（GDScript）](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript) — 官方第二 runtime，选项 Presenter 明确“第一个被任何 Presenter 选中的选项生效”、TranslationServer 本地化，可核对双 runtime 的选项语义是否一致。
- [Godot 文档 A Different Kind of Presenter](https://yarnspinner.dev/docs/godot/gdscript/04-showing-dialogue/08-a-different-kind-of-presenter/) — 用 `_choices` 把屏幕序号映射回原选项索引、并在 `is_next_content_requested` 时提前返回 -1，正好回答重排后如何提交原 ID。
- [Unreal 文档 Async and Cancellation](https://yarnspinner.dev/docs/unreal/05-connecting-to-your-game/08-async-and-cancellation/) — Unreal 侧把选项 hurry/next 做成独立标志与事件，并警告 Presenter 不返回会永久阻塞，可横向校验 Unity 的同一契约。
- [YarnSpinner-Godot（C#）仓库](https://github.com/YarnSpinnerTool/YarnSpinner-Godot) — 另一官方 C# 集成，可交叉核对选项 Presenter 在非 Unity 引擎的实现差异。
- [YarnSpinner-Godot-GDScript options_presenter.gd](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript/blob/main/addons/yarn_spinner/ui/options_presenter.gd) — Godot 版选项 Presenter 源码，直接对照无可用项、快进与取消的处理顺序。
- [YarnSpinner-Godot-GDScript option_item.gd](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript/blob/main/addons/yarn_spinner/ui/option_item.gd) — Godot 的选项项实现，包含可用性与点击守卫，可与 Unity OptionItem 的双保险对照。
- [YarnSpinner-Godot-GDScript line_advancer.gd](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-GDScript/blob/main/addons/yarn_spinner/ui/line_advancer.gd) — Godot 侧快进/推进输入实现，补 Unity LineAdvancer 的跨引擎参照。
- [YarnSpinner-UnrealEngine 仓库](https://github.com/YarnSpinnerTool/YarnSpinner-UnrealEngine) — 官方 Unreal 集成仓库，用于核对跨引擎选项契约和 Presenter 生命周期。
- [YarnSpinner-Godot-Samples 仓库](https://github.com/YarnSpinnerTool/YarnSpinner-Godot-Samples) — Godot 官方样例，含选项场景可作跨引擎行为对照。
- [YarnSpinner-Console 仓库](https://github.com/YarnSpinnerTool/YarnSpinner-Console) — 官方 CLI，可离线编译固定 Yarn 输入做回归，不启动 Unity。
- [async-vm 分支（固定源 5b3a4ff 不含该文件）](https://github.com/YarnSpinnerTool/YarnSpinner/tree/async-vm) — 候选里的 AsyncVirtualMachine/IDialogueResponder 只存在于 async-vm 分支，固定源 5b3a4ff（v3.2.2）没有此文件，接异步契约前必须先确认版本基线。
- [Godot GDScript 样例：最小 options presenter](https://github.com/YarnSpinnerTool/YarnSpinner-Godot/blob/b0abe886cf3ac721ec15779ff635057c97396a77/Samples/GDScriptIntegration/SimpleGDScriptOptionsPresenter.gd#L1-L45) — 最小 options presenter 只回传 dialogue_option_id、完全不处理取消，展示最小接口与项目必须补的取消契约。
- [YarnSpinner/async-vm · AsyncVirtualMachine.cs（IDialogueResponder 契约）](https://github.com/YarnSpinnerTool/YarnSpinner/blob/async-vm/YarnSpinner/AsyncVirtualMachine.cs) — 官方异步 VM 源码，IDialogueResponder.HandleOptions 返回 int（L54-59 注明返回 NoOptionSelected 时整组跳过），ShowOptions 处把返回值当作当前组的索引校验（L640-680），正是“旧组延迟点击落到新组”必须靠 generation 拦截的框架侧事实。
- [YarnSpinner-Unity commit 2198347：AsyncDialogue 改回 Dialogue](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/commit/2198347e26a9ffc6543cbdeb6bcbd04f71bf950e) — 展示异步内核的公开类型在 2026-11 仍在改名（AsyncDialogue→Dialogue，含 NoOptionSelected 常量迁移），提醒接口草案不要锚定未发布命名。
- [YarnSpinner-Godot PR #108：StartDialogue/Stop 改 async 并新增 ChangeDialogue](https://github.com/YarnSpinnerTool/YarnSpinner-Godot/pull/108) — 同一维护者在 Godot 侧给出的 async Start/Stop 与 ChangeDialogue 形态，可交叉验证 Unity 侧交接接口应长什么样，且合并后 issue #86 仍复现。
- [Technohacker/godot_yarn_spinner（社区 GDScript 编译器插件）](https://github.com/Technohacker/godot_yarn_spinner) — 把 Yarn 编译成 GDScript 并以 command/dialogue/options 信号 + step_through_story(option) 驱动，是“选项交回”另一种信号式契约，可作对照。
- [Godot Dialogue Manager · Using_Dialogue.md（await 取行 + responses.next_id）](https://github.com/nathanhoad/godot_dialogue_manager/blob/main/docs/Using_Dialogue.md) — 另一种契约：await get_next_dialogue_line 返回带 responses 列表的行，选中后按 next_id 继续，全流程无共享可变选择槽，可作为“无 generation 也能正确交接”的对照。
- [mushakushi/yarn-spinner-utility（UPM 实际上游）](https://github.com/mushakushi/yarn-spinner-utility) — 清单里的 neffigie 仓库只是同名镜像，README 的 UPM 地址指向 mushakushi；其 DialogueParser/Observer 以 TryContinue 手动推进，是第三方最小 runner 的接管方式。

### P1.2 项目侧generation与取消契约（25 项）

Unity/.NET 通用取消、生命周期、版本号与旧句柄隔离；用于补框架没有保证的部分，不能冒充官方契约。

- [YarnSpinner-Unity PR #304：YarnTask.WaitUntil 的 Task 版本取消时不提前返回](https://github.com/YarnSpinnerTool/YarnSpinner-Unity/pull/304) — 修复 System.Threading.Tasks 版 WaitUntil 在 CancellationToken 取消时不退出；说明取消传播在框架内部也曾有缺口，项目不能假定所有 await 都尊重 token。
- [Cysharp/UniTask](https://github.com/Cysharp/UniTask) — Yarn Spinner 3 在 UniTask/Awaitable/Task 中优先探测 UniTask；其取消以异常抛出的行为会影响 presenter 的 try/catch，是异步取消实现的底层依赖。
- [Unity Awaitable API 文档](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Awaitable.html) — Yarn Spinner 次选的 Unity 原生 awaiter；官方异步页说明其取消会抛异常且需 catch，与 YarnTask 的包装行为不同，接 presenter 时要区分。
- [FUI（fujisheng）Unity 异步 UI 框架](https://github.com/fujisheng/FUI) — 该系列文章的代码库，Unity 6 MVVM 明确资源所有权和导航生命周期，可直接看 generation/version 防护的实现。
- [Unity Awaitable 官方文档](https://docs.unity.com/en-us/engine/6000.0/script-reference/unityengine/awaitable) — Unity 6 原生 async 类型，支持 Cancel() 但实例被池化、不可重复 await，是 UniTask 方案的官方对照。
- [Unity async-await support 手册](https://docs.unity3d.com/6000.0/Documentation/Manual/async-await-support.html) — Unity 官方 async/await 手册，说明 Awaitable 的调度与生命周期，是 YarnTask 回退链的一环。
- [Unity Input System 1.11 手册](https://docs.unity3d.com/Packages/com.unity.inputsystem@1.11/manual/index.html) — LineAdvancer 的 InputActions/InputAxes 依赖 Input System 1.11，手册覆盖 action asset 与设备切换。
- [FUI · ViewHandle.cs](https://github.com/fujisheng/FUI/blob/main/Packages/com.fujisheng.fui/Runtime/Navigation/Routing/ViewHandle.cs) — 把“视图句柄 + 代际”落成代码，用于隔离旧异步结果，正好对位“旧组延迟点击/旧回调必须带 generation”的项目侧契约。
- [FUI · Navigator.Operations.cs](https://github.com/fujisheng/FUI/blob/main/Packages/com.fujisheng.fui/Runtime/Navigation/Navigator.Operations.cs) — 打开/关闭以 Operation Version 提交、旧结果不得覆盖后续操作的实现入口，可与 Moyuta 的原子提交文章互证。
- [moyuta《返回背包时选中项丢了：导航栈不能把页面状态交给视图池》](https://blog.moyuta.com/posts/game-ui-navigation-stack-view-pool-state-ownership) — 视图池复用会让旧页面状态串到新页面，对应选项视图池化后旧组选中态或回调残留。
- [Juejin 原文《Unity 异步 UI 实战：取消令牌、版本校验与旧句柄隔离》](https://juejin.cn/post/7681991052950519808) — jishuzhan 那篇异步 UI 文章的原发地址，含取消令牌+版本校验+旧句柄隔离的完整系列上下文。
- [Moyuta《渲染资源延迟释放：代际租约必须阻断槽位误删》](https://blog.moyuta.com/posts/render-resource-deferred-release-generation-lease) — 用代际租约阻止旧回调删除新槽位，和“旧组点击不能作用到新组”是同一类所有权问题。
- [Moyuta《UI 导航栈视图池：原子提交》](https://blog.moyuta.com/posts/ui-navigation-stack-view-pool-atomic-commit) — 异步 UI 操作以事务提交/回滚，给“翻译晚到后是否提交新选项组”提供判定框架。
- [FUI 生命周期文档](https://github.com/fujisheng/FUI/blob/main/Packages/com.fujisheng.fui/Documentation~/zh-CN/lifecycle.md) — 把资源/逻辑/视觉三条生命周期和异步版本校验写在一起，是“关闭后晚到回调”契约的可复用模型。
- [Haruma-K/UnityScreenNavigator（uGUI 页面/弹窗导航）](https://github.com/Haruma-K/UnityScreenNavigator) — 提供 async 转场 AsyncProcessHandle 与生命周期钩子，但 README 明确未提供取消 API、弹出的页面立即销毁不可复用，是“异步导航 + 复用”取舍的现成反例。
- [UniTask README：取消与异常处理](https://github.com/Cysharp/UniTask/blob/master/README.md#L226-L268) — 高质量 Unity 异步库的官方约定：GetCancellationTokenOnDestroy 绑定生命周期、SuppressCancellationThrow、以及「基于 player loop 的取消不会立即生效」这一直接影响迟到回调判定的坑。
- [Unity 官方文档：MonoBehaviour.destroyCancellationToken](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/MonoBehaviour-destroyCancellationToken.html) — Unity 官方提供的对象生命周期取消入口，是「关闭对白/销毁 UI 后不再回调」最底层、无需自造 generation 的保证。
- [Unity 异步 UI 实战：取消令牌、版本校验与旧句柄隔离（fujisheng661，2026-09-07）](https://jishuzhan.net/article/2096790928367996929) — 与六场景最贴合的通用契约：async void 只做入口，每次请求独立 CTS + 单调版本号，提交前校验 token/version，finally 也按版本清理；覆盖旧组迟到点击、关闭后回调、双击、翻译晚到四类“旧结果不得提交”。
- [Unity UI 生命周期状态机：处理 Covered、异步竞态与事务回滚（2026-09-07）](https://jishuzhan.net/article/2096892959426531330) — 把 Covered 与 Closed 分开、Open/Close 用 OperationVersion + CancellationToken、过期结果释放租约后丢弃；适合定义“关闭对白后回调”和“新一组选项”的代际边界。
- [动画过渡中断：完成回调必须服从代际所有权（moyuta，2026-08-03）](https://blog.moyuta.com/posts/animation-transition-interruption-generation-ownership) — 用不可变 TransitionToken（Generation/From/To）让旧完成回调只能“提案”不能提交；是“旧组延迟点击/旧动画完成”最干净的中文代际模型。
- [CancellationTokenSource.CreateLinkedTokenSource (Microsoft Learn)](https://learn.microsoft.com/en-us/dotnet/api/system.threading.cancellationtokensource.createlinkedtokensource) — 链接 token 的重载、异常与释放契约，是“多来源取消合并”的规范依据。
- [Unity Application.exitCancellationToken](https://docs.unity3d.com/6000.0/Documentation/ScriptReference/Application-exitCancellationToken.html) — 应用退出级取消令牌，可与 `destroyCancellationToken` 组合成链接令牌。
- [JEngine 的 .claude-plugin/CLAUDE.md](https://github.com/JasonXuDeveloper/JEngine/blob/master/.claude-plugin/CLAUDE.md) — 高质量 Unity 框架把项目级 agent 约定写成短文件：统一用 UniTask、JObjectPool 归还时重置状态、MessageBox 必须 await——与选项池化/回调清理同构的实践。
- [JEngine messagebox Skill（SKILL.md）](https://github.com/JasonXuDeveloper/JEngine/blob/master/.claude-plugin/skills/messagebox/SKILL.md) — 第一方 Skill 明确 async 模态框的常见错误（忘记 await、未处理两个返回值、场景切换前未 CloseAll），可作为「关闭对白后回调」清单的旁证。
- [JEngine jaction SKILL.md](https://github.com/JasonXuDeveloper/JEngine/blob/master/.claude-plugin/skills/jaction/SKILL.md) — 同插件中的零分配 async/取消模式说明，可作为 UniTask 接入约定的旁证。

### P1.3 替代与商业引擎（48 项）

另一套选项所有权、禁用、超时、回滚模型；只作对照，商业引擎的营销文案不计为验证。

- [ink 运行时：ChooseChoiceIndex 的状态校验](https://github.com/inkle/ink/blob/master/ink-engine-runtime/Story.cs#L1794-L1798) — 另一高质量叙事引擎的做法：选项对象自带生成时线程，越界索引直接断言失败，用状态校验而非 token 拒绝旧组点击，可作对照设计。
- [Naninovel（Unity Asset Store）](https://assetstore.unity.com/packages/slug/135453) — Unity 头部商业视觉小说/对话引擎（1.21，2026-09-26，$150，Unity 6000.0.78），可作为选项等待/回滚处理对照；a1dbv 未覆盖。
- [Dialogue System for Unity（Pixel Crushers）](https://assetstore.unity.com/packages/tools/behavior-ai/dialogue-system-for-unity-11672) — 头部商业对话/任务系统（2.2.75.3，2026-11-03，$95），a1dbv 只引过其存档论坛帖，未覆盖当前版本的选项与存档边界。
- [Fungus](https://github.com/snozbot/fungus) — 免费开源的 Unity 互动小说/视觉小说引擎（1.8k star，仍在维护），a1dbv 未覆盖的头部替代。
- [Ibralogue](https://github.com/Ibralogue/Ibralogue) — Unity 对话框架（topic:dialogue-system 头部，2026-03 仍活跃），可对照条件选项与异步呈现；a1dbv 未覆盖。
- [DialogueGraph](https://github.com/TeodorVecerdi/DialogueGraph) — 开源节点式分支对话工具（215 star），Unity 选项编辑的头部替代之一；a1dbv 未覆盖。
- [NodeBasedDialogueSystem](https://github.com/mert-dev-acc/NodeBasedDialogueSystem) — “unity dialogue system”按 star 搜索最高（898），但 2023 后停更；只作头部参考，a1dbv 未覆盖。
- [fluid-dialogue](https://github.com/ashblue/fluid-dialogue) — ScriptableObject 驱动的 Unity 对话图（218 star，2026-03 活跃），可对照选项/条件工作流；a1dbv 未覆盖。
- [ScenarioFlow](https://github.com/dotprologue/ScenarioFlow) — Unity 对话系统库（42 star，近期活跃），日本社区路线，可对照选项等待与取消处理。
- [patter](https://github.com/patterkit/patter) — 2026 年新出的对话编辑器/编译器和多运行时，topic 近期活跃，作为新兴头部候选；a1dbv 未覆盖。
- [Yarn-Pile](https://github.com/zephyo/Yarn-Pile) — 用 Yarn Spinner 的 Unity 视觉小说/点击模板（110 star），可作真实调用顺序与选项 UI 的样例参考；a1dbv 未覆盖。
- [Loreline 的竞品对比：Yarn 选项只有 -> + <<if>>，once/pick/shuffle 与本地化能力受限](https://loreline.app/en/docs/comparison/) — 竞品作者自写、带厂商偏见：称 Yarn 选项用 -> 加 if 条件，once/pick/shuffle 需自定义脚本，本地化仅 CSV 导入导出；不涉及异步选择，但提供替代品视角与功能边界。
- [当 Yarn Spinner 遇上 Lua：一次对话系统的放浪逃亡（李瑾，2025-03-11）](https://ippclub.org/%E5%BD%93Yarn%20Spinner%E9%81%87%E4%B8%8ALua%EF%BC%9A%E4%B8%80%E6%AC%A1%E5%AF%B9%E8%AF%9D%E7%B3%BB%E7%BB%9F%E7%9A%84%E6%94%BE%E6%B5%AA%E9%80%83%E4%BA%A1/) — 给出与 Unity 不同的选项交接契约：文本/选项通过 Lua 协程 yield 暂停，宿主展示后带分支回调恢复，协程自己保存执行位置；可对照 RunOptionsAsync/DialogueOptionID 理解“谁拥有本组选项与恢复权”。
- [YarnFlow README（AtomGit，MIT）](https://atomgit.com/ippclub/YarnFlow) — 非 Unity 运行时的选项交接契约：runner:advance(nil/序号) 返回 Text/Option，选项以序号回传；可直接对照“新组复用同数值 ID”的风险，但不是官方 Unity API。
- [ink 官方 Unity 集成](https://github.com/inkle/ink-unity-integration) — ink 的选择通过 currentChoices + ChooseChoiceIndex 由游戏拉取，与 Yarn 的 presenter 推送模型相反，可作为“谁持有选项”的对照。
- [ink 运行时文档：RunningYourInk](https://github.com/inkle/ink/blob/master/Documentation/RunningYourInk.md) — 明确先 Continue 到 canContinue 耗尽再检查 currentChoices，按索引选择后继续 Continue；给出另一种选项交接时序和“选中后不立即出字”的语义。
- [Fungus Community Edition](https://github.com/Fungus-Community-Edition/Fungus) — Fungus 原仓库 README 已声明停止维护并指向社区版，评估 Fungus 作为替代品时应看这个仍在维护的 fork，而不是 snozbot/fungus 本体。
- [Naninovel 官方 Choices 指南](https://naninovel.com/guide/choices) — @choice 用 goto/handler/lock 参数表达选项，lock 通过按钮 Interactable 控制禁用；与 Yarn 的 IsAvailable + presenter 自行禁用形成对照，可核“可用性检查放哪层”。
- [Utage4（Unity Asset Store）](https://assetstore.unity.com/packages/tools/game-toolkits/utage4-for-unity-text-adventure-game-engine-version4-266447) — ScenarioFlow README 明确把 Utage4 与 Naninovel 并列为更完整的 ADV 引擎；作为商业整包方案，适合界定“框架自带 vs 需要自建”的边界。
- [Pixel Crushers 手册：Standard UI Menu Panel](https://www.pixelcrushers.com/dialogue_system/manual2x/html/standard_u_i_menu_panel.html) — 响应菜单提供 Timer Slider 显示剩余时间，并有 First Selected/导航缓存/Input Device Manager 处理手柄焦点，是商业方案把超时与焦点内置到 UI 层的样本。
- [Speech Bubbles for Yarn Spinner（付费 add-on）](https://docs.yarnspinner.dev/yarn-spinner-for-unity/unity-add-ons/speech-bubbles) — 另一套 presenter：Bubble Content 可承载一组选项、Bubble Input 负责切换显示选项，可对照官方 OptionsPresenter 的职责拆分。
- [Text Animator for Yarn Spinner（add-on）](https://docs.yarnspinner.dev/yarn-spinner-for-unity/unity-add-ons/text-animator) — 展示 RunLineAsync 内 PrepareForContent→RunTypewriter→等待 token.NextContentToken→ContentWillDismiss 的异步等待写法。
- [Ink（inkle 叙事脚本语言）](https://www.inklestudios.com/ink/) — #364 以 Ink 的 *（一次性）/ +（常驻）选项作为语义参照，是 Yarn 之外最直接的替代实现。
- [Dialogue Manager（Godot）](https://github.com/nathanhoad/godot_dialogue_manager) — Godot 的无状态分支对话运行时，可对照 Yarn 的 presenter/VM 职责划分。
- [Dialogic（Godot 视觉小说插件）](https://github.com/dialogic-godot/dialogic) — Godot 4.5+ 的对话/视觉小说插件，用时间线与事件表达选项分支，是选项呈现的另一种模型。
- [yarn-spinner-utility（第三方 Unity runner）](https://github.com/neffigie/yarn-spinner-utility) — 非默认的 Minimal Dialogue Runner + IView 实现，命令用 dialogueParser.TryContinue() 异步续跑，可对照框架 presenter 契约。
- [yarn-spinner-runner-ts（TypeScript 运行时）](https://github.com/oleksii-chekhovskyi/yarn-spinner-runner-ts) — Yarn Spinner 3.x 的 TypeScript parser/compiler/runtime + React adapter，适合在不装 Unity 的环境复现选项消费顺序。
- [Loreline 仓库（jeremyfa/loreline）](https://github.com/jeremyfa/loreline) — seed 中 Loreline 对比页的开源实现，自带 once/pick/shuffle 与多语言 runtime，是“选项模式内建 vs 自定义脚本”的另一端。
- [IppClub/Dora-Story](https://github.com/IppClub/Dora-Story) — YarnFlow 作者团队的 VN 框架，展示 Lua coroutine 版选项/对话挂起如何落到实际游戏层。
- [Ink（inkle 开源叙事引擎）](https://github.com/inkle/ink) — Yarn Spinner 之外最常被拿来对照的分支叙事引擎，choice/flow 由 Story API 驱动，可用于反证框架差异。
- [Naninovel](https://naninovel.com/) — 商业视觉小说引擎，用 @choice 命令与 Dialogue Mode 提供分支/本地化/回滚，是完整引擎路线的对照。
- [Dialogue System for Unity 手册](https://pixelcrushers.com/dialogue_system/manual2x/html/index.html) — 另一套商业对话系统，含分支、本地化与 Lua 逻辑，可与 Yarn 的 presenter/runner 分层比较。
- [Naninovel Input Processing](https://naninovel.com/guide/input-processing) — Submit/Cancel/Navigate/Skip 的标准输入动作表，含手柄映射，直接对照双击与取消入口设计。
- [Pixel Crushers Dialogue UIs 手册](https://www.pixelcrushers.com/dialogue_system/manual2x/html/dialogue_u_is.html) — 标准 UI 把字幕与 Response Menu 分层、支持自定义 `IDialogueUI`，是另一套选项呈现/交接架构。
- [Siccity/Dialogue](https://github.com/Siccity/Dialogue) — awesome-opensource-unity 列出的节点式对话系统条目，组外新候选。
- [Quest-System-Pro](https://github.com/devdogio/Quest-System-Pro) — 同一列表中的任务/对话树系统，分支条件与任务状态耦合，可作为重型替代评估。
- [TMPEffects](https://github.com/Luca3317/TMPEffects) — 该列表明确标注 Yarn Spinner 兼容的文字动效工具，会影响行/选项文本呈现与快进视觉。
- [Febucci Text Animator for Unity](https://www.textanimatorforgames.com/unity) — 官方付费 Text Animator 集成依赖的第三方资源，涉及 typewriter 与 Yarn 标记共存。
- [Speech Bubbles for Yarn Spinner](https://assetstore.unity.com/packages/tools/gui/speech-bubbles-for-yarn-spinner-275933) — 官方付费气泡 Presenter 一次只显示一个选项，由 Bubble Input 切换并处理快进/推进，直接对应单选项视图。
- [Ren'Py](https://www.renpy.org/) — 成熟 VN 引擎的 menu/choice 与回滚模型，可作为选项阻塞和状态回退的对照。
- [ScenarioFlow SimpleSFSample](https://github.com/dotprologue/SimpleSFSample) — ScenarioFlow 官方样例里的 `branch on 2 selections async`，展示 UniTask + 取消令牌的选项交接。
- [Inkpot（UE5 的 ink 集成）](https://github.com/The-Chinese-Room/Inkpot) — 提供另一引擎下 ink 选项 UI 与运行时的职责划分，可作为 Yarn Presenter 设计的反例对照。
- [Dialogic 2](https://docs.dialogic.pro/introduction.html) — Godot 视觉小说/对话框架，选项呈现与状态管理是另一条技术路线。
- [YarnFlow（C++ 编译器 + Lua 运行时）](https://github.com/IppClub/YarnFlow) — 非 Unity 的 Yarn 消费端，用 Lua 协程处理等待与命令，能说明哪些选项交接责任在运行时而非 UI。
- [Text Animator for Unity（Febucci）](https://tools.febucci.com/text-animator/unity) — 与 Yarn Spinner 有官方 bundle，打字机/逐字时序直接影响行呈现的取消与译文晚到处理。
- [Dialogue System for Unity（Pixel Crushers）](https://www.pixelcrushers.com/dialogue_system/) — 被 CSDN 对话系统文章与 Yarn Spinner、Fungus 并列推荐，是评估“自研 vs 采购”的对照项。
- [ink Choice 的 index/sourcePath/tags](https://github.com/inkle/ink/blob/master/ink-engine-runtime/Choice.cs#L10-L50) — ink 的 Choice 是 index+sourcePath+tags，没有跨组稳定 ID，可对照 Yarn Option.ID 的组内语义。
- [Fungus MenuDialog 的焦点清理与超时](https://github.com/Fungus-Community-Edition/Fungus/blob/master/Assets/Fungus/Scripts/Components/MenuDialog.cs#L230-L320) — 独立 Unity 实现同样要先 SetSelectedGameObject(null) 清焦点，并有 autoSelectFirstButton 与 ShowTimer，是焦点/超时的第三方做法。

### P1.4 英文从业者与演讲（6 项）

第一方之外的真实采用、历史基线与开发笔记；可补「官方没写但实际会踩」的时序。

- [实践复盘：Tryhard dev log — Cutscene and Game Scripting with Yarn Spinner v3.0 beta](https://www.blog.radiator.debacle.us/2025/04/tryhard-dev-log-cutscene-and-game.html) — 独立游戏作者（Robert Yang）实际接入 v3 presenter 的过程记录，称可以「skip / cancel all of them gracefully」，是第一方之外的真实采用证据。
- [Adam Learns 的 Yarn Spinner 笔记：RunOptionsAsync、启动预热与暂停时序坑](https://notes.adamlearns.com/notes/godot-game-engine/thirdparty/yarn-spinner/) — Godot 实战笔记：RunOptionsAsync/StartDialogue 异步、选项没有内建 selected 事件、首轮对话卡顿需预热、暂停时 timer 可能在暂停菜单上弹选项；还记录选项隐藏/禁用、CSV/Weblate 本地化与 typewriter 性能坑。
- [Secret Lab《How Night in the Woods Uses Yarn Spinner》：引擎只负责行、选项选择、命令](https://secretlab.games/blog/2017/11/14/how-night-in-the-woods-uses-yarn-spinner) — 引擎作者回顾核心只做三件事：发台词、请求在一组选项中选一个、发命令；Night in the Woods 在其上做气泡/表情/标记，说明选项选择是引擎显式边界而非 UI 细节。
- [GDC 2022《Building Narrative Games with Yarn Spinner》文字稿：选项用 ->，命令返回 coroutine 会被等待](https://gameindustrylibrary.com/documents/building-narrative-games-with-yarn-spinner) — 官方集成演示记录：选项用 -> 与 jump，命令可返回 coroutine 且 Yarn 会暂停到它结束，内置 wait 阻塞推进，命令必须在任何脚本前注册；给出 v2 时代阻塞/异步的基线，便于对照 v3 Presenter。
- [GodotFest 2026《Waiting for GDScript》演讲页：TranslationServer 与双 runtime parity](https://godotfest.com/talks/waiting-for-gdscript/) — 2026 演讲：把 C# runtime 重写为纯 GDScript，接 Godot TranslationServer，用共享测试脚本做双 runtime parity；摘要没有 options/async 细节，但可看本地化与跨实现一致性的方法。
- [GDC 2022 演讲视频](https://www.youtube.com/watch?v=549J0eHE88k) — 给定文字稿的原始视频，可核对 Space Journey 示例与“命令返回 coroutine 会被等待”的原话。

### P2.1 中文社区（20 项）

中文资料以安装、语法、选型和本地化为主，少量输入与本地化实录可作反证；版本断层明显，不能直接当 3.x 行为。

- [cnblogs《Yarn Spinner使用记录》：条件选项、本地化 line ID 与 3.1 反向经验](https://www.cnblogs.com/muyiGin/p/18882607) — 2025-05 中文 Unity 实践笔记：条件选项/once、本地化 line ID、变量持久化；作者称 3.1 表现不正常、建议 2.5 或更低（未给证据），作为中文社区的反向经验需自行核实。
- [【YarnSnipper】unity 剧情对话插件--安装（博客园，2022-02-28）](https://www.cnblogs.com/LemonInCup/p/15948260.html) — 记录 2022 年的 OpenUPM/Git/.unitypackage 三种安装路径与 Unity 2020.1、TextMeshPro 门槛，可解释旧教程与 3.x 的差异；没有选项/异步内容。
- [在 Unity 中安装和使用 Yarn Spinner（星月笔迹）](https://lunarconcerto.cafe/archives/zai-unity-zhong-an-zhuang-he-shi-yong-yarn-spinner) — 2.x 时代最具体的中文选项 UI 搭建文：Line View、Option List View、Option View、Canvas Group、Last Line Components 与按钮推进；可直接对照 3.x Presenter 迁移前后的职责差异。
- [Yarn 脚本语法指南（星月笔迹，编写中）](https://lunarconcerto.cafe/archives/yarn-jiao-ben-yu-fa-zhi-nan) — 明确“连续、同缩进、中间无空行的 -> 属于同一组选项”，是理解本组边界、重排与分组的语法依据；作者自标内容可能过时。
- [关于YarnSpinner插件在Unity中运行的时候有时候空格键失灵的问题（B站专栏）](https://www.bilibili.com/opus/1059008076142608391) — 中文少见的输入问题实录：官方示例也会卡住空格/回车，需挂 DialogueAdvanceInput 或手动调 lineView.OnContinueClicked；说明推进输入被多处消费会造成一次输入多次效果，和双击/连点同源。
- [编写游戏剧本：Yarn Spinner的Unity使用教程（B站，哈德，2024-10-30）](https://www.bilibili.com/video/BV1obSeYREr1) — 目前较新的中文程序向视频；评论区直接反映“网上几乎没有使用教程、要啃文档”，是中文资料稀缺与版本断层的社区证据。
- [【Unity】对话系统YarnSpinner本地化/多语言（B站，2023-02-28）](https://www.bilibili.com/video/BV1Ao4y1a7Cs) — 中文少见的本地化实操视频，覆盖 CSV/Line ID/语言切换流程；未涉及切换语言时已显示的选项组是否刷新，正好是任务要补的空白。
- [【中文字幕】Unity免费对话系统：Yarn Spinner快速入门（B站，2022）](https://www.bilibili.com/video/BV1FS4y1z7Hg) — 传播较广的入门搬运；评论明确说操作与现在“完全不一样、当作上古教程”，是旧 UI/旧 API 不能直接照搬的社区证据。
- [一个月复刻魔塔，我用了这些工具：LDtk、Luban、YarnSpinner（indienova，2024-07-22）](https://indienova.com/u/agoo/blogread/35658) — 真实项目采用 Yarn Spinner 的一手复盘：条件、分支、读写游戏数据、调用函数，纯文本优于可视化；没有选项 UI/异步细节，但能证明生产可用面。
- [游戏剧情交互开发工具（rd163，2025-09-08/更新 2026-07-23）](https://rd163.visword.com/posts/storyline-interactive-tools/) — 中文工具 survey，给出 Yarn Spinner v3.2.1、ysc 编译/导出字符串表/本地化管线与 Ink 对比；适合确认版本与本地化边界，不涉及选项等待。
- [Twine、ink、Yarn Spinner 和 DramaFork 应该怎么选（DramaFork，2026-08-25）](https://dramafork.com/zh-cn/blog/interactive-film-from-zero-to-one-29-how-to-choose-between-twine-ink-yarn-spinner-and-dramafork) — 中文选型文，明确 Yarn 强在引擎内对话与玩法事件、弱在长视频与资产治理；厂商文章，立场需打折。
- [【Unity 插件推薦】Yarn Spinner 對話腳本神器（繁体中文）](https://asiagamemaster.com/article/recommend-unity-plugin-yarns-spinner) — 繁体中文安装/本地化流程与常见坑：OpenUPM 需 Unity 2020.1、Start Node 与 Line Tag/音频文件名必须一致；没有异步。
- [YarnSpinner剧情编辑（fasty97，2020-04-27/更新 2025-12-11）](https://www.fasty97.top/2020/04/27/YarnSpinner%E5%89%A7%E6%83%85%E7%BC%96%E8%BE%91/) — 旧版 API 实例：YarnProgram、dr.Add、AddFunction、onNodeComplete，可用来识别 v1 写法、避免把旧接口当 3.x；没有选项 UI。
- [unity 点击，长按和双击（博客园）](https://www.cnblogs.com/mcyushao/p/17808200.html) — 中文双击/长按检测与单击冲突处理的实现；说明双击不能只靠按钮自身，需在输入层做窗口/仲裁，和 Yarn OptionItem 的一次性提交标志是两层防线。
- [Unity对话系统开发：使用Dialogue Editor插件快速构建可视化对话逻辑（CSDN）](https://blog.csdn.net/weixin_34348805/article/details/91799475) — 虽是另一套插件，但给出与本任务同构的坑：生成新选项前必须销毁旧按钮/移除旧监听器，打字协程要 StopCoroutine，打字期间禁用继续按钮；可作为旧组回调/双击反例（内容农场转载，需核）。
- [Indienova《分支对话工具综述》](https://indienova.com/indie-game-development/tools-for-branching-dialogs-and-narrative/) — 收录 Yarn Spinner 并与 Twine/ink/articy/Fungus/Ren'Py 对比的列表文章，评论区还有 Yarn vs ink 的实际使用反馈。
- [CSDN 原文：Unity 单击、双击、长按事件处理（司军礼）](https://blog.csdn.net/weixin_42498461/article/details/127675691) — 候选里博客园文章标注“转自”此 CSDN 原文，代码与图更完整，是双击检测的原始来源。
- [CSDN：Unity 对话系统开发指南——多分支剧情与多语言本地化](https://blog.csdn.net/weixin_34289454/article/details/89573077) — 与本地化 issue 群（#104/#330/#205/#240/#287）同题的实现文，可补“翻译异步晚到”的工程做法。
- [CSDN：基于 NewGraph 的 Unity 节点图编辑器](https://blog.csdn.net/weixin_33743703/article/details/90184646) — 对话编辑器文章把它列为替代的可视化节点方案，适合判断 Dialogue Editor 之外的编辑器选型。
- [CSDN：基于 Timeline 与 Playable 的可视化剧情编排](https://blog.csdn.net/weixin_34239169/article/details/90324152) — 以 Timeline 而非选项列表驱动剧情的另一条路线，可作为“推进由谁驱动”的对照。

### P2.2 列表与发现入口（19 项）

发现更多实现的入口（awesome、Asset Store、topics、编辑器扩展）；多数不触及异步交接，只作补面。

- [awesome-opensource-unity](https://github.com/StefanoCecere/awesome-opensource-unity) — 2.3k star 开源 Unity 包清单，visual/Gameplay/Scriptings 区列 YarnSpinner、Fungus、Quest-System-Pro、Siccity Dialogue、TMPEffects；a1dbv 未收录。
- [magictools](https://github.com/ellisonleao/magictools) — 17.7k star 游戏开发资源清单，narrative 区仅列 Ink/Ren'Py，可作为发现入口；a1dbv 未收录。
- [awesome-gamedev-agent-skills](https://github.com/gamedev-skills/awesome-gamedev-agent-skills) — 6.9k star，77 个游戏开发 Agent Skills + Claude Code 插件市场，含 dialogue-systems/rpg/visual-novel 技能；a1dbv 未覆盖。
- [gamedev-skills dialogue-systems SKILL.md](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/main/skills/disciplines/dialogue-systems/SKILL.md) — 该技能把 Yarn/Ink 选型、选项条件、line ID 与本地化写成 agent 配方，可核其是否触及异步选项交接（目前只到设计层）。
- [LibreGameDev-Claude-Code](https://github.com/HermeticOrmus/LibreGameDev-Claude-Code) — 20 个 Godot/Unity/Unreal 游戏开发 Claude Code 插件，含对话/UI 相关技能；a1dbv 未覆盖。
- [W-ChouYing/AISkills](https://github.com/W-ChouYing/AISkills) — 中文 92 个游戏开发 Agent Skills 合集，含 dialogue-systems 与 UE5 对话任务技能；中文 skill 市场候选，a1dbv 未覆盖。
- [Yarn Spinner+（Unity Asset Store）](https://assetstore.unity.com/packages/tools/behavior-ai/yarn-spinner-for-unity-the-friendly-dialogue-and-narrative-tool-267061) — 官方付费包（3.2.8，2026-08-07，$75，Unity 2022.3.62f3），与固定开源提交同版本线，是市场头部入口；a1dbv 未引该页。
- [Dialogue Wheels for Yarn Spinner（Unity Asset Store 276025）](https://assetstore.unity.com/packages/tools/gui/dialogue-wheels-for-yarn-spinner-276025) — Dialogue Wheel 的实际付费资源页（与给定文档页、267061 的 Yarn Spinner+ 页是不同商品），可核轮盘如何映射选项 ID 与可用性。
- [branchguard 叙事 QA 清单](https://github.com/ExpectooPatronum/branchguard-narrative-qa-checklist) — 给出分支/可达性/本地化的静态 QA 输入与证据格式，可借来组织六场景断言；但它不覆盖选项计时与输入窗口。
- [HermeticOrmus/claude-code-game-development](https://github.com/HermeticOrmus/claude-code-game-development) — LibreGameDev 包已迁移到的 87 插件合集（含 80 文件参考手册与 Unity/Godot/Unreal 插件），是给定归档仓库的后续主体。
- [try.yarnspinner.dev](https://try.yarnspinner.dev) — 官方浏览器 playground，可直接写两组连续选项复现交接与重排，不必安装 Unity。
- [Yarn Spinner VS Code 扩展](https://marketplace.visualstudio.com/items?itemName=SecretLab.yarn-spinner) — 3.2 起重写的 TypeScript language server 与图视图，编写多组选项测试脚本时是官方编辑入口。
- [GitHub topic: yarn-spinner](https://github.com/topics/yarn-spinner) — 收录 23 个生态项目（模板、Bolt 集成、tree-sitter、Python runner），可继续发现实现与替代方案。
- [gamedev-skills references/ink-and-yarn.md](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/main/skills/disciplines/dialogue-systems/references/ink-and-yarn.md) — 该 Skill 的 Ink/Yarn 语法对照表，补充两套选项语法与条件写法差异。
- [gamedev-skills references/runner.md](https://github.com/gamedev-skills/awesome-gamedev-agent-skills/blob/main/skills/disciplines/dialogue-systems/references/runner.md) — 该 Skill 的自建 runner 参考设计，含 choices schema 与本地化 key，适合作为轻量替代评估。
- [dev.yarnspinner.tmp-essentials](https://github.com/desplesda/dev.yarnspinner.tmp-essentials) — Unity 测试矩阵安装的 TMP essentials 分支，说明测试依赖的文本组件边界。
- [getsentry/dotnet-assembly-alias](https://github.com/getsentry/dotnet-assembly-alias) — update_dlls 工作流用它为 Antlr/Csv/Google/System 程序集生成 `Yarn.` 前缀别名，处理 Yarn DLL 与项目程序集冲突。
- [Yarn Spinner Public License（YSPL）](https://yarnspinner.dev/yspl) — 固定 3.2.8（Unity）与 3.2.2（核心）以及当前开源仓库根目录 `LICENSE.md` 都是 MIT；YSPL 页面明确「our existing tools remain under the MIT License; only these newer product offerings have changed to the YSPL」，只适用于部分新产品。接入开源包必须按仓库和发行版分别核 `LICENSE.md`，不能按「3.x」一概而论。
- [simonSkrippek/YarnSpinner-Unity-RuntimeImports fork](https://github.com/simonSkrippek/YarnSpinner-Unity-RuntimeImports) — 在 #199、#213 两条修复里都同步出现，可用来对照 runtime-only 分发是否带上同版本修复。

## 边界与未关闭

- **未运行 Unity/.NET，未做按钮或输入实测。** 本文件做来源整理与读码定位；「框架保证」均由固定源码或官方文档支持，「项目必须保」仍需非作者按固定提交逐行复核。六场景的接口草案与六组输入/期望已写在「接入者结论」，但均未运行，不能当已验。
- **固定 3.2.8，不是 3.3。** async-vm 的 `HandleOptions`、`RunDialogue`、`Responder` 等只存在于分支或下一版；引用处已标注。PR #335 页面显示 merged，但固定 3.2.8 与当前 main 的 `DialoguePresenterBase` 都没有 runner 参数，接入前须核实际分支。
- **部分候选理由含版本或行号，需复核。** 例如 UTage4 的 Asset Store 页只有营销文案与手册入口，没有可核的异步选项/取消契约；Wol 的仓库链接 404；docs.yarnspinner.dev/changelog 只读到 JS 壳；Godot 的 5 秒 stall 告警不在 Unity 3.2.8。
- **中文资料时效性有限。** cnblogs 作者称 3.1 表现不正常、建议 2.5 或更低，但未给证据；B 站教程多为 2022–2024，API 与 UI 已换代。这些只作社区证据，不作版本行为依据。
- **链接核对范围。** 505 个候选都做了链接核对；其中约 20 条返回 412/521/000 或因 JS/登录不可读，已按原因列出，不宣称全部可达。本单元未逐页重读全部页面；个别页面以 HTML 标题或状态码判断、未读正文，相关理由沿用收集者原文。
- **未新增链接。** 本文件所有 URL 均来自上述候选清单；没有把搜索结果页、转载页或未核实的新地址写进来。

下一步：在 Unity 工程执行「六组可执行输入/期望」并记录实际结果（本轮未运行）；执行前先按固定源码复核「接入者结论」引用的行号，优先核 P0.0 的 20 项与对应场景的 issue，不要从 P2 的选型或安装文起手。
