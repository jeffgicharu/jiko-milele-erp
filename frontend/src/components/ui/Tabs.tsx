'use client'

import React from 'react'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (tab: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

interface TabsProps {
  defaultTab?: string
  value?: string
  onChange?: (tab: string) => void
  children: React.ReactNode
  className?: string
}

export function Tabs({
  defaultTab,
  value,
  onChange,
  children,
  className = ''
}: TabsProps) {
  const [internalTab, setInternalTab] = React.useState(defaultTab || '')
  
  const activeTab = value !== undefined ? value : internalTab
  const setActiveTab = (tab: string) => {
    if (value === undefined) {
      setInternalTab(tab)
    }
    onChange?.(tab)
  }
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>
        {children}
      </div>
    </TabsContext.Provider>
  )
}

interface TabsListProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'pills' | 'underline'
}

export function TabsList({
  children,
  className = '',
  variant = 'default'
}: TabsListProps) {
  const baseClasses = 'flex'
  
  const variantClasses = {
    default: 'border-b border-gray-200 space-x-8',
    pills: 'bg-gray-100 p-1 rounded-lg space-x-1',
    underline: 'border-b border-gray-200 space-x-0'
  }
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, { variant, index })
        }
        return child
      })}
    </div>
  )
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'pills' | 'underline'
  index?: number
  disabled?: boolean
}

export function TabsTrigger({
  value,
  children,
  className = '',
  variant = 'default',
  disabled = false,
  ...props
}: TabsTriggerProps) {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs')
  }
  
  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value
  
  const baseClasses = 'px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variantClasses = {
    default: isActive
      ? 'border-b-2 border-orange-500 text-orange-600'
      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700',
    pills: isActive
      ? 'bg-white text-orange-600 shadow-sm rounded-md'
      : 'text-gray-500 hover:text-gray-700 rounded-md hover:bg-white hover:bg-opacity-50',
    underline: isActive
      ? 'border-b-2 border-orange-500 text-orange-600 pb-2'
      : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 pb-2'
  }
  
  return (
    <button
      type="button"
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      aria-selected={isActive}
      role="tab"
      {...props}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabsContent({
  value,
  children,
  className = ''
}: TabsContentProps) {
  const context = React.useContext(TabsContext)
  if (!context) {
    throw new Error('TabsContent must be used within Tabs')
  }
  
  const { activeTab } = context
  
  if (activeTab !== value) {
    return null
  }
  
  return (
    <div className={`mt-4 ${className}`} role="tabpanel">
      {children}
    </div>
  )
}