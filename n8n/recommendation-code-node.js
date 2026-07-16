/**
 * n8n Code Node: Calculate Rule-Based Recommendation
 * Mode: Run Once for All Items
 */

const input = $input.first()?.json ?? {};

const ALLOWED_OFFER_ACTIONS = new Set([
  "recommend_offer",
  "ask_discovery_before_package",
  "clarify_budget_before_offer",
  "clarify_timeline_before_offer",
  "share_portfolio_first",
  "manual_review_required",
]);

const ALLOWED_RISK_FLAGS = new Set([
  "low_recommendation_confidence",
  "insufficient_interaction_data",
  "cold_start_customer",
  "cold_start_offer",
  "offer_budget_mismatch",
  "recommendation_needs_review",
  "catalog_match_unclear",
  "manual_review_required",
]);

const RELATED_SERVICE_GROUPS = [
  [
    "social media management",
    "instagram management",
    "content management",
    "kelola instagram",
    "manage instagram",
  ],
  [
    "feed design",
    "instagram design",
    "visual design",
    "social media design",
    "desain feed",
  ],
  [
    "launch content",
    "campaign",
    "rebranding",
    "brand launch",
    "product launch",
  ],
  [
    "landing page",
    "website",
    "sales page",
    "registration page",
  ],
  [
    "event content",
    "wedding content",
    "event documentation",
  ],
  [
    "marketing consultation",
    "marketing help",
    "jasa marketing",
    "business consultation",
  ],
  [
    "lead generation",
    "buyer campaign",
    "ads campaign",
    "sales campaign",
  ],
  [
    "product photography",
    "foto produk",
    "catalog photo",
    "marketplace photo",
  ],
  [
    "website strategy",
    "content strategy",
    "website and content",
  ],
];

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "the",
  "for",
  "or",
  "to",
  "of",
  "lead",
  "asks",
  "ask",
  "needs",
  "need",
  "only",
  "with",
  "yang",
  "dan",
  "untuk",
  "dengan",
]);

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function normalize(value) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[_-]/g, " ")
    .replace(/[^a-z0-9\s.,]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function tokens(value) {
  return normalize(value)
    .split(" ")
    .filter((token) => token && !STOP_WORDS.has(token));
}

function containsPhrase(text, phrase) {
  const normalizedText = normalize(text);
  const normalizedPhrase = normalize(phrase);

  return Boolean(
    normalizedText &&
      normalizedPhrase &&
      normalizedText.includes(normalizedPhrase)
  );
}

function tokenCoverage(text, phrase) {
  const textTokens = new Set(tokens(text));
  const phraseTokens = tokens(phrase);

  if (phraseTokens.length === 0) {
    return 0;
  }

  const matchedCount = phraseTokens.filter((token) =>
    textTokens.has(token)
  ).length;

  return matchedCount / phraseTokens.length;
}

function conditionMatches(text, condition, threshold = 0.75) {
  return (
    containsPhrase(text, condition) ||
    tokenCoverage(text, condition) >= threshold
  );
}

function deriveCustomerId(leadId) {
  const match = String(leadId ?? "").match(/^L(\d+)$/i);
  return match ? `C${match[1]}` : "";
}

function sanitizeRiskFlags(flags) {
  return unique(flags).filter((flag) => ALLOWED_RISK_FLAGS.has(flag));
}

function fallbackOutput(
  lead,
  reason,
  extraFlags = [],
  missingContext = []
) {
  const leadId = String(lead?.lead_id ?? "");
  const customerId =
    String(lead?.customer_id ?? "") || deriveCustomerId(leadId);

  return {
    customer_id: customerId,
    lead_id: leadId,
    recommended_offer_id: "",
    recommended_offer_name: "",
    recommended_offer_category: "",
    recommendation_score: null,
    recommendation_confidence: "review",
    recommendation_method: "fallback",
    recommendation_reason:
      reason ||
      "The system cannot safely recommend an offer because the input is incomplete or no reliable catalog match is available.",
    offer_action: "manual_review_required",
    matched_signals: {
      service_interest_match: 0,
      business_type_fit: 0,
      budget_fit: 0,
      timeline_fit: 0,
      lead_quality_fit: 0,
      required_context_readiness: 0,
    },
    missing_recommendation_context: Array.isArray(missingContext)
      ? missingContext
      : [],
    recommendation_risk_flags: sanitizeRiskFlags([
      "recommendation_needs_review",
      "manual_review_required",
      ...extraFlags,
    ]),
    requires_human_review: true,
  };
}

function parseMoneyRange(value) {
  const text = normalize(value);

  const missingIndicators = [
    "tidak disebutkan",
    "belum ada budget",
    "budget belum ada",
    "not mentioned",
    "no budget",
    "unknown",
  ];

  if (
    !text ||
    missingIndicators.some((indicator) =>
      text.includes(normalize(indicator))
    )
  ) {
    return {
      missing: true,
      min: null,
      max: null,
    };
  }

  const numbers = [...text.matchAll(/\d+(?:[.,]\d+)?/g)].map(
    (match) => Number(match[0].replace(",", "."))
  );

  if (numbers.length === 0) {
    return {
      missing: false,
      min: null,
      max: null,
    };
  }

  if (
    text.includes("di bawah") ||
    text.includes("under") ||
    text.includes("below")
  ) {
    return {
      missing: false,
      min: 0,
      max: numbers[0],
    };
  }

  if (numbers.length === 1) {
    return {
      missing: false,
      min: numbers[0],
      max: numbers[0],
    };
  }

  return {
    missing: false,
    min: Math.min(numbers[0], numbers[1]),
    max: Math.max(numbers[0], numbers[1]),
  };
}

function findRelatedGroupIndex(text) {
  const normalizedText = normalize(text);

  return RELATED_SERVICE_GROUPS.findIndex((group) =>
    group.some((term) => normalizedText.includes(normalize(term)))
  );
}

function calculateServiceInterestMatch(lead, offer) {
  const leadText = [
    lead.service_interest,
    lead.message,
  ].join(" ");

  const negativeConditions = Array.isArray(offer.not_recommended_when)
    ? offer.not_recommended_when
    : [];

  const hasStrongNegativeCondition = negativeConditions.some(
    (condition) => conditionMatches(leadText, condition, 0.85)
  );

  if (hasStrongNegativeCondition) {
    return 0;
  }

  const directTerms = [
    offer.category,
    ...(Array.isArray(offer.keywords) ? offer.keywords : []),
  ];

  const hasDirectMatch = directTerms.some(
    (term) =>
      containsPhrase(leadText, term) ||
      conditionMatches(leadText, term, 0.85)
  );

  if (hasDirectMatch) {
    return 30;
  }

  const leadGroupIndex = findRelatedGroupIndex(leadText);
  const offerGroupIndex = findRelatedGroupIndex(directTerms.join(" "));

  if (
    leadGroupIndex !== -1 &&
    offerGroupIndex !== -1 &&
    leadGroupIndex === offerGroupIndex
  ) {
    return 20;
  }

  const highestCoverage = directTerms.reduce(
    (highest, term) =>
      Math.max(highest, tokenCoverage(leadText, term)),
    0
  );

  return highestCoverage >= 0.3 ? 10 : 0;
}

function calculateBusinessTypeFit(lead, offer) {
  const businessType = normalize(lead.business_type);
  const bestFor = Array.isArray(offer.best_for)
    ? offer.best_for
    : [];

  if (!businessType) {
    return 0;
  }

  const directMatch = bestFor.some((item) => {
    const normalizedItem = normalize(item);

    return (
      normalizedItem === businessType ||
      normalizedItem.includes(businessType) ||
      businessType.includes(normalizedItem)
    );
  });

  if (directMatch) {
    return 20;
  }

  const relatedMatch = bestFor.some(
    (item) => tokenCoverage(businessType, item) >= 0.5
  );

  if (relatedMatch) {
    return 15;
  }

  const genericIndicators = [
    "small business",
    "small brand",
    "local brand",
    "early stage lead",
    "business with unclear marketing need",
  ];

  const genericMatch = bestFor.some((item) =>
    genericIndicators.some(
      (indicator) =>
        normalize(item).includes(normalize(indicator)) ||
        normalize(indicator).includes(normalize(item))
    )
  );

  return genericMatch ? 10 : 0;
}

function calculateBudgetFit(lead, offer) {
  const leadBudget = parseMoneyRange(lead.budget_range);
  const offerBudget = parseMoneyRange(offer.price_range);

  if (leadBudget.missing) {
    return 5;
  }

  if (
    leadBudget.min !== null &&
    leadBudget.max !== null &&
    offerBudget.min !== null &&
    offerBudget.max !== null
  ) {
    const overlaps =
      leadBudget.max >= offerBudget.min &&
      leadBudget.min <= offerBudget.max;

    if (overlaps) {
      return 20;
    }

    if (leadBudget.max < offerBudget.min) {
      return 0;
    }

    return 10;
  }

  const signal = normalize(offer.minimum_budget_signal);
  const leadMaximum = leadBudget.max;

  if (leadMaximum === null) {
    return 10;
  }

  if (signal === "high") {
    return leadMaximum >= 5 ? 20 : 0;
  }

  if (signal === "medium") {
    return leadMaximum >= 2 ? 20 : 0;
  }

  if (signal === "low") {
    return 20;
  }

  return 10;
}

function calculateTimelineFit(lead) {
  const timeline = normalize(lead.timeline);

  if (
    !timeline ||
    timeline.includes("tidak disebutkan") ||
    timeline.includes("not mentioned")
  ) {
    return 0;
  }

  if (
    timeline.includes("belum pasti") ||
    timeline.includes("unclear") ||
    timeline.includes("not decided")
  ) {
    return 3;
  }

  if (timeline.includes("bulan depan")) {
    return 7;
  }

  const nearTermIndicators = [
    "secepatnya",
    "segera",
    "bulan ini",
    "minggu depan",
    "2 minggu lagi",
    "dua minggu lagi",
    "as soon as possible",
    "this month",
    "next week",
  ];

  return nearTermIndicators.some((indicator) =>
    timeline.includes(normalize(indicator))
  )
    ? 10
    : 3;
}

function calculateLeadQualityFit(qualification) {
  const mapping = {
    hot: 10,
    warm: 7,
    cold: 3,
    needs_review: 0,
  };

  const category = normalize(
    qualification.lead_category
  ).replace(/ /g, "_");

  return mapping[category] ?? 0;
}

function calculateContextReadiness(
  lead,
  offer,
  serviceScore,
  budgetScore,
  timelineScore
) {
  const requiredContext = Array.isArray(offer.required_context)
    ? offer.required_context
    : [];

  if (requiredContext.length === 0) {
    return {
      score: 10,
      missing: [],
    };
  }

  const availableContextText = normalize(
    JSON.stringify({
      ...lead,
      context: lead.context ?? {},
      additional_context: lead.additional_context ?? {},
    })
  );

  const available = requiredContext.filter((requirement) =>
    conditionMatches(availableContextText, requirement, 0.75)
  );

  const missing = requiredContext.filter(
    (requirement) =>
      !conditionMatches(availableContextText, requirement, 0.75)
  );

  const availabilityRatio =
    available.length / requiredContext.length;

  if (availabilityRatio >= 0.6) {
    return {
      score: 10,
      missing,
    };
  }

  if (
    serviceScore === 30 &&
    budgetScore >= 10 &&
    timelineScore >= 7
  ) {
    return {
      score: 5,
      missing,
    };
  }

  return {
    score: 0,
    missing,
  };
}

function confidenceFromScore(score) {
  if (score >= 80) {
    return "high";
  }

  if (score >= 50) {
    return "medium";
  }

  return "low";
}

function calculateCandidate(lead, qualification, offer) {
  const serviceInterestMatch =
    calculateServiceInterestMatch(lead, offer);

  const businessTypeFit =
    calculateBusinessTypeFit(lead, offer);

  const budgetFit =
    calculateBudgetFit(lead, offer);

  const timelineFit =
    calculateTimelineFit(lead);

  const leadQualityFit =
    calculateLeadQualityFit(qualification);

  const contextResult = calculateContextReadiness(
    lead,
    offer,
    serviceInterestMatch,
    budgetFit,
    timelineFit
  );

  const matchedSignals = {
    service_interest_match: serviceInterestMatch,
    business_type_fit: businessTypeFit,
    budget_fit: budgetFit,
    timeline_fit: timelineFit,
    lead_quality_fit: leadQualityFit,
    required_context_readiness: contextResult.score,
  };

  const recommendationScore = Object.values(
    matchedSignals
  ).reduce((total, value) => total + value, 0);

  return {
    offer,
    matched_signals: matchedSignals,
    recommendation_score: recommendationScore,
    recommendation_confidence:
      confidenceFromScore(recommendationScore),
    missing_recommendation_context: contextResult.missing,
  };
}

function compareCandidates(a, b) {
  const comparisons = [
    b.recommendation_score - a.recommendation_score,
    b.matched_signals.service_interest_match -
      a.matched_signals.service_interest_match,
    b.matched_signals.budget_fit -
      a.matched_signals.budget_fit,
    b.matched_signals.business_type_fit -
      a.matched_signals.business_type_fit,
    b.matched_signals.required_context_readiness -
      a.matched_signals.required_context_readiness,
    a.missing_recommendation_context.length -
      b.missing_recommendation_context.length,
  ];

  for (const comparison of comparisons) {
    if (comparison !== 0) {
      return comparison;
    }
  }

  return String(a.offer.offer_id).localeCompare(
    String(b.offer.offer_id)
  );
}

function hasSameDecisionProfile(a, b) {
  if (!a || !b) {
    return false;
  }

  return (
    a.recommendation_score === b.recommendation_score &&
    a.matched_signals.service_interest_match ===
      b.matched_signals.service_interest_match &&
    a.matched_signals.business_type_fit ===
      b.matched_signals.business_type_fit &&
    a.matched_signals.budget_fit ===
      b.matched_signals.budget_fit &&
    a.matched_signals.timeline_fit ===
      b.matched_signals.timeline_fit &&
    a.matched_signals.lead_quality_fit ===
      b.matched_signals.lead_quality_fit &&
    a.matched_signals.required_context_readiness ===
      b.matched_signals.required_context_readiness &&
    a.missing_recommendation_context.length ===
      b.missing_recommendation_context.length &&
    String(a.offer.offer_id) !== String(b.offer.offer_id)
  );
}

function resolveCatalogDefaultAction(value) {
  const normalizedValue = normalize(value).replace(/ /g, "_");

  if (ALLOWED_OFFER_ACTIONS.has(normalizedValue)) {
    return normalizedValue;
  }

  if (normalizedValue === "clarify_scope_before_offer") {
    return "ask_discovery_before_package";
  }

  return "";
}

function leadRequestsPortfolio(lead) {
  const text = normalize(
    `${lead.service_interest ?? ""} ${lead.message ?? ""}`
  );

  return [
    "portfolio",
    "example",
    "examples",
    "previous work",
    "sample work",
    "contoh karya",
  ].some((term) => text.includes(normalize(term)));
}

function determineOfferAction(lead, candidate) {
  const confidence = candidate.recommendation_confidence;
  const signals = candidate.matched_signals;
  const defaultAction = resolveCatalogDefaultAction(
    candidate.offer.default_offer_action
  );

  if (confidence === "low") {
    return "manual_review_required";
  }

  if (signals.budget_fit === 0) {
    return "clarify_budget_before_offer";
  }

  if (leadRequestsPortfolio(lead)) {
    return "share_portfolio_first";
  }

  if (
    confidence === "high" &&
    signals.required_context_readiness === 10
  ) {
    return "recommend_offer";
  }

  if (
    signals.timeline_fit === 0 &&
    signals.budget_fit >= 10 &&
    signals.required_context_readiness < 10
  ) {
    return "clarify_timeline_before_offer";
  }

  if (
    (confidence === "high" || confidence === "medium") &&
    signals.required_context_readiness < 10
  ) {
    return defaultAction || "ask_discovery_before_package";
  }

  return defaultAction || "ask_discovery_before_package";
}

function buildRiskFlags(candidate) {
  const flags = [];
  const signals = candidate.matched_signals;

  if (
    candidate.recommendation_confidence === "medium" &&
    (
      signals.required_context_readiness === 0 ||
      candidate.missing_recommendation_context.length > 0
    )
  ) {
    flags.push("recommendation_needs_review");
  }

  if (candidate.recommendation_confidence === "low") {
    flags.push(
      "low_recommendation_confidence",
      "recommendation_needs_review",
      "manual_review_required"
    );
  }

  if (signals.budget_fit === 0) {
    flags.push("offer_budget_mismatch");
  }

  return sanitizeRiskFlags(flags);
}

function isMissingValue(value) {
  const text = normalize(value);

  return (
    !text ||
    text.includes("tidak disebutkan") ||
    text.includes("belum ada") ||
    text.includes("not mentioned")
  );
}

function buildRecommendationReason(lead, candidate) {
  const businessType =
    String(lead.business_type ?? "").trim() || "customer";

  const serviceInterest =
    String(lead.service_interest ?? "").trim() ||
    "the requested service";

  const offerName = String(
    candidate.offer.offer_name
  ).trim();

  if (
    isMissingValue(lead.budget_range) ||
    isMissingValue(lead.timeline)
  ) {
    return `The lead is a ${businessType} asking about ${serviceInterest}. Because the budget, timeline, or required discovery context is still incomplete, ${offerName} is the safest catalog direction before a fixed package is recommended.`;
  }

  return `The lead is a ${businessType} asking for ${serviceInterest} with a clear budget and timeline, making ${offerName} the strongest catalog match.`;
}

/* -------------------------------------------------------------------------- */
/* Main execution                                                             */
/* -------------------------------------------------------------------------- */

const lead = isObject(input.lead)
  ? input.lead
  : {};

const qualification = isObject(input.qualification)
  ? input.qualification
  : {};

const catalog = Array.isArray(input.catalog)
  ? input.catalog
  : [];

if (
  !lead.lead_id ||
  !qualification.lead_category ||
  catalog.length === 0
) {
  return [
    {
      json: fallbackOutput(
        lead,
        "The system cannot safely recommend an offer because the merged recommendation input is incomplete."
      ),
    },
  ];
}

const validCatalog = catalog.filter(
  (offer) =>
    isObject(offer) &&
    offer.offer_id &&
    offer.offer_name &&
    offer.category
);

if (validCatalog.length === 0) {
  return [
    {
      json: fallbackOutput(
        lead,
        "The system cannot safely recommend an offer because the service catalog contains no valid offers."
      ),
    },
  ];
}

const candidates = validCatalog
  .map((offer) =>
    calculateCandidate(lead, qualification, offer)
  )
  .filter(
    (candidate) =>
      candidate.matched_signals.service_interest_match > 0
  )
  .sort(compareCandidates);

if (candidates.length === 0) {
  return [
    {
      json: fallbackOutput(
        lead,
        "The system cannot safely recommend an offer because no catalog service matches the lead inquiry.",
        ["catalog_match_unclear"]
      ),
    },
  ];
}

const selected = candidates[0];
const secondCandidate = candidates[1];

if (hasSameDecisionProfile(selected, secondCandidate)) {
  return [
    {
      json: fallbackOutput(
        lead,
        "The system cannot safely select one offer because multiple catalog offers have an identical recommendation profile.",
        ["catalog_match_unclear"]
      ),
    },
  ];
}

const offerAction = determineOfferAction(
  lead,
  selected
);

const riskFlags = buildRiskFlags(selected);

const leadId = String(lead.lead_id);

const customerId =
  String(lead.customer_id ?? "") ||
  deriveCustomerId(leadId);

if (!customerId) {
  riskFlags.push("manual_review_required");
}

const result = {
  customer_id: customerId,
  lead_id: leadId,
  recommended_offer_id: String(
    selected.offer.offer_id
  ),
  recommended_offer_name: String(
    selected.offer.offer_name
  ),
  recommended_offer_category: String(
    selected.offer.category
  ),
  recommendation_score:
    selected.recommendation_score,
  recommendation_confidence:
    selected.recommendation_confidence,
  recommendation_method: "rule_based",
  recommendation_reason:
    buildRecommendationReason(lead, selected),
  offer_action: offerAction,
  matched_signals: selected.matched_signals,
  missing_recommendation_context:
    selected.missing_recommendation_context,
  recommendation_risk_flags:
    sanitizeRiskFlags(riskFlags),
  requires_human_review: true,
};

const calculatedTotal = Object.values(
  result.matched_signals
).reduce(
  (total, value) => total + value,
  0
);

const catalogIdentityValid =
  result.recommended_offer_id ===
    String(selected.offer.offer_id) &&
  result.recommended_offer_name ===
    String(selected.offer.offer_name) &&
  result.recommended_offer_category ===
    String(selected.offer.category);

const outputValid =
  calculatedTotal === result.recommendation_score &&
  catalogIdentityValid &&
  result.requires_human_review === true &&
  ALLOWED_OFFER_ACTIONS.has(result.offer_action);

if (!outputValid) {
  return [
    {
      json: fallbackOutput(
        lead,
        "The recommendation calculation completed, but final output validation failed.",
        ["manual_review_required"]
      ),
    },
  ];
}

return [
  {
    json: result,
  },
];