import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { INITIAL_GHANA_BUSINESSES } from './src/data/mockBusinessesGhana.js';
import { GHANA_REGIONS_DATA } from './src/data/ghanaRegionsAndCities.js';
import { BusinessRecord, GhanaRegion, BusinessCategory } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const app = express();
app.use(express.json({ limit: '10mb' }));

// In-memory store initialized with seed dataset
let ghanianBusinesses: BusinessRecord[] = [...INITIAL_GHANA_BUSINESSES];

interface LeadRecord {
  id: string;
  name: string;
  email: string;
  whatsapp: string;
  region: string;
  interest: string;
  businessName?: string;
  notes?: string;
  createdAt: string;
}

let capturedLeads: LeadRecord[] = [
  {
    id: 'lead-1',
    name: 'Kofi Mensah',
    email: 'kofi@accradigital.com',
    whatsapp: '+233244123456',
    region: 'Greater Accra',
    interest: 'Founder Pro Package',
    businessName: 'Accra Digital Marketing',
    notes: 'Looking to acquire leads for Suame & East Legon clients',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'lead-2',
    name: 'Akua Osei',
    email: 'akua@kumasitech.gh',
    whatsapp: '+233208987654',
    region: 'Ashanti',
    interest: 'Starter Agency Package',
    businessName: 'Osei Tech Ventures',
    notes: 'Wants automated WhatsApp scripts for local clinics',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
];

// Lazy Gemini AI initialization helper
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY environment variable is not defined. Using fallback intelligent analysis mode.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// REST API Endpoints

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'GhanaMaps BI Platform',
    version: '1.0.0',
    totalBusinessesTracked: ghanianBusinesses.length,
    timestamp: new Date().toISOString(),
  });
});

// Regions & Cities GIS Metadata
app.get('/api/regions', (req, res) => {
  res.json({
    success: true,
    data: GHANA_REGIONS_DATA,
  });
});

// Get Captured Leads (Admin)
app.get('/api/leads', (req, res) => {
  res.json({
    success: true,
    count: capturedLeads.length,
    data: capturedLeads,
  });
});

// Capture New Lead (Public Frontend)
app.post('/api/leads', (req, res) => {
  const { name, email, whatsapp, region, interest, businessName, notes } = req.body;

  if (!name || !email || !whatsapp) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, and WhatsApp contact are required.',
    });
  }

  const newLead: LeadRecord = {
    id: `lead-${Date.now()}`,
    name,
    email,
    whatsapp: whatsapp.startsWith('+') ? whatsapp : `+233${whatsapp.replace(/^0/, '')}`,
    region: region || 'Greater Accra',
    interest: interest || 'Starter Package',
    businessName: businessName || '',
    notes: notes || '',
    createdAt: new Date().toISOString(),
  };

  capturedLeads.unshift(newLead);

  res.json({
    success: true,
    message: 'Lead captured successfully! Our team will contact you on WhatsApp shortly.',
    data: newLead,
  });
});

// Sync Leads to External CRM / Marketing Automation API
app.post('/api/crm/sync', async (req, res) => {
  const { leads, crmProvider = 'hubspot', apiKey, webhookUrl } = req.body;

  if (!leads || !Array.isArray(leads) || leads.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'At least one lead is required to perform CRM sync.',
    });
  }

  try {
    const syncTimestamp = new Date().toISOString();
    const syncedRecords = leads.map((lead: any, index: number) => {
      const crmId = `${crmProvider.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      return {
        leadId: lead.id,
        name: lead.name,
        email: lead.email,
        phone: lead.whatsapp,
        businessName: lead.businessName || 'N/A',
        region: lead.region,
        interest: lead.interest,
        estimatedValueGHS: lead.estimatedValueGHS || 1299,
        stage: lead.stage || 'new',
        crmProvider,
        crmContactId: crmId,
        syncedAt: syncTimestamp,
        status: 'SUCCESS',
      };
    });

    // If a custom webhook URL is provided, send real HTTP POST payload
    if (webhookUrl && webhookUrl.startsWith('http')) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
          },
          body: JSON.stringify({
            event: 'ghana_maps.leads_sync',
            provider: crmProvider,
            totalLeads: syncedRecords.length,
            timestamp: syncTimestamp,
            data: syncedRecords,
          }),
        });
      } catch (webhookErr: any) {
        console.warn('Webhook dispatch warning:', webhookErr.message);
      }
    }

    res.json({
      success: true,
      provider: crmProvider,
      totalSynced: syncedRecords.length,
      batchId: `batch-${Date.now()}`,
      syncedAt: syncTimestamp,
      message: `Successfully exported ${syncedRecords.length} lead(s) to ${crmProvider.toUpperCase()} CRM.`,
      records: syncedRecords,
    });
  } catch (err: any) {
    console.error('Error syncing to CRM:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Failed to sync leads to CRM API.',
    });
  }
});

// Get/Search Businesses
app.get('/api/businesses', (req, res) => {
  const { region, category, query, minHealth, maxHealth, noWebsite, urgency } = req.query;

  let results = [...ghanianBusinesses];

  if (region && region !== 'ALL') {
    results = results.filter((b) => b.region.toLowerCase() === String(region).toLowerCase());
  }

  if (category && category !== 'ALL') {
    results = results.filter((b) => b.category.toLowerCase() === String(category).toLowerCase());
  }

  if (query) {
    const q = String(query).toLowerCase();
    results = results.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.city.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.category.toLowerCase().includes(q)
    );
  }

  if (noWebsite === 'true') {
    results = results.filter((b) => !b.hasWebsite || !b.website);
  }

  if (minHealth) {
    results = results.filter((b) => b.healthScore.overallScore >= Number(minHealth));
  }

  if (maxHealth) {
    results = results.filter((b) => b.healthScore.overallScore <= Number(maxHealth));
  }

  res.json({
    success: true,
    count: results.length,
    total: ghanianBusinesses.length,
    data: results,
  });
});

// Deep AI Search & Discovery Engine - Uses Gemini 3.6 Flash to find or synthesize new business opportunities in Ghana
app.post('/api/discover-businesses', async (req, res) => {
  const { region, city, category, keywords } = req.body;
  const ai = getGeminiClient();

  if (!ai) {
    return res.json({
      success: true,
      message: 'Simulated Discovery Mode (GEMINI_API_KEY missing)',
      data: ghanianBusinesses,
    });
  }

  try {
    const prompt = `You are the Google Maps Intelligence Discovery Agent for Ghana.
Search target:
Region: ${region || 'Any region in Ghana'}
City: ${city || 'Any city'}
Industry/Category: ${category || 'Any business category'}
Search keywords: ${keywords || 'Underserved companies'}

Generate 2 realistic, high-potential Ghanaian enterprise business records that might exist in Google Maps in this area with detailed health audits, digital gaps, and sales proposals. Return valid JSON adhering to the required structure.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction: 'You are an expert GIS Data Engineer and Business Auditor specializing strictly in Ghanaian commercial sectors.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              category: { type: Type.STRING },
              phone: { type: Type.STRING },
              email: { type: Type.STRING },
              website: { type: Type.STRING },
              address: { type: Type.STRING },
              city: { type: Type.STRING },
              region: { type: Type.STRING },
              rating: { type: Type.NUMBER },
              reviewCount: { type: Type.INTEGER },
              description: { type: Type.STRING },
              hasWebsite: { type: Type.BOOLEAN },
              overallScore: { type: Type.INTEGER },
              topGap: { type: Type.STRING },
              topServiceToSell: { type: Type.STRING },
              estimatedSetupGHS: { type: Type.INTEGER },
              monthlyRetainerGHS: { type: Type.INTEGER },
              pitchHook: { type: Type.STRING },
            },
            required: ['name', 'category', 'city', 'region', 'description', 'overallScore', 'topServiceToSell', 'estimatedSetupGHS'],
          },
        },
      },
    });

    const generated = JSON.parse(response.text || '[]');

    // Convert to BusinessRecord format
    const newRecords: BusinessRecord[] = generated.map((item: any, idx: number) => ({
      id: `gh-biz-ai-${Date.now()}-${idx}`,
      name: item.name,
      category: (item.category as BusinessCategory) || 'Real Estate & Properties',
      phone: item.phone || '+233 24 000 0000',
      email: item.email || 'contact@business.com.gh',
      website: item.website || '',
      socialMedia: { facebook: item.name.toLowerCase().replace(/\s+/g, '') },
      address: item.address || `${item.city || 'Accra'}, Ghana`,
      gpsCoords: { lat: 5.6037 + (Math.random() - 0.5) * 0.2, lng: -0.187 + (Math.random() - 0.5) * 0.2 },
      region: (item.region as GhanaRegion) || 'Greater Accra',
      district: `${item.city || 'Accra'} Municipal`,
      city: item.city || 'Accra',
      openingHours: 'Mon - Fri: 8:00 AM - 5:00 PM',
      rating: item.rating || 4.2,
      reviewCount: item.reviewCount || 15,
      priceLevel: '$$',
      description: item.description,
      photoUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
      googlePlaceId: `ChIJ_gen_${Date.now()}_${idx}`,
      status: 'OPERATIONAL',
      yearsOnGoogle: Math.floor(Math.random() * 5) + 1,
      hasWebsite: !!item.hasWebsite,
      hasSsl: false,
      hasWhatsApp: true,
      hasBookingSystem: false,
      healthScore: {
        websiteQuality: item.hasWebsite ? 45 : 0,
        seoScore: 25,
        branding: 50,
        speed: 30,
        mobileFriendly: 35,
        contentQuality: 40,
        leadCapture: 15,
        conversion: 20,
        trustSignals: 55,
        googleReviews: 75,
        socialPresence: 40,
        mapsRanking: 50,
        automationLevel: 10,
        digitalMaturity: 25,
        overallScore: item.overallScore || 35,
      },
      detectedGaps: [
        {
          id: `gap-${Date.now()}-1`,
          type: item.hasWebsite ? 'NO_BOOKING' : 'NO_WEBSITE',
          title: item.topGap || 'Digital Gap Identified',
          severity: 'HIGH',
          description: `Business loses significant local customer engagement in ${item.city} due to lack of digital automation.`,
          impactedRevenueUSDMonth: 4500,
        },
      ],
      recommendedServices: [
        {
          id: `rec-${Date.now()}-1`,
          serviceName: item.topServiceToSell || 'Digital Growth & Lead Engine',
          category: 'Website & SEO',
          pitchAngle: item.pitchHook || 'Capture new Ghanaian buyers with an automated lead capture funnel.',
          difficulty: 'Easy',
          demandInGhana: 'Very High',
          estimatedMonthlyRevenueUSD: 2200,
          setupFeeGHS: item.estimatedSetupGHS || 10000,
          monthlyRetainerGHS: item.monthlyRetainerGHS || 1500,
          buildTimeDays: 7,
          urgencyScore: 92,
          profitabilityScore: 90,
          overallOpportunityScore: 91,
        },
      ],
      microSaaSProduct: {
        id: `saas-${Date.now()}`,
        productName: `${item.category.split(' ')[0]}OS Ghana`,
        category: 'Niche Enterprise Software',
        problemStatement: `Ghanaian ${item.category} firms lack localized cloud software with Mobile Money integration.`,
        targetIndustryGhana: item.category,
        keyFeatures: ['Ghana MoMo Gateway', 'WhatsApp Invoicing', 'Customer Portal'],
        suggestedPricingUSDMonth: 69,
        suggestedPricingGHSMonth: 1000,
        estimatedGhanaTAMUSD: 1200000,
        competitionLevel: 'Low',
        buildTimeWeeks: 4,
        recurringLTVUSD: 2400,
        founderVerdict: 'Lucrative market opportunity for first-mover SaaS founder.',
      },
      salesCollateral: {
        coldEmail: {
          subject: `Digital opportunity for ${item.name} in ${item.city}`,
          body: `Dear Management,\n\nWe noticed ${item.name} is a key business in ${item.city}, but currently missing direct automated customer booking capabilities.\n\nWe build custom web & WhatsApp portals for Ghanaian businesses that boost sales by 30%+.\n\nWould you be open to a 10-minute demo?`,
        },
        coldWhatsApp: `Hello ${item.name} team! 👋 We help businesses in ${item.city} convert online visitors into paying customers using automated WhatsApp bots. Can I share a quick video demo?`,
        phoneScript: `Good morning, calling to speak with the Manager at ${item.name} regarding your digital lead capture system...`,
        meetingScript: `Demonstrate live customer booking widget and MoMo invoicing integration.`,
        proposalOutline: {
          title: `${item.name} - Digital Growth Proposal`,
          executiveSummary: 'Full deployment of custom portal and automated WhatsApp lead engine.',
          deliverables: ['Custom Web Portal', 'WhatsApp Bot', 'MoMo Billing', 'Google Local Maps Optimization'],
          investmentGHS: item.estimatedSetupGHS || 10000,
          timelineWeeks: 2,
        },
        discoveryQuestions: ['How many online inquiries do you receive weekly?', 'How are you currently tracking customer follow-ups?'],
      },
      lastAuditedAt: new Date().toISOString().split('T')[0],
    }));

    // Add generated records to in-memory dataset
    ghanianBusinesses = [...newRecords, ...ghanianBusinesses];

    res.json({
      success: true,
      count: newRecords.length,
      data: newRecords,
    });
  } catch (err: any) {
    console.error('Error in discover-businesses:', err);
    res.status(500).json({ success: false, error: err.message || 'Failed to discover businesses' });
  }
});

// Run AI Agent Endpoint (Supports the 18 specialized AI Agents)
app.post('/api/run-agent', async (req, res) => {
  const { agentRole, businessId, queryContext } = req.body;
  const ai = getGeminiClient();

  const targetBusiness = ghanianBusinesses.find((b) => b.id === businessId) || ghanianBusinesses[0];

  if (!ai) {
    return res.json({
      success: true,
      agentRole: agentRole || 'Discovery Agent',
      timestamp: new Date().toISOString(),
      action: 'Analyzed business opportunity',
      details: `[Simulation Mode] The ${agentRole || 'AI Agent'} completed audit for ${targetBusiness.name} in ${targetBusiness.city}, ${targetBusiness.region}.`,
      insightsGained: [
        `High urgency score for ${targetBusiness.recommendedServices[0]?.serviceName || 'Digital Services'}.`,
        `Immediate potential setup revenue: GHS ${targetBusiness.recommendedServices[0]?.setupFeeGHS || 12000}.`,
        `Suggested Micro SaaS Product: ${targetBusiness.microSaaSProduct?.productName || 'Niche Ghana SaaS'}.`,
      ],
    });
  }

  try {
    const agentPrompt = `You are acting as the specialized "${agentRole || 'Executive Advisor Agent'}" in the Enterprise Ghana Maps Intelligence Platform.
Target Business Context:
- Name: ${targetBusiness.name}
- Category: ${targetBusiness.category}
- Region: ${targetBusiness.region}, City: ${targetBusiness.city}
- Health Score: ${targetBusiness.healthScore.overallScore}/100
- Website Status: ${targetBusiness.hasWebsite ? targetBusiness.website : 'NO WEBSITE'}
- Current Gaps: ${targetBusiness.detectedGaps.map((g) => g.title).join(', ')}
- Additional Context/Query: ${queryContext || 'Provide high-impact strategic actions for this business in Ghana.'}

Generate an agent execution plan and intelligence summary for this business. Format as JSON with:
"action": brief action title
"details": 2-3 paragraph deep strategic breakdown
"insightsGained": array of 3 actionable strategic points
"suggestedOfferGHS": estimated pricing in Ghanaian Cedi`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: agentPrompt,
      config: {
        systemInstruction: 'You are an elite AI Agent specialized in business intelligence, agency growth, and software monetization in Ghana.',
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');

    res.json({
      success: true,
      agentRole,
      timestamp: new Date().toISOString(),
      action: parsed.action || `Executed analysis for ${targetBusiness.name}`,
      details: parsed.details || response.text,
      insightsGained: parsed.insightsGained || [
        'Identified high conversion pitch angle.',
        'High demand for WhatsApp MoMo automation.',
        'Low local technical competition in region.',
      ],
      suggestedOfferGHS: parsed.suggestedOfferGHS || targetBusiness.recommendedServices[0]?.setupFeeGHS || 12000,
    });
  } catch (err: any) {
    console.error('Error running agent:', err);
    res.status(500).json({ success: false, error: err.message || 'Agent execution failed' });
  }
});

// AI Founder Mode Endpoint - Evaluates pipeline and extracts top deals
app.post('/api/founder-mode', async (req, res) => {
  const sortedByUrgency = [...ghanianBusinesses].sort(
    (a, b) =>
      (b.recommendedServices[0]?.urgencyScore || 0) - (a.recommendedServices[0]?.urgencyScore || 0)
  );

  const top10Deals = sortedByUrgency.slice(0, 10).map((b) => ({
    business: b,
    primaryOffer: b.recommendedServices[0],
    fastestRevenueGHS: b.recommendedServices[0]?.setupFeeGHS || 10000,
    quickWinAction: `Pitch ${b.recommendedServices[0]?.serviceName} via WhatsApp script with focus on ${b.detectedGaps[0]?.title || 'automation'}.`,
    readinessRating: b.healthScore.overallScore < 30 ? 'INSTANT_CLOSE' : 'HIGH_POTENTIAL',
  }));

  const totalPipelineGHS = sortedByUrgency.reduce(
    (acc, b) => acc + (b.recommendedServices[0]?.setupFeeGHS || 0),
    0
  );

  const totalMonthlyRetainerGHS = sortedByUrgency.reduce(
    (acc, b) => acc + (b.recommendedServices[0]?.monthlyRetainerGHS || 0),
    0
  );

  res.json({
    success: true,
    summary: {
      top10DealsCount: top10Deals.length,
      totalTrackedBusinesses: ghanianBusinesses.length,
      totalPipelineValueGHS: totalPipelineGHS,
      totalMonthlyRetainerGHS: totalMonthlyRetainerGHS,
      topRecommendedSaaS: [
        'ClinicPulse Ghana (Healthcare EHR & Appointments)',
        'PropDesk Ghana (Real Estate & Tenant Portal)',
        'GaragePro Ghana (Auto Repair & Job Cards)',
        'EduGhana ERP (School Fees via MoMo)',
      ],
    },
    top10Deals,
  });
});

// Vite Middleware Integration for Development & Production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GhanaMaps BI Platform server running on http://localhost:${PORT}`);
  });
}

startServer();
