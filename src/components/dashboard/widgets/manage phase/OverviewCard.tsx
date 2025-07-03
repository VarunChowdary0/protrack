// File: widgets/manage phase/OverviewCard.tsx

import { Timeline } from "@/types/timelineType";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TabsContent } from "@/components/ui/tabs";
import { Calendar, FileText, CheckCircle2 } from "lucide-react";

interface OverviewCardProps {
    phaseData: Timeline & {
        requiredDocuments?: any[];
        submittedDocs?: any[];
    };
}

export const OverviewCard: React.FC<OverviewCardProps> = ({ phaseData }) => {
    const totalDocs = phaseData.requiredDocuments?.length || 0;
    const verifiedDocs = phaseData.submittedDocs?.length || 0;
    const progress = (verifiedDocs / Math.max(totalDocs, 1)) * 100;

    return (
        <TabsContent value="overview" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Phase Details - Left */}
                <Card className="border-0 shadow-md bg-gradient-to-br from-background to-background/50">
                    <CardHeader className="pb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <Calendar className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-xl font-semibold">Phase Details</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0 pb-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Section - Title and Description */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Phase Title
                                    </p>
                                    <p className="text-lg font-semibold leading-relaxed">{phaseData.title}</p>
                                </div>

                                <div className="space-y-3">
                                    <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                        Description
                                    </p>
                                    <p className="text-base leading-relaxed text-foreground/90">
                                        {phaseData.description || "No description available"}
                                    </p>
                                </div>
                            </div>

                            {/* Right Section - Date Range */}
                            <div className="lg:col-span-1">
                                <div className="space-y-6 lg:pl-6 lg:border-l border-border/30">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Start Date
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                                            {new Date(phaseData.startDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                End Date
                                            </p>
                                        </div>
                                        <p className="text-sm font-semibold text-red-700 dark:text-red-400">
                                            {new Date(phaseData.endDate).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Phase Progress - Right */}
                <Card className="w-full md:w-1/2 relative overflow-hidden border-0 shadow-md bg-gradient-to-br from-background to-background/50">
                    <CardHeader className="pb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-primary/10">
                                <CheckCircle2 className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle className="text-xl font-semibold">Phase Progress</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-2xl font-bold">{Math.round(progress)}%</span>
                                <span className="text-sm font-medium text-muted-foreground">
                                    {verifiedDocs}/{totalDocs} completed
                                </span>
                            </div>
                            <Progress value={progress} className="h-3 bg-secondary/30" />
                            <div className="flex items-center gap-2 pt-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                    {verifiedDocs} of {totalDocs} documents submitted
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </TabsContent>
    );
};
