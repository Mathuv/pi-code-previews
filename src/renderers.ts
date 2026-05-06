import type { ExtensionAPI } from "@mariozechner/pi-coding-agent";
import { registerBash } from "./tool-renderers/bash.ts";
import { registerEdit } from "./tool-renderers/edit.ts";
import { registerFind } from "./tool-renderers/find.ts";
import { registerGrep } from "./tool-renderers/grep.ts";
import { registerLs } from "./tool-renderers/ls.ts";
import { registerRead } from "./tool-renderers/read.ts";
import { registerWrite } from "./tool-renderers/write.ts";
import { getEnabledCodePreviewTools, type CodePreviewToolName } from "./tool-selection.ts";

export interface CodePreviewRendererRegistrationStatus {
  registered: CodePreviewToolName[];
  skipped: Array<{ name: CodePreviewToolName; reason: string }>;
}

interface RegisterToolRenderersOptions {
  skipTools?: Map<CodePreviewToolName, string>;
}

export function registerToolRenderers(
  pi: ExtensionAPI,
  cwd: string,
  options: RegisterToolRenderersOptions = {},
): CodePreviewRendererRegistrationStatus {
  const enabledTools = getEnabledCodePreviewTools();
  const status: CodePreviewRendererRegistrationStatus = { registered: [], skipped: [] };

  const register = (name: CodePreviewToolName, registerTool: () => void) => {
    if (!enabledTools.has(name)) return;
    const skipReason = options.skipTools?.get(name);
    if (skipReason) {
      status.skipped.push({ name, reason: skipReason });
      return;
    }
    registerTool();
    status.registered.push(name);
  };

  register("bash", () => registerBash(pi, cwd));
  register("read", () => registerRead(pi, cwd));
  register("write", () => registerWrite(pi, cwd));
  register("edit", () => registerEdit(pi, cwd));
  register("grep", () => registerGrep(pi, cwd));
  register("find", () => registerFind(pi, cwd));
  register("ls", () => registerLs(pi, cwd));

  return status;
}
