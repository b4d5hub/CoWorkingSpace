import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ArrowLeft, Monitor, Server, Database, ArrowRight, Layers, Code2 } from 'lucide-react';

type SystemArchitectureProps = {
  onBack: () => void;
};

export function SystemArchitecture({ onBack }: SystemArchitectureProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/5">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      <div className="mb-8">
        <h1 className="text-white mb-2 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
          System Architecture
        </h1>
        <p className="text-gray-400">Distributed three-tier architecture using Java RMI</p>
      </div>

      {/* Architecture Banner */}
      <Card className="mb-8 backdrop-blur-xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-500/20 shadow-lg shadow-cyan-500/10">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-3 py-4">
            <Layers className="w-6 h-6 text-cyan-400" />
            <h2 className="text-white text-xl">Distributed Three-Tier Architecture using Java RMI</h2>
          </div>
        </CardContent>
      </Card>

      {/* Architecture Diagram */}
      <Card className="mb-8 backdrop-blur-xl bg-card/60 border-border shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-white">Architecture Overview</CardTitle>
          <CardDescription className="text-gray-400">
            Visual representation of the distributed system deployment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-stretch gap-6 justify-between">
            {/* Client Layer */}
            <div className="flex-1">
              <div className="p-6 rounded-lg bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/30 flex items-center justify-center">
                    <Monitor className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-white">Client Browser</h3>
                    <p className="text-xs text-gray-400">Presentation Layer</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 w-full justify-start">
                    JSP/Servlet Interface
                  </Badge>
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 w-full justify-start">
                    HTML Forms
                  </Badge>
                  <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/30 w-full justify-start">
                    User Actions
                  </Badge>
                </div>
                <div className="mt-6 pt-4 border-t border-cyan-500/20">
                  <p className="text-xs text-gray-400 mb-2">Functions:</p>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• Login/Registration</li>
                    <li>• Browse Rooms</li>
                    <li>• Make Reservations</li>
                    <li>• View Bookings</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <ArrowRight className="w-8 h-8 text-cyan-400 mb-2" />
                <p className="text-xs text-cyan-400 rotate-0 whitespace-nowrap">HTTP Request</p>
                <ArrowRight className="w-8 h-8 text-purple-400 mt-8 mb-2" />
                <p className="text-xs text-purple-400 rotate-0 whitespace-nowrap">RMI Invocation</p>
              </div>
            </div>

            {/* RMI Server Layer */}
            <div className="flex-1">
              <div className="p-6 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-purple-500/30 flex items-center justify-center">
                    <Server className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-white">RMI Server</h3>
                    <p className="text-xs text-gray-400">Business Logic Layer</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-xs text-gray-400 mb-2">Remote Interfaces:</p>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 w-full justify-start">
                    ReservationService
                  </Badge>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 w-full justify-start">
                    UserService
                  </Badge>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 w-full justify-start">
                    RoomService
                  </Badge>
                </div>
                <div className="space-y-2 pt-2 border-t border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-2">DAOs:</p>
                  <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/30 w-full justify-start text-xs">
                    RoomDAO
                  </Badge>
                  <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/30 w-full justify-start text-xs">
                    UserDAO
                  </Badge>
                  <Badge className="bg-pink-500/10 text-pink-400 border-pink-500/30 w-full justify-start text-xs">
                    ReservationDAO
                  </Badge>
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="flex flex-col items-center justify-center">
              <div className="flex flex-col items-center">
                <ArrowRight className="w-8 h-8 text-green-400 mb-2" />
                <p className="text-xs text-green-400 rotate-0 whitespace-nowrap">JDBC Connection</p>
              </div>
            </div>

            {/* Database Layer */}
            <div className="flex-1">
              <div className="p-6 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/30 flex items-center justify-center">
                    <Database className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-white">MySQL Database</h3>
                    <p className="text-xs text-gray-400">Data Layer</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-xs text-gray-400 mb-2">Tables:</p>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30 w-full justify-start">
                    users
                  </Badge>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30 w-full justify-start">
                    rooms
                  </Badge>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30 w-full justify-start">
                    reservations
                  </Badge>
                </div>
                <div className="mt-6 pt-4 border-t border-green-500/20">
                  <p className="text-xs text-gray-400 mb-2">Data Storage:</p>
                  <ul className="text-xs text-gray-300 space-y-1">
                    <li>• User accounts</li>
                    <li>• Room inventory</li>
                    <li>• Booking records</li>
                    <li>• System logs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distributed Deployment */}
      <Card className="mb-8 backdrop-blur-xl bg-card/60 border-border shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-white">Distributed Deployment</CardTitle>
          <CardDescription className="text-gray-400">
            RMI servers deployed across multiple co-working branches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-cyan-500/30 flex items-center justify-center">
                  <Server className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-white">Agadir Branch</h3>
                  <p className="text-xs text-gray-400">RMI Server 1</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">IP:</span>
                  <span className="text-cyan-400 font-mono">192.168.1.10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Port:</span>
                  <span className="text-white">1099</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    Online
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/30 flex items-center justify-center">
                  <Server className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-white">Marrakech Branch</h3>
                  <p className="text-xs text-gray-400">RMI Server 2</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">IP:</span>
                  <span className="text-purple-400 font-mono">192.168.1.20</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Port:</span>
                  <span className="text-white">1099</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    Online
                  </Badge>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-green-500/30 flex items-center justify-center">
                  <Server className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <h3 className="text-white">Casablanca Branch</h3>
                  <p className="text-xs text-gray-400">RMI Server 3</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">IP:</span>
                  <span className="text-green-400 font-mono">192.168.1.30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Port:</span>
                  <span className="text-white">1099</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Status:</span>
                  <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                    <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                    Online
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Technology Stack */}
      <Card className="backdrop-blur-xl bg-card/60 border-border shadow-lg shadow-cyan-500/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code2 className="w-5 h-5 text-cyan-400" />
            Technology Stack
          </CardTitle>
          <CardDescription className="text-gray-400">
            Components and technologies used in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-white mb-2">Frontend</h4>
              <div className="space-y-1">
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  JSP (JavaServer Pages)
                </Badge>
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  Servlets
                </Badge>
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  HTML/CSS
                </Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-white mb-2">Backend</h4>
              <div className="space-y-1">
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  Java RMI
                </Badge>
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  Remote Interfaces
                </Badge>
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  Business Logic
                </Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-white mb-2">Database</h4>
              <div className="space-y-1">
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  MySQL
                </Badge>
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  JDBC Driver
                </Badge>
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  Connection Pool
                </Badge>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-white mb-2">Architecture</h4>
              <div className="space-y-1">
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  3-Tier Pattern
                </Badge>
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  Distributed System
                </Badge>
                <Badge variant="secondary" className="w-full justify-start bg-white/5 border-white/10 text-gray-300">
                  DAO Pattern
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
