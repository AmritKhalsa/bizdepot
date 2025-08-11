'use client';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React, { useEffect, useState, useMemo } from 'react';
import { ArrowDown, ArrowUp, Building, Calendar, CircleChevronRight, Clock, DollarSign, ExternalLink, Globe, Mail, MapPin, Phone, Target, TrendingUp, User } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LayoutGrid, List, PlusCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Listing, ListingsType } from "./types";
import Link from "next/link";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

// --- HELPER FUNCTIONS (moved outside component for stability) ---

const getStatusColor = (status: string) => {
    switch (status) {
        case 'On Track': return 'bg-green-500 border-green-700';
        case 'Off Track': return 'bg-yellow-500 border-yellow-700';
        case 'Completed': return 'bg-blue-500 border-blue-700';
        case 'At Risk': return 'bg-red-500 border-red-700';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
};

const formatPrice = (amount: number) => {
    if (amount >= 1000000) {
        return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
        return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(2)}`;
};
// Phone number formatting function (basic example)
function formatPhoneNumber(phoneNumber: number) {
    if (!phoneNumber) return "";
  
    // Remove all non-digit characters
    const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  
    // Check if the cleaned number is of the correct length
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
  
    return phoneNumber; // Return original if formatting fails
}
const today = new Date().getTime();
const msInDay = 1000 * 60 * 60 * 24;

// --- MEMOIZED CARD COMPONENTS ---

const BigPropertyCard = React.memo(function BigPropertyCard({ listing }: { listing: Listing }) {
    const daysListed = useMemo(() => Math.floor((today - new Date(listing.Date_Listed).getTime()) / msInDay), [listing.Date_Listed]);
    const daysInStage = useMemo(() => Math.floor((today - new Date(listing.Day_Stage_Changed).getTime()) / msInDay), [listing.Day_Stage_Changed]);
    const askingPriceFormatted = useMemo(() => formatPrice(listing.Asking_Price), [listing.Asking_Price]);
    const totalCommissionFormatted = useMemo(() => formatPrice(listing.Asking_Price * listing.Commission_Percentage), [listing.Asking_Price, listing.Commission_Percentage]);
    const agentSplitFormatted = useMemo(() => formatPrice(listing.Asking_Price * listing.Commission_Percentage * listing.Agents_Split), [listing.Asking_Price, listing.Commission_Percentage, listing.Agents_Split]);

    return (
        <div className="p-2 bg-gray-50">
            <div className="max-w-md mx-auto">
                <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md overflow-hidden bg-white">
                    <div className="relative h-48 overflow-hidden">
                        <img
                            // src={listing.imageUrl || "/placeholder.svg"}
                            // alt={listing.businessName}
                            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div
                            className={`absolute rounded-full top-4 right-4 shadow-sm ${getStatusColor(listing.Status)}`}
                        >
                        </div>
                        <div className="absolute bottom-4 left-4 right-4">
                            <h3 className="font-bold text-white text-lg leading-tight drop-shadow-lg">
                                {listing.Buisness_Name}
                            </h3>
                        </div>
                    </div>
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600 leading-tight">{listing.Location}</span>
                        </div>
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <DollarSign className="h-4 w-4 text-green-700" />
                                    </div>
                                    <div>
                                        <p className="text-xs pt-10 text-gray-600 font-medium">Asking Price</p>
                                        <p className="font-bold text-green-700 text-lg">
                                            {askingPriceFormatted}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-1 justify-end mb-1">
                                        <TrendingUp className="h-3 w-3 text-blue-600" />
                                        <span className="text-sm font-semibold text-blue-600">
                                            {(listing.Commission_Percentage * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600">Commission</p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-600">
                                <span>Total: <span className="font-semibold text-gray-800">{totalCommissionFormatted}</span></span>
                                <span>Your Split: <span className="font-semibold text-gray-800">{agentSplitFormatted}</span></span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-gray-500" />
                                    <div>
                                        <p className="text-xs text-gray-600">Listed</p>
                                        <p className="font-semibold text-sm">{daysListed} days ago</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-orange-500" />
                                    <div>
                                        <p className="text-xs text-gray-600">Inquiries</p>
                                        <p className="font-semibold text-sm text-orange-600">{listing.Inquiry_Calls_Taken} calls</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-purple-500" />
                                <span className="text-sm font-medium text-gray-800">Current Stage</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-purple-600 font-semibold">{listing.Current_Stage}</span>
                                <div className="flex items-center gap-1 text-xs text-gray-600">
                                    <Clock className="h-3 w-3" />
                                    <span>{daysInStage}d in stage</span>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-700 leading-relaxed line-clamp-3">
                                {listing.Description}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div>
                                    <p className="text-xs text-gray-600">Owner</p>
                                    <p className="text-sm font-medium">{listing.Owner_Name}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-gray-600">Broker</p>
                                <p className="text-sm font-medium">{listing.Broker_Assigned.split(',')[0]}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
});

const CompactPropertyCard = React.memo(function CompactPropertyCard({ listing }: { listing: Listing }) {
    const dateListedFormatted = useMemo(() => new Date(listing.Date_Listed).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' }), [listing.Date_Listed]);
    const daysInStage = useMemo(() => Math.floor((today - new Date(listing.Day_Stage_Changed).getTime()) / msInDay), [listing.Day_Stage_Changed]);
    const askingPriceFormatted = useMemo(() => formatPrice(listing.Asking_Price), [listing.Asking_Price]);
    const agentSplitFormatted = useMemo(() => formatPrice(listing.Asking_Price * listing.Commission_Percentage * listing.Agents_Split), [listing.Asking_Price, listing.Commission_Percentage, listing.Agents_Split]);
    const lastChangedDateFormatted = useMemo(() => new Date(listing.Day_Stage_Changed).toLocaleDateString('en-US', { year: '2-digit', month: '2-digit', day: '2-digit' }), [listing.Day_Stage_Changed]);

    return (
        <Card className="group relative py-3 h-40 mx-3 w-full border-l-4 border-l-transparent transition-all duration-200 ease-in-out hover:border-l-blue-500 hover:shadow-lg hover:scale-[1.0001]">
            <CardContent className="px-3 pb-3 h-full flex flex-col justify-between">
                <div className="flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm leading-tight truncate text-gray-800 flex-1 group-hover:text-blue-600 transition-colors">
                            {listing.Buisness_Name}
                        </h3>
                        <div className={`rounded-full w-4 h-4 shadow-sm ${getStatusColor(listing.Status)}`}></div>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 shrink-0 text-gray-400" />
                            <span className="truncate">{listing.Location}</span>
                        </div>
                        <div className="text-xs text-gray-500 whitespace-nowrap">
                            Listed: {dateListedFormatted}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex items-end justify-between gap-2">
                        <div className="flex flex-col ">
                            <div className="flex items-center gap-1">
                                <span className="text-sm pt-4 font-bold text-emerald-600">
                                    {askingPriceFormatted}
                                </span>
                            </div>
                            <Popover>
                                <PopoverTrigger asChild onClick={(e) => e.stopPropagation()}>
                                    <button className="flex text-xs text-left font-medium text-gray-800 cursor-pointer hover:underline focus:outline-none rounded py-0.5 transition-colors" type="button">
                                        {agentSplitFormatted}
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-56 p-3 text-xs z-50" align="start" sideOffset={5}>
                                    <div className="space-y-2">
                                        <p className="font-semibold text-gray-900">Your Commission Calculation:</p>
                                        <div className="space-y-1 text-gray-600">
                                            <p><span className="font-medium">{askingPriceFormatted}</span> (Asking Price)</p>
                                            <p>× <span className="font-medium">{(listing.Commission_Percentage * 100).toFixed(1)}%</span> (Commission Rate)</p>
                                            <p>× <span className="font-medium">{(listing.Agents_Split * 100).toFixed(0)}%</span> (Your Split)</p>
                                        </div>
                                        <div className="border-t border-gray-200 pt-2 mt-2">
                                            <p className="font-bold text-blue-600 text-sm">= {agentSplitFormatted}</p>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full border border-blue-100 cursor-help hover:bg-blue-100 transition-colors">
                                    {(listing.Commission_Percentage * 100).toFixed(1)}%
                                </div>
                            </TooltipTrigger>
                            <TooltipContent side="top" sideOffset={5}>
                                <p className="text-xs">Total commission: {formatPrice(listing.Commission_Percentage * listing.Asking_Price)}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                    <hr />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center">
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <div className="font-medium">{daysInStage}d</div>
                                </TooltipTrigger>
                                <TooltipContent side="bottom" sideOffset={5}>
                                    <p className="text-xs">Last changed: {lastChangedDateFormatted}</p>
                                </TooltipContent>
                            </Tooltip>
                            <div className="flex border-x-2 mx-2 px-2 items-center gap-1">
                                <span className="font-medium">{listing.Inquiry_Calls_Taken}</span>
                                <span>call{listing.Inquiry_Calls_Taken !== 1 ? 's' : ''}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Link target="_blank" href={`/dashboard/listings/${listing.id}`} passHref>
                                <Button asChild size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-blue-50" onClick={(e) => e.stopPropagation()}>
                                    <CircleChevronRight className="h-2 p-1 w-2 text-blue-600" />
                                </Button>
                            </Link>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 hover:bg-gray-50" onClick={(e) => e.stopPropagation()}>
                                        <Globe className="h-3 w-3 text-gray-600" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><ExternalLink className="h-3 w-3" /><Link href={listing.BizBuySell_Listing_Link} target="_blank">BizBuySell</Link></DropdownMenuItem>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><ExternalLink className="h-3 w-3" /><Link href={listing.BizDepot_Listing_Link} target="_blank">BizDepot Link</Link></DropdownMenuItem>
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}><ExternalLink className="h-3 w-3" /><Link href={listing.Drive_Link} target="_blank">Google Drive</Link></DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-7 w-7 p-0 hover:bg-gray-50 rounded-full"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label="Owner Information"
                                    >
                                    <User className="h-3 w-3 text-green-600" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 shadow-md border rounded-md">
                                    <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100">
                                    <div className="flex items-center space-x-2 overflow-hidden"> {/* Added overflow-hidden */}
                                        <User className="h-4 w-4" />
                                        <span className="truncate text-sm"> {/* Added truncate for text overflow */}
                                        {listing.Owner_Name ? listing.Owner_Name : "No Name"}
                                        </span>
                                    </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100">
                                    <div className="flex items-center space-x-2 overflow-hidden">
                                        <Phone className="h-4 w-4" />
                                        <span className="truncate text-sm">
                                        {listing.Owner_Phone ? formatPhoneNumber(listing.Owner_Phone) : "No Phone"}
                                        </span>
                                    </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="hover:bg-gray-100 focus:bg-gray-100">
                                    <Link href={`mailto:${listing.Owner_Email}`} className="flex items-center space-x-2 overflow-hidden">
                                        <Mail className="h-4 w-4" />
                                        <span className="truncate text-sm">
                                            {listing.Owner_Email ? listing.Owner_Email : "No Email"}
                                        </span>
                                    </Link>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
});

const stages = [
    { id: 'All', title: 'All' }, { id: 'Buyer Qualification', title: 'Buyer Qualification' },
    { id: 'Letter of Intent (LOI)', title: 'Letter of Intent (LOI)' }, { id: 'Due Diligence Process', title: 'Due Diligence Process' },
    { id: 'Purchase Agreement Negotiation', title: 'Purchase Agreement Negotiation' }, { id: 'Financing Coordination', title: 'Financing Coordination' },
    { id: 'In Escrow', title: 'In Escrow' }, { id: 'Closing & Transition', title: 'Closing & Transition' },
    { id: 'Deal Closed', title: 'Deal Closed' }, { id: 'Off Market', title: 'Off Market' }, { id: 'archived', title: 'Archived' },
];

export default function Listings({ listing: rawListings }: { listing: ListingsType }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCompactView, setIsCompactView] = useState<boolean | undefined>();
    const [activeStageId, setActiveStageId] = useState<string>('All');
    const [statusFilter, setStatusFilter] = useState<string>('All');
    const [sortOption, setSortOption] = useState<string>('date-desc');
    const [availableStages, setAvailableStages] = useState<any[]>([]);

    const getCookie = (name: string): string | null => {
        if (typeof document === 'undefined') return null;
        const cookie = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
        return cookie ? cookie.split('=')[1] : null;
    };

    const setCookie = (name: string, value: string) => {
        if (typeof document !== 'undefined') {
            document.cookie = `${name}=${value}; path=/; max-age=31536000;`;
        }
    };

    useEffect(() => {
        const compactViewCookie = getCookie('isCompactView');
        setIsCompactView(compactViewCookie === 'true');

        const sortOptionCookie = getCookie('sortOption');
        if (sortOptionCookie) {
            setSortOption(sortOptionCookie);
        }
    }, []);

    useEffect(() => {
        if (isCompactView !== undefined) {
            setCookie('isCompactView', isCompactView.toString());
        }
    }, [isCompactView]);

    useEffect(() => {
        setCookie('sortOption', sortOption);
    }, [sortOption]);

    const processedListings = useMemo(() => {
        if (!rawListings) return [];
        return rawListings.map(item => ({
            ...item,
            lowerCaseName: item.Buisness_Name?.toLowerCase() ?? '',
            dateListed: new Date(item.Date_Listed).getTime(),
            dayStageChanged: new Date(item.Day_Stage_Changed).getTime(),
        }));
    }, [rawListings]);

    useEffect(() => {
        if (processedListings.length > 0) {
            const uniqueStages = [...new Set(processedListings.map(item => item.Current_Stage))];
            const stagesWithData = stages.filter(stage => stage.id === 'All' || uniqueStages.includes(stage.id));
            setAvailableStages(stagesWithData);
        } else {
            setAvailableStages([{ id: 'All', title: 'All' }]);
        }
    }, [processedListings]);

    const filteredAndSortedListings = useMemo(() => {
        let filtered = [...processedListings];
        const lowerCaseQuery = searchQuery.toLowerCase();

        if (searchQuery) filtered = filtered.filter(item => item.lowerCaseName.includes(lowerCaseQuery));
        if (activeStageId !== 'All') filtered = filtered.filter(item => item.Current_Stage === activeStageId);
        if (statusFilter !== 'All') filtered = filtered.filter(item => item.Status === statusFilter);

        filtered.sort((a, b) => {
            switch (sortOption) {
                case 'date-desc': return b.dateListed - a.dateListed;
                case 'date-asc': return a.dateListed - b.dateListed;
                case 'updated-desc': return b.dayStageChanged - a.dayStageChanged;
                case 'updated-asc': return a.dayStageChanged - b.dayStageChanged;
                case 'price-asc': return a.Asking_Price - b.Asking_Price;
                case 'price-desc': return b.Asking_Price - a.Asking_Price;
                
                default: return 0;
            }
        });

        return filtered;
    }, [processedListings, searchQuery, activeStageId, statusFilter, sortOption]);
    
    const stageCounts = useMemo(() => {
        const counts = new Map<string, number>();
        const listToCount = processedListings.filter(item => {
            const lowerCaseQuery = searchQuery.toLowerCase();
            const passesSearch = !searchQuery || item.lowerCaseName.includes(lowerCaseQuery);
            const passesStatus = statusFilter === 'All' || item.Status === statusFilter;
            return passesSearch && passesStatus;
        });

        listToCount.forEach(listing => {
            const stage = listing.Current_Stage;
            counts.set(stage, (counts.get(stage) || 0) + 1);
        });

        counts.set('All', listToCount.length);
        return counts;
    }, [processedListings, searchQuery, statusFilter]);
    
    const sortValue = sortOption.split('-')[0];
    const sortDirection = sortOption.split('-')[1];

    const handleSortChange = (value: string) => {
        setSortOption(`${value}-${sortDirection}`);
    };

    const toggleSortDirection = () => {
        const newDirection = sortDirection === 'desc' ? 'asc' : 'desc';
        setSortOption(`${sortValue}-${newDirection}`);
    };

    if (isCompactView === undefined) {
        return <div className="animate-fadeIn bg-white rounded-xl"><Skeleton className="w-full h-screen" /></div>;
    }

    return (
        <div className="container mx-auto px-4">
            <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                <h1 className="text-3xl font-extrabold text-gray-900">Property Listings</h1>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Button variant="default" size="sm" className="w-full sm:w-auto"><PlusCircle className="mr-2 h-4 w-4" /> Add New Listing</Button>
                    <Input placeholder="Search by Business Name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full sm:w-64" />
                    <ToggleGroup size="sm" type="single" value={isCompactView ? "compact" : "big"} onValueChange={(value) => setIsCompactView(value === "compact")} className="flex-shrink-0">
                        <ToggleGroupItem value="compact" aria-label="Toggle compact view"><List className="h-4 w-4" /></ToggleGroupItem>
                        <ToggleGroupItem value="big" aria-label="Toggle big view"><LayoutGrid className="h-4 w-4" /></ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </header>
            {!rawListings || rawListings.length === 0 ? (
                <div className="text-center py-10"><p className="text-gray-600 text-lg">No listing data available.</p></div>
            ) : (
                <>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-gray-700 font-medium whitespace-nowrap">Stage:</span>
                            <Select value={activeStageId} onValueChange={setActiveStageId}>
                                <SelectTrigger className="w-full sm:w-[240px]">
                                    <SelectValue placeholder="Select a stage" />
                                </SelectTrigger>
                                <SelectContent>
                                    {stages.map((stage) => {
                                        const count = stageCounts.get(stage.id) ?? 0;
                                        const hasData = count > 0;
                                        return (
                                            <SelectItem
                                                key={stage.id}
                                                value={stage.id}
                                                disabled={!hasData && stage.id !== 'All'}
                                            >
                                                <div className="flex items-center justify-between w-full">
                                                    <span className="truncate pr-1">{stage.title}</span>
                                                    {hasData && (
                                                        <span className="ml-2 text-xs font-semibold bg-green-300 text-gray-700 px-2 py-0.5 rounded-full">
                                                            {count}
                                                        </span>
                                                    )}
                                                </div>
                                            </SelectItem>
                                        );
                                    })}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                            <span className="text-gray-700 font-medium whitespace-nowrap">Status:</span>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filter by status" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="All">All Statuses</SelectItem>
                                    <SelectItem value="On Track">On Track</SelectItem>
                                    <SelectItem value="Off Track">Off Track</SelectItem>
                                    <SelectItem value="Completed">Completed</SelectItem>
                                    <SelectItem value="At Risk">At Risk</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto sm:ml-auto">
                            <span className="text-gray-700 font-medium whitespace-nowrap">Sort By:</span>
                            <Select value={sortValue} onValueChange={handleSortChange}>
                                <SelectTrigger className="w-full sm:w-[180px]">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="price">Asking Price</SelectItem>
                                  
                                  <SelectItem value="date">Listing Date</SelectItem>
                                  <SelectItem value="updated">Last Updated</SelectItem>
                                    
                                    
                                </SelectContent>
                            </Select>
                            <Button variant="outline" size="icon" onClick={toggleSortDirection}>
                                {sortDirection === 'desc' ? (
                                    <ArrowDown className="h-4 w-4" aria-label="Sort descending" />
                                ) : (
                                    <ArrowUp className="h-4 w-4" aria-label="Sort ascending" />
                                )}
                            </Button>
                        </div>
                    </div>
                    <TooltipProvider delayDuration={200}>
                        <div className={isCompactView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2" : "space-y-4"}>
                            {filteredAndSortedListings.length > 0 ? (
                                filteredAndSortedListings.map(listing => (
                                    isCompactView ? (
                                        <CompactPropertyCard key={listing.id} listing={listing} />
                                    ) : (
                                        <BigPropertyCard key={listing.id} listing={listing} />
                                    )
                                ))
                            ) : (
                                <p className="col-span-full text-center text-gray-500 mt-8">No listings match your current filters.</p>
                            )}
                        </div>
                    </TooltipProvider>
                </>
            )}
        </div>
    );
}