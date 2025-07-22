'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Settings, 
  BarChart3, 
  FileText, 
  Users, 
  CreditCard,
  Bell,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Search,
  Database,
  Zap,
  Shield,
  Key,
  Upload,
  Download,
  Server,
  Brain,
  Eye
} from 'lucide-react'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Equipment', href: '/dashboard/equipment', icon: Settings },
  { name: 'Calibrations', href: '/dashboard/calibrations', icon: CheckCircle },
  { name: 'Due Soon', href: '/dashboard/calibrations/due', icon: Clock },
  { name: 'Overdue', href: '/dashboard/calibrations/overdue', icon: AlertTriangle },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Reports', href: '/dashboard/reports', icon: FileText },
  { name: 'Compliance', href: '/dashboard/reports/compliance', icon: CheckCircle },
  { name: 'Equipment Analytics', href: '/dashboard/reports/equipment', icon: BarChart3 },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Enterprise Analytics', href: '/dashboard/analytics/enterprise', icon: BarChart3 },
  { name: 'Search', href: '/dashboard/search', icon: Search },
  { name: 'Bulk Operations', href: '/dashboard/bulk-operations', icon: Upload },
  { name: 'Data Management', href: '/dashboard/data-management', icon: Database },
  { name: 'LIMS Integration', href: '/dashboard/integrations/lims', icon: Server },
  { name: 'API Management', href: '/dashboard/api', icon: Key },
  { name: 'Automation', href: '/dashboard/automation', icon: Zap },
  { name: 'AI Predictive Maintenance', href: '/dashboard/ai/predictive-maintenance', icon: Brain },
  { name: 'AI Anomaly Detection', href: '/dashboard/ai/anomaly-detection', icon: Eye },
  { name: 'AI NLP Reports', href: '/dashboard/ai/nlp-reports', icon: FileText },
  { name: 'Notifications', href: '/dashboard/notifications', icon: Bell },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'System Admin', href: '/admin/system', icon: Shield },
]

const billingSubNavigation = [
  { name: 'Overview', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Subscription', href: '/dashboard/billing/subscription', icon: CreditCard },
  { name: 'Payment Methods', href: '/dashboard/billing/payment-methods', icon: CreditCard },
  { name: 'Invoices', href: '/dashboard/billing/invoices', icon: FileText },
  { name: 'Usage', href: '/dashboard/billing/usage', icon: Activity },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen border-r border-gray-200">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">LabGuard Pro</span>
        </div>
      </div>
      
      <nav className="mt-6">
        <div className="px-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Navigation
          </div>
        </div>
        
        <div className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            
            return (
              <div key={item.name}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-3 mb-1
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
                
                {/* Show billing sub-navigation when on billing pages */}
                {item.name === 'Billing' && isActive && (
                  <div className="ml-8 mt-2 space-y-1">
                    {billingSubNavigation.map((subItem) => {
                      const isSubActive = pathname === subItem.href
                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`
                            flex items-center px-3 py-2 text-xs font-medium rounded
                            ${isSubActive 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'text-gray-600 hover:text-blue-600'
                            }
                          `}
                        >
                          <subItem.icon className="w-3 h-3 mr-2" />
                          {subItem.name}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Quick Actions
          </div>
          <div className="space-y-2">
            <Link
              href="/dashboard/calibrations/new"
              className="flex items-center text-sm text-gray-700 hover:text-blue-600"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Calibration
            </Link>
            <Link
              href="/dashboard/equipment/new"
              className="flex items-center text-sm text-gray-700 hover:text-blue-600"
            >
              <Settings className="w-4 h-4 mr-2" />
              Add Equipment
            </Link>
            <Link
              href="/dashboard/team/invite"
              className="flex items-center text-sm text-gray-700 hover:text-blue-600"
            >
              <Users className="w-4 h-4 mr-2" />
              Invite Team Member
            </Link>
            <Link
              href="/dashboard/notifications"
              className="flex items-center text-sm text-gray-700 hover:text-blue-600"
            >
              <Bell className="w-4 h-4 mr-2" />
              View Notifications
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
} 