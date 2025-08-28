import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Users,
  Building,
  Eye,
  FileText,
  TrendingUp,
  ExternalLink,
  Download,
  Share2,
  Copy,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { Separator } from "@/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/ui/table";
import { mockThreatData, type ThreatData } from "@/data/mockThreatData";
import { cn } from "@/lib/utils";

const getStatusColor = (status: string) => {
  switch (status) {
    case "mitigated":
      return "bg-medium/10 text-medium border-medium/20";
    case "active":
      return "bg-critical/10 text-critical border-critical/20";
    case "investigating":
      return "bg-high/10 text-high border-high/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

const getConfidenceColor = (confidence: string) => {
  switch (confidence) {
    case "high":
      return "bg-critical/10 text-critical border-critical/20";
    case "medium":
      return "bg-medium/10 text-medium border-medium/20";
    case "low":
      return "bg-low/10 text-low border-low/20";
    case "suspicious":
      return "bg-primary/10 text-primary border-primary/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

const getVerdictColor = (verdict: string) => {
  switch (verdict) {
    case "true_positive":
      return "bg-primary/10 text-primary border-primary/20";
    case "false_positive":
      return "bg-low/10 text-low border-low/20";
    case "pending":
      return "bg-medium/10 text-medium border-medium/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

const getIncidentColor = (status: string) => {
  switch (status) {
    case "resolved":
      return "bg-low/10 text-low border-low/20";
    case "unresolved":
      return "bg-critical/10 text-critical border-critical/20";
    case "in_progress":
      return "bg-medium/10 text-medium border-medium/20";
    default:
      return "bg-muted/10 text-muted-foreground border-muted/20";
  }
};

export default function ThreatDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("indicators");
  const threat = mockThreatData;

  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container max-w-none p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/threats")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Threats
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Identified Time
              </span>
              <span className="text-sm font-medium">Jan 18, 2022 12:23:20</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm text-muted-foreground">
                Reporting Time
              </span>
              <span className="text-sm font-medium">Jan 18, 2022 12:23:20</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container max-w-none p-6 space-y-6">
        {/* Status Header */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Threat Status</span>
            <Badge className={cn("", getStatusColor(threat.threatStatus))}>
              MITIGATED
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              AI Confidence Level
            </span>
            <Badge className={cn("", getConfidenceColor(threat.aiConfidence))}>
              SUSPICIOUS
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Analyst Verdict
            </span>
            <Badge className={cn("", getVerdictColor(threat.analystVerdict))}>
              True Positive
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">
              Incident Status
            </span>
            <Badge className={cn("", getIncidentColor(threat.incidentStatus))}>
              Unresolved
            </Badge>
          </div>
        </div>

        {/* Mitigation Actions */}
        <div className="bg-card/50 border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm text-muted-foreground">
              Mitigation Actions taken:
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">KILLED</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-foreground">
                  {threat.mitigationActions.killed}
                </span>
                <span className="text-green-400">✓</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">QUARANTINED</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-foreground">
                  {threat.mitigationActions.quarantined}
                </span>
                <span className="text-green-400">✓</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">REMEDIATED</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-foreground">
                  {threat.mitigationActions.remediated}
                </span>
                <span className="text-green-400">✓</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">ROLLED BACK</span>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-foreground">
                  {threat.mitigationActions.rolledBack}
                </span>
                <span className="text-green-400">✓</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Meta Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    First seen
                  </div>
                  <div className="font-medium">{threat.firstSeen}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Last seen</div>
                  <div className="font-medium">{threat.lastSeen}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">
                    2 times on
                  </div>
                  <div className="font-medium">1 endpoint</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-sm text-muted-foreground">
                    1 Account / 1 Site / 1 Group
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              <span className="text-sm text-muted-foreground">
                Find this hash on Deep Visibility
              </span>
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Hunt Now
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Threat File Details */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>THREAT FILE NAME</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Copy Details
                    </Button>
                    <Button variant="outline" size="sm">
                      Download Threat File
                    </Button>
                  </div>
                </CardTitle>
                <div className="font-mono text-sm bg-muted/30 p-3 rounded break-all">
                  {threat.threatFileName}
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground w-48">
                        Path
                      </TableCell>
                      <TableCell className="font-mono text-sm break-all">
                        {threat.details.path}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Command Line Arguments
                      </TableCell>
                      <TableCell className="font-mono text-sm break-all">
                        {threat.details.commandLine}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Process User
                      </TableCell>
                      <TableCell>{threat.details.processUser}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Publisher Name
                      </TableCell>
                      <TableCell>
                        {threat.details.publisherName || "N/A"}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Signer Identity
                      </TableCell>
                      <TableCell>{threat.details.signerIdentity}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Signature Verification
                      </TableCell>
                      <TableCell>
                        {threat.details.signatureVerification}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Originating Process
                      </TableCell>
                      <TableCell>{threat.details.originatingProcess}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        SHA1
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {threat.details.sha1}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Engine
                      </TableCell>
                      <TableCell>{threat.details.engine}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Detection type
                      </TableCell>
                      <TableCell>{threat.details.detectionType}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Classification
                      </TableCell>
                      <TableCell>{threat.details.classification}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        File Size
                      </TableCell>
                      <TableCell>{threat.details.fileSize}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Storyline
                      </TableCell>
                      <TableCell>{threat.details.storyline}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Threat Id
                      </TableCell>
                      <TableCell>{threat.details.threatId}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Endpoint Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ENDPOINT</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Real-time data about this endpoint.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-muted/30 rounded-lg flex items-center justify-center">
                    <Building className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {threat.endpoint.hostname}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {threat.endpoint.scope}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Console Connectivity
                    </span>
                    <div className="font-medium">
                      {threat.endpoint.consoleConnectivity}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      At detection time:
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Full Disk Scan
                    </span>
                    <div className="font-medium">
                      {threat.endpoint.fullDiskScan}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Scope</span>
                    <div className="font-medium">
                      {threat.endpoint.scope.split(" - ")[0]}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Pending reboot
                    </span>
                    <div className="font-medium">
                      {threat.endpoint.pendingReboot}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">OS Version</span>
                    <div className="font-medium">
                      {threat.endpoint.osVersion}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Number of not mitigated threats
                    </span>
                    <div className="font-medium">
                      {threat.endpoint.numberOfThreats}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Agent Version</span>
                    <div className="font-medium">
                      {threat.endpoint.agentVersion}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-muted-foreground">Policy</span>
                    <div className="font-medium">{threat.endpoint.policy}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">
                      Logged In User
                    </span>
                    <div className="font-medium">
                      {threat.endpoint.loggedInUser}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">UUID</span>
                    <div className="font-mono text-xs">
                      {threat.endpoint.uuid}
                    </div>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Domain</span>
                    <div className="font-medium">{threat.endpoint.domain}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="indicators" className="text-xs">
                  THREAT INDICATORS ({threat.threatIndicators.length})
                </TabsTrigger>
                <TabsTrigger value="notes" className="text-xs">
                  NOTES ({threat.notes.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="indicators" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {threat.threatIndicators.map((indicator, index) => (
                        <div
                          key={index}
                          className="border-l-2 border-primary pl-4"
                        >
                          <div className="font-medium text-sm">
                            {indicator.type}
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {indicator.description}
                          </div>
                          {indicator.mitreId && (
                            <div className="flex items-center gap-2">
                              <Badge
                                variant="outline"
                                className="text-xs font-mono"
                              >
                                {indicator.mitreId}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 p-1"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                          {indicator.mitreDescription && (
                            <div className="text-xs text-muted-foreground mt-1">
                              MITRE - {indicator.mitreDescription}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className="mt-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {threat.notes.map((note) => (
                        <div
                          key={note.id}
                          className="border-b border-border pb-4 last:border-b-0"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-sm">
                              {note.author}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {note.timestamp}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {note.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
