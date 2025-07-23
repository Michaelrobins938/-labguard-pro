'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Brain,
  Sparkles,
  Target,
  Zap
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const calibrationSchema = z.object({
  equipmentId: z.string().min(1, 'Equipment is required'),
  calibrationType: z.enum(['ROUTINE', 'PREVENTIVE', 'CORRECTIVE', 'EMERGENCY']),
  scheduledDate: z.date(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  estimatedDuration: z.number().min(15, 'Duration must be at least 15 minutes'),
  assignedTo: z.string().optional(),
  specialRequirements: z.string().optional(),
  aiOptimization: z.boolean().default(true)
})

type CalibrationFormData = z.infer<typeof calibrationSchema>

interface Equipment {
  id: string
  name: string
  model: string
  type: string
  lastCalibrated: string | null
  nextCalibration: string | null
  status: string
}

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function NewCalibrationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [aiInsights, setAiInsights] = useState<any>(null)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<CalibrationFormData>({
    resolver: zodResolver(calibrationSchema),
    defaultValues: {
      aiOptimization: true
    }
  })

  const watchedValues = watch()

  // Mock data - replace with API calls
  const equipment = [
    {
      id: 'eq-001',
      name: 'Centrifuge #1',
      model: 'Eppendorf 5810R',
      type: 'Centrifuge',
      lastCalibrated: '2024-01-15',
      nextCalibration: '2024-02-15',
      status: 'ACTIVE'
    },
    {
      id: 'eq-002',
      name: 'Spectrophotometer #1',
      model: 'Thermo Scientific NanoDrop 2000',
      type: 'Spectrophotometer',
      lastCalibrated: '2024-01-10',
      nextCalibration: '2024-02-10',
      status: 'ACTIVE'
    },
    {
      id: 'eq-003',
      name: 'Microscope #1',
      model: 'Olympus BX53',
      type: 'Microscope',
      lastCalibrated: '2024-01-20',
      nextCalibration: '2024-02-20',
      status: 'ACTIVE'
    }
  ]

  const users = [
    { id: 'user-001', name: 'Dr. Sarah Johnson', email: 'sarah@lab.com', role: 'Senior Technician' },
    { id: 'user-002', name: 'Mike Chen', email: 'mike@lab.com', role: 'Technician' },
    { id: 'user-003', name: 'Dr. Emily Rodriguez', email: 'emily@lab.com', role: 'Lab Manager' }
  ]

  const handleEquipmentChange = async (equipmentId: string) => {
    const selected = equipment.find(eq => eq.id === equipmentId)
    setSelectedEquipment(selected || null)

    if (selected && watchedValues.aiOptimization) {
      await generateAiInsights(selected)
    }
  }

  const generateAiInsights = async (equipment: Equipment) => {
    try {
      const response = await fetch('/api/biomni/calibration-insights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          equipmentId: equipment.id,
          equipmentType: equipment.type,
          lastCalibration: equipment.lastCalibrated,
          calibrationType: watchedValues.calibrationType
        })
      })

      if (response.ok) {
        const insights = await response.json()
        setAiInsights(insights)
      }
    } catch (error) {
      console.error('Failed to generate AI insights:', error)
    }
  }

  const onSubmit = async (data: CalibrationFormData) => {
    setLoading(true)
    
    try {
      const response = await fetch('/api/calibrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...data,
          aiInsights: aiInsights
        })
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/dashboard/calibrations/${result.id}/perform`)
      } else {
        throw new Error('Failed to create calibration')
      }
    } catch (error) {
      console.error('Calibration creation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Schedule New Calibration</h1>
          <p className="text-gray-400 mt-2">Create a new calibration workflow with AI optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-teal-500/20 text-teal-400 border-teal-500/30">
            <Brain className="w-3 h-3 mr-1" />
            AI Enhanced
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-400" />
                <span>Calibration Details</span>
              </CardTitle>
              <CardDescription>
                Configure the calibration parameters and schedule
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Equipment Selection */}
                <div className="space-y-2">
                  <Label htmlFor="equipmentId">Equipment *</Label>
                  <Select onValueChange={handleEquipmentChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select equipment to calibrate" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipment.map((eq) => (
                        <SelectItem key={eq.id} value={eq.id}>
                          <div className="flex items-center space-x-2">
                            <span>{eq.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {eq.type}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.equipmentId && (
                    <p className="text-red-500 text-sm">{errors.equipmentId.message}</p>
                  )}
                </div>

                {/* Calibration Type */}
                <div className="space-y-2">
                  <Label htmlFor="calibrationType">Calibration Type *</Label>
                  <Select onValueChange={(value) => setValue('calibrationType', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select calibration type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ROUTINE">Routine Calibration</SelectItem>
                      <SelectItem value="PREVENTIVE">Preventive Maintenance</SelectItem>
                      <SelectItem value="CORRECTIVE">Corrective Action</SelectItem>
                      <SelectItem value="EMERGENCY">Emergency Calibration</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.calibrationType && (
                    <p className="text-red-500 text-sm">{errors.calibrationType.message}</p>
                  )}
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Scheduled Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !watchedValues.scheduledDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {watchedValues.scheduledDate ? (
                            format(watchedValues.scheduledDate, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={watchedValues.scheduledDate}
                          onSelect={(date) => setValue('scheduledDate', date || new Date())}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.scheduledDate && (
                      <p className="text-red-500 text-sm">{errors.scheduledDate.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="estimatedDuration">Estimated Duration (minutes) *</Label>
                    <Input
                      type="number"
                      min="15"
                      step="15"
                      {...register('estimatedDuration', { valueAsNumber: true })}
                      placeholder="e.g., 60"
                    />
                    {errors.estimatedDuration && (
                      <p className="text-red-500 text-sm">{errors.estimatedDuration.message}</p>
                    )}
                  </div>
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority *</Label>
                  <Select onValueChange={(value) => setValue('priority', value as any)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOW">Low</SelectItem>
                      <SelectItem value="MEDIUM">Medium</SelectItem>
                      <SelectItem value="HIGH">High</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.priority && (
                    <p className="text-red-500 text-sm">{errors.priority.message}</p>
                  )}
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    {...register('description')}
                    placeholder="Describe the calibration requirements, special considerations, or issues to address..."
                    rows={3}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm">{errors.description.message}</p>
                  )}
                </div>

                {/* Assigned To */}
                <div className="space-y-2">
                  <Label htmlFor="assignedTo">Assigned To (Optional)</Label>
                  <Select onValueChange={(value) => setValue('assignedTo', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select team member" />
                    </SelectTrigger>
                    <SelectContent>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          <div className="flex items-center space-x-2">
                            <span>{user.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {user.role}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Special Requirements */}
                <div className="space-y-2">
                  <Label htmlFor="specialRequirements">Special Requirements (Optional)</Label>
                  <Textarea
                    {...register('specialRequirements')}
                    placeholder="Any special equipment, conditions, or procedures required..."
                    rows={2}
                  />
                </div>

                {/* AI Optimization Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="aiOptimization"
                    {...register('aiOptimization')}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="aiOptimization" className="flex items-center space-x-2">
                    <Brain className="w-4 h-4 text-blue-400" />
                    <span>Enable AI optimization and insights</span>
                  </Label>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  disabled={!isValid || loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Calibration...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Schedule Calibration
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* AI Insights Sidebar */}
        <div className="space-y-6">
          {/* Equipment Info */}
          {selectedEquipment && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="w-5 h-5 text-green-400" />
                  <span>Equipment Info</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-400">Equipment</p>
                  <p className="font-medium">{selectedEquipment.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Model</p>
                  <p className="font-medium">{selectedEquipment.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Last Calibrated</p>
                  <p className="font-medium">
                    {selectedEquipment.lastCalibrated ? 
                      format(new Date(selectedEquipment.lastCalibrated), 'MMM dd, yyyy') : 
                      'Never'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Next Due</p>
                  <p className="font-medium">
                    {selectedEquipment.nextCalibration ? 
                      format(new Date(selectedEquipment.nextCalibration), 'MMM dd, yyyy') : 
                      'Not scheduled'
                    }
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Status</p>
                  <Badge 
                    variant="outline" 
                    className={selectedEquipment.status === 'ACTIVE' ? 
                      'border-green-500 text-green-400' : 
                      'border-red-500 text-red-400'
                    }
                  >
                    {selectedEquipment.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Insights */}
          {aiInsights && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <span>AI Insights</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {aiInsights.recommendations?.map((rec: any, index: number) => (
                  <div key={index} className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                    <h4 className="font-medium text-purple-300">{rec.title}</h4>
                    <p className="text-sm text-purple-200 mt-1">{rec.description}</p>
                  </div>
                ))}
                
                {aiInsights.riskFactors?.map((risk: any, index: number) => (
                  <div key={index} className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                    <h4 className="font-medium text-red-300">{risk.title}</h4>
                    <p className="text-sm text-red-200 mt-1">{risk.description}</p>
                  </div>
                ))}

                {aiInsights.optimizationTips?.map((tip: any, index: number) => (
                  <div key={index} className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <h4 className="font-medium text-blue-300">{tip.title}</h4>
                    <p className="text-sm text-blue-200 mt-1">{tip.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span>Quick Actions</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Clock className="w-4 h-4 mr-2" />
                View Calibration History
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Check Equipment Status
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="w-4 h-4 mr-2" />
                View Compliance Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 