import { useState } from "react";
import { Monitor, Laptop, Apple, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { mockEndpoints, endpointFilterOptions, type EndpointData } from "@/data/mockEndpointData";

const getOSIcon = (osType: string) => {
  switch (osType) {
    case 'windows':
      return Laptop;
    case 'macos':
      return Apple;
    case 'android':
      return Smartphone;
    default:
      return Monitor;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'bg-green-500/10 text-green-400 border-green-500/20';
    case 'offline':
      return 'bg-red-500/10 text-red-400 border-red-500/20';
    case 'pending':
      return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
    default:
      return 'bg-muted/10 text-muted-foreground border-muted/20';
  }
};

export function EndpointsDashboard() {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState("50");

  const filteredEndpoints = mockEndpoints.filter(endpoint =>
    endpoint.endpointName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.account.toLowerCase().includes(searchTerm.toLowerCase()) ||
    endpoint.lastLoggedInUser.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="text-xs">
                Select filters...
              </Button>
              {selectedFilters.map((filter) => (
                <Badge key={filter} variant="secondary" className="text-xs">
                  {filter}
                </Badge>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Load Filter
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>Recent Filters</DropdownMenuItem>
                  <DropdownMenuItem>Saved Filters</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button size="sm">Save Filter</Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Input
            placeholder="Search endpoints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Group
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Group by Account</DropdownMenuItem>
              <DropdownMenuItem>Group by Site</DropdownMenuItem>
              <DropdownMenuItem>Group by Status</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{filteredEndpoints.length} Endpoints</span>
          <Select value={pageSize} onValueChange={setPageSize}>
            <SelectTrigger className="w-24 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="25">25 Results</SelectItem>
              <SelectItem value="50">50 Results</SelectItem>
              <SelectItem value="100">100 Results</SelectItem>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Customize Columns</DropdownMenuItem>
              <DropdownMenuItem>Reset to Default</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>Export as CSV</DropdownMenuItem>
              <DropdownMenuItem>Export as JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Endpoints Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="w-12">
                    <input type="checkbox" className="rounded border-border" />
                  </TableHead>
                  <TableHead className="min-w-[200px]">Endpoint Name</TableHead>
                  <TableHead className="min-w-[150px]">Account</TableHead>
                  <TableHead className="min-w-[200px]">Site</TableHead>
                  <TableHead className="min-w-[150px]">Last Logged in User</TableHead>
                  <TableHead className="min-w-[120px]">Group</TableHead>
                  <TableHead className="min-w-[120px]">Domain</TableHead>
                  <TableHead className="min-w-[140px]">Console Visible IP</TableHead>
                  <TableHead className="min-w-[120px]">Agent Version</TableHead>
                  <TableHead className="min-w-[120px]">Last Active</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEndpoints.map((endpoint) => {
                  const OSIcon = getOSIcon(endpoint.osType);
                  return (
                    <TableRow key={endpoint.id} className="border-border hover:bg-muted/30">
                      <TableCell>
                        <input type="checkbox" className="rounded border-border" />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <OSIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{endpoint.endpointName}</span>
                          <Badge className={`text-xs ${getStatusColor(endpoint.status)}`}>
                            {endpoint.status}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{endpoint.account}</TableCell>
                      <TableCell className="text-muted-foreground truncate">{endpoint.site}</TableCell>
                      <TableCell className="text-muted-foreground">{endpoint.lastLoggedInUser}</TableCell>
                      <TableCell className="text-muted-foreground">{endpoint.group}</TableCell>
                      <TableCell className="text-muted-foreground">{endpoint.domain}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">{endpoint.consoleVisibleIP}</TableCell>
                      <TableCell className="text-muted-foreground font-mono text-sm">{endpoint.agentVersion}</TableCell>
                      <TableCell className="text-muted-foreground">{endpoint.lastActive}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}