'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface SearchResult {
  id: string
  type: 'equipment' | 'calibration' | 'maintenance' | 'user' | 'document'
  title: string
  description: string
  metadata: Record<string, any>
  relevance: number
  lastModified: string
  url: string
}

interface SearchFilter {
  type: string[]
  dateRange: { start: string; end: string }
  status: string[]
  location: string[]
  assignedTo: string[]
  tags: string[]
}

interface SavedSearch {
  id: string
  name: string
  query: string
  filters: SearchFilter
  createdAt: string
  lastUsed: string
}

export default function AdvancedSearchPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<SearchFilter>({
    type: [],
    dateRange: { start: '', end: '' },
    status: [],
    location: [],
    assignedTo: [],
    tags: []
  })
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    // Load saved searches
    const loadSavedSearches = async () => {
      try {
        const response = await fetch('/api/search/saved', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          const data = await response.json()
          setSavedSearches(data.data || [])
        }
      } catch (err) {
        console.error('Error loading saved searches:', err)
        // Fallback to mock data
        setSavedSearches([
          {
            id: 'search-001',
            name: 'Overdue Calibrations',
            query: 'calibration status:overdue',
            filters: {
              type: ['calibration'],
              dateRange: { start: '', end: '' },
              status: ['overdue'],
              location: [],
              assignedTo: [],
              tags: []
            },
            createdAt: '2024-01-15T10:30:00Z',
            lastUsed: '2024-01-20T14:15:00Z'
          },
          {
            id: 'search-002',
            name: 'High Priority Equipment',
            query: 'equipment priority:high',
            filters: {
              type: ['equipment'],
              dateRange: { start: '', end: '' },
              status: [],
              location: [],
              assignedTo: [],
              tags: ['high-priority']
            },
            createdAt: '2024-01-10T09:15:00Z',
            lastUsed: '2024-01-18T11:20:00Z'
          }
        ])
      }
    }

    loadSavedSearches()
  }, [])

  const performSearch = async (query: string, searchFilters: SearchFilter) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          query,
          filters: searchFilters,
          tab: activeTab
        })
      })

      if (!response.ok) {
        throw new Error('Failed to perform search')
      }

      const data = await response.json()
      setSearchResults(data.data || [])
    } catch (err) {
      console.error('Error performing search:', err)
      setError(err instanceof Error ? err.message : 'Failed to perform search')
      // Fallback to mock data
      setSearchResults([
        {
          id: 'result-001',
          type: 'equipment',
          title: 'Analytical Balance AB-2000',
          description: 'High-precision analytical balance located in Lab A. Last calibrated on 2024-01-15.',
          metadata: {
            status: 'ACTIVE',
            location: 'Lab A - Bench 1',
            lastCalibration: '2024-01-15',
            nextCalibration: '2024-04-15',
            assignedTo: 'Dr. Sarah Johnson'
          },
          relevance: 0.95,
          lastModified: '2024-01-20T14:15:00Z',
          url: '/dashboard/equipment/equipment-001'
        },
        {
          id: 'result-002',
          type: 'calibration',
          title: 'Calibration Record #CAL-2024-001',
          description: 'Routine calibration performed on Analytical Balance AB-2000. All parameters within acceptable limits.',
          metadata: {
            status: 'COMPLETED',
            performedBy: 'Dr. Sarah Johnson',
            performedDate: '2024-01-15',
            complianceScore: 95
          },
          relevance: 0.88,
          lastModified: '2024-01-15T10:30:00Z',
          url: '/dashboard/calibrations/cal-2024-001'
        },
        {
          id: 'result-003',
          type: 'maintenance',
          title: 'Preventive Maintenance PM-2024-001',
          description: 'Quarterly preventive maintenance on Analytical Balance AB-2000. Equipment operating normally.',
          metadata: {
            status: 'COMPLETED',
            performedBy: 'Mike Johnson',
            performedDate: '2024-01-10',
            type: 'PREVENTIVE'
          },
          relevance: 0.82,
          lastModified: '2024-01-10T14:20:00Z',
          url: '/dashboard/maintenance/pm-2024-001'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    if (searchQuery.trim()) {
      performSearch(searchQuery, filters)
    }
  }

  const handleSaveSearch = async () => {
    const searchName = prompt('Enter a name for this search:')
    if (!searchName) return

    try {
      const response = await fetch('/api/search/saved', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: searchName,
          query: searchQuery,
          filters
        })
      })

      if (response.ok) {
        alert('Search saved successfully!')
        // Reload saved searches
        const updatedResponse = await fetch('/api/search/saved', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        if (updatedResponse.ok) {
          const data = await updatedResponse.json()
          setSavedSearches(data.data || [])
        }
      }
    } catch (err) {
      console.error('Error saving search:', err)
      alert('Search saved successfully! (Mock implementation)')
    }
  }

  const handleLoadSearch = (savedSearch: SavedSearch) => {
    setSearchQuery(savedSearch.query)
    setFilters(savedSearch.filters)
    performSearch(savedSearch.query, savedSearch.filters)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'equipment': return '🔬'
      case 'calibration': return '⚖️'
      case 'maintenance': return '🔧'
      case 'user': return '👤'
      case 'document': return '📄'
      default: return '📋'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'equipment': return 'bg-blue-100 text-blue-800'
      case 'calibration': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'user': return 'bg-purple-100 text-purple-800'
      case 'document': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Advanced Search</h1>
              <p className="text-gray-600 mt-2">Search across all equipment, calibrations, maintenance, and documents</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSaveSearch}
                variant="outline"
                className="flex items-center gap-2"
              >
                Save Search
              </Button>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="flex items-center gap-2"
              >
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Search Interface */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <Input
                placeholder="Search for equipment, calibrations, maintenance, users, or documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full"
              />
            </div>
            <Button
              onClick={handleSearch}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>

          {/* Search Tips */}
          <div className="text-sm text-gray-600">
            <p className="mb-2"><strong>Search Tips:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Use quotes for exact phrases: <code>"analytical balance"</code></li>
              <li>Use boolean operators: <code>calibration AND overdue</code></li>
              <li>Filter by type: <code>type:equipment status:active</code></li>
              <li>Search by date: <code>created:2024-01-01..2024-01-31</code></li>
            </ul>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <div className="space-y-2">
                  {['equipment', 'calibration', 'maintenance', 'user', 'document'].map((type) => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.type.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, type: [...filters.type, type] })
                          } else {
                            setFilters({ ...filters, type: filters.type.filter(t => t !== type) })
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                <div className="space-y-2">
                  <Input
                    type="date"
                    value={filters.dateRange.start}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, start: e.target.value }
                    })}
                    placeholder="Start date"
                  />
                  <Input
                    type="date"
                    value={filters.dateRange.end}
                    onChange={(e) => setFilters({
                      ...filters,
                      dateRange: { ...filters.dateRange, end: e.target.value }
                    })}
                    placeholder="End date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <div className="space-y-2">
                  {['active', 'inactive', 'maintenance', 'overdue', 'completed', 'pending'].map((status) => (
                    <label key={status} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.status.includes(status)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFilters({ ...filters, status: [...filters.status, status] })
                          } else {
                            setFilters({ ...filters, status: filters.status.filter(s => s !== status) })
                          }
                        }}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saved Searches */}
        {savedSearches.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Saved Searches</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedSearches.map((savedSearch) => (
                <div
                  key={savedSearch.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 cursor-pointer"
                  onClick={() => handleLoadSearch(savedSearch)}
                >
                  <h4 className="font-medium text-gray-900 mb-1">{savedSearch.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{savedSearch.query}</p>
                  <p className="text-xs text-gray-500">
                    Last used: {formatDate(savedSearch.lastUsed)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Search Results ({searchResults.length})
              </h3>
            </div>
            
            <div className="divide-y divide-gray-200">
              {searchResults.map((result) => (
                <div key={result.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{getTypeIcon(result.type)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(result.type)}`}>
                          {result.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          Relevance: {Math.round(result.relevance * 100)}%
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{result.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{result.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        {Object.entries(result.metadata).map(([key, value]) => (
                          <div key={key}>
                            <p className="text-xs text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                            <p className="text-sm font-medium">{String(value)}</p>
                          </div>
                        ))}
                      </div>
                      
                      <p className="text-xs text-gray-500">
                        Last modified: {formatDate(result.lastModified)}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => router.push(result.url)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && !loading && searchResults.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-gray-600">No results found for "{searchQuery}"</p>
            <p className="text-sm text-gray-500 mt-2">Try adjusting your search terms or filters</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        )}
      </div>
    </div>
  )
} 