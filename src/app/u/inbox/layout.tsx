"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/redux/store'
import ChangeThemeColor from '@/lib/ChangeThemeColor'
import { 
  LucideMessageCirclePlus, 
  Inbox as InboxIcon,
  Star,
  Send,
  Archive,
  Trash2,
  Settings,
  Menu,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { fetchInboxItems } from '@/redux/reducers/InboxReducer'


export default function InboxLayout({ children }: { children: React.ReactNode }) {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState<boolean>(false);
    const [currentView, setCurrentView] = React.useState<string>('inbox');
    const isDarkMode = useSelector((state: RootState) => state.booleans.isDarkMode);
    const inboxMessages = useSelector((state: RootState) => state.inbox.items);
    const dispatch = useDispatch<AppDispatch>();

    React.useEffect(() => {
        if(isDarkMode){
            ChangeThemeColor("#171717");
        }
    }, [isDarkMode]);

    React.useEffect(() => {
        dispatch(fetchInboxItems());
    }, []);

    
    // Gmail-style sidebar items
    const sidebarItems = [
        { id: 'inbox', label: 'Inbox', icon: InboxIcon, count: inboxMessages.length },
        { id: 'starred', label: 'Starred', icon: Star, count: inboxMessages.filter(item => item.isStarred).length },
        { id: 'sent', label: 'Sent', icon: Send, count: 0 },
        { id: 'archive', label: 'Archive', icon: Archive, count: 0 },
        { id: 'trash', label: 'Trash', icon: Trash2, count: 0 },
    ];


    return (
        <div className="flex h-screen max-w-full bg-background">
            {/* Gmail-style Sidebar */}
            <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} transition-all duration-300 border-r bg-background flex flex-col max-sm:hidden`}>
                {/* Sidebar Header */}
                <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        >
                            <Menu size={16} />
                        </Button>
                        {!sidebarCollapsed && (
                            <h2 className="font-semibold text-lg">Mail</h2>
                        )}
                    </div>
                </div>

                {/* Compose Button */}
                <div className="p-4">
                    <Button className={`${sidebarCollapsed ? 'w-8 h-8 p-0' : 'w-full'} transition-all`}>
                        {sidebarCollapsed ? (
                            <LucideMessageCirclePlus size={16} />
                        ) : (
                            <>
                                <LucideMessageCirclePlus size={16} className="mr-2" />
                                Compose
                            </>
                        )}
                    </Button>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex-1 overflow-auto">
                    <nav className="space-y-1 px-2">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setCurrentView(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-secondary transition-colors ${
                                        currentView === item.id ? 'bg-secondary font-medium' : ''
                                    }`}
                                >
                                    <Icon size={16} />
                                    {!sidebarCollapsed && (
                                        <>
                                            <span className="flex-1">{item.label}</span>
                                            {item.count > 0 && (
                                                <Badge variant="secondary" className="ml-auto">
                                                    {item.count}
                                                </Badge>
                                            )}
                                        </>
                                    )}
                                </button>
                            );
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer */}
                <div className="p-4 border-t">
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className={`${sidebarCollapsed ? 'w-8 h-8 p-0' : 'w-full justify-start'}`}
                    >
                        <Settings size={16} />
                        {!sidebarCollapsed && <span className="ml-2">Settings</span>}
                    </Button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden">
                    {children}
            </div>
        </div>
    );
}
