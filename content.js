/* Personal homepage content and posts. */
window.PORTFOLIO = {
  "posts": [
    {
      "id": "jev-agent-decision-layer",
      "title": "Jev 不负责聊天，却值得进入 Agent 的决策层",
      "date": "2026-10-28",
      "category": "技术与工程",
      "summary": "从两篇 Jev 参考文章出发，核对接口、版本与价格，讨论概率、置信度和权限的区别，以及如何把高频小判断接入可评估、可降级的 Agent 工作流。",
      "tags": [
        "Jev",
        "Agent",
        "决策模型",
        "模型路由",
        "概率校准"
      ],
      "source": "https://mp.weixin.qq.com/s/p9BojZZGgMidFEffEEvCFA",
      "body": "> 本文受公众号 Agent-First 的[《一文读懂 Jev：从大模型中剥离高频小决策》](https://mp.weixin.qq.com/s/p9BojZZGgMidFEffEEvCFA)与广知科技的[《不会聊天的 Jev，为什么突然成了开发者圈的新宠？》](https://mp.weixin.qq.com/s/t_ehLCycSX6XB-vFsahTCQ)启发，结合官方文档与研究重新整理。资料核查截至 2026 年 10 月 28 日；本文没有进行付费 API 实测，也不将参考文章中的演示写成个人复现结果。\n\n一个 RAG 系统检索到二十段材料，接下来要判断：哪些相关、哪些支持答案、哪些值得继续送给强模型。一个 Agent 执行完工具，也要判断：结果够不够、下一步走哪条分支、是否需要升级处理。\n\n这些判断不一定需要一篇回答。系统真正需要的，可能只是一个合法选项、一个分数或一个概率。\n\nJev 值得讨论的地方就在这里：**把高频、答案边界明确的小判断，从通用生成任务中拆出来。**不过，能按类型返回答案，与能可靠地接管工作流，之间还有很长一段工程距离。\n\n## 01 · 它提供的是决策接口，不是另一种聊天体验\n\nTypeSafe 将 Jev 定位为 System One model：输入当前状态与带类型的问题，输出程序可使用的结构化结果。这个命名是厂商对产品形态的定义，不等于已经建立了一个学界公认、边界清晰的新模型分类。[官方介绍](https://typesafe.ai/blog/introducing-system-one-models-and-jev)\n\n当前主要接口可以这样理解：\n\n- **Choice：无序选项。** 在预先定义的候选项里选择，并返回选项概率与 `confidence`。适合工具路由、类别判断；候选集合最好包含合理的“其他”或兜底路径。[Choice 文档](https://docs.typesafe.ai/primitives/choice)\n- **Score：有序量表。** 根据有顺序的文字等级评分，返回分数、等级概率和 `confidence`。分数可以落在两个等级之间，不能直接假定它天然就是 0—100 分。[Score 文档](https://docs.typesafe.ai/primitives/score)\n- **Noul：二元命题。** 返回“是”的概率，字段为 `noul`；它不是布尔值，也不额外返回同名的 `confidence` 字段。`0.82` 表示对某个命题为真的估计，不表示某个动作已获授权。[Noul 文档](https://docs.typesafe.ai/primitives/noul)\n\n一个重要使用条件是：问题要足够原子化。官方建议将多因素的大问题拆开，再由代码组合结果。[接口与组合方式](https://docs.typesafe.ai/introduction)\n\n例如“这份答案好不好”过于模糊。我会拆成“是否覆盖用户的主要问题”“关键事实是否被所给材料支持”“有没有尚未回答的约束”，并为每项定义清楚判定标准。这是本文的设计建议，不是对 Jev 在这些任务上准确率的承诺。\n\n## 02 · 不能用“LLM 会输出坏 JSON”证明它的全部价值\n\n两篇参考文都强调了有限输出空间的优势。这一点值得保留，但比较对象需要升级。\n\n通用大模型并不只有“提示它输出 JSON”这一种接入方式。以 Claude 的官方结构化输出为例，它已经提供基于 schema 的约束解码与严格工具参数机制。因此，公平的基线应该包含结构化输出模式，而不是刻意选一个格式容易出错的普通聊天接口。[结构化输出文档](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)\n\n真正应该比较的是：在相同输入、相同候选集合和相同错误代价下，Jev 是否能用更低延迟与成本，得到足够好的语义判断，以及对错误有用的不确定性信号。\n\n格式安全可以消除一部分解析失败；**它不能保证候选集合完整、输入事实可靠，也不能保证选中的答案正确。**当所有选项都不合适时，一个总能返回合法选项的系统，甚至可能更稳定地做错事。\n\n所以，“没有自由文本生成”是一种接口约束，不是语义零错误的证明；“只能选择允许的动作名称”也不等于这个动作在当前用户、资源和时间范围内被允许执行。\n\n## 03 · 几个容易过期或被混淆的事实\n\n**多模态能力需要分版本、分稳定性。**10 月 14 日的官方更新开放了实验性图像输入，并说明图像能力也可用于 `jev-1.13.0`；新增 `box` 类型则要求 `jev-1.14.0`。所以，“Jev 完全不能看图”已经不准确。[Jev 1.14 发布说明](https://typesafe.ai/blog/jev-1-14)\n\n但反过来，也不能把实验性能力说成成熟视觉方案。当前文档将 Images 与 Box 标为未达到生产可靠性标准、默认关闭且需显式开启的功能；接口、限制和准确率可能变化。图像输入也不意味着已经提供音频、视频的原生理解能力。[图像文档](https://docs.typesafe.ai/images)\n\n**价格和版本应读当前模型表。**此次查阅的官方文档列出 `jev-1.14.0` 与 `jev-1.13.0`，输入价格均为每百万 token 0.042 美元，输出 token 免费。该表还区分请求与单问题的上下文限制；这不是所有第三方平台、网络环境和附加能力的统一服务承诺。[模型与计费说明](https://docs.typesafe.ai/models)\n\n**采用率要带上统计口径。**Vercel 报告称 Jev 在上线首 14 天触达其 35.3% 的外部付费团队；同一窗口支出占比很低。月度报告又给出了不同时间窗口的请求与支出数据。这些是 AI Gateway 平台内的观察，不能改写成整个开发者市场的份额，更不能把两个窗口的百分比混为一谈。[Vercel 生产指数](https://vercel.com/blog/ai-gateway-production-index-october-2026)\n\n这些信息能说明它值得评估，却不足以替任何具体业务证明收益。\n\n## 04 · `confidence` 不是一个通用的“正确率按钮”\n\n这是我认为最值得从参考文章继续往下挖的一层。\n\n官方文档说明，Choice 的 `confidence` 是根据候选概率计算的统计量，而不是另一次独立的“我有多大概率答对”估计。对有 n 个选项的 Choice，当前定义为：\n\n```text\nconfidence = (最高选项概率 - 1/n) / (1 - 1/n)\n```\n\n例如有三个选项时，最高选项概率为 0.90，按这个公式得到的 `confidence` 是 0.85。两者不是同一个数字。Noul 则只有“是”的概率：接近 0 可能表示非常确定地否定，不能被简单理解为“低概率，所以转人工”。[Confidence 定义](https://docs.typesafe.ai/confidence)\n\n还要继续区分两个问题：\n\n- **校准：** 一组声称有相近概率的判断，长期正确比例是否与之相符？\n- **错误排序：** 低置信度样本是否真的更容易出错，值得优先升级？\n\n这两者相关，却不等价。对多语言、任务变化、候选项调整或分布外输入，原有关系可能失效。\n\n一项覆盖 37 个数据集、针对 Jev 1.13 的预印本报告了有竞争力的选择任务表现，但也发现部分二元判断不能直接依赖固定 0.5 阈值，需要按任务调整。[基准预印本](https://arxiv.org/abs/2609.37647)\n\n另一项关于印尼地区语言的预印本进一步提示：整体校准误差没有明显变坏，不代表模型排序自身错误的能力仍然良好。研究里的级联收益依赖具体数据集与配置，不能当作中文业务的现成结论。[跨语言研究](https://arxiv.org/abs/2610.14112)\n\n因此，“高于 90% 自动执行、60%—90% 调强模型、低于 60% 转人工”最多是一个待验证的示意。它既没有区分概率与 `confidence`，也没有考虑错误后果，不能直接复制成生产策略。\n\n## 05 · 更适合它的位置：受约束的决策层\n\n在我设想的 Agent 架构里，Jev 不应成为一个拥有最终权限的指挥中心。它更适合在代码定义的边界内，提供一个可以拒绝采纳的语义信号。\n\n```text\n事件与材料\n   ↓\n代码规范化：对象、时间、任务状态、候选动作\n   ↓\n规则检查：权限、资源约束、幂等性与明确禁令\n   ↓\nJev：分类／评分／二元命题\n   ↓\n策略层：验证输出、应用已评估阈值、检查任务边界\n   ├─ 满足条件 → 执行可授权的动作并验证结果\n   ├─ 语义复杂 → 升级强模型，必要时再确认\n   └─ 缺信息／代价高 → 询问用户或转人工\n```\n\n这是本文提出的示意架构，不是 TypeSafe 的服务内部实现。\n\n以检索材料筛选为例，我会先用代码去重、限制长度并附上文档身份，再让模型分别判断“是否相关”和“是否足以支持当前主张”。对于被保留的证据，保留来源位置；对于存在冲突或缺少依据的材料，让后续步骤继续核实，而不是因为一个高分就直接生成确定答案。\n\n涉及外部写入时，也不让模型绕过资源权限或业务约束。比如某张工单已被人工接管，这个确定性事实应先由代码处理，不必让另一个模型重新猜测是否应该接管。\n\n原子问题还需要正确组合。若两个判断互为条件，不能因为接口能并行询问，就默认它们可以彼此共享尚未产生的答案。先取得必要结果，再用代码决定下一阶段，通常比把所有依赖塞进一次“大而全”的查询更容易验证。\n\n## 06 · 便宜调用之外，要算整条链路的账\n\n按上述官方输入价，假设一万次调用，每次总输入恰好 2,000 token，那么模型输入费用约为：\n\n```text\n10,000 × 2,000 / 1,000,000 × $0.042 = $0.84\n```\n\n这是按标价进行的示例计算，不是本文的实际账单。总输入还应包括问题、判断标准等内容，不能只计算业务原文。\n\n真正影响产品收益的成本更接近：\n\n```text\n总成本 = 状态获取与清洗\n       + 决策调用\n       + 升级比例 × 强模型处理成本\n       + 校验、记录、失败恢复与实际执行\n```\n\n如果为了省一次判断，先花几秒钟截图、OCR、抓取网页和压缩状态，端到端体验未必更快。如果减少的小模型费用，被更高的误判复核率抵消，模型单价也无法单独证明系统更便宜。\n\n我的建议是同时记录 p50／p95 端到端延迟、升级比例、有效任务完成率、错误操作率和每个成功任务的总成本，而不是只展示一次 API 的响应时间。\n\n此外，标签稳定、已有大量优质标注数据的业务，也应纳入传统分类器；规则可以精确写清的判断，直接用代码。Jev 的合理对手包括规则、专用分类器和带结构化输出的通用模型，而不只是最昂贵的强模型。\n\n## 07 · 我会怎样做一次小范围验证\n\n先从可回滚、错误代价较低的任务开始，例如内部资料分流；把发送消息、付款或权限变更留在独立的授权流程里。\n\n准备来自真实业务、经过适当脱敏的数据，覆盖正常样本、边界样本、缺字段、冲突指令和不属于任何候选项的输入。按时间或来源划分训练／校准／测试集，避免同一事件的近重复文本流入两侧。\n\n保持各个基线看到的状态与标签含义一致，比较整体质量，也分别看高代价错误和少数类别。阈值只在校准集调整，再在保留测试集评估覆盖率、被自动处理部分的错误率，以及升级后的端到端收益。\n\n有三个变量需要格外警惕：\n\n- **状态是否足够。** 再好的决策接口，也无法可靠补回系统根本没有提供的关键事实。\n- **题目是否变了。** 改动说明文字、候选项、语言或状态长度之后，需要重新评估，而不是沿用旧阈值。\n- **版本是否变了。** 基线测试应记录具体模型 ID；跟随动态别名升级时，要有回归检查和回滚方案。\n\n官方针对 1.13 的已知局限也提醒开发者关注数值精确性、日期比较、冗余状态和题目定义。这些是该版本的记录，不能原样当成 1.14 的实测结论；但它们很适合作为测试用例设计的起点。[已知局限](https://docs.typesafe.ai/model-jaggedness/jev-1.13)\n\n之后再做影子运行：先记录模型建议而不实际改变线上动作，检查失误来源；只有质量、升级成本与恢复机制都能接受，才逐步扩大自动处理范围。这是工程实施建议，不是本文已经完成的实验。\n\n## 让模型做小判断，让系统承担完整责任\n\nJev 让我感兴趣的，不是“不会聊天”这个反差，而是它把一个经常被忽略的层次单独拿了出来：软件内部大量、重复、必须能被程序消费的语义判断。\n\n它是否适合一个业务，最终取决于真实样本上的质量、代价、延迟与可维护性。输出类型稳定，是接入的起点；概率经过验证、升级路径可靠、执行权限明确，才有机会形成一个值得托付的工作流。\n\n**把强模型放在需要开放式推理的位置，把小决策交给经过评估的组件，把确定性的责任留给代码。**这比让某个模型包办所有步骤，更值得作为 Agent 架构的长期方向去验证。\n\n---\n\n## 参考与说明\n\n- 原文启发：[Agent-First／AI路上](https://mp.weixin.qq.com/s/p9BojZZGgMidFEffEEvCFA)，2026-10-24；[广知科技](https://mp.weixin.qq.com/s/t_ehLCycSX6XB-vFsahTCQ)，2026-10-28。两篇内容已在浏览器中读取；文章为独立分析，不复制其图片与全文。\n- 产品信息：[TypeSafe 首发说明](https://typesafe.ai/blog/introducing-system-one-models-and-jev)、[1.14 更新](https://typesafe.ai/blog/jev-1-14)、[当前模型表](https://docs.typesafe.ai/models)、[图像功能](https://docs.typesafe.ai/images)。\n- 接口定义：[Choice](https://docs.typesafe.ai/primitives/choice)、[Score](https://docs.typesafe.ai/primitives/score)、[Noul](https://docs.typesafe.ai/primitives/noul)、[Confidence](https://docs.typesafe.ai/confidence)。文中没有调用真实账户或提供可直接用于生产的阈值。\n- 采用情况：[Vercel 2026 年 10 月生产指数](https://vercel.com/blog/ai-gateway-production-index-october-2026)。仅代表该平台统计范围。\n- 研究：[Jev 基准评估](https://arxiv.org/abs/2609.37647)、[地区语言迁移研究](https://arxiv.org/abs/2610.14112)。均按预印本证据使用，不将其中结果当成本文的亲测或所有场景的保证。\n- 封面为 AI 生成的编辑性概念插画；“JEV 芯片”只是决策层的视觉隐喻，不代表真实硬件、官方产品图或公司标识。",
      "cover": "assets/blog-jev-agent-decision-layer.png",
      "alt": "Jev 决策层概念插画：输入状态经过模块连接 Choice、Score 与 Noul。AI 生成，不代表真实硬件或官方产品标识。",
      "status": "published",
      "images": []
    },
    {
      "id": "personal-agent-person-like",
      "title": "Personal Agent 是一个错误的产品定义",
      "date": "2026-10-28",
      "category": "产品与工程",
      "summary": "如果 personal 只让人想到订机票、叫车和生活助理，它就低估了这类产品。真正值得讨论的是：用一个对话入口，承接有记忆、可并行、能异步交付的长期协作。",
      "tags": [
        "Agent",
        "产品设计",
        "Agent Memory",
        "多智能体",
        "异步协作"
      ],
      "source": "https://x.com/ludamn513/status/2109942664737264058",
      "body": "> 本文受「10公里」的[原帖](https://x.com/ludamn513/status/2109942664737264058)启发，基于用户提供的原帖文本独立整理与扩展，并核对截至 2026 年 10 月 28 日可访问的官方资料。下文区分公开事实、产品判断与工程建议，不将未公开的系统提示词当作已证实实现。\n\n如果把 Personal Agent 理解为“帮个人处理生活琐事的 AI”，这个定义确实太窄了。\n\n研究市场、整理客户线索、修复产品缺陷、持续跟进项目，同样可以由一个长期为你工作的 Agent 完成。它面对的是一个人，承接的却可能是一整套工作。这里更值得命名的变化，是人与软件的协作关系。\n\n我更愿意用 **Person-like Agent** 描述这种交互：你像给同事发消息一样交代任务，它记住必要的背景，在后台推进工作，在需要判断或完成交付时回来找你。\n\n这不是说 Agent 具有人的意识，也不是一个已有统一标准的技术分类。它是本文使用的产品分析视角。\n\n## 01 · Personal 描述对象，Person-like 描述协作\n\nInstinct 的官方介绍突出短信、通话和日常事务；Grok Bot 的发布页则直接把产品定位为可交付真实工作的 AI teammates，举出销售、运营和工程等场景。两者都降低了交代任务的门槛，但任务边界与用户预期并不相同。[Instinct 官网](https://instinct.com/) · [Grok Bot 官方发布](https://x.ai/news/introducing-grok-bot)\n\n因此，“Grok Bot 不只是生活助理”有明确依据；“它完全不属于 Personal Agent”却不是必然结论。一个产品可以由个人持有，同时表现得像一支工作团队。这是两个不同维度。\n\n更有用的问题是：用户是在反复操作一个工具，还是在持续委托一个有上下文的协作者？前者要求用户管理步骤，后者要求系统接住责任。\n\nOpenClaw 是理解这类系统的一个公开参考，但外观相似不等于技术同源。没有直接证据，就不能把所有产品都说成它的后代。\n\n## 02 · 商业模式不能靠想象补齐\n\n原帖关于商业激励的直觉有价值，但几个推断需要拆开。\n\n- **Instinct 的交易抽成。** 此次查阅的官方首页没有提供足以确认这一结论的收费说明，因此本文不把它写成既定事实。生活服务场景可能产生交易机会，与公司已经如何收费，是两件事。\n- **Muse 与广告数据。** Meta 的发布说明明确表示，Muse 不把个人对话及其虚拟机中的数据分享给 Meta 广告系统；同时介绍了免费使用和更高需求的订阅计划。不能把 Meta 公司的整体广告业务直接套到 Muse 上。[Meta 官方说明](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)\n- **Grok Bot 与 token。** 当前产品页描述了订阅内含周使用额度，以及额外用量按 token 成本计费。它支持“更复杂工作需要更多资源”，却不能证明“用户烧得越多，公司赚得越多”。收入、推理成本与利润必须分开讨论。[Grok Bot 产品与价格](https://x.ai/bot)\n\n下面是我的商业判断：交易型收入可能鼓励交易完成，订阅可能鼓励持续留存，按量收入可能随使用增加；但任何一种机制都可能与浪费、失败重试和过度执行发生冲突。\n\n真正可持续的目标应该是**单位成本下的有效交付**。用户付费买的是节省的时间、完成的工作与可接受的风险，不是 token 本身。\n\n## 03 · 一个入口，不等于一个无限延长的 Session\n\n想象你早上发了三条消息：“下午前整理竞品”“帮我比较周末车票”“那封合作邮件先别发”。\n\n如果系统把它们机械地接在同一条执行链后面，第二条就要等第一条结束，第三条甚至来不及阻止发送。这只是把等待队列包装成聊天。\n\n我认为，面向用户可以是一个稳定入口，面向执行却应有多个独立任务：每个任务都有自己的目标、输入、权限、状态与交付物。“那封邮件”需要指向对应任务，而不是依靠最近一条消息猜测。\n\nSession 也不只是上下文窗口不足的补丁。它还承载任务隔离、权限边界、成本归属与协作关系。产品可以减少用户手工整理 Session 的负担，但不能删除系统内部的这些边界。\n\n“异步”同样不意味着完全隐藏状态。Muse 的官方设计文章介绍了后台多任务、活动日志、目标页和结构化审批。因此更准确的方向是：**默认不倾倒中间推理，但让状态、证据和关键操作可查看、可干预。**[How We Designed Muse](https://introducing.muse.ai/)\n\n用户需要知道“任务还在进行、卡在哪里、何时需要我”，而不需要被迫阅读每一次内部思考。\n\n## 04 · Memory 要记住的，不只有聊天记录\n\nAgent 的持续性来自模型之外的状态管理，不能简单理解为把所有历史消息重新塞进上下文。\n\nOpenClaw 的公开文档区分了长期精选记忆与日常工作记录，并通过检索访问更多材料。这说明“存下来”和“每轮都加载”可以分离。[OpenClaw Memory](https://docs.openclaw.ai/concepts/memory)\n\n在产品实现上，我建议至少区分四类信息：\n\n- **偏好与约束：** 喜欢怎样的沟通方式、明确的预算和禁忌。\n- **任务状态：** 做到了哪一步、哪些结果已经确认、还欠什么。\n- **经历与证据：** 哪次决策为什么发生，对应哪份文件或原始来源。\n- **可复用流程：** 已验证的方法、失败经验与适用条件。\n\n这是一种设计拆分，不是声称所有厂商都采用了同样架构。\n\n更关键的是记忆的更新规则：临时愿望不能自动变成长期偏好；网页里的指令不能冒充用户授权；旧预算不能永久有效；群聊中出现的信息，也不能无条件写进私人长期记忆。\n\n所以，记忆条目除了内容，最好还有来源、时间、适用任务、可见范围和失效条件。删除、更正和冲突处理，应当是产品能力的一部分。记得更多不一定更可靠，知道何时重新核实才重要。\n\n## 05 · 前台接住对话，后台推进任务\n\n[ReAct 论文](https://arxiv.org/abs/2210.03629)讨论了推理与行动交替进行的范式。一个任务内部采用这样的循环，并不自动意味着它能处理不断到来的用户消息。\n\n如果把长时间浏览、运行脚本和整理报告都放进前台的单一串行执行链，用户就会频繁遇到“它正在忙，暂时接不了我的下一句话”。\n\n公开实现里已经能看到另一种结构。OpenClaw 的子 Agent 在独立 Session 中后台运行，并默认将结果通知发起方；Anthropic 也讨论过由协调器拆分工作、交给执行者并整合结果的模式。[OpenClaw Sub-agents](https://docs.openclaw.ai/tools/subagents) · [Building effective agents](https://www.anthropic.com/research/building-effective-agents)\n\n下面是本文建议的抽象架构，**不是 Grok Bot 源码或系统提示词的还原**：\n\n```text\n用户消息 → 前台协调器 → 确认意图 / 回答简单问题\n                    → 创建任务 → 后台执行者\n用户补充 → 匹配任务 → 更新约束 / 取消 / 请求重做\n后台事件 → 校验结果 → 更新任务状态 → 决定是否通知\n```\n\n核心目标不是让某个主 loop 在字面上始终 idle，而是让**对话接收与长任务执行解耦**。线程、事件队列、异步工具、工作进程或子 Agent 都可能实现它；并非每个任务都值得再启动一个模型。\n\n子 Agent 也不是免费的并行加速器。它会增加上下文传递、重复研究、模型调用和结果整合成本。任务之间如果有依赖，盲目并行反而容易制造错误。\n\n值得先工程化的，是任务 ID、取消信号、进度事件、失败重试和恢复机制。尤其涉及外部写入时，还要有幂等控制：一次超时重试不应该发出两封邮件，或者创建两份相同订单。\n\n## 06 · 会做事之外，还要知道何时开口\n\n原帖最有启发的一点，是把“内部完成一轮推理”和“向用户发出一条消息”分开。\n\n如果每个 Agent 都把自己的最终文本直接广播到群里，一次讨论很容易变成所有人同时汇报。把发言当作一次显式、受控的动作，确实能让系统更接近协作软件。\n\n但需要说明：此次核查没有从公开官方资料中确认原帖提到的 `delegate`、`senduser` 精确工具名及那句系统提示词。因此，这里保留的是设计思想，而不是把观察或转述包装成已验证的内部实现。\n\n我会在消息出口增加以下判断：\n\n- 这是回答用户、请求决策、报告阻塞，还是交付结果？\n- 接收者是谁，应该发在私聊、任务线程还是群聊？\n- 是否有新信息，是否与刚才的通知重复？\n- 是否值得现在打断用户，还是应该合并成一次摘要？\n- 是否涉及其他参与者的隐私或超出当前任务授权？\n\n这只是必要的一层。显式发言工具不会自动保证模型安静，也不会自动解决群聊权限；去重、速率限制和可见范围检查，应由运行时共同约束。\n\n私聊与群聊可以共用消息处理机制，却不能共用无差别的信息权限。**架构可以统一，信任边界必须明确。**\n\n## 07 · 像同事一样自然，像软件一样可控\n\n“像人”容易让用户产生一种过强的推断：既然它理解我，就应该知道什么时候该停。产品不能把这种期待当作可靠的权限系统。\n\nMuse 的安全技术文章描述了独立于核心 Agent 的权限裁决层。这个例子说明，行动边界不应只依赖执行模型自觉遵守提示。[How We Built Safety Into Muse](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse)\n\n作为产品设计，我建议把任务过程明确成“待确认、排队中、执行中、等待用户、已完成、失败、已取消”等状态。允许用户插话、暂停和撤销；交付时给出结果与证据，需要用户批准的动作则呈现清楚的对象、范围和后果。\n\n相应的评估也应从“回答像不像人”转向真实协作质量：\n\n- 新消息能否及时得到接收或处理，长任务是否阻塞对话？\n- 多任务是否串线，用户的更正能否更新到正确任务？\n- 完成率、错误写入率和恢复成功率如何？\n- 每个有效交付消耗多少成本，需要多少次人工干预？\n- 通知带来多少有效决策，又制造了多少打扰？\n\n这些是本文提出的评估维度，不是任何产品的实测排名。\n\nPersonal Agent 不是一个必须废弃的词；它的问题在于，经常被用来同时描述服务对象、应用场景、交互方式和技术架构。\n\n我赞同原帖更深的一层判断：真正的产品机会，是把复杂的执行系统封装成一种容易理解的委托关系。用户无需成为任务调度员，也不必持续盯着推理过程。\n\n**一个入口，多个任务；有记忆，也有边界；能异步交付，也能被及时打断。**这比“会帮我订机票的个人助手”，更接近我所理解的 Person-like Agent。\n\n---\n\n## 来源与说明\n\n- 原帖启发：[10公里 · X 原帖](https://x.com/ludamn513/status/2109942664737264058)。X 原页此次访问受限，原帖观点依据用户提供的文本，不声称已读取其完整评论或后台信息。\n- 产品事实：[Instinct](https://instinct.com/)、[Grok Bot 发布说明](https://x.ai/news/introducing-grok-bot)、[当前 Grok Bot 产品页](https://x.ai/bot)、[Meta Muse 发布说明](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/)。产品和价格会变化，本文未将发布时的历史套餐当成当前价格。\n- 产品设计与安全：[Muse 设计文章](https://introducing.muse.ai/)、[Muse 安全技术文章](https://research.meta.ai/blog/security-and-safety-for-ai-agents-our-approach-with-muse)。官方说明代表厂商公开设计与承诺，不等于独立安全审计。\n- 技术参考：[ReAct](https://arxiv.org/abs/2210.03629)、[OpenClaw Memory](https://docs.openclaw.ai/concepts/memory)、[OpenClaw Sub-agents](https://docs.openclaw.ai/tools/subagents)、[Anthropic：Building effective agents](https://www.anthropic.com/research/building-effective-agents)。\n- 封面为 AI 生成的编辑性概念插画，产品标识参考各自官网素材，仅用于识别讨论对象，不代表合作或背书。",
      "cover": "assets/person-like-agents.png",
      "alt": "Person-like Agents：一个对话入口连接并行任务与长期记忆，底部为 Instinct、Muse 和 Grok Bot 产品标识。AI 生成概念封面。",
      "status": "published",
      "images": []
    }
  ],
  "profile": {
    "name": "邵建钧",
    "english": "Jianjun Shao",
    "location": "Beijing, China",
    "email": "202421081054@mail.bnu.edu.cn",
    "github": "https://github.com/shaojian0514",
    "title": "让智能，从研究\n走向真实世界。",
    "portrait": "assets/portrait.png",
    "intro": "我是邵建钧，北京师范大学硕士在读。探索大语言模型、智能体系统与医学多模态学习，也热衷于把研究想法做成可用的产品。",
    "interests": [
      "LLM & Agents",
      "Medical Multimodal",
      "Research → Product"
    ]
  },
  "experience": [
    {
      "company": "小红书",
      "date": "2026.03 — 至今",
      "role": "Product Engineer · AI 全栈",
      "team": "社区工程部 / 产品设计部 · 北京",
      "text": "参与「Lab 1327」旅行规划 Agent，围绕攻略理解、多智能体编排和偏好记忆开展工作；结合 Plan-and-Execute、优先级并行调度与渐进式 Skill 加载，完善旅行规划体验。"
    },
    {
      "company": "Microsoft",
      "date": "2025.08 — 2026.01",
      "role": "大模型算法实习生",
      "team": "Bing Copilot Search · 北京",
      "text": "参与 Deep Research 相关工作，构建多跳问答与长搜索轨迹数据，探索高并发搜索和浏览器交互，以及 Qwen3-14B 的 SFT 与 GRPO 训练。"
    }
  ],
  "education": [
    {
      "school": "北京师范大学",
      "subject": "智能科学与技术 · 硕士在读",
      "date": "2024.09 — 2027.06（预计）"
    },
    {
      "school": "杭州电子科技大学",
      "subject": "计算机科学与技术 · 本科",
      "date": "2020.09 — 2024.06"
    }
  ],
  "skills": [
    {
      "name": "语言与工程",
      "items": [
        "Python",
        "C++",
        "TypeScript",
        "Go",
        "Docker",
        "Redis"
      ]
    },
    {
      "name": "模型与训练",
      "items": [
        "PyTorch",
        "SFT / RL",
        "GRPO",
        "vLLM",
        "Vision–Language"
      ]
    },
    {
      "name": "智能体系统",
      "items": [
        "LangGraph",
        "AgentScope",
        "RAG",
        "Milvus",
        "Skills",
        "Harness Engineering"
      ]
    }
  ],
  "honors": [
    "浙江省政府奖学金",
    "国家励志奖学金",
    "多次学业奖学金",
    "校优秀毕业生"
  ],
  "projects": [
    {
      "id": "medagent",
      "type": "work",
      "name": "MedAgent",
      "subtitle": "让医学智能体，各司其职。",
      "label": "MULTIMODAL · AGENT SYSTEM",
      "image": "assets/medagent.webp",
      "alt": "医学多智能体概念插画：中央智能核心连接咨询、诊断与研究三个模块",
      "summary": "将医学视觉语言模型、专业智能体与可复用技能连接起来，探索从模型能力到任务协作的完整链路。",
      "tags": [
        "Agent Swarm",
        "VLM",
        "vLLM",
        "Milvus"
      ],
      "role": "个人项目 · 模型与系统",
      "code": "https://github.com/shaojian0514/MedAgent",
      "flow": [
        "多模态输入",
        "任务路由",
        "专业 Agent + Skills",
        "上下文与记忆"
      ],
      "sections": [
        {
          "title": "问题 / Context",
          "text": "医学问答涉及健康咨询、症状分析和资料检索等不同任务。单一通用对话难以兼顾专业分工、工具调用和上下文管理。MedAgent 将任务拆分为可组合的能力。"
        },
        {
          "title": "系统 / Approach",
          "text": "采用 Skills–Agent 两层结构，将原子技能与三个专业智能体分离，通过智能路由组织协作。共享上下文与短期、长期记忆连接多轮任务，并用运行时约束管理执行过程。"
        },
        {
          "title": "实现 / Engineering",
          "text": "覆盖医学 VLM 的训练与部署，结合 vLLM、量化推理和 Milvus 检索，探索模型服务与 Agent Swarm 的整合。实现细节与使用方式见公开仓库。"
        }
      ]
    },
    {
      "id": "touragent",
      "type": "work",
      "name": "TourAgent",
      "subtitle": "从一句想法，到一份旅行计划。",
      "label": "PLANNING · MULTI-AGENT",
      "image": "assets/touragent.webp",
      "alt": "旅行规划概念插画：折叠地图上的多个目的地由青绿色行程路线串联",
      "summary": "基于 AgentScope 的开源旅行规划项目，通过意图理解、专业智能体协作和偏好记忆，把自然语言需求组织为结构化行程。",
      "tags": [
        "AgentScope",
        "Planning",
        "RAG",
        "Memory"
      ],
      "role": "个人开源项目 · 智能体编排",
      "code": "https://github.com/shaojian0514/TourAgent",
      "flow": [
        "理解需求",
        "分解任务",
        "六个子智能体协作",
        "结构化行程"
      ],
      "sections": [
        {
          "title": "问题 / Context",
          "text": "旅行规划需要同时处理目的地信息、用户偏好和行程约束。项目尝试将复杂需求拆解成专业任务，让多个智能体协同完成规划。"
        },
        {
          "title": "编排 / Orchestration",
          "text": "通过六个专业子智能体，按任务优先级并行或顺序执行，配合偏好记忆、知识检索和信息查询，组织多阶段规划过程。"
        },
        {
          "title": "可靠性 / Reliability",
          "text": "使用懒加载、熔断与重试机制增强执行稳定性。这里展示个人公开仓库；小红书「Lab 1327」相关工作在个人经历中介绍。"
        }
      ]
    },
    {
      "id": "dcaf",
      "type": "research",
      "name": "DCAF",
      "subtitle": "让检索知识，与诊断保持一致。",
      "label": "MICCAI 2026 · FIRST AUTHOR",
      "title": "Disease-Consistent Visual-Text Alignment and Fusion for Reliable Radiology Report Generation",
      "image": "assets/dcaf.webp",
      "alt": "DCAF 概念插画：影像与报告信息经过对齐棱镜汇聚为报告，表达疾病一致性对齐与融合",
      "summary": "研究检索增强报告生成中的诊断不一致问题，通过疾病一致性的视觉文本对齐与选择性融合，让检索到的知识更有效地服务于报告生成。",
      "tags": [
        "Radiology Report Generation",
        "Vision–Language",
        "Retrieval"
      ],
      "role": "第一作者 · 医学报告生成",
      "status": "已接收",
      "venue": "MICCAI 2026",
      "code": "https://github.com/shaojian0514/DCAF-RRG",
      "paper": "https://link.springer.com/chapter/10.1007/978-3-032-38062-3_18",
      "flow": [
        "视觉特征 + 检索报告",
        "疾病一致性对齐",
        "选择性跨模态融合",
        "报告生成"
      ],
      "sections": [
        {
          "title": "问题 / Motivation",
          "text": "检索到的相似报告可能带有与当前影像不一致的疾病信息。直接引入文本知识，可能让不相关的诊断线索干扰报告生成。"
        },
        {
          "title": "方法 / Method",
          "text": "围绕疾病一致性设计检索增强与视觉文本对齐，并通过最优传输增强的跨模态融合选择性整合相关文本知识；结合疾病感知特征提取，为报告生成提供诊断线索。"
        },
        {
          "title": "论文 / Publication",
          "text": "第一作者论文，MICCAI 2026 已接收。正式论文题目、作者和出版信息可在 Springer 页面查看，研究代码见 DCAF-RRG 仓库。"
        }
      ]
    },
    {
      "id": "cmrg",
      "type": "research",
      "name": "CMRG",
      "subtitle": "理解动态影像，生成描述性报告。",
      "label": "AAAI 2027 · FIRST AUTHOR · UNDER REVIEW",
      "title": "CMRG: Automated Descriptive Report Generation for Cardiac Magnetic Resonance Cine Sequences",
      "image": "assets/cmrg.webp",
      "alt": "CMRG 概念插画：多个心脏影像序列帧连接到一份描述性报告",
      "summary": "面向心脏磁共振电影序列，探索从动态影像到描述性报告的自动生成。",
      "tags": [
        "Cardiac MRI",
        "Cine Sequences",
        "Report Generation"
      ],
      "role": "第一作者 · 心脏磁共振影像报告生成",
      "status": "在投",
      "venue": "AAAI 2027",
      "code": "https://github.com/shaojian0514/CMRG",
      "flow": [
        "心脏磁共振",
        "电影序列",
        "影像理解",
        "描述性报告"
      ],
      "sections": [
        {
          "title": "研究方向 / Focus",
          "text": "研究心脏磁共振电影序列的自动描述性报告生成，将动态医学影像与自然语言报告连接起来。"
        },
        {
          "title": "当前进展 / Status",
          "text": "第一作者工作，AAAI 2027 在投。代码入口已提供，具体方法与研究进展以仓库和后续公开论文为准。"
        }
      ]
    }
  ],
  "otherPapers": [
    {
      "venue": "AAAI 2027",
      "status": "在投",
      "title": "VeriMem: Learning to Reuse Verified Evidence for Agentic Retrieval",
      "role": "共同作者 · 智能体检索与证据复用"
    }
  ]
};
