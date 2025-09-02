// PolicyRuleFormDialog.tsx
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ---- shadcn / Radix UI components (adjust import paths to your project) ----
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@//ui/button";
import { Input } from "@//ui/input";
import { Textarea } from "@//ui/textarea";
import { Label } from "@/ui/label";
import { Switch } from "@//ui/switch";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/ui/select";

// ------------ Types & Schema -------------
export type Scope = "local" | "global";
export type policy_rule_type =
  | "parentChild"
  | "cmdline_string"
  | "blockProcess";

const optionalText = z
  .string()
  .transform((v) => (v ?? "").trim())
  .transform((v) => (v === "" ? undefined : v))
  .optional();

const baseSchema = z.object({
  scope: z.enum(["local", "global"]),
  agent_id: z.string().optional(),
  policy_rule_type: z.enum(["parentChild", "cmdline_string", "blockProcess"]),
  rule_desc: z.string().trim().min(1, "Rule description is required"),
  parent_process: optionalText,
  child_process: optionalText,
  target_process: optionalText,
  cmdline_string: optionalText,
});

type BaseForm = z.infer<typeof baseSchema>;

// Super-refine to enforce conditional requirements
const formSchema = baseSchema.superRefine((data, ctx) => {
  // Scope requirement for agent_id
  if (data.scope === "local") {
    if (!data.agent_id || data.agent_id === "-") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Agent ID is required for Local scope",
        path: ["agent_id"],
      });
    }
  }

  // Policy-type specific requirements
  if (data.policy_rule_type === "parentChild") {
    if (!data.parent_process) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parent process name is required",
        path: ["parent_process"],
      });
    }
    if (!data.child_process) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Child process name is required",
        path: ["child_process"],
      });
    }
  } else if (data.policy_rule_type === "cmdline_string") {
    if (!data.target_process) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Target process name is required",
        path: ["target_process"],
      });
    }
    if (!data.cmdline_string) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "String in command line is required",
        path: ["cmdline_string"],
      });
    }
  } else if (data.policy_rule_type === "blockProcess") {
    if (!data.target_process) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Target process name is required",
        path: ["target_process"],
      });
    }
  }
});

// ---------- Props ----------
export interface AgentOption {
  label: string;
  value: string;
}

export interface PolicyRuleFormDialogProps {
  /** Control the dialog externally (optional). If omitted, component is uncontrolled. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;

  /** Called with normalized payload on Save */
  onSave?: (payload: NormalizedPayload) => void;

  /** Called when user cancels/closes */
  onCancel?: () => void;

  /** Provide agent options, else sample defaults are used */
  agentOptions?: AgentOption[];

  /** Optional initial values */
  initialValues?: Partial<BaseForm> & {
    id?: string; // if editing an existing rule
  };

  /** Optional title/description override */
  title?: string;
  description?: string;
}

// ---------- Normalized Submit Payload ----------
export type NormalizedPayload = {
  scope: Scope;
  agent_id: string; // "-" for global
  policy_rule_type: policy_rule_type;
  rule_desc: string;
  parent_process?: string;
  child_process?: string;
  target_process?: string;
  cmdline_string?: string;
};

// ---------- Component ----------
export default function PolicyRuleFormDialog(props: PolicyRuleFormDialogProps) {
  const {
    open: controlledOpen,
    onOpenChange,
    onSave,
    onCancel,
    agentOptions,
    initialValues,
    title = "Create Policy Rule",
    description = "Define the rule details. Fields adapt to Rule Type and Scope.",
  } = props;

  // Allow uncontrolled open if not driven by parent
  const [uncontrolledOpen, setUncontrolledOpen] = useState(true);
  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = onOpenChange ?? setUncontrolledOpen;

  const agentList: AgentOption[] = useMemo(
    () =>
      agentOptions && agentOptions.length
        ? agentOptions
        : [
            { label: "001 (Windows-Workstation)", value: "001" },
            { label: "002 (DB-Server)", value: "002" },
            { label: "003 (Jump-Host)", value: "003" },
          ],
    [agentOptions]
  );

  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<BaseForm>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      scope: initialValues?.scope ?? "local",
      agent_id: initialValues?.agent_id,
      policy_rule_type: initialValues?.policy_rule_type ?? "blockProcess",
      rule_desc: initialValues?.rule_desc ?? "",
      parent_process: initialValues?.parent_process ?? undefined,
      child_process: initialValues?.child_process ?? undefined,
      target_process: initialValues?.target_process ?? undefined,
      cmdline_string: initialValues?.cmdline_string ?? undefined,
    },
  });

  const scope = watch("scope");
  const policyType = watch("policy_rule_type");

  // When scope toggles to global, clear and set agent_id = "-"
  useEffect(() => {
    if (scope === "global") {
      setValue("agent_id", "-", { shouldValidate: true, shouldDirty: true });
    } else {
      // Local: if agent is "-", clear to force selection
      if (watch("agent_id") === "-") {
        setValue("agent_id", undefined, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  // When policy type changes, clear irrelevant fields to avoid stale data
  useEffect(() => {
    if (policyType === "parentChild") {
      resetField("target_process");
      resetField("cmdline_string");
    } else if (policyType === "cmdline_string") {
      resetField("parent_process");
      resetField("child_process");
    } else if (policyType === "blockProcess") {
      resetField("parent_process");
      resetField("child_process");
      resetField("cmdline_string");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyType]);

  // Normalize before submit
  function normalize(values: BaseForm): NormalizedPayload {
    const { scope, policy_rule_type, rule_desc } = values;
    const isParentChild = policy_rule_type === "parentChild";
    const isCmdline = policy_rule_type === "cmdline_string";

    return {
      scope,
      agent_id: scope === "global" ? "-" : (values.agent_id as string),
      policy_rule_type,
      rule_desc: rule_desc.trim(),
      parent_process: isParentChild ? values.parent_process?.trim() : undefined,
      child_process: isParentChild ? values.child_process?.trim() : undefined,
      target_process:
        policyType === "blockProcess" || isCmdline
          ? values.target_process?.trim()
          : undefined,
      cmdline_string: isCmdline ? values.cmdline_string?.trim() : undefined,
    };
  }

  const submit = handleSubmit((values) => {
    const payload = normalize(values);
    if (onSave) onSave(payload);
    setOpen(false);
  });

  const cancel = () => {
    onCancel?.();
    setOpen(false);
  };

  const renderAgentId = scope === "local";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden p-0">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Body */}
        <form onSubmit={submit} className="px-6 pb-2 overflow-y-auto">
          {/* Row: Scope (Switch) + Agent ID (Select) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex flex-col">
                <Label className="mb-1">Scope</Label>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-sm ${
                    scope === "local" ? "opacity-100" : "opacity-50"
                  }`}
                >
                  Local
                </span>
                <Switch
                  checked={scope === "global"}
                  onCheckedChange={(checked) =>
                    setValue("scope", checked ? "global" : "local", {
                      shouldDirty: true,
                      shouldValidate: true,
                    })
                  }
                  aria-label="Toggle scope"
                />
                <span
                  className={`text-sm ${
                    scope === "global" ? "opacity-100" : "opacity-50"
                  }`}
                >
                  Global
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3">
              <Label htmlFor="agent_id">Agent ID</Label>
              <div className="mt-2">
                <Select
                  value={watch("agent_id")}
                  onValueChange={(val) =>
                    setValue("agent_id", val, {
                      shouldValidate: true,
                      shouldDirty: true,
                    })
                  }
                  disabled={!renderAgentId}
                >
                  <SelectTrigger
                    id="agent_id"
                    className="w-full"
                    aria-disabled={!renderAgentId}
                  >
                    <SelectValue
                      placeholder={
                        renderAgentId
                          ? "Select an agent…"
                          : "Disabled for Global"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {agentList.map((a) => (
                      <SelectItem key={a.value} value={a.value}>
                        {a.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {errors.agent_id && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.agent_id.message}
                </p>
              )}
            </div>
          </div>

          {/* Row: Policy Rule Type */}
          <div className="mt-4">
            <Label htmlFor="policy_rule_type">Policy Rule Type</Label>
            <div className="mt-2">
              <Select
                value={policyType}
                onValueChange={(val: policy_rule_type) =>
                  setValue("policy_rule_type", val, {
                    shouldValidate: true,
                    shouldDirty: true,
                  })
                }
              >
                <SelectTrigger id="policy_rule_type" className="w-full">
                  <SelectValue placeholder="Select a rule type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="parentChild">
                    Unusual Parent-Child Process Relation
                  </SelectItem>
                  <SelectItem value="cmdline_string">
                    Suspicious String in Command Line
                  </SelectItem>
                  <SelectItem value="blockProcess">Block a Process</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Conditional fields */}
          {policyType === "parentChild" && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent_process">Parent Process Name</Label>
                <Input
                  id="parent_process"
                  placeholder="e.g. winword.exe"
                  className="mt-2"
                  {...register("parent_process")}
                />
                {errors.parent_process && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.parent_process.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="child_process">Child Process Name</Label>
                <Input
                  id="child_process"
                  placeholder="e.g., powershell.exe"
                  className="mt-2"
                  {...register("child_process")}
                />
                {errors.child_process && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.child_process.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {policyType === "cmdline_string" && (
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="target_process">Target Process Name</Label>
                <Input
                  id="target_process"
                  placeholder="e.g. powershell.exe"
                  className="mt-2"
                  {...register("target_process")}
                />
                {errors.target_process && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.target_process.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="cmdline_string">String in Command Line</Label>
                <Input
                  id="cmdline_string"
                  placeholder='e.g. "Invoke-WebRequest"'
                  className="mt-2"
                  {...register("cmdline_string")}
                />
                {errors.cmdline_string && (
                  <p className="mt-1 text-xs text-destructive">
                    {errors.cmdline_string.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {policyType === "blockProcess" && (
            <div className="mt-4">
              <Label htmlFor="target_process">Target Process Name</Label>
              <Input
                id="target_process"
                placeholder="e.g. mimikatz.exe"
                className="mt-2"
                {...register("target_process")}
              />
              {errors.target_process && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.target_process.message}
                </p>
              )}
            </div>
          )}

          {/* Rule Description */}
          <div className="mt-4">
            <Label htmlFor="rule_desc">Rule Description</Label>
            <Textarea
              id="rule_desc"
              placeholder="Describe the rule intent, context, and expected outcome…"
              className="mt-2 min-h-28"
              {...register("rule_desc")}
            />
            {errors.rule_desc && (
              <p className="mt-1 text-xs text-destructive">
                {errors.rule_desc.message}
              </p>
            )}
          </div>
        </form>

        {/* Footer */}
        <DialogFooter className="px-6 pb-4 gap-2">
          <Button type="button" variant="outline" onClick={cancel}>
            Cancel
          </Button>
          <Button
            type="submit"
            form="__implicit" // not used, but keep Button as submit via form submitter below
            onClick={(e) => {
              e.preventDefault();
              (document.activeElement as HTMLElement)?.blur?.();
              // submit via handleSubmit
              void submit();
            }}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
