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

const { deepCopyModule, deepCopyModules } = await import("./db");

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

function mockBatchImport(options: { existingDuplicate?: boolean; failSourceModuleId?: string } = {}) {
  mocks.release.mockReset();
  mocks.query.mockReset();

  const sourceModules: Record<string, Record<string, unknown>> = {
    "9": { id: 9, course_id: 1, title: "Source module" },
    "10": { id: 10, course_id: 1, title: "Legacy module" },
  };
  const sourceLessons: Record<string, Record<string, unknown>[]> = {
    "9": [{ id: 91, title: "Graded lesson", video_url: "https://video.example/graded", duration: "10 min", is_preview: false, order_index: 0 }],
    "10": [{ id: 92, title: "Legacy lesson", video_url: "https://video.example/legacy", duration: "20 min", is_preview: false, order_index: 0 }],
  };
  let moduleListReads = 0;
  let moduleInsertCount = 0;
  let lessonInsertCount = 0;

  const gradedAssignment = {
    instructions: "Submit a notebook",
    rubric: "Check correctness",
    max_score: 75,
    allowed_file_types: ".ipynb",
    max_file_size_mb: 12,
    max_attempts: 2,
    is_active: true,
  };
  const toReadAssignment = () => ({
    instructions: gradedAssignment.instructions,
    rubric: gradedAssignment.rubric,
    maxScore: gradedAssignment.max_score,
    allowedFileTypes: gradedAssignment.allowed_file_types,
    maxFileSizeMb: gradedAssignment.max_file_size_mb,
    maxAttempts: gradedAssignment.max_attempts,
    isActive: gradedAssignment.is_active,
  });

  mocks.query.mockImplementation(async (sql: string, params?: unknown[]) => {
    const id = String(params?.[0] ?? "");
    if (sql === "BEGIN" || sql === "COMMIT" || sql === "ROLLBACK") return { rows: [] };
    if (sql.includes("SELECT id FROM courses WHERE id = $1 FOR UPDATE")) return { rows: [{ id: 2 }] };
    if (sql.includes('SELECT id, title, order_index as "orderIndex" FROM modules WHERE course_id = $1')) {
      moduleListReads += 1;
      if (moduleListReads === 1) {
        return { rows: options.existingDuplicate ? [{ id: 100, title: "Source module", orderIndex: 0 }] : [] };
      }
      const imported = [
        { id: 100, title: "Source module", orderIndex: 3 },
        { id: 101, title: "Legacy module", orderIndex: 4 },
      ].slice(0, moduleInsertCount);
      return { rows: options.existingDuplicate ? [{ id: 100, title: "Source module", orderIndex: 0 }] : imported };
    }
    if (sql.includes("SELECT COALESCE(MAX(order_index) + 1, 0)")) return { rows: [{ nextOrderIndex: 3 }] };
    if (sql.includes("SELECT * FROM modules WHERE id = $1")) {
      if (options.failSourceModuleId === id) throw new Error("copy failed");
      return { rows: sourceModules[id] ? [sourceModules[id]] : [] };
    }
    if (sql.includes('SELECT id, title, video_url as "videoUrl"')) {
      if (id === "9") return { rows: [{ id: 91, title: "Graded lesson", videoUrl: "https://video.example/graded", duration: "10 min", isPreview: false, orderIndex: 0 }] };
      if (id === "10") return { rows: [{ id: 92, title: "Legacy lesson", videoUrl: "https://video.example/legacy", duration: "20 min", isPreview: false, orderIndex: 0 }] };
      if (id === "100") return { rows: [{ id: 200, title: "Graded lesson", videoUrl: "https://video.example/graded", duration: "10 min", isPreview: false, orderIndex: 0 }] };
      if (id === "101") return { rows: [{ id: 201, title: "Legacy lesson", videoUrl: "https://video.example/legacy", duration: "20 min", isPreview: false, orderIndex: 0 }] };
    }
    if (sql.includes("SELECT * FROM lessons WHERE module_id = $1")) return { rows: sourceLessons[id] || [] };
    if (sql.includes("INSERT INTO modules")) {
      const insertedId = 100 + moduleInsertCount;
      moduleInsertCount += 1;
      return { rows: [{ id: insertedId }] };
    }
    if (sql.includes("INSERT INTO lessons")) {
      const insertedId = 200 + lessonInsertCount;
      lessonInsertCount += 1;
      return { rows: [{ id: insertedId }] };
    }
    if (sql.includes('SELECT material_title as "title"') || sql.includes("SELECT * FROM materials")) return { rows: [] };
    if (sql.includes('SELECT id, title FROM quizzes') || sql.includes("SELECT * FROM quizzes")) return { rows: [] };
    if (sql.includes("FROM course_assignments")) {
      if (id === "91" || id === "200") {
        return { rows: sql.includes('max_score as "maxScore"') ? [toReadAssignment()] : [gradedAssignment] };
      }
      return { rows: [] };
    }
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

describe("deepCopyModules", () => {
  it("persists multiple modules in one transaction and returns the canonical module graph", async () => {
    mockBatchImport();

    const result = await deepCopyModules(["9", "10"], "2");

    expect(result.importedSourceModuleIds).toEqual(["9", "10"]);
    expect(result.skippedSourceModuleIds).toEqual([]);
    expect(result.modules.map((module: any) => module.title)).toEqual(["Source module", "Legacy module"]);
    expect(result.modules[0].lessons[0].assignment).toMatchObject({ maxScore: 75, isActive: true });
    expect(result.modules[1].lessons[0].assignment).toBeNull();
    expect(mocks.query.mock.calls.filter(([sql]) => sql.includes("INSERT INTO modules"))[0]?.[1]).toEqual(["2", "Source module", 3]);
    expect(mocks.query.mock.calls.filter(([sql]) => sql.includes("INSERT INTO modules"))[1]?.[1]).toEqual(["2", "Legacy module", 4]);
    const assignmentInsert = mocks.query.mock.calls.find(([sql]) => sql.includes("INSERT INTO course_assignments"));
    expect(assignmentInsert?.[1]).toEqual([200, "Submit a notebook", "Check correctness", 75, ".ipynb", 12, 2, true]);
    expect(mocks.query.mock.calls.filter(([sql]) => sql === "BEGIN")).toHaveLength(1);
    expect(mocks.query.mock.calls.filter(([sql]) => sql === "COMMIT")).toHaveLength(1);
    expect(mocks.query.mock.calls.filter(([sql]) => sql === "ROLLBACK")).toHaveLength(0);
  });

  it("deduplicates repeated selections in the same import action", async () => {
    mockBatchImport();

    const result = await deepCopyModules(["9", "9"], "2");

    expect(result.importedSourceModuleIds).toEqual(["9"]);
    expect(mocks.query.mock.calls.filter(([sql]) => sql.includes("INSERT INTO modules"))).toHaveLength(1);
  });

  it("skips an already imported module with matching content", async () => {
    mockBatchImport({ existingDuplicate: true });

    const result = await deepCopyModules(["9"], "2");

    expect(result.importedSourceModuleIds).toEqual([]);
    expect(result.skippedSourceModuleIds).toEqual(["9"]);
    expect(mocks.query.mock.calls.filter(([sql]) => sql.includes("INSERT INTO modules"))).toHaveLength(0);
  });

  it("rolls back the entire batch when any selected module fails", async () => {
    mockBatchImport({ failSourceModuleId: "10" });

    await expect(deepCopyModules(["9", "10"], "2")).rejects.toThrow("copy failed");

    expect(mocks.query.mock.calls.filter(([sql]) => sql === "BEGIN")).toHaveLength(1);
    expect(mocks.query.mock.calls.filter(([sql]) => sql === "COMMIT")).toHaveLength(0);
    expect(mocks.query.mock.calls.filter(([sql]) => sql === "ROLLBACK")).toHaveLength(1);
  });
});
