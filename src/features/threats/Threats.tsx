import { useState } from "react";
import {
  Shield,
  Clock,
  Users,
  Building,
  Eye,
  FileText,
  TrendingUp,
  ExternalLink,
  Download,
  Share2,
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
import {
  mockThreatData,
  mitreFrequencyData,
  type ThreatData,
} from "@/data/mockThreatData";
import { cn } from "@/lib/utils";

const getStatusColor = (status: string) => {
  switch (status) {
    case "mitigated":
      return "text-green-400 bg-green-400/10";
    case "active":
      return "text-red-400 bg-red-400/10";
    case "investigating":
      return "text-yellow-400 bg-yellow-400/10";
    default:
      return "text-muted-foreground bg-muted/10";
  }
};

const getConfidenceColor = (confidence: string) => {
  switch (confidence) {
    case "high":
      return "text-red-400 bg-red-400/10";
    case "medium":
      return "text-yellow-400 bg-yellow-400/10";
    case "low":
      return "text-green-400 bg-green-400/10";
    case "suspicious":
      return "text-purple-400 bg-purple-400/10";
    default:
      return "text-muted-foreground bg-muted/10";
  }
};

const getVerdictColor = (verdict: string) => {
  switch (verdict) {
    case "true_positive":
      return "text-red-400 bg-red-400/10";
    case "false_positive":
      return "text-green-400 bg-green-400/10";
    case "pending":
      return "text-yellow-400 bg-yellow-400/10";
    default:
      return "text-muted-foreground bg-muted/10";
  }
};

const getIncidentColor = (status: string) => {
  switch (status) {
    case "resolved":
      return "text-green-400 bg-green-400/10";
    case "unresolved":
      return "text-red-400 bg-red-400/10";
    case "in_progress":
      return "text-yellow-400 bg-yellow-400/10";
    default:
      return "text-muted-foreground bg-muted/10";
  }
};

export default function Threats() {
  const [selectedTab, setSelectedTab] = useState("details");
  const threat = mockThreatData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-12 h-12 bg-green-400/10 rounded-lg">
            <Shield className="h-6 w-6 text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Threat Details
            </h1>
            <p className="text-muted-foreground">
              Malware incident analysis and mitigation
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Download Threat File
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Threat Status</p>
                <Badge
                  className={cn("mt-1", getStatusColor(threat.threatStatus))}
                >
                  {threat.threatStatus.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <Shield className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  AI Confidence Level
                </p>
                <Badge
                  className={cn(
                    "mt-1",
                    getConfidenceColor(threat.aiConfidence)
                  )}
                >
                  {threat.aiConfidence.toUpperCase()}
                </Badge>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Analyst Verdict</p>
                <Badge
                  className={cn("mt-1", getVerdictColor(threat.analystVerdict))}
                >
                  {threat.analystVerdict.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <Eye className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Incident Status</p>
                <Badge
                  className={cn(
                    "mt-1",
                    getIncidentColor(threat.incidentStatus)
                  )}
                >
                  {threat.incidentStatus.replace("_", " ").toUpperCase()}
                </Badge>
              </div>
              <FileText className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mitigation Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mitigation Actions Taken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">
                {threat.mitigationActions.killed}
              </div>
              <div className="text-sm text-muted-foreground">KILLED ✓</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {threat.mitigationActions.quarantined}
              </div>
              <div className="text-sm text-muted-foreground">QUARANTINED ✓</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-400">
                {threat.mitigationActions.remediated}
              </div>
              <div className="text-sm text-muted-foreground">REMEDIATED ✓</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">
                {threat.mitigationActions.rolledBack}
              </div>
              <div className="text-sm text-muted-foreground">ROLLED BACK ✓</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Threat Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">First seen</p>
                <p className="font-medium">{threat.firstSeen}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Last seen</p>
                <p className="font-medium">{threat.lastSeen}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Endpoints affected
                </p>
                <p className="font-medium">
                  {threat.endpointsAffected} times on {threat.endpointsAffected}{" "}
                  endpoint
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coverage</p>
                <p className="font-medium">
                  {threat.accountsAffected} Account / {threat.sitesAffected}{" "}
                  Site / {threat.groupsAffected} Group
                </p>
              </div>
            </div>

            <Separator />

            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">
                  Find this hash on Deep Visibility
                </span>
                <Button variant="outline" size="sm" className="h-6">
                  Hunt Now
                </Button>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-2">
                THREAT FILE NAME
              </p>
              <p className="font-mono text-sm bg-muted/30 p-2 rounded">
                {threat.threatFileName}
              </p>
              <div className="flex gap-2 mt-2">
                <Button variant="outline" size="sm">
                  Copy Details
                </Button>
                <Button variant="outline" size="sm">
                  Download Threat File
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Latest MITRE Technique Hits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mitreFrequencyData.slice(0, 6).map((technique, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium">{technique.technique}</p>
                    <p className="text-xs text-muted-foreground">
                      {technique.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{technique.count}</div>
                    <div className="w-16 h-1 bg-muted rounded-full">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${(technique.count / 45) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Information Tabs */}
      <Tabs
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Threat Details</TabsTrigger>
          <TabsTrigger value="indicators">
            Threat Indicators ({threat.threatIndicators.length})
          </TabsTrigger>
          <TabsTrigger value="notes">Notes ({threat.notes.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>File Details</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Path
                      </TableCell>
                      <TableCell className="font-mono text-xs">
                        {threat.details.path}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium text-muted-foreground">
                        Command Line Arguments
                      </TableCell>
                      <TableCell className="font-mono text-xs">
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
                      <TableCell className="font-mono text-xs">
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

            <Card>
              <CardHeader>
                <CardTitle>Endpoint Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{threat.endpoint.hostname}</p>
                    <p className="text-xs text-muted-foreground">
                      {threat.endpoint.scope.length > 40
                        ? `${threat.endpoint.scope.substring(0, 40)}...`
                        : threat.endpoint.scope}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      At detection time:
                    </p>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Scope</span>
                      <span>{threat.endpoint.scope.split(" - ")[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">OS Version</span>
                      <span>{threat.endpoint.osVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Agent Version
                      </span>
                      <span>{threat.endpoint.agentVersion}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Policy</span>
                      <span>{threat.endpoint.policy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Logged In User
                      </span>
                      <span>{threat.endpoint.loggedInUser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">UUID</span>
                      <span className="font-mono text-xs">
                        {threat.endpoint.uuid}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Domain</span>
                      <span>{threat.endpoint.domain}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Console Connectivity
                      </span>
                      <Badge variant="secondary" className="text-xs">
                        {threat.endpoint.consoleConnectivity}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Full Disk Scan
                      </span>
                      <span className="text-xs">
                        {threat.endpoint.fullDiskScan}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Pending reboot
                      </span>
                      <span>{threat.endpoint.pendingReboot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Number of not mitigated threats
                      </span>
                      <span>{threat.endpoint.numberOfThreats}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="indicators" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Threat Indicators</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threat.threatIndicators.map((indicator, index) => (
                  <div
                    key={index}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge variant="outline" className="mb-2">
                          {indicator.type}
                        </Badge>
                        <p className="text-sm mb-2">{indicator.description}</p>
                        {indicator.mitreId && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              MITRE: {indicator.mitreId}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {indicator.mitreDescription}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Investigation Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {threat.notes.map((note) => (
                  <div
                    key={note.id}
                    className="border border-border rounded-lg p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{note.author}</span>
                      <span className="text-xs text-muted-foreground">
                        {note.timestamp}
                      </span>
                    </div>
                    <p className="text-sm">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
