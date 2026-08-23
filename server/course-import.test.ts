import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => {
  const query = vi.fn();
  const release = vi.fn();

  return {
    query,
    release,
    client: { query, release },
  };
});

vi.mock("./database", () => ({
  getPool: () => ({ connect: async () => mocks.client }),
  query: vi.fn(),
  queryOne: vi.fn(),
  queryMany: vi.fn(),
}));

vi.mock("./_core/env", () => ({ ENV: { ownerOpenId: "" } }));

const { deepCopyModule } = await import("./db");

function mockModuleImport(assignment: Record<string, unknown> | null) {
  mocks.release.mockReset();
  mocks.query.mockReset();
  mocks.query.mockImplementation(async (sql: string) => {
    if (sql.includes("SELECT * FROM modules")) return { rows: [{ id: 9, title: "Source module" }] };
    if (sql.includes("INSERT INTO modules")) return { rows: [{ id: 100 }] };
    if (sql.includes("SELECT * FROM lessons")) {
      return { rows: [{ id: 10, title: "Source lesson", video_url: "https://video.example", duration: "10 min", is_preview: false, order_index: 0 }] };
    }
    if (sql.includes("INSERT INTO lessons")) return { rows: [{ id: 200 }] };
    if (sql.includes("SELECT instructions, rubric")) return { rows: assignment ? [assignment] : [] };
    if (sql.includes("SELECT * FROM materials") || sql.includes("SELECT * FROM quizzes")) return { rows: [] };
    return { rows: [] };
  });
}

describe("deepCopyModule", () => {
  it("preserves an existing grading configuration on the imported lesson", async () => {
    mockModuleImport({
      instructions: "Submit a notebook",
      rubric: "Check correctness",
      max_score: 75,
      allowed_file_types: ".ipynb",
      max_file_size_mb: 12,
      max_attempts: 2,
      is_active: true,
    });

    await deepCopyModule("9", "2", 1);

    const assignmentInsert = mocks.query.mock.calls.find(([sql]) => sql.includes("INSERT INTO course_assignments"));
    expect(assignmentInsert?.[1]).toEqual([200, "Submit a notebook", "Check correctness", 75, ".ipynb", 12, 2, true]);
  });

  it("imports legacy lessons without an assignment safely", async () => {
    mockModuleImport(null);

    await expect(deepCopyModule("9", "2", 1)).resolves.toEqual({ moduleId: "100" });
    expect(mocks.query.mock.calls.some(([sql]) => sql.includes("INSERT INTO course_assignments"))).toBe(false);
  });
});
