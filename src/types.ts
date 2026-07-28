/**
 * Enterprise Agentic Google Maps Intelligence Platform for Ghana
 * Global TypeScript Interfaces & Types
 */

export type GhanaRegion =
  | 'Greater Accra'
  | 'Ashanti'
  | 'Western'
  | 'Central'
  | 'Eastern'
  | 'Northern'
  | 'Upper East'
  | 'Upper West'
  | 'Volta'
  | 'Oti'
  | 'Savannah'
  | 'Ahafo'
  | 'North East'
  | 'Bono'
  | 'Bono East'
  | 'Western North';

export type BusinessCategory =
  | 'Restaurants & Food'
  | 'Hotels & Hospitality'
  | 'Architects & Design'
  | 'Hospitals & Clinics'
  | 'Schools & Universities'
  | 'Churches & Religious Orgs'
  | 'Lawyers & Legal Services'
  | 'Mechanics & Auto Garages'
  | 'Real Estate & Properties'
  | 'Construction & Engineering'
  | 'Beauty Salons & Spas'
  | 'Supermarkets & Wholesalers'
  | 'Pharmacies & Medical'
  | 'Transport & Logistics'
  | 'Furniture & Woodwork'
  | 'Financial & Insurance'
  | 'NGOs & Government'
  | 'Manufacturing & Factories';

export interface AuditScores {
  websiteQuality: number; // 0-100
  seoScore: number; // 0-100
  branding: number; // 0-100
  speed: number; // 0-100
  mobileFriendly: number; // 0-100
  contentQuality: number; // 0-100
  leadCapture: number; // 0-100
  conversion: number; // 0-100
  trustSignals: number; // 0-100
  googleReviews: number; // 0-100
  socialPresence: number; // 0-100
  mapsRanking: number; // 0-100
  automationLevel: number; // 0-100
  digitalMaturity: number; // 0-100
  overallScore: number; // 0-100
}

export interface OpportunityGap {
  id: string;
  type:
    | 'NO_WEBSITE'
    | 'SLOW_WEBSITE'
    | 'NO_SSL'
    | 'POOR_SEO'
    | 'NO_BOOKING'
    | 'NO_CRM'
    | 'NO_CHATBOT'
    | 'NO_WHATSAPP'
    | 'INACTIVE_SOCIAL'
    | 'POOR_REVIEWS'
    | 'NO_PAYMENTS'
    | 'POOR_UX'
    | 'POOR_CONVERSION'
    | 'NO_SMS_MARKETING';
  title: string;
  severity: 'HIGH' | 'MEDIUM' | 'CRITICAL';
  description: string;
  impactedRevenueUSDMonth: number;
}

export interface RecommendedService {
  id: string;
  serviceName: string;
  category: 'Website & SEO' | 'AI & Automation' | 'Software & Systems' | 'Marketing & Sales';
  pitchAngle: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  demandInGhana: 'Very High' | 'High' | 'Moderate';
  estimatedMonthlyRevenueUSD: number;
  setupFeeGHS: number;
  monthlyRetainerGHS: number;
  buildTimeDays: number;
  urgencyScore: number; // 1-100
  profitabilityScore: number; // 1-100
  overallOpportunityScore: number; // 1-100
}

export interface MicroSaaSOpportunity {
  id: string;
  productName: string;
  category: string;
  problemStatement: string;
  targetIndustryGhana: string;
  keyFeatures: string[];
  suggestedPricingUSDMonth: number;
  suggestedPricingGHSMonth: number;
  estimatedGhanaTAMUSD: number;
  competitionLevel: 'Low' | 'Medium' | 'High';
  buildTimeWeeks: number;
  recurringLTVUSD: number;
  founderVerdict: string;
}

export interface SalesCollateral {
  coldEmail: {
    subject: string;
    body: string;
  };
  coldWhatsApp: string;
  phoneScript: string;
  meetingScript: string;
  proposalOutline: {
    title: string;
    executiveSummary: string;
    deliverables: string[];
    investmentGHS: number;
    timelineWeeks: number;
  };
  discoveryQuestions: string[];
}

export interface BusinessRecord {
  id: string;
  name: string;
  category: BusinessCategory;
  phone: string;
  email: string;
  website: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  address: string;
  gpsCoords: {
    lat: number;
    lng: number;
  };
  region: GhanaRegion;
  district: string;
  city: string;
  openingHours: string;
  rating: number; // 1.0 - 5.0
  reviewCount: number;
  priceLevel: string; // '$', '$$', '$$$'
  description: string;
  photoUrl: string;
  googlePlaceId: string;
  status: 'OPERATIONAL' | 'TEMPORARILY_CLOSED' | 'UNVERIFIED';
  yearsOnGoogle: number;
  hasWebsite: boolean;
  hasSsl: boolean;
  hasWhatsApp: boolean;
  hasBookingSystem: boolean;

  // AI Analytics & Intelligence
  healthScore: AuditScores;
  detectedGaps: OpportunityGap[];
  recommendedServices: RecommendedService[];
  microSaaSProduct: MicroSaaSOpportunity;
  salesCollateral: SalesCollateral;

  // Metadata
  lastAuditedAt: string;
}

export type AgentRole =
  | 'Discovery Agent'
  | 'Google Maps Agent'
  | 'Website Auditor Agent'
  | 'SEO Agent'
  | 'AI Opportunity Agent'
  | 'Digital Services Agent'
  | 'Micro SaaS Strategist'
  | 'Revenue Forecast Agent'
  | 'Sales Agent'
  | 'Proposal Generator Agent'
  | 'CRM Agent'
  | 'Lead Qualification Agent'
  | 'Competitive Intelligence Agent'
  | 'Business Health Agent'
  | 'Product Manager Agent'
  | 'Market Research Agent'
  | 'Report Writer Agent'
  | 'Executive Advisor Agent';

export interface AgentLog {
  id: string;
  agentRole: AgentRole;
  timestamp: string;
  action: string;
  details: string;
  status: 'THINKING' | 'EXECUTING' | 'COMPLETED' | 'ALERT';
  insightsGained?: string[];
}

export interface FilterState {
  searchQuery: string;
  region: GhanaRegion | 'ALL';
  city: string;
  category: BusinessCategory | 'ALL';
  minHealthScore: number;
  maxHealthScore: number;
  urgencyOnly: boolean;
  noWebsiteOnly: boolean;
  sortBy: 'urgency' | 'health_asc' | 'health_desc' | 'revenue_desc' | 'rating_asc';
}

export interface FounderModeDeal {
  business: BusinessRecord;
  primaryOffer: RecommendedService;
  fastestRevenueGHS: number;
  quickWinAction: string;
  readinessRating: 'INSTANT_CLOSE' | 'HIGH_POTENTIAL' | 'NURTURE';
}
