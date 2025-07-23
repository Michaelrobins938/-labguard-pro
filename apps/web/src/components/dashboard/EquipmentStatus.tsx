'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { FlaskConical, AlertTriangle, CheckCircle, Clock, MoreVertical, Plus } from 'lucide-react'

const equipment = [
  {
    id: 1,
    name: 'Centrifuge #1',
    type: 'Centrifuge',
    status: 'active',
    compliance: 'compliant',
    lastCalibration: '2024-01-15',
    nextCalibration: '2024-02-15',
    location: 'Lab A',
    efficiency: 95
  },
  {
    id: 2,
    name: 'Spectrophotometer #2',
    type: 'Analytical',
    status: 'maintenance',
    compliance: 'due_soon',
    lastCalibration: '2024-01-10',
    nextCalibration: '2024-01-25',
    location: 'Lab B',
    efficiency: 87
  },
  {
    id: 3,
    name: 'Incubator #3',
    type: 'Environmental',
    status: 'active',
    compliance: 'compliant',
    lastCalibration: '2024-01-20',
    nextCalibration: '2024-02-20',
    location: 'Lab A',
    efficiency: 98
  },
  {
    id: 4,
    name: 'Autoclave #1',
    type: 'Sterilization',
    status: 'inactive',
    compliance: 'overdue',
    lastCalibration: '2023-12-15',
    nextCalibration: '2024-01-15',
    location: 'Lab C',
    efficiency: 0
  }
]

export function EquipmentStatus() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      case 'maintenance': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30'
      case 'inactive': return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30'
    }
  }

  const getComplianceColor = (compliance: string) => {
    switch (compliance) {
      case 'compliant': return 'text-emerald-400'
      case 'due_soon': return 'text-yellow-400'
      case 'overdue': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500">
              <FlaskConical className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-white">Equipment Status</CardTitle>
              <CardDescription className="text-gray-400">
                Real-time equipment monitoring
              </CardDescription>
            </div>
          </div>
          <Button 
            size="sm" 
            className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 rounded-xl"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Equipment
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {equipment.map((item, index) => (
          <div 
            key={item.id}
            className="group p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all duration-200 border border-white/10 hover:border-white/20"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Equipment Icon */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-teal-400/20 to-cyan-500/20 border border-teal-500/30">
                  <FlaskConical className="h-5 w-5 text-teal-400" />
                </div>
                
                {/* Equipment Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="text-sm font-medium text-white truncate">
                      {item.name}
                    </h4>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getStatusColor(item.status)}`}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-400">
                    <span>{item.type}</span>
                    <span>•</span>
                    <span>{item.location}</span>
                    <span>•</span>
                    <span className={getComplianceColor(item.compliance)}>
                      {item.compliance === 'compliant' && <CheckCircle className="h-3 w-3 inline mr-1" />}
                      {item.compliance === 'due_soon' && <Clock className="h-3 w-3 inline mr-1" />}
                      {item.compliance === 'overdue' && <AlertTriangle className="h-3 w-3 inline mr-1" />}
                      {item.compliance.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Efficiency and Actions */}
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{item.efficiency}%</p>
                  <p className="text-xs text-gray-400">Efficiency</p>
                </div>
                
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Calibration Info */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-400">
                    Last: {new Date(item.lastCalibration).toLocaleDateString()}
                  </span>
                  <span className="text-gray-400">
                    Next: {new Date(item.nextCalibration).toLocaleDateString()}
                  </span>
                </div>
                
                {item.compliance === 'overdue' && (
                  <Button 
                    size="sm" 
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg"
                  >
                    Schedule Now
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
          <div className="text-center">
            <p className="text-2xl font-bold text-white">145</p>
            <p className="text-xs text-gray-400">Total Equipment</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-400">142</p>
            <p className="text-xs text-gray-400">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-400">2</p>
            <p className="text-xs text-gray-400">Maintenance</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-400">1</p>
            <p className="text-xs text-gray-400">Inactive</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 