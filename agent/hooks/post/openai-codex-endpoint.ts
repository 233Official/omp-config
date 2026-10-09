import type { ExtensionAPI } from "@oh-my-pi/pi-coding-agent/extensibility/extensions";

/**
 * 从 OMP_OPENAI_CODEX_BASE_URL 覆盖 openai-codex 的运行时地址，
 * 用于启动时切换网关；不写回 models.yml，不替换内置模型或密钥配置。
 * 变量未设置或为空时沿用原配置，其他 provider 不受影响。
 */
export default (pi: ExtensionAPI) => {
  const baseUrl = process.env.OMP_OPENAI_CODEX_BASE_URL?.trim();
  if (!baseUrl) return;

  pi.on("session_start", async (_event, ctx) => {
    pi.registerProvider("openai-codex", { baseUrl });

    // 当前模型可能在 provider 覆盖前已选定，须重新绑定才能让首次请求使用新地址。
    const current = ctx.model;
    if (current?.provider !== "openai-codex") return;

    const updated = ctx.modelRegistry.find(current.provider, current.id);
    if (!updated) {
      throw new Error("OpenAI Codex endpoint override: current model not found");
    }

    await pi.setModel(updated);
  });
};
