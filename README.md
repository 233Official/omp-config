# OMP 配置

个人 OMP 配置与自维护 Hook；不包含 OMP 安装包或运行状态。

## 内容

- `agent/config.yml`：模型角色及基础交互设置。
- `agent/config.eco.yml`：经济型模型角色配置。
- `agent/models.yml`：Provider 地址与模型定义，密钥通过环境变量提供。
- `agent/hooks/post/openai-codex-endpoint.ts`：读取 `OMP_OPENAI_CODEX_BASE_URL`，仅覆盖 `openai-codex` 的运行时地址，不写回配置文件；变量未设置或为空时沿用原配置。
- `agent/hooks/post/onebot.ts`：通过 Webhook 发送会话结束通知。

全局规则与共享 Skills 由 OMP 原生发现 `~/.agents/AGENTS.md` 和 `~/.agents/skills`，不在本仓库复制。

## 边界

- `.gitignore` 默认忽略所有内容，仅放行指定配置和 Hook；认证、Session、数据库、缓存、日志及真实密钥不进入版本控制。
- 通知 Hook 从 `OMP_SESSION_WEBHOOK_*` 或 `ONEBOT_WEBHOOK_*` 环境变量读取 URL、Token 和超时。未配置 URL 时不发送；启用后会发送最多 2,000 字符的提示词片段及 Session 信息，包括工作目录、模型和耗时。

## 同步

直接在 `~/.omp` 中维护配置，`main` 跟踪公开仓库 `233Official/omp-config` 的 `origin/main`，不另建发布副本。

发布前检查差异与敏感信息，仅暂存本次修改的具体文件：

```bash
cd ~/.omp
git diff
git add -- <本次修改的文件路径>
git diff --cached
git commit -m "<提交说明>"
git push
```

需要接收远端更新时，在工作区干净的情况下执行 `git pull --ff-only`。同步由手动提交、推送和拉取完成，不自动覆盖运行配置；不要使用 `git add -f` 绕过发布白名单。
