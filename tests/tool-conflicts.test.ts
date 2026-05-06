import assert from "node:assert/strict";
import { test } from "vitest";
import { getCodePreviewToolConflicts } from "../src/tool-conflicts.ts";

test("detects code preview tools owned by non-builtin sources", () => {
  const conflicts = getCodePreviewToolConflicts([
    {
      name: "bash",
      sourceInfo: {
        path: "/Users/mathu/.pi/agent/extensions/uv.ts",
        source: "/Users/mathu/.pi/agent/extensions/uv.ts",
        scope: "user",
        origin: "top-level",
      },
    },
    {
      name: "read",
      sourceInfo: {
        path: "<builtin:read>",
        source: "builtin",
        scope: "temporary",
        origin: "top-level",
      },
    },
    {
      name: "custom_tool",
      sourceInfo: {
        path: "/tmp/custom.ts",
        source: "/tmp/custom.ts",
        scope: "temporary",
        origin: "top-level",
      },
    },
  ]);

  assert.deepEqual([...conflicts.keys()], ["bash"]);
  assert.equal(conflicts.get("bash")?.owner, "/Users/mathu/.pi/agent/extensions/uv.ts");
});
