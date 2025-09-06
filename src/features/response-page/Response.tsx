import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/ui/button"; // (if using shadcn)
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { http } from "@/lib/config";
import { POLICY_RULES, RESPONSE_PLAYBOOK } from "./responseEndpoints";
import { TruncText } from "@/lib/helpers";
import { SeverityBadge } from "@/ui/severity-badge";
import PolicyRuleFormDialog from "./Components/PolicyPopover";
import PlaybookFormDialog from "./Components/ResponsePopover";

const policyTableHeader = [
  "Scope",
  "AgentID",
  "Policy Rule Type",
  "Description",
  "Modify Date",
  "Activate",
];

const playbookTableHeader = [
  "Playbook Name",
  "Scope",
  "AgentID",
  "Trigger Condition",
  "Severity",
  "Attack Category",
  "Last Modified",
  "Last Run",
  "Author",
  "Associated Alerts",
  "Frequency",
  "Activate",
];

const useGetPolicies = () => {
  const [policyData, setPolicyData] = useState([]);
  const [policyLoading, setPolicyLoading] = useState(false);

  const fetchPolicy = useCallback(async () => {
    setPolicyLoading(true);

    try {
      const response = await http.get(POLICY_RULES);
      if (response.status == 200) {
        setPolicyData(response.data.formattedHits);
      }
    } catch (error) {
      console.error("Error Fetching Policies");
      toast.error(`Error fetching policies, Error: ${error}`);
    } finally {
      setPolicyLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPolicy();
  }, []);

  return { policyData, policyLoading, refetch: fetchPolicy };
};

const useGetResponsePlaybook = () => {
  const [playbookData, setPlaybookData] = useState([]);
  const [playbookLoading, setPlaybookLoading] = useState(false);

  const fetchResponsePlaybook = useCallback(async () => {
    setPlaybookLoading(true);

    try {
      const response = await http.get(RESPONSE_PLAYBOOK);
      if (response.status == 200) {
        setPlaybookData(response.data.hits);
      }
    } catch (error) {
      console.error("Error Fetching Policies");
      toast.error(`Error fetching policies, Error: ${error}`);
    } finally {
      setPlaybookLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResponsePlaybook();
  }, []);

  return { playbookData, playbookLoading, refetch: fetchResponsePlaybook };
};

const useSetNewPolicy = () => {
  const [loading, setLoading] = useState(false);
  const addNewPolicy = useCallback(async (apiBody: any) => {
    try {
      const response = await http.post(POLICY_RULES, apiBody);

      if (response.status == 201 || response.status == 200) {
        toast.success("New Policy Added Successfully");
      }
    } catch (error) {
      toast.error(`Error adding new policy, Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }, []);
  return { addNewPolicy, loading };
};

const useSetNewPlaybook = () => {
  const [loading, setLoading] = useState(false);
  const addNewPlaybook = useCallback(async (apiBody: any) => {
    try {
      const response = await http.post(RESPONSE_PLAYBOOK, apiBody);

      if (response.status == 201 || response.status == 200) {
        toast.success("New Policy Added Successfully");
      }
    } catch (error) {
      toast.error(`Error adding new policy, Error: ${error}`);
    } finally {
      setLoading(false);
    }
  }, []);
  return { addNewPlaybook, loading };
};

const Response = () => {
  const { policyData, policyLoading } = useGetPolicies();
  const { playbookData, playbookLoading } = useGetResponsePlaybook();
  const { addNewPolicy } = useSetNewPolicy();
  const { addNewPlaybook } = useSetNewPlaybook();
  const [policyPopoverOpen, setPolicyPopoverOpen] = useState(false);
  const [playbookPopoverOpen, setPlaybookPopoverOpen] = useState(false);

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="flex h-full">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-foreground">RESPONSE</h1>
          </div>
        </div>
      </div>

      {/* Policy Table */}
      <div className="h-full overflow-auto pt-4">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">
              AVAILABLE POLICIES
            </h1>
          </div>
          <Button
            onClick={() => {
              setPolicyPopoverOpen(true);
            }}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
        {/*Main Content*/}
        <div className="pt-4">
          <Card>
            <CardContent className="p-2">
              <Table className="max-h-[400px]">
                <TableHeader>
                  <TableRow className="border-border/10">
                    {policyTableHeader.map((label) => (
                      <TableHead
                        key={label}
                        className="whitespace-nowrap font-medium text-foreground"
                      >
                        {label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="text-md">
                  {policyLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        Loading…
                      </TableCell>
                    </TableRow>
                  ) : policyData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No policies found
                      </TableCell>
                    </TableRow>
                  ) : (
                    policyData.map((row: any) => (
                      <TableRow key={row?._id}>
                        {/* <TableCell className="justify-items-center">
                          <TruncText
                            value={row?._id}
                            maxWidth="max-w-[200px]"
                          />
                        </TableCell> */}
                        <TableCell className="justify-items-center">
                          <TruncText value={row?.scope} />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText value={row?.agentId} />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText
                            value={
                              row.policy_rule_type
                                ? row.policy_rule_type
                                : "N/A"
                            }
                          />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText
                            value={row.rule_desc ? row.rule_desc : "N/A"}
                            maxWidth="max-w-[300px]"
                          />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText
                            value={row.modified_at ? row.modified_at : "N/A"}
                            maxWidth="max-w-[200px]"
                          />
                        </TableCell>
                        <TableCell className="justify-center flex">
                          <Button
                            onClick={() => {
                              toast.success("add new");
                            }}
                            className="p-2"
                            variant="outline"
                          >
                            Activate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <PolicyRuleFormDialog
          open={policyPopoverOpen}
          onOpenChange={setPolicyPopoverOpen}
          onCancel={() => setPolicyPopoverOpen(false)}
          onSave={async (apiBody) => {
            await addNewPolicy(apiBody);
          }}
        />
      </div>

      {/* Response Table */}
      <div className="h-full overflow-auto pt-4">
        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-foreground">
              AVAILABLE SCRIPTS
            </h1>
          </div>
          <Button
            onClick={() => {
              setPlaybookPopoverOpen(true);
            }}
            className="gap-1"
          >
            <Plus className="h-4 w-4" />
            Add New
          </Button>
        </div>
        {/*Main Content*/}
        <div className="pt-4">
          <Card>
            <CardContent className="p-2">
              <Table>
                <TableHeader>
                  <TableRow className="border-border/10">
                    {playbookTableHeader.map((label) => (
                      <TableHead
                        key={label}
                        className="whitespace-nowrap font-medium text-foreground"
                      >
                        {label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody className="text-md">
                  {playbookLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        Loading…
                      </TableCell>
                    </TableRow>
                  ) : playbookData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        No policies found
                      </TableCell>
                    </TableRow>
                  ) : (
                    playbookData.map((row: any) => (
                      <TableRow key={row?._id}>
                        <TableCell className="justify-items-center">
                          <TruncText
                            value={row?.playbook_name}
                            maxWidth="max-w-[200px]"
                          />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText value={row?.scope} />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText value={row?.agentId} />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText
                            value={
                              row.trigger_condition
                                ? row.trigger_condition
                                : "N/A"
                            }
                          />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <SeverityBadge severity={row.severity.toLowerCase()}>
                            {row.severity.charAt(0).toUpperCase() +
                              row.severity.slice(1)}
                          </SeverityBadge>
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText
                            value={
                              row.attack_category ? row.attack_category : "N/A"
                            }
                          />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText
                            maxWidth="max-w-[200px]"
                            value={
                              row.last_modified ? row.last_modified : "N/A"
                            }
                          />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText
                            maxWidth="max-w-[200px]"
                            value={row.last_run ? row.last_run : "N/A"}
                          />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText value={row.author ? row.author : "N/A"} />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText
                            value={
                              row.associated_alerts
                                ? row.associated_alerts
                                : "N/A"
                            }
                          />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <TruncText
                            value={row.frequency ? row.frequency : "N/A"}
                          />
                        </TableCell>
                        <TableCell className="justify-items-center">
                          <Button
                            onClick={() => {
                              toast.success("add new");
                            }}
                            className="p-2"
                            variant="outline"
                          >
                            Activate
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
        <PlaybookFormDialog
          open={playbookPopoverOpen}
          onOpenChange={setPlaybookPopoverOpen}
          onCancel={() => setPlaybookPopoverOpen(false)}
          onSave={async (apiBody) => {
            await addNewPlaybook(apiBody);
          }}
        />
      </div>
    </div>
  );
};

export default Response;
