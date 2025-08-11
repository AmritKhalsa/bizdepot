import React from 'react';
import pb from '../../../../../../connections/pocketbase';
import { Listing } from '../types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatPhoneNumber } from '../../../../../utils';
import {
  Badge,
  Calendar,
  DollarSign,
  Mail,
  Phone,
  User,
  MapPin,
  TrendingUp,
  Clock,
  Building2,
  FileText,
  Users,
  Percent,
  Star,
  Eye,
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ListingPageProps {
  params: {
    listingId: string;
  };
}

async function getListing(listingId: string): Promise<Listing | null> {
  try {
    const listing = await pb.collection('Listings').getOne<Listing>(listingId);
    return listing;
  } catch (error) {
    console.error("Error fetching listing:", error);
    return null;
  }
}

export default async function ListingPage({ params }: ListingPageProps) {
  const { listingId } = await params;
  const listingData = await getListing(listingId);
  console.log(listingData)
  if (!listingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center space-y-4 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
          <div className="w-16 h-16 mx-auto bg-red-50 text-red-600 rounded-full flex items-center justify-center border-4 border-red-100">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Listing not found</h2>
          <p className="text-gray-500">The listing you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const getStageColor = (stage: string) => {
    switch (stage?.toLowerCase()) {
      case 'active': return 'bg-yellow-500 text-black border-yellow-200';
      case 'pending': return 'bg-red-500 text-white border-red-200';
      case 'sold': return 'bg-blue-500 text-white border-blue-200';
      case 'withdrawn': return 'bg-gray-500 text-white border-gray-200';
      default: return 'bg-gray-500 text-white border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        {/* Header Section */}
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-red-500 rounded-2xl flex items-center justify-center shadow-md">
                  <Building2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-extrabold text-gray-900 tracking-tighter">
                    {listingData.Buisness_Name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <Badge variant="outline" className="text-xs font-semibold text-gray-600 border-gray-300">
                      ID: {listingData.id}
                    </Badge>
                    <Badge className={`${getStageColor(listingData.Current_Stage)} text-xs font-bold`}>
                      {listingData.Current_Stage}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-600 mt-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{listingData.Location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">Listed {formatDate(listingData.Date_Listed)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-blue-500" />
                  <span className="font-medium">{listingData.Inquiry_Calls_Taken} inquiries</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500 mb-1 font-semibold">Asking Price</div>
              <div className="text-5xl font-extrabold text-gray-900">
                {formatCurrency(listingData.Asking_Price)}
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="overview" className="space-y-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
            <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-lg">
              <TabsTrigger
                value="overview"
                className="data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-gray-700"
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="details"
                className="data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-gray-700"
              >
                Details
              </TabsTrigger>
              <TabsTrigger
                value="owner"
                className="data-[state=active]:bg-white data-[state=active]:shadow-md font-bold text-gray-700"
              >
                Owner Information
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-8">
            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="bg-white shadow-lg border border-yellow-200 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-yellow-700 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Asking Price
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-yellow-800">
                    {formatCurrency(listingData.Asking_Price)}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border border-red-200 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-red-700 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Current Stage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-extrabold text-red-800 mb-1">
                    {listingData.Current_Stage}
                  </div>
                  <p className="text-xs text-red-600 flex items-center gap-1 font-medium">
                    <Clock className="h-3 w-3" />
                    Since {formatDate(listingData.Day_Stage_Changed)}
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-blue-700 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Inquiry Calls
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-blue-800">
                    {listingData.Inquiry_Calls_Taken}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border border-red-200 hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-red-700 flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Commission
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-extrabold text-red-800">
                    {listingData.Commission_Percentage}%
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Description */}
            <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 p-6">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-xl font-bold">
                  <FileText className="h-5 w-5 text-gray-500" />
                  Business Description
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-gray-700 leading-relaxed text-base">
                  {listingData.Description}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-8">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Listing Information */}
              <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-gray-100 p-6">
                  <CardTitle className="flex items-center gap-2 text-gray-900 text-xl font-bold">
                    <Building2 className="h-5 w-5 text-gray-500" />
                    Listing Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-sm text-gray-700 mb-1">Confidential Name</h3>
                      <p className="text-gray-900 font-medium">{listingData.Confidential_Listing_Name}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-sm text-gray-700 mb-1 flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-blue-500" />
                        Location
                      </h3>
                      <p className="text-gray-900 font-medium">{listingData.Location}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <h3 className="font-bold text-sm text-gray-700 mb-1 flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        Date Listed
                      </h3>
                      <p className="text-gray-900 font-medium">{formatDate(listingData.Date_Listed)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Commission & Agent Info */}
              <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
                <CardHeader className="border-b border-gray-100 p-6">
                  <CardTitle className="flex items-center gap-2 text-gray-900 text-xl font-bold">
                    <Users className="h-5 w-5 text-gray-500" />
                    Commission & Agent Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                      <h3 className="font-bold text-sm text-red-700 mb-1">Commission Percentage</h3>
                      <p className="text-2xl font-extrabold text-red-800">{listingData.Commission_Percentage}%</p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h3 className="font-bold text-sm text-blue-700 mb-1">Agent's Split</h3>
                      <p className="text-2xl font-extrabold text-blue-800">{listingData.Agents_Split}%</p>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                      <h3 className="font-bold text-sm text-yellow-700 mb-1">Broker Assigned</h3>
                      <p className="text-lg font-bold text-yellow-800">{listingData.Broker_Assigned}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300">
              <CardHeader className="border-b border-gray-100 p-6">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-xl font-bold">
                  <Clock className="h-5 w-5 text-gray-500" />
                  Timeline
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {[
                    { label: 'Created', date: listingData.created, color: 'bg-red-500', icon: Calendar },
                    { label: 'Last Updated', date: listingData.updated, color: 'bg-yellow-500', icon: Calendar },
                    { label: 'Stage Changed', date: listingData.Day_Stage_Changed, color: 'bg-blue-500', icon: TrendingUp }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full shadow-md ${item.color}`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-600 font-medium">{formatDate(item.date)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="owner" className="space-y-8">
            <Card className="shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 max-w-2xl">
              <CardHeader className="border-b border-gray-100 p-6">
                <CardTitle className="flex items-center gap-2 text-gray-900 text-xl font-bold">
                  <User className="h-5 w-5 text-gray-500" />
                  Owner Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-md">
                      <User className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-extrabold text-lg text-gray-900">{listingData.Owner_Name}</p>
                      <p className="text-sm text-blue-600 font-bold">Business Owner</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-yellow-500 shadow-md">
                      <Mail className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{listingData.Owner_Email}</p>
                      <p className="text-sm text-yellow-600 font-bold">Email Address</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-500 shadow-md">
                      <Phone className="h-7 w-7 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{formatPhoneNumber(listingData.Owner_Phone)}</p>
                      <p className="text-sm text-red-600 font-bold">Phone Number</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}