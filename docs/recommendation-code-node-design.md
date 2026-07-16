# Deterministic Recommendation Code Node Design — AI Sales Recommendation & Follow-Up Assistant for UMKM

## Purpose

This document defines the deterministic n8n Code Node design for the rule-based recommendation layer of the AI Sales Recommendation & Follow-Up Assistant for UMKM.

The Code Node calculates recommendation scores using explicit application rules.

It does not depend on generative AI to:

- calculate scores
- rank service offers
- select an offer
- determine confidence
- validate catalog identity
- apply tie-breaking rules

Generative AI may later be used to:

- explain the selected recommendation
- convert missing context into natural discovery questions
- draft a follow-up message
- improve language quality

The AI must not change the offer selected by the deterministic Code Node.

---

## Engineering Objective

The Code Node must convert this input:

```text
normalized lead
+ validated lead qualification
+ service catalog
```

Into this output:

```text
catalog-grounded recommendation
+ matched-signal scores
+ confidence
+ offer action
+ missing context
+ risk flags
+ mandatory human review
```

The result must conform to:

```text
docs/recommendation-output-schema.md
```

---

## Why Move Recommendation Logic Into Code?

The Recommendation Node prompt can simulate deterministic scoring, but a language model can still produce inconsistent calculations.

Moving recommendation decisions into a Code Node provides:

- repeatable results
- explicit formulas
- predictable scoring
- catalog-grounded selection
- testable tie-breaking
- easier debugging
- lower hallucination risk
- clearer audit trail
- stronger separation of responsibilities

The target responsibility split is:

```text
Code Node
-> calculate scores
-> rank catalog offers
-> select the offer
-> determine confidence
-> apply safety rules

AI Explanation Node
-> explain the selected offer
-> generate discovery questions
-> draft the follow-up message

QA Node
-> validate structure
-> validate catalog identity
-> validate score calculation
-> validate human-review safety
```

---

# 1. Architecture Position

The deterministic recommendation Code Node should be positioned here:

```text
Manual Trigger / Google Form
-> Normalize Lead Input
-> Lead Qualification
-> Load Service Catalog
-> Merge Recommendation Input
-> Deterministic Recommendation Code Node
-> Recommendation Validation
-> AI Recommendation Explanation
-> Follow-Up Drafting
-> QA Guard
-> Google Sheet Tracker
-> Owner Review
```

Recommended node name:

```text
Calculate Rule-Based Recommendation
```

---

# 2. n8n Node Configuration

Recommended configuration:

```text
Node Type:
Code

Mode:
Run Once for All Items

Language:
JavaScript

Input:
One merged item containing lead, qualification, and catalog

Output:
One recommendation JSON item

Continue on Fail:
Disabled

Retry on Fail:
Not required for deterministic calculation

Error Route:
Manual Review Fallback
```

---

# 3. Input Contract

The Code Node expects one merged object:

```json
{
  "lead": {
    "lead_id": "L001",
    "customer_id": "C001",
    "customer_name": "Dinda",
    "business_type": "Skincare Brand",
    "source": "Instagram DM",
    "service_interest": "Social Media Management",
    "budget_range": "2-3 juta/bulan",
    "timeline": "Bulan ini",
    "message": "Kak bisa bantu kelola IG brand skincare aku?",
    "created_at": "2026-07-10"
  },
  "qualification": {
    "lead_category": "hot",
    "lead_score": 90,
    "priority": "high",
    "score_breakdown": {
      "budget_clarity": 25,
      "timeline_urgency": 20,
      "service_clarity": 25,
      "buying_intent": 20
    },
    "missing_information": []
  },
  "catalog": [
    {
      "offer_id": "SVC002",
      "offer_name": "Monthly Social Media Management",
      "category": "social_media_management",
      "keywords": [
        "social media management",
        "kelola instagram",
        "manage instagram"
      ],
      "best_for": [
        "skincare brand",
        "restaurant",
        "fashion brand"
      ],
      "price_range": "2-5 juta/bulan",
      "minimum_budget_signal": "medium",
      "ideal_lead_category": [
        "hot",
        "warm"
      ],
      "required_context": [
        "current Instagram account",
        "monthly content target",
        "brand style preference"
      ],
      "recommended_when": [
        "lead asks for Instagram management"
      ],
      "not_recommended_when": [
        "lead only needs one-time feed design"
      ],
      "default_offer_action": "ask_discovery_before_package"
    }
  ]
}
```

---

# 4. Input Validation

Before calculating recommendations, validate that:

1. Input is an object.
2. `lead` is an object.
3. `qualification` is an object.
4. `catalog` is an array.
5. `lead.lead_id` is available.
6. `qualification.lead_category` is available.
7. The catalog contains at least one offer.
8. Every catalog offer has:
   - `offer_id`
   - `offer_name`
   - `category`

If validation fails, return fallback output.

---

# 5. Identifier Preservation

## Lead ID

Use:

```text
lead.lead_id
```

The Code Node must not modify it.

## Customer ID

Use:

```text
lead.customer_id
```

If it is missing, derive it only when `lead_id` follows this stable pattern:

```text
L001 -> C001
L006 -> C006
```

If customer ID cannot be safely preserved or derived:

- return an empty customer ID
- add `manual_review_required`
- preserve human review

---

# 6. Deterministic Scoring Model

Each catalog offer receives six scores.

| Signal | Maximum |
|---|---:|
| service_interest_match | 30 |
| business_type_fit | 20 |
| budget_fit | 20 |
| timeline_fit | 10 |
| lead_quality_fit | 10 |
| required_context_readiness | 10 |
| **Total** | **100** |

Formula:

```text
recommendation_score =
service_interest_match
+ business_type_fit
+ budget_fit
+ timeline_fit
+ lead_quality_fit
+ required_context_readiness
```

---

# 7. Text Normalization

All text matching must be case-insensitive.

Normalization should:

- convert values into strings
- convert text to lowercase
- remove accent marks
- convert underscores and hyphens into spaces
- remove unsupported punctuation
- collapse duplicate spaces
- trim whitespace

Examples:

```text
Social_Media-Management
-> social media management
```

```text
KELola Instagram
-> kelola instagram
```

Normalization prevents capitalization and formatting differences from affecting the recommendation score.

---

# 8. Service Interest Match

Compare lead text:

```text
lead.service_interest
lead.message
```

Against catalog fields:

```text
offer.category
offer.keywords
offer.recommended_when
offer.not_recommended_when
```

Scoring:

| Condition | Score |
|---|---:|
| Direct category or keyword match | 30 |
| Related service category | 20 |
| Weak but meaningful token overlap | 10 |
| No meaningful relationship | 0 |

Direct examples:

```text
Social Media Management
-> Monthly Social Media Management
-> 30
```

```text
Product Photography
-> Product Photography Starter
-> 30
```

```text
Marketing Consultation
-> Marketing Discovery Consultation
-> 30
```

A catalog offer with:

```text
service_interest_match = 0
```

must not be selected as the final recommendation.

---

# 9. Related Service Groups

Related service matching may use deterministic synonym groups.

Example groups:

```text
social media management
instagram management
content management
kelola instagram
```

```text
feed design
instagram design
visual design
social media design
```

```text
launch content
campaign
rebranding
brand launch
product launch
```

```text
landing page
website
sales page
registration page
```

```text
event content
wedding content
event documentation
```

```text
marketing consultation
marketing help
jasa marketing
business consultation
```

```text
lead generation
buyer campaign
ads campaign
sales campaign
```

```text
product photography
foto produk
catalog photo
marketplace photo
```

```text
website strategy
content strategy
website and content
```

If lead and offer terms belong to the same group but do not directly match:

```text
service_interest_match = 20
```

---

# 10. Business Type Fit

Compare:

```text
lead.business_type
```

Against:

```text
offer.best_for
```

Scoring:

| Condition | Score |
|---|---:|
| Direct business-type match | 20 |
| Closely related business type | 15 |
| Generic small-business fit | 10 |
| Poor fit | 0 |

Examples:

```text
Skincare Brand
-> best_for contains skincare brand
-> 20
```

```text
Local Gym
-> consultation best_for contains local gym
-> 20
```

Generic indicators may include:

```text
small business
local brand
small brand
early-stage lead
business with unclear marketing need
```

The generic score must not override a clear conflicting business fit.

---

# 11. Budget Parsing

The Code Node should normalize budget values into an approximate range measured in millions of Indonesian rupiah.

Examples:

```text
2-3 juta/bulan
-> minimum = 2
-> maximum = 3
```

```text
5 juta/bulan
-> minimum = 5
-> maximum = 5
```

```text
Di bawah 1 juta
-> minimum = 0
-> maximum = 1
```

```text
Tidak disebutkan
-> missing = true
```

```text
Belum ada budget
-> missing = true
```

Catalog examples:

```text
2-5 juta/bulan
-> minimum = 2
-> maximum = 5
```

```text
5-10 juta/project
-> minimum = 5
-> maximum = 10
```

```text
project-based
-> numeric range unavailable
```

---

# 12. Budget Fit

Scoring:

| Condition | Score |
|---|---:|
| Lead and offer ranges overlap | 20 |
| Budget may fit but numeric comparison is incomplete | 10 |
| Budget is missing | 5 |
| Lead budget is clearly below the offer minimum | 0 |

Rules:

- Missing budget must not produce a score above 5.
- A clear mismatch must add `offer_budget_mismatch`.
- A higher customer budget may still fit a lower-priced service.
- Non-numeric catalog prices should use `minimum_budget_signal`.

Minimum budget signal guidance:

| Signal | Approximate Requirement |
|---|---|
| low | low-budget offer |
| medium | approximately 2 juta or above |
| high | approximately 5 juta or above |
| unknown | requires clarification |

---

# 13. Timeline Fit

Scoring:

| Lead Timeline | Score |
|---|---:|
| Secepatnya | 10 |
| Segera | 10 |
| Bulan ini | 10 |
| Minggu depan | 10 |
| 2 minggu lagi | 10 |
| Bulan depan | 7 |
| Belum pasti | 3 |
| Tidak disebutkan | 0 |

Rules:

- Do not infer urgency.
- Missing timeline must receive 0.
- Unclear timeline may receive 3.
- Timeline scoring must remain independent from lead qualification scoring.

---

# 14. Lead Quality Fit

Use the validated qualification output.

| Lead Category | Score |
|---|---:|
| hot | 10 |
| warm | 7 |
| cold | 3 |
| needs_review | 0 |

Source of truth:

```text
qualification.lead_category
```

The Code Node must not silently recalculate or change the lead category.

---

# 15. Required Context Readiness

Compare the available lead context against:

```text
offer.required_context
```

Scoring:

| Condition | Score |
|---|---:|
| Most required context is available | 10 |
| Core offer fit is clear but discovery details are missing | 5 |
| Critical commercial or diagnostic context is missing | 0 |

Deterministic policy:

```text
If at least 60% of required context is available:
-> 10

Else if:
service_interest_match = 30
AND budget_fit >= 10
AND timeline_fit >= 7
-> 5

Else:
-> 0
```

This produces the expected difference between the main test cases:

```text
L001
-> service fit is direct
-> budget is clear
-> timeline is clear
-> operational discovery context is incomplete
-> readiness = 5
```

```text
L006
-> service direction exists
-> budget is missing
-> timeline is missing
-> business goal and marketing problem are missing
-> readiness = 0
```

All missing catalog context should be returned in:

```text
missing_recommendation_context
```

---

# 16. Candidate Ranking

Calculate all six signals for every catalog offer.

Each candidate should internally contain:

```json
{
  "offer": {},
  "matched_signals": {
    "service_interest_match": 0,
    "business_type_fit": 0,
    "budget_fit": 0,
    "timeline_fit": 0,
    "lead_quality_fit": 0,
    "required_context_readiness": 0
  },
  "recommendation_score": 0,
  "missing_recommendation_context": []
}
```

Sort candidates using this order:

```text
1. Higher recommendation score
2. Higher service interest match
3. Higher budget fit
4. Higher business type fit
5. Higher required context readiness
6. Fewer missing context items
7. Offer ID in ascending lexical order
```

---

# 17. Ambiguous Tie Handling

The Code Node must not select arbitrarily when two offers have an identical decision profile.

An unresolved tie exists when the top candidates have:

- the same total score
- the same six matched-signal values
- the same missing-context count
- different offer IDs

In this case:

```text
recommendation_method = fallback
recommendation_confidence = review
offer_action = manual_review_required
```

Risk flags:

```text
catalog_match_unclear
recommendation_needs_review
manual_review_required
```

---

# 18. Recommendation Confidence

| Score | Confidence |
|---|---|
| 80–100 | high |
| 50–79 | medium |
| 0–49 | low |
| unsafe or fallback | review |

Confidence must always be calculated from the final score.

It must not be generated based on intuition.

---

# 19. Offer Action Policy

Allowed values:

```text
recommend_offer
ask_discovery_before_package
clarify_budget_before_offer
clarify_timeline_before_offer
share_portfolio_first
manual_review_required
```

Decision order:

## Manual Review

Use:

```text
manual_review_required
```

when:

- confidence is low
- recommendation is unsafe
- catalog match is unresolved
- the selected offer does not have a service match
- fallback is used

## Budget Clarification

Use:

```text
clarify_budget_before_offer
```

when:

- the selected service is directionally relevant
- budget clearly conflicts or needs commercial clarification
- the offer should not yet be presented as final

## Portfolio First

Use:

```text
share_portfolio_first
```

when the lead explicitly asks for:

```text
portfolio
examples
previous work
sample work
```

## Direct Recommendation

Use:

```text
recommend_offer
```

only when:

- confidence is high
- required context readiness is 10
- no important risk exists

## Discovery Before Package

Use:

```text
ask_discovery_before_package
```

when:

- confidence is high or medium
- the catalog match is valid
- context readiness is below 10
- a discovery conversation is safer

## Timeline Clarification

Use:

```text
clarify_timeline_before_offer
```

when:

- service and budget are sufficiently clear
- the timeline is missing
- timeline is essential to delivery planning

---

# 20. Catalog Action Compatibility Guard

The Code Node must only return offer actions defined by the recommendation output schema.

If a catalog entry contains an unsupported `default_offer_action`, the value must not pass directly into the output.

Example:

```text
Unsupported catalog action:
clarify_scope_before_offer
```

Safe mapping:

```text
clarify_scope_before_offer
-> ask_discovery_before_package
```

This prevents catalog metadata from breaking the output contract.

---

# 21. Recommendation Risk Flags

Allowed values:

```text
low_recommendation_confidence
insufficient_interaction_data
cold_start_customer
cold_start_offer
offer_budget_mismatch
recommendation_needs_review
catalog_match_unclear
manual_review_required
```

Current rule-based policy:

## High Confidence

Risk flags may remain empty when:

- catalog match is clear
- score is valid
- there is no budget conflict
- discovery action is safe

## Medium Confidence

Add:

```text
recommendation_needs_review
```

when critical context remains incomplete.

## Low Confidence

Add:

```text
low_recommendation_confidence
recommendation_needs_review
manual_review_required
```

## Budget Mismatch

Add:

```text
offer_budget_mismatch
```

## Unresolved Catalog Match

Add:

```text
catalog_match_unclear
recommendation_needs_review
manual_review_required
```

Do not use collaborative-filtering-specific flags in the rule-based MVP unless they are genuinely relevant.

---

# 22. Recommendation Reason Generation

The deterministic Code Node should generate a short grounded reason.

When budget and timeline are available:

```text
The lead is a {business_type} asking for {service_interest} with a clear budget and timeline, making {offer_name} the strongest catalog match.
```

When budget and timeline are missing:

```text
The lead is a {business_type} asking about {service_interest}. Because the budget, timeline, and required discovery context are still incomplete, {offer_name} is the safest catalog direction before a fixed package is recommended.
```

The Code Node must not claim:

- previous customer behavior
- customer ratings
- prior purchases
- guaranteed suitability
- guaranteed sales
- guaranteed conversion

An AI Explanation Node may later improve the wording but must not change the selected offer or score.

---

# 23. Required Output

Normal recommendation output:

```json
{
  "customer_id": "",
  "lead_id": "",
  "recommended_offer_id": "",
  "recommended_offer_name": "",
  "recommended_offer_category": "",
  "recommendation_score": 0,
  "recommendation_confidence": "high",
  "recommendation_method": "rule_based",
  "recommendation_reason": "",
  "offer_action": "ask_discovery_before_package",
  "matched_signals": {
    "service_interest_match": 0,
    "business_type_fit": 0,
    "budget_fit": 0,
    "timeline_fit": 0,
    "lead_quality_fit": 0,
    "required_context_readiness": 0
  },
  "missing_recommendation_context": [],
  "recommendation_risk_flags": [],
  "requires_human_review": true
}
```

---

# 24. Fallback Output

```json
{
  "customer_id": "",
  "lead_id": "",
  "recommended_offer_id": "",
  "recommended_offer_name": "",
  "recommended_offer_category": "",
  "recommendation_score": null,
  "recommendation_confidence": "review",
  "recommendation_method": "fallback",
  "recommendation_reason": "The system cannot safely recommend an offer because the input is incomplete or no reliable catalog match is available.",
  "offer_action": "manual_review_required",
  "matched_signals": {
    "service_interest_match": 0,
    "business_type_fit": 0,
    "budget_fit": 0,
    "timeline_fit": 0,
    "lead_quality_fit": 0,
    "required_context_readiness": 0
  },
  "missing_recommendation_context": [],
  "recommendation_risk_flags": [
    "recommendation_needs_review",
    "manual_review_required"
  ],
  "requires_human_review": true
}
```

---

# 25. Executable n8n Code Node Reference

The following JavaScript is the target executable reference for the n8n Code Node.

```javascript
const input = $input.first()?.json ?? {};

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

function deriveCustomerId(leadId) {
  const match = String(leadId ?? "").match(/^L(\d+)$/i);
  return match ? `C${match[1]}` : "";
}

function fallbackOutput(lead, reason, extraFlags = [], missingContext = []) {
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
    missing_recommendation_context: missingContext,
    recommendation_risk_flags: unique([
      "recommendation_needs_review",
      "manual_review_required",
      ...extraFlags,
    ]),
    requires_human_review: true,
  };
}

const lead = isObject(input.lead) ? input.lead : {};
const qualification = isObject(input.qualification)
  ? input.qualification
  : {};
const catalog = Array.isArray(input.catalog) ? input.catalog : [];

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

const stopWords = new Set([
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

function tokens(value) {
  return normalize(value)
    .split(" ")
    .filter((token) => token && !stopWords.has(token));
}

function containsPhrase(text, phrase) {
  const normalizedText = normalize(text);
  const normalizedPhrase = normalize(phrase);

  return Boolean(
    normalizedPhrase &&
      normalizedText &&
      normalizedText.includes(normalizedPhrase)
  );
}

function tokenCoverage(text, phrase) {
  const textTokens = new Set(tokens(text));
  const phraseTokens = tokens(phrase);

  if (phraseTokens.length === 0) {
    return 0;
  }

  const matched = phraseTokens.filter((token) =>
    textTokens.has(token)
  ).length;

  return matched / phraseTokens.length;
}

function conditionMatches(text, condition, threshold = 0.75) {
  return (
    containsPhrase(text, condition) ||
    tokenCoverage(text, condition) >= threshold
  );
}

const relatedServiceGroups = [
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

function findRelatedGroup(text) {
  const normalizedText = normalize(text);

  return relatedServiceGroups.find((group) =>
    group.some((term) => normalizedText.includes(normalize(term)))
  );
}

function calculateServiceInterestMatch(offer) {
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

  const leadGroup = findRelatedGroup(leadText);
  const offerGroup = findRelatedGroup(directTerms.join(" "));

  if (leadGroup && offerGroup && leadGroup === offerGroup) {
    return 20;
  }

  const highestCoverage = directTerms.reduce(
    (highest, term) =>
      Math.max(highest, tokenCoverage(leadText, term)),
    0
  );

  if (highestCoverage >= 0.3) {
    return 10;
  }

  return 0;
}

function calculateBusinessTypeFit(offer) {
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

function calculateBudgetFit(offer) {
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

function calculateTimelineFit() {
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

  if (
    nearTermIndicators.some((indicator) =>
      timeline.includes(normalize(indicator))
    )
  ) {
    return 10;
  }

  return 3;
}

function calculateLeadQualityFit() {
  const mapping = {
    hot: 10,
    warm: 7,
    cold: 3,
    needs_review: 0,
  };

  return mapping[normalize(qualification.lead_category).replace(/ /g, "_")] ?? 0;
}

function calculateContextReadiness(
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

function calculateCandidate(offer) {
  const serviceInterestMatch =
    calculateServiceInterestMatch(offer);

  const businessTypeFit =
    calculateBusinessTypeFit(offer);

  const budgetFit =
    calculateBudgetFit(offer);

  const timelineFit =
    calculateTimelineFit();

  const leadQualityFit =
    calculateLeadQualityFit();

  const contextResult = calculateContextReadiness(
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

const candidates = validCatalog
  .map(calculateCandidate)
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

const allowedOfferActions = new Set([
  "recommend_offer",
  "ask_discovery_before_package",
  "clarify_budget_before_offer",
  "clarify_timeline_before_offer",
  "share_portfolio_first",
  "manual_review_required",
]);

function resolveCatalogDefaultAction(value) {
  const normalizedValue = normalize(value).replace(/ /g, "_");

  if (allowedOfferActions.has(normalizedValue)) {
    return normalizedValue;
  }

  if (normalizedValue === "clarify_scope_before_offer") {
    return "ask_discovery_before_package";
  }

  return "";
}

function leadRequestsPortfolio() {
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

function determineOfferAction(candidate) {
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

  if (leadRequestsPortfolio()) {
    return "share_portfolio_first";
  }

  if (
    confidence === "high" &&
    signals.required_context_readiness === 10
  ) {
    return "recommend_offer";
  }

  if (
    (confidence === "high" || confidence === "medium") &&
    signals.required_context_readiness < 10
  ) {
    return defaultAction || "ask_discovery_before_package";
  }

  if (
    signals.timeline_fit === 0 &&
    signals.budget_fit >= 10
  ) {
    return "clarify_timeline_before_offer";
  }

  return defaultAction || "ask_discovery_before_package";
}

function buildRiskFlags(candidate) {
  const flags = [];
  const signals = candidate.matched_signals;

  if (candidate.recommendation_confidence === "medium") {
    if (
      signals.required_context_readiness === 0 ||
      candidate.missing_recommendation_context.length > 0
    ) {
      flags.push("recommendation_needs_review");
    }
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

  return unique(flags);
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

function buildRecommendationReason(candidate) {
  const businessType =
    String(lead.business_type ?? "").trim() || "customer";

  const serviceInterest =
    String(lead.service_interest ?? "").trim() ||
    "the requested service";

  const offerName = String(
    candidate.offer.offer_name
  ).trim();

  const budgetMissing = isMissingValue(lead.budget_range);
  const timelineMissing = isMissingValue(lead.timeline);

  if (budgetMissing || timelineMissing) {
    return `The lead is a ${businessType} asking about ${serviceInterest}. Because the budget, timeline, or required discovery context is still incomplete, ${offerName} is the safest catalog direction before a fixed package is recommended.`;
  }

  return `The lead is a ${businessType} asking for ${serviceInterest} with a clear budget and timeline, making ${offerName} the strongest catalog match.`;
}

const offerAction = determineOfferAction(selected);
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
    buildRecommendationReason(selected),
  offer_action: offerAction,
  matched_signals: selected.matched_signals,
  missing_recommendation_context:
    selected.missing_recommendation_context,
  recommendation_risk_flags: unique(riskFlags),
  requires_human_review: true,
};

const calculatedTotal = Object.values(
  result.matched_signals
).reduce((total, value) => total + value, 0);

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
  allowedOfferActions.has(result.offer_action);

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

return [{ json: result }];
```

---

# 26. Expected Test Result — L001

Input characteristics:

```text
Lead ID: L001
Customer ID: C001
Business Type: Skincare Brand
Service Interest: Social Media Management
Budget: 2-3 juta/bulan
Timeline: Bulan ini
Lead Category: hot
```

Expected result:

```text
Offer: SVC002
Recommendation Score: 95
Confidence: high
Method: rule_based
Action: ask_discovery_before_package
```

Expected signals:

```text
service_interest_match = 30
business_type_fit = 20
budget_fit = 20
timeline_fit = 10
lead_quality_fit = 10
required_context_readiness = 5
```

Calculation:

```text
30 + 20 + 20 + 10 + 10 + 5 = 95
```

Expected risk flags:

```json
[]
```

---

# 27. Expected Test Result — L006

Input characteristics:

```text
Lead ID: L006
Customer ID: C006
Business Type: Local Gym
Service Interest: Marketing Consultation
Budget: Tidak disebutkan
Timeline: Tidak disebutkan
Lead Category: cold
```

Expected result:

```text
Offer: SVC006
Recommendation Score: 58
Confidence: medium
Method: rule_based
Action: ask_discovery_before_package
```

Expected signals:

```text
service_interest_match = 30
business_type_fit = 20
budget_fit = 5
timeline_fit = 0
lead_quality_fit = 3
required_context_readiness = 0
```

Calculation:

```text
30 + 20 + 5 + 0 + 3 + 0 = 58
```

Expected risk flags:

```json
[
  "recommendation_needs_review"
]
```

---

# 28. Deterministic Test Assertions

For L001:

```text
result.lead_id === "L001"
result.customer_id === "C001"
result.recommended_offer_id === "SVC002"
result.recommendation_score === 95
result.recommendation_confidence === "high"
result.recommendation_method === "rule_based"
result.offer_action === "ask_discovery_before_package"
result.requires_human_review === true
```

For L006:

```text
result.lead_id === "L006"
result.customer_id === "C006"
result.recommended_offer_id === "SVC006"
result.recommendation_score === 58
result.recommendation_confidence === "medium"
result.recommendation_method === "rule_based"
result.offer_action === "ask_discovery_before_package"
result.recommendation_risk_flags includes "recommendation_needs_review"
result.requires_human_review === true
```

---

# 29. Failure Test Cases

The Code Node must also be tested against:

## Empty Catalog

Expected:

```text
recommendation_method = fallback
recommendation_confidence = review
offer_action = manual_review_required
```

## Missing Lead ID

Expected:

```text
fallback
manual_review_required
```

## Unknown Lead Category

Expected:

```text
lead_quality_fit = 0
```

If other matching remains unsafe:

```text
manual review
```

## No Service Match

Expected:

```text
catalog_match_unclear
fallback
manual_review_required
```

## Exact Candidate Tie

Expected:

```text
catalog_match_unclear
recommendation_needs_review
manual_review_required
```

## Budget Mismatch

Expected:

```text
budget_fit = 0
offer_budget_mismatch
clarify_budget_before_offer
```

---

# 30. Human-in-the-Loop Requirement

The Code Node must always return:

```json
{
  "requires_human_review": true
}
```

The Code Node must not:

- send customer messages
- approve recommendations
- modify customer records automatically
- set final pricing
- mark a recommendation as sent
- replace the owner decision

---

# 31. Current Scope

Included:

```text
rule-based service matching
deterministic scoring
catalog validation
confidence calculation
offer-action policy
risk flags
fallback handling
human-review preservation
```

Not included:

```text
interaction-based scoring
collaborative filtering calculation
rating matrix
adjusted cosine similarity
weighted-sum prediction
automatic customer messaging
```

Those capabilities belong to later engineering phases.

---

# 32. Definition of Done

This Code Node design is complete when it defines:

1. Code Node purpose
2. Architecture position
3. n8n configuration
4. Input contract
5. Input validation
6. Identifier preservation
7. Deterministic scoring model
8. Text normalization
9. Service-interest matching
10. Business-type matching
11. Budget parsing
12. Budget-fit scoring
13. Timeline scoring
14. Lead-quality scoring
15. Context-readiness scoring
16. Candidate ranking
17. Tie handling
18. Confidence mapping
19. Offer-action policy
20. Catalog action compatibility
21. Risk flag policy
22. Grounded recommendation reason
23. Output contract
24. Fallback output
25. Executable JavaScript reference
26. L001 expected result
27. L006 expected result
28. Deterministic assertions
29. Failure test cases
30. Human-review safety
31. Current scope boundaries
```