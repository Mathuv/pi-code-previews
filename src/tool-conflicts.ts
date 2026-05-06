import type { ToolInfo } from "@mariozechner/pi-coding-agent";
import { isCodePreviewToolName, type CodePreviewToolName } from "./tool-selection.ts";

export interface CodePreviewToolConflict {
  name: CodePreviewToolName;
  owner: string;
  source: string;
}

export function getCodePreviewToolConflicts(
  tools: Array<Pick<ToolInfo, "name" | "sourceInfo">>,
): Map<CodePreviewToolName, CodePreviewToolConflict> {
  const conflicts = new Map<CodePreviewToolName, CodePreviewToolConflict>();
  for (const tool of tools) {
    if (!isCodePreviewToolName(tool.name) || tool.sourceInfo.source === "builtin") continue;
    conflicts.set(tool.name, {
      name: tool.name,
      owner: tool.sourceInfo.path,
      source: tool.sourceInfo.source,
    });
  }
  return conflicts;
}
