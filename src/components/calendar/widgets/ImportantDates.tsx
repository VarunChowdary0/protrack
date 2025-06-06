import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useState, useMemo } from 'react'
import { Search, Clock, CalendarClockIcon } from 'lucide-react'
import Image from 'next/image';

interface ImportantDate {
    data : {
        id: number;
        title: string;
        description: string;
        date: Date;
    }[]
}

const ImportantDates:React.FC<ImportantDate> = ({data}) => {
    const [searchTerm, setSearchTerm] = useState('');

    const formatWeekday = (date: Date) =>
        new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);

    const formatDay = (date: Date) =>
        new Intl.DateTimeFormat('en-US', { day: '2-digit' }).format(date);

    const formatMonth = (date: Date) =>
        new Intl.DateTimeFormat('en-US', { month: 'short' }).format(date);
    const formatYear = (date:Date) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
        }).format(date);
    };

    const formatTime = (date:Date) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };
    
    const formatMonthYear = (date: Date) =>
    new Intl.DateTimeFormat('en-US', {
        month: 'long',
        year: 'numeric',
    }).format(date);


    const groupByMonthAndWeek = (events: typeof data) => {
        const monthGroups: Record<string, Record<string, typeof data>> = {};

        events.forEach(event => {
            const eventDate = event.date;
            const monthKey = formatMonthYear(eventDate);

            const startOfWeek = new Date(eventDate);
            startOfWeek.setDate(eventDate.getDate() - eventDate.getDay());

            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            const weekLabel = `${formatDay(startOfWeek)}–${formatDay(endOfWeek)} ${formatMonth(startOfWeek)}`;

            if (!monthGroups[monthKey]) monthGroups[monthKey] = {};
            if (!monthGroups[monthKey][weekLabel]) monthGroups[monthKey][weekLabel] = [];

            monthGroups[monthKey][weekLabel].push(event);
        });

        // Sort months and their weeks
        return Object.entries(monthGroups).sort(([a], [b]) =>
            new Date(a).getTime() - new Date(b).getTime()
        ).map(([month, weeks]) => ({
            month,
            weeks: Object.entries(weeks).sort((a, b) =>
                new Date(a[1][0].date).getTime() - new Date(b[1][0].date).getTime()
            )
        }));
    };

    const filteredGroupedData = useMemo(() => {
        const filtered = data
            .filter(event =>
                event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => a.date.getTime() - b.date.getTime());

        return groupByMonthAndWeek(filtered);
    }, [searchTerm]);

    const getMonthImage = (month: string) => {
        const monthName = month.split(' ')[0].toLowerCase();
        return (
            <div className="flex items-center gap-2 px-8 pt-5">
                <Image
                    src={`/months/${monthName}.png`} 
                    alt={month}
                    width={100}
                    height={100} 
                    className=" rounded-full object-fill "
                />
                <h2 className="text-lg font-bold">{month}</h2>
            </div>
        );
    }

    return (
        <Card className="w-full max-w-2xl !gap-0 !pb-10 !px-0 !py-0 mx-auto">
            <CardHeader className="pb-4 p-8">
                <h2 className="text-xl font-medium">Important Dates</h2>
                <div className="relative mt-3">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                    />
                </div>
            </CardHeader>

            <CardContent className=' !px-0 !pb-10 '>
                {filteredGroupedData.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                        <p>No events found</p>
                    </div>
                ) : (
                    filteredGroupedData.map(({ month, weeks }) => (
                        <div key={month} className="space-y-6">
                            <div>
                                {getMonthImage(month)}
                            </div>
                            <div className=' flex flex-col space-y-4 -mt-3 px-8 max-sm:px-4'>
                                {weeks.map(([weekRange, events]) => (
                                    <div key={weekRange} className="space-y-3">
                                        <h3 className="font-semibold text-xs text-muted-foreground pl-10">{weekRange}</h3>
                                        <div className='flex flex-col gap-4'>
                                            {events.map(event => (
                                                <div className=' flex justify-between items-center gap-2' key={event.id}>
                                                    <div  className="flex items-center gap-5 max-w-[75%]">
                                                        <div className="flex-col flex">
                                                            <span className="text-xs">{formatWeekday(event.date)}</span>
                                                            <span className="text-lg font-semibold">{formatDay(event.date)}</span>
                                                        </div>
                                                        <div className="w-full gap-0 flex flex-col">
                                                            <span className="bg-teal-600 text-sm font-semibold rounded-md w-fit px-2 text-white">
                                                                {event.title}
                                                            </span>
                                                            <span className="text-xs mt-1">{event.description}</span>
                                                        </div>
                                                    </div>
                                                    <div className=' flex flex-col items-end gap-2 text-muted-foreground '>
                                                        <div className="flex items-center gap-2 text-xs ">
                                                            <CalendarClockIcon className="w-4 h-4" />
                                                            <span>{formatMonth(event.date)} {formatYear(event.date)}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-xs ">
                                                            <Clock className="w-4 h-4" />
                                                            <span>{formatTime(event.date)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </CardContent>
        </Card>
    );
};

export default ImportantDates;
