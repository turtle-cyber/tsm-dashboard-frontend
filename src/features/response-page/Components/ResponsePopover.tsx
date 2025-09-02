// PlaybookFormDialog.tsx
import * as React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// shadcn/radix wrappers — adjust paths to your setup
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/ui/dialog";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Textarea } from "@/ui/textarea";
import { Label } from "@/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/ui/select";

export type PlaybookPayload = {
  playbook_name: string;
  description: string;
  frequency: "Once" | "Regular" | "Daily" | "Weekly" | "Monthly";
  severity: "Low" | "Medium" | "High" | "Critical";
  scope: "Local" | "Global";
  agentId: number | "-";
  attack_category: string;
  trigger_condition: string;
  author: string;
  associated_alerts: string;
};

const schema = z.object({
  playbook_name: z.string().trim().min(1, "Playbook name is required"),
  description: z.string().trim().min(1, "Description is required"),
  frequency: z.enum(["Once", "Regular", "Daily", "Weekly", "Monthly"]),
  severity: z.enum(["Low", "Medium", "High", "Critical"]),
  scope: z.enum(["Local", "Global"]),
  // Support "-" for Global and numbers for Local (no conditional behavior enforced)
  agentId: z.union([z.literal("-"), z.coerce.number().int().nonnegative()]),
  attack_category: z.string().trim().min(1, "Attack category is required"),
  trigger_condition: z.string().trim().min(1, "Trigger/Use case is required"),
  author: z.string().trim().min(1, "Author is required"),
  associated_alerts: z.string().trim().min(1, "Associated alerts is required"),
});

type FormValues = z.infer<typeof schema>;

export interface PlaybookFormDialogProps {
  open?: boolean;
  onOpenChange?: (o: boolean) => void;
  onCancel?: () => void;
  onSave?: (body: PlaybookPayload) => Promise<any> | void;
  title?: string;
  description?: string;
  // Optional agent list; include "-" so users can pick it for Global if desired
  agentOptions?: Array<{ label: string; value: number | "-" }>;
  initialValues?: Partial<PlaybookPayload>;
}

export default function PlaybookFormDialog({
  open = true,
  onOpenChange,
  onCancel,
  onSave,
  title = "Create Response Playbook",
  description = "Fill in the playbook details and click Save.",
  agentOptions = [
    { label: "-", value: "-" },
    { label: "01 (Workstation)", value: 1 },
    { label: "02 (DB-Server)", value: 2 },
    { label: "03 (Jump-Host)", value: 3 },
  ],
  initialValues,
}: PlaybookFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      playbook_name: initialValues?.playbook_name ?? "",
      description: initialValues?.description ?? "",
      frequency:
        (initialValues?.frequency as FormValues["frequency"]) ?? "Once",
      severity: (initialValues?.severity as FormValues["severity"]) ?? "Low",
      scope: (initialValues?.scope as FormValues["scope"]) ?? "Local",
      agentId: (initialValues?.agentId as FormValues["agentId"]) ?? "-",
      attack_category: initialValues?.attack_category ?? "",
      trigger_condition: initialValues?.trigger_condition ?? "",
      author: initialValues?.author ?? "",
      associated_alerts: initialValues?.associated_alerts ?? "",
    },
  });

  const scope = watch("scope");

  const submit = handleSubmit(async (vals) => {
    const body: PlaybookPayload = {
      playbook_name: vals.playbook_name.trim(),
      description: vals.description.trim(),
      frequency: vals.frequency,
      severity: vals.severity,
      scope: vals.scope, // "Local" | "Global"
      agentId: vals.agentId, // number | "-"
      attack_category: vals.attack_category.trim(),
      trigger_condition: vals.trigger_condition.trim(),
      author: vals.author.trim(),
      associated_alerts: vals.associated_alerts.trim(),
    };
    await onSave?.(body);
    onOpenChange?.(false);
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[85vh] overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="px-6 pb-2 overflow-y-auto">
          {/* Row 1: Playbook Name */}
          <div className="mt-2">
            <Label htmlFor="playbook_name">Playbook Name</Label>
            <Input
              id="playbook_name"
              placeholder='e.g., "Custom Test Workflow"'
              className="mt-2"
              {...register("playbook_name")}
            />
            {errors.playbook_name && (
              <p className="mt-1 text-xs text-destructive">
                {errors.playbook_name.message}
              </p>
            )}
          </div>

          {/* Row 2: Scope + Agent ID (no conditional) */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <Label>Scope</Label>
                  <span className="text-xs text-muted-foreground">
                    Local or Global
                  </span>
                </div>
                <div className="min-w-[180px]">
                  <Select
                    value={watch("scope")}
                    onValueChange={(v: "Local" | "Global") =>
                      setValue("scope", v, {
                        shouldDirty: true,
                        shouldValidate: true,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Local">Local</SelectItem>
                      <SelectItem value="Global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {errors.scope && (
                <p className="mt-2 text-xs text-destructive">
                  {errors.scope.message}
                </p>
              )}
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <Label>Agent ID</Label>
                  <span className="text-xs text-muted-foreground">
                    Select “-” for Global if needed
                  </span>
                </div>
                <div className="min-w-[180px]">
                  <Select
                    value={String(watch("agentId"))}
                    onValueChange={(v) => {
                      const parsed: "-" | number = v === "-" ? "-" : Number(v);
                      setValue("agentId", parsed, {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an agent…" />
                    </SelectTrigger>
                    <SelectContent>
                      {agentOptions.map((a) => (
                        <SelectItem
                          key={String(a.value)}
                          value={String(a.value)}
                        >
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {errors.agentId && (
                <p className="mt-2 text-xs text-destructive">
                  {errors.agentId.message as any}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Trigger + Severity */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="trigger_condition">
                Trigger Condition / Use Case
              </Label>
              <Input
                id="trigger_condition"
                placeholder='e.g., "Manual Run" or "Detection of suspicious PowerShell/WMI"'
                className="mt-2"
                {...register("trigger_condition")}
              />
              {errors.trigger_condition && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.trigger_condition.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={watch("severity")}
                onValueChange={(v: PlaybookPayload["severity"]) =>
                  setValue("severity", v, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="severity" className="mt-2 w-full">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                </SelectContent>
              </Select>
              {errors.severity && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.severity.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: Attack Category + Frequency */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="attack_category">Attack Category</Label>
              <Input
                id="attack_category"
                placeholder='e.g., "Generic" or "Defense Evasion, Execution (T1059, T1547, T1047)"'
                className="mt-2"
                {...register("attack_category")}
              />
              {errors.attack_category && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.attack_category.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="frequency">Frequency</Label>
              <Select
                value={watch("frequency")}
                onValueChange={(v: PlaybookPayload["frequency"]) =>
                  setValue("frequency", v, {
                    shouldDirty: true,
                    shouldValidate: true,
                  })
                }
              >
                <SelectTrigger id="frequency" className="mt-2 w-full">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Once">Once</SelectItem>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              {errors.frequency && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.frequency.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 5: Author + Associated Alerts */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author">Author</Label>
              <Input
                id="author"
                placeholder='e.g., "Analyst (Simranjeet)"'
                className="mt-2"
                {...register("author")}
              />
              {errors.author && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.author.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="associated_alerts">Associated Alerts</Label>
              <Input
                id="associated_alerts"
                placeholder='e.g., "Precautionary" or "6 Incidents"'
                className="mt-2"
                {...register("associated_alerts")}
              />
              {errors.associated_alerts && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.associated_alerts.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 6: Description */}
          <div className="mt-4">
            <Label htmlFor="description">Notes / Description</Label>
            <Textarea
              id="description"
              placeholder='e.g., "Workflow for testing automation steps"'
              className="mt-2 min-h-28"
              {...register("description")}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="h-4" />
        </form>

        <DialogFooter className="px-6 pb-6 gap-2">
          <Button type="button" variant="outline" onClick={() => onCancel?.()}>
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
