import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Server, Database, Wifi, Activity, CheckCircle, MapPin, Clock } from 'lucide-react';

type SystemStatusProps = {
  onBack: () => void;
};

export function SystemStatus({ onBack }: SystemStatusProps) {
  const servers = [
    {
      id: '1',
      name: 'Agadir RMI Server',
      location: 'Agadir, Morocco',
      ip: '192.168.1.10:1099',
      status: 'online',
      uptime: '99.8%',
      requests: '15,234',
      responseTime: '45ms',
    },
    {
      id: '2',
      name: 'Marrakech RMI Server',
      location: 'Marrakech, Morocco',
      ip: '192.168.1.20:1099',
      status: 'online',
      uptime: '99.9%',
      requests: '18,567',
      responseTime: '38ms',
    },
    {
      id: '3',
      name: 'Casablanca RMI Server',
      location: 'Casablanca, Morocco',
      ip: '192.168.1.30:1099',
      status: 'online',
      uptime: '99.7%',
      requests: '21,890',
      responseTime: '42ms',
    },
  ];

  const services = [
    {
      name: 'ReservationService',
      status: 'operational',
      instances: 3,
      description: 'Handles all reservation operations via RMI',
    },
    {
      name: 'UserService',
      status: 'operational',
      instances: 3,
      description: 'Manages user authentication and profiles',
    },
    {
      name: 'RoomService',
      status: 'operational',
      instances: 3,
      description: 'Controls room availability and management',
    },
    {
      name: 'Database Connection Pool',
      status: 'operational',
      instances: 3,
      description: 'MySQL connections via JDBC',
    },
  ];

  const formatDate = () => {
    return new Date().toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="text-foreground hover:text-foreground/70">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-foreground mb-2">
          System Status
        </h1>
        <p className="text-muted-foreground">Real-time monitoring of distributed RMI infrastructure</p>
        <p className="text-xs text-muted-foreground mt-2">Last updated: {formatDate()}</p>
      </div>

      {/* Overall Status */}
      <Card className="mb-8 bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-sm bg-green-500/10 flex items-center justify-center border border-green-500/30">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-foreground text-xl mb-1">All Systems Operational</h2>
              <p className="text-muted-foreground">All distributed services are running normally across all branches</p>
            </div>
            <Badge className="bg-green-500/10 text-green-600 border-green-500/30 px-4 py-2">
              <span className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse"></span>
              Healthy
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* RMI Servers Status */}
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Server className="w-5 h-5" />
            RMI Server Status
          </CardTitle>
          <CardDescription>
            Distributed Remote Method Invocation servers across Morocco branches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {servers.map((server) => (
              <div
                key={server.id}
                className="p-5 rounded-sm bg-muted border border-border"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-foreground" />
                    <h3 className="text-foreground">{server.name}</h3>
                  </div>
                  <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-1.5 animate-pulse"></span>
                    Online
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Location</p>
                    <p className="text-foreground text-sm">{server.location}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">IP Address</p>
                    <p className="text-foreground text-sm font-mono">{server.ip}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Uptime</p>
                      <p className="text-green-600">{server.uptime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Response</p>
                      <p className="text-green-600">{server.responseTime}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Total Requests (24h)</p>
                    <p className="text-foreground">{server.requests}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services Status */}
      <Card className="mb-8 bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Distributed Services
          </CardTitle>
          <CardDescription>
            Remote services and components status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {services.map((service, index) => (
              <div
                key={index}
                className="p-4 rounded-sm bg-muted border border-border flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-sm bg-background flex items-center justify-center flex-shrink-0 border border-border">
                  <Server className="w-6 h-6 text-foreground" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-foreground">{service.name}</h4>
                    <Badge className="bg-muted text-foreground border-border text-xs">
                      {service.instances} instances
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </div>
                <Badge className="bg-green-500/10 text-green-600 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Database Status */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Status
          </CardTitle>
          <CardDescription>
            MySQL database connections and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-sm bg-muted border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Database className="w-4 h-4 text-foreground" />
                <h4 className="text-foreground">Connection Pool</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active:</span>
                  <span className="text-green-600">12 / 50</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Idle:</span>
                  <span className="text-foreground">38</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-sm bg-muted border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-foreground" />
                <h4 className="text-foreground">Performance</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Avg Query Time:</span>
                  <span className="text-foreground">12ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Queries/sec:</span>
                  <span className="text-foreground">245</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-sm bg-muted border border-border">
              <div className="flex items-center gap-2 mb-3">
                <Wifi className="w-4 h-4 text-foreground" />
                <h4 className="text-foreground">Tables</h4>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">users:</span>
                  <span className="text-foreground">4 rows</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">rooms:</span>
                  <span className="text-foreground">8 rows</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">reservations:</span>
                  <span className="text-foreground">3 rows</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
