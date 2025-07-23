'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  FlaskConical, 
  Calendar, 
  Users, 
  Settings,
  BarChart3,
  Zap,
  FileText,
  Shield,
  CreditCard,
  HelpCircle,
  LogOut
} from 'lucide-react'

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    description: 'Overview & Analytics'
  },
  { 
    name: 'Equipment', 
    href: '/dashboard/equipment', 
    icon: FlaskConical,
    description: 'Manage Lab Equipment'
  },
  { 
    name: 'Calibrations', 
    href: '/dashboard/calibrations', 
    icon: Calendar,
    description: 'Schedule & Track'
  },
  { 
    name: 'AI Insights', 
    href: '/dashboard/ai', 
    icon: Zap,
    description: 'Predictive Analytics'
  },
  { 
    name: 'Reports', 
    href: '/dashboard/reports', 
    icon: BarChart3,
    description: 'Compliance Reports'
  },
  { 
    name: 'Team', 
    href: '/dashboard/team', 
    icon: Users,
    description: 'User Management'
  },
]

const secondaryNavigation = [
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
  { name: 'Help', href: '/dashboard/help', icon: HelpCircle },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="glass-sidebar w-80 transform transition-transform duration-200 ease-in-out">
      {/* Logo Section */}
      <div className="flex h-20 items-center px-8 border-b border-white/10">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg group-hover:shadow-teal-500/25 transition-all duration-200">
              <FlaskConical className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 opacity-30 blur group-hover:opacity-50 transition-opacity duration-200" />
          </div>
          <div>
            <span className="text-xl font-bold text-white group-hover:text-gradient transition-all duration-200">
              LabGuard Pro
            </span>
            <p className="text-xs text-gray-400">AI-Powered Lab Management</p>
          </div>
        </Link>
      </div>
      
      {/* Main Navigation */}
      <nav className="mt-8 px-6">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.name} href={item.href}>
                <div className={cn(
                  "group relative flex items-center px-4 py-3 rounded-2xl transition-all duration-200 cursor-pointer",
                  "hover:bg-white/10 hover:scale-[1.02]",
                  isActive 
                    ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 border border-teal-500/30 shadow-lg" 
                    : "hover:bg-white/5"
                )}>
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-teal-400 to-cyan-500 rounded-r-full" />
                  )}
                  
                  {/* Icon container */}
                  <div className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg" 
                      : "bg-white/10 group-hover:bg-white/20"
                  )}>
                    <item.icon className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                    )} />
                  </div>
                  
                  {/* Text content */}
                  <div className="ml-4 flex-1">
                    <p className={cn(
                      "text-sm font-medium transition-colors duration-200",
                      isActive ? "text-white" : "text-gray-300 group-hover:text-white"
                    )}>
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-200">
                      {item.description}
                    </p>
                  </div>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                </div>
              </Link>
            )
          })}
        </div>
        
        {/* Secondary Navigation */}
        <div className="mt-8 pt-6 border-t border-white/10">
          <div className="space-y-1">
            {secondaryNavigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <div className="group flex items-center px-4 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
                  <item.icon className="mr-3 h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      
      {/* User Profile Section */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="glass-card p-4 group hover:scale-105 transition-transform duration-200">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                <span className="text-white font-semibold">SC</span>
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Dr. Sarah Chen</p>
              <p className="text-xs text-gray-400 truncate">Lab Director • Premium</p>
            </div>
            <Button 
              size="icon" 
              variant="ghost" 
              className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 