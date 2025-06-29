"use client"

import * as React from "react"
import {
  Settings2,
  FileText,
  Bird,
  GalleryVerticalEnd,
  Bell,
  MoreHorizontal,
  Calendar,
  ActivityIcon,
  GoalIcon
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover"
import { useParams, useRouter } from "next/navigation"

export function OwnerCard() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { project_id } = useParams();
  const router = useRouter();

  const data = [
    [
      {
        label: "Project Settings",
        icon: Settings2,
        route: `/${project_id}/settings`,
      },
      {
        label: "Team Members",
        icon: FileText,
        route: `/${project_id}/manage-participants`,
      },
    ],
    [
    //   {
    //     label: "Manage Phases",
    //     icon: ChartLineIcon,
    //     route: `/${project_id}/timeline`,
    //   },
      {
        label: "Add Phase",
        icon: GoalIcon,
        route: `/${project_id}/add-phase`,
      },
      {
        label: "Add Upcoming Activity",
        icon: ActivityIcon,
        route: `/${project_id}/add-activity`,
      },
      {
        label: "Manage Activities",
        icon: Bird,
        route: `/${project_id}/manage-activities`,
      },
      {
        label: "Project Calendar",
        icon: Calendar,
        route: `/${project_id}/calendar`,
      },
    ],
    [
      {
        label: "Activity Log",
        icon: GalleryVerticalEnd,
        route: `/${project_id}/activity`,
      },
      {
        label: "Notifications",
        icon: Bell,
        route: `/${project_id}/notifications`,
      },
    ]
  ];

  return (
    <div
      style={{ zIndex: 6000 }}
      className="fixed top-3 right-3 flex items-center gap-2 text-sm"
    >
      <div className="text-muted-foreground hidden font-medium md:inline-block">
        Manage
      </div>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-accent"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 p-0 rounded-lg overflow-hidden"
          align="end"
        >
          <div className="flex flex-col divide-y">
            {data.map((group, groupIndex) => (
              <div key={groupIndex} className="py-1">
                {group.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => router.push(item.route)}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-accent rounded-sm w-full text-left"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
