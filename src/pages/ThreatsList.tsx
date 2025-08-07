import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Filter, Calendar, Download, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { SeverityBadge } from "@/components/ui/severity-badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { mockThreatsList, threatTimeRanges, threatSeverityFilters } from "@/data/mockThreatsListData";
import { mockThreatData } from "@/data/mockThreatData";

export default function ThreatsList() {
  const navigate = useNavigate();
  const [selectedTimeRange, setSelectedTimeRange] = useState("7d");
  const [selectedSeverity, setSelectedSeverity] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredThreats = mockThreatsList.filter(threat => {
    const matchesSearch = threat.threatName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         threat.mitreTechniques.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSeverity = selectedSeverity === "all" || threat.severity === selectedSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-critical/10 text-critical border-critical/20';
      case 'investigating':
        return 'bg-high/10 text-high border-high/20';
      case 'mitigated':
        return 'bg-medium/10 text-medium border-medium/20';
      case 'resolved':
        return 'bg-low/10 text-low border-low/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'true_positive':
        return 'bg-critical/10 text-critical border-critical/20';
      case 'false_positive':
        return 'bg-low/10 text-low border-low/20';
      case 'pending':
        return 'bg-medium/10 text-medium border-medium/20';
      case 'in_review':
        return 'bg-info/10 text-info border-info/20';
      default:
        return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">THREATS</h1>
          <p className="text-muted-foreground mt-1">Security threats detected across your environment</p>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                <SelectTrigger className="w-40">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {threatTimeRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex gap-1">
                {threatSeverityFilters.map((filter) => (
                  <Button
                    key={filter.value}
                    variant={selectedSeverity === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSeverity(filter.value)}
                    className="text-xs"
                  >
                    {filter.label} ({filter.count})
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Search threats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Threats Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="min-w-[150px]">First Seen</TableHead>
                  <TableHead className="min-w-[100px]">Severity</TableHead>
                  <TableHead className="min-w-[250px]">Threat Name</TableHead>
                  <TableHead className="min-w-[200px]">MITRE Technique(s)</TableHead>
                  <TableHead className="min-w-[120px]">Affected Endpoints</TableHead>
                  <TableHead className="min-w-[120px]">Status</TableHead>
                  <TableHead className="min-w-[150px]">Last Action</TableHead>
                  <TableHead className="min-w-[130px]">Analyst Verdict</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredThreats.map((threat) => (
                  <TableRow 
                    key={threat.id} 
                    className="border-border hover:bg-muted/30 cursor-pointer"
                    onClick={() => navigate(`/threats/${threat.id}`)}
                  >
                    <TableCell className="text-muted-foreground font-mono text-sm">
                      {new Date(threat.firstSeen).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <SeverityBadge severity={threat.severity}>
                        {threat.severity.toUpperCase()}
                      </SeverityBadge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{threat.threatName}</div>
                      <div className="text-xs text-muted-foreground">Confidence: {threat.confidence}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {threat.mitreTechniques.map((technique) => (
                          <Badge key={technique} variant="outline" className="text-xs font-mono">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {threat.affectedEndpoints}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getStatusColor(threat.status)}`}>
                        {threat.status.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {threat.lastAction}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${getVerdictColor(threat.analystVerdict)}`}>
                        {threat.analystVerdict.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                          <DropdownMenuItem>Add to Exclusions</DropdownMenuItem>
                          <DropdownMenuItem>Export Evidence</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}