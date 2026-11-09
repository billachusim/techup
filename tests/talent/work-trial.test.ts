import { describe, expect, it } from "vitest";
import { hiringStepsText, trialDaysLeft, workTrialPreset, workTrialText } from "@/lib/talent";
import { toMatchStatus } from "@/lib/hr-api-rules";

describe("work trial before selection", () => {
  it("maps role settings to presets", () => {
    expect(workTrialPreset({ work_trial_works: 0, work_trial_days: 14 })).toBe("off");
    expect(workTrialPreset({ work_trial_works: 1, work_trial_days: 7 })).toBe("urgent");
    expect(workTrialPreset({ work_trial_works: 2, work_trial_days: 14 })).toBe("standard");
    expect(workTrialPreset({ work_trial_works: 3, work_trial_days: 10 })).toBe("custom");
  });

  it("describes the trial in plain words", () => {
    expect(workTrialText(1, 7)).toBe("1 piece of work within 1 week");
    expect(workTrialText(2, 14)).toBe("2 pieces of work within 2 weeks");
    expect(workTrialText(2, 10)).toBe("2 pieces of work within 10 days");
  });

  it("puts the trial ahead of other hiring steps", () => {
    expect(hiringStepsText({ selection_process: "direct", work_trial_works: 0 })).toMatch(/^No assessment or interview/);
    expect(hiringStepsText({ selection_process: "direct", work_trial_works: 1, work_trial_days: 7 })).toMatch(/work trial: submit 1 piece of work within 1 week/);
    expect(hiringStepsText({ selection_process: "interview", work_trial_works: 2, work_trial_days: 14 })).toMatch(/work trial.*book an interview/);
  });

  it("counts days left, negative when overdue", () => {
    const now = Date.parse("2026-11-09T08:00:00Z");
    expect(trialDaysLeft("2026-11-16T08:00:00Z", now)).toBe(7);
    expect(trialDaysLeft("2026-11-08T08:00:00Z", now)).toBe(-1);
    expect(trialDaysLeft(null, now)).toBeNull();
  });

  it("lets the HR agent start a trial", () => {
    expect(toMatchStatus("work_trial")).toBe("trial");
    expect(toMatchStatus("selected")).toBe("accepted");
  });
});
