# Owner Notification Template — AI Sales Recommendation & Follow-Up Assistant for SME

## Purpose

This document defines the internal owner-notification templates for the AI Sales Recommendation & Follow-Up Assistant for SME.

The notification layer informs the business owner that:

- a new lead has been processed
- lead qualification has been completed
- a service recommendation has been generated
- a follow-up draft is available
- human review is required
- tracker persistence succeeded or failed
- the workflow requires owner intervention

The notification is internal.

It must not be sent to the customer.

---

## Core Safety Rule

Every notification must clearly communicate:

```text
The recommendation and follow-up message are drafts.
Human review is required before anything is sent to the customer.
```

The notification must never claim that:

```text
the customer message was already sent
the recommendation was automatically approved
the pricing was finalized
the lead accepted the offer
the system guaranteed conversion
```

---

# 1. Architecture Position

The owner notification should occur after tracker persistence.

```text
Lead Intake
-> Lead Qualification
-> Recommendation Engine
-> Follow-Up Drafting
-> JSON Validation
-> Google Sheet Mapping
-> Google Sheet Write
-> Owner Notification
-> Human Review
```

Normal notification path:

```text
tracker write succeeds
-> prepare owner notification
-> send internal notification
```

Failure notification path:

```text
tracker write fails
-> prepare persistence-failure alert
-> notify owner
-> do not claim that tracker storage succeeded
```

---

# 2. Notification Responsibility

The notification layer is responsible for:

1. Summarizing the lead.
2. Displaying lead qualification.
3. Displaying the recommended offer.
4. Displaying recommendation confidence.
5. Displaying missing information.
6. Displaying recommendation risk flags.
7. Displaying the proposed next action.
8. Displaying the follow-up draft when available.
9. Communicating the required owner action.
10. Preserving human review.
11. Reporting tracker-write status.
12. Avoiding duplicate notifications.

The notification layer is not responsible for:

- changing lead scores
- changing recommendation scores
- selecting a different offer
- editing customer records
- sending the follow-up message
- approving pricing
- marking the lead as contacted
- marking the message as sent

---

# 3. Supported Notification States

The MVP supports four owner-notification states.

```text
ready_for_review
needs_review
processing_failed
persistence_failed
```

---

## 3.1 Ready for Review

Use when:

```text
validation_status = passed
mapping_status = ready
tracker write succeeded
```

Meaning:

```text
The lead and recommendation are valid and ready for owner review.
```

---

## 3.2 Needs Review

Use when:

```text
validation_status = needs_review
or
mapping_status = needs_review
```

Meaning:

```text
The output is structurally valid, but important information is incomplete or risk flags require owner attention.
```

---

## 3.3 Processing Failed

Use when:

```text
validation_status = failed
validation_route = fallback_and_manual_review
```

Meaning:

```text
The system could not safely validate the generated output.
Manual inspection of the original lead is required.
```

---

## 3.4 Persistence Failed

Use when:

```text
Google Sheet write failed
or
partial_write_failure occurred
```

Meaning:

```text
The recommendation may have been generated successfully, but one or more tracker records were not stored correctly.
```

---

# 4. Notification Priority

Allowed priority values:

```text
high
medium
low
critical
```

Recommended mapping:

| Condition | Notification Priority |
|---|---|
| Hot lead, high-confidence recommendation | high |
| Warm lead or medium-confidence recommendation | medium |
| Cold lead without blocking errors | low |
| Validation failure | critical |
| Google Sheet persistence failure | critical |
| Human-review safety failure | critical |

---

# 5. Notification Output Contract

The notification preparation node should return:

```json
{
  "notification_id": "",
  "notification_type": "ready_for_review",
  "notification_priority": "high",
  "notification_title": "",
  "notification_summary": "",
  "notification_body": "",
  "lead_id": "",
  "customer_id": "",
  "recommendation_id": "",
  "owner_action": "",
  "tracker_write_status": "succeeded",
  "notification_channel": "internal",
  "notification_status": "ready_to_send",
  "idempotency_key": "",
  "requires_human_review": true
}
```

---

# 6. Allowed Notification Values

## Notification Type

```text
ready_for_review
needs_review
processing_failed
persistence_failed
```

## Notification Priority

```text
high
medium
low
critical
```

## Tracker Write Status

```text
succeeded
partial_failure
failed
not_attempted
```

## Notification Status

```text
ready_to_send
sent
failed
duplicate_skipped
```

## Notification Channel

Current generic value:

```text
internal
```

Future channels may include:

```text
email
telegram
slack
whatsapp_internal
discord
```

Channel configuration is outside the current MVP scope.

---

# 7. Required Notification Fields

Every owner notification must include:

```text
notification_type
notification_priority
lead_id
lead name
business type
service interest
lead category
lead score
recommended offer
recommendation score
recommendation confidence
offer action
human-review requirement
owner action
tracker-write status
```

Include these fields when available:

```text
budget
timeline
missing information
missing recommendation context
risk flags
follow-up draft
tracker row link
recommendation row link
```

---

# 8. Notification ID

Recommended format:

```text
NOTIF-{lead_id}-{notification_type}-{timestamp}
```

Example:

```text
NOTIF-L001-ready_for_review-20260716T103500000Z
```

---

# 9. Notification Idempotency Key

The workflow must prevent duplicate owner notifications.

Recommended idempotency key:

```text
lead_id
+ recommendation_id
+ notification_type
+ tracker_write_status
```

Example:

```text
L001|REC-L001-20260716T103000000Z|ready_for_review|succeeded
```

A retry with the same key should return:

```text
notification_status = duplicate_skipped
```

---

# 10. Owner Notification Timing

Send the normal owner notification only after:

```text
lead tracker write succeeded
and
recommendation tracker write succeeded
```

For partial persistence:

```text
do not send ready_for_review
send persistence_failed instead
```

The notification must not say:

```text
Saved successfully
```

unless both required tracker writes succeeded.

---

# 11. Message Formatting Principles

The notification should be:

- concise
- scannable
- factual
- grounded in validated output
- action-oriented
- explicit about human review
- free from sales hype
- free from fabricated information

Recommended structure:

```text
Status
Lead summary
Qualification
Recommendation
Missing context or risks
Draft follow-up
Required owner action
Tracker status
Safety reminder
```

---

# 12. Generic Notification Template

```text
[STATUS] New Lead Recommendation — {lead_id}

Lead:
- Name: {lead_name}
- Business: {business_type}
- Source: {source}
- Interest: {service_interest}
- Budget: {budget_range}
- Timeline: {timeline}

Qualification:
- Category: {lead_category}
- Score: {lead_score}/100
- Priority: {priority}

Recommendation:
- Offer: {recommended_offer_name}
- Offer ID: {recommended_offer_id}
- Score: {recommendation_score}/100
- Confidence: {recommendation_confidence}
- Method: {recommendation_method}
- Next action: {offer_action}

Reason:
{recommendation_reason}

Missing context:
{missing_recommendation_context}

Risk flags:
{recommendation_risk_flags}

Follow-up draft:
{follow_up_message}

Owner action:
{owner_action}

Tracker status:
{tracker_write_status}

Human review is required before any message is sent to the customer.
```

---

# 13. Ready-for-Review Template

Use when:

```text
notification_type = ready_for_review
```

## Suggested Title

```text
New Qualified Lead Ready for Review — {lead_id}
```

## Suggested Summary

```text
A validated lead and service recommendation have been stored and are ready for owner review.
```

## Template

```text
✅ NEW LEAD READY FOR REVIEW

Lead ID: {lead_id}
Lead: {lead_name}
Business: {business_type}
Source: {source}

Customer interest:
{service_interest}

Commercial context:
- Budget: {budget_range}
- Timeline: {timeline}

Lead qualification:
- Category: {lead_category}
- Score: {lead_score}/100
- Priority: {priority}

Recommended offer:
- {recommended_offer_name}
- Offer ID: {recommended_offer_id}
- Recommendation score: {recommendation_score}/100
- Confidence: {recommendation_confidence}
- Method: {recommendation_method}

Recommended next action:
{offer_action}

Why this offer:
{recommendation_reason}

Missing discovery context:
{missing_recommendation_context_or_none}

Prepared follow-up draft:
{follow_up_message_or_not_available}

Required owner action:
Review the recommendation and follow-up draft. Approve, edit, reject, or request more customer information.

Tracker status:
Lead Tracker: saved
Recommendation Tracker: saved

Important:
No customer message has been sent. Human review is required before any follow-up.
```

---

# 14. Needs-Review Template

Use when:

```text
notification_type = needs_review
```

## Suggested Title

```text
Lead Requires Review Before Offer Recommendation — {lead_id}
```

## Suggested Summary

```text
The recommendation is structurally valid, but important customer or commercial context is incomplete.
```

## Template

```text
⚠️ LEAD REQUIRES MANUAL REVIEW

Lead ID: {lead_id}
Lead: {lead_name}
Business: {business_type}
Source: {source}

Customer interest:
{service_interest}

Available commercial context:
- Budget: {budget_range}
- Timeline: {timeline}

Lead qualification:
- Category: {lead_category}
- Score: {lead_score}/100
- Priority: {priority}

Current recommendation direction:
- Offer: {recommended_offer_name}
- Offer ID: {recommended_offer_id}
- Recommendation score: {recommendation_score}/100
- Confidence: {recommendation_confidence}
- Next action: {offer_action}

Missing information:
{combined_missing_context}

Risk flags:
{combined_risk_flags}

Why review is required:
{review_reason}

Prepared follow-up draft:
{follow_up_message_or_not_available}

Required owner action:
Review the original inquiry and confirm which discovery questions should be asked before presenting a package.

Tracker status:
Lead Tracker: saved
Recommendation Tracker: saved
Human Review Status: pending_review
Final Message Sent: no

Important:
This recommendation is only a discovery direction. No final offer or customer message has been sent.
```

---

# 15. Processing-Failed Template

Use when:

```text
notification_type = processing_failed
```

## Suggested Title

```text
Processing Validation Failed — Manual Review Required — {lead_id}
```

## Suggested Summary

```text
The lead or recommendation output could not be safely validated.
```

## Template

```text
🚨 PROCESSING VALIDATION FAILED

Lead ID:
{lead_id_or_unknown}

Customer:
{lead_name_or_unknown}

Validation status:
failed

Blocking errors:
{blocking_errors}

Warnings:
{warnings}

Known lead context:
- Business: {business_type}
- Source: {source}
- Interest: {service_interest}
- Budget: {budget_range}
- Timeline: {timeline}

Fallback status:
{fallback_status}

Required owner action:
Review the original lead input and the preserved raw processing output manually.

Safety state:
- Customer message sent: no
- Recommendation approved: no
- Human review required: yes

Tracker status:
{tracker_write_status}

Important:
The workflow did not trust the generated output and did not continue through the normal recommendation path.
```

---

# 16. Persistence-Failed Template

Use when:

```text
notification_type = persistence_failed
```

## Suggested Title

```text
Tracker Write Failed — Lead Data Requires Recovery — {lead_id}
```

## Suggested Summary

```text
Processing completed, but one or more Google Sheet records were not stored successfully.
```

## Template

```text
🚨 TRACKER PERSISTENCE FAILURE

Lead ID:
{lead_id}

Recommendation ID:
{recommendation_id}

Processing result:
{processing_status}

Write status:
- Lead Tracker: {lead_tracker_write_status}
- Recommendation Tracker: {recommendation_tracker_write_status}

Persistence errors:
{persistence_errors}

Prepared data remains available:
{prepared_row_status}

Required owner action:
Review the failed tracker write and retry only the missing operation.

Retry safety:
- Do not append a duplicate lead row.
- Use lead_id as the Lead Tracker idempotency key.
- Use recommendation_id as the Recommendation Tracker idempotency key.

Customer message sent:
no

Important:
Do not treat the lead as fully stored until both tracker writes are confirmed.
```

---

# 17. L001 Ready-for-Review Example

Expected state:

```text
validation_status = passed
mapping_status = ready
tracker write status = succeeded
notification_type = ready_for_review
notification_priority = high
```

Example:

```text
✅ NEW LEAD READY FOR REVIEW

Lead ID: L001
Lead: Dinda
Business: Skincare Brand
Source: Instagram DM

Customer interest:
Social Media Management

Commercial context:
- Budget: 2-3 juta/bulan
- Timeline: Bulan ini

Lead qualification:
- Category: hot
- Score: 90/100
- Priority: high

Recommended offer:
- Monthly Social Media Management
- Offer ID: SVC002
- Recommendation score: 95/100
- Confidence: high
- Method: rule_based

Recommended next action:
ask_discovery_before_package

Why this offer:
The lead is a skincare brand asking for social media management with a clear budget and timeline, making Monthly Social Media Management the strongest catalog match.

Missing discovery context:
current Instagram account, monthly content target, brand style preference, approval process, posting frequency, content goals

Prepared follow-up draft:
Available for owner review in the Lead Tracker.

Required owner action:
Review the recommendation and follow-up draft. Confirm the discovery questions before sending anything to the customer.

Tracker status:
Lead Tracker: saved
Recommendation Tracker: saved
Human Review Status: pending_review
Final Message Sent: no

Important:
No customer message has been sent. Human review is required before any follow-up.
```

---

# 18. L006 Needs-Review Example

Expected state:

```text
validation_status = needs_review
mapping_status = needs_review
tracker write status = succeeded
notification_type = needs_review
notification_priority = low
```

Example:

```text
⚠️ LEAD REQUIRES MANUAL REVIEW

Lead ID: L006
Lead: Bima
Business: Local Gym
Source: available in tracker

Customer interest:
Marketing Consultation

Available commercial context:
- Budget: Tidak disebutkan
- Timeline: Tidak disebutkan

Lead qualification:
- Category: cold
- Score: 15/100
- Priority: low

Current recommendation direction:
- Offer: Marketing Discovery Consultation
- Offer ID: SVC006
- Recommendation score: 58/100
- Confidence: medium
- Next action: ask_discovery_before_package

Missing information:
specific marketing problem, business goal, available budget, timeline, current marketing channels, decision-making stage

Risk flags:
recommendation_needs_review

Why review is required:
The service direction is relevant, but the commercial and diagnostic context is incomplete. A discovery conversation is required before recommending a fixed package.

Prepared follow-up draft:
Available for owner review in the Lead Tracker.

Required owner action:
Review the original inquiry and decide which discovery questions should be asked first.

Tracker status:
Lead Tracker: saved
Recommendation Tracker: saved
Human Review Status: pending_review
Final Message Sent: no

Important:
This recommendation is only a discovery direction. No final package or customer message has been sent.
```

---

# 19. Owner Action Mapping

Recommended owner actions by workflow state:

| Condition | Owner Action |
|---|---|
| High-confidence recommendation | Review and approve or edit the draft |
| Medium-confidence recommendation | Review missing context and discovery questions |
| Low-confidence recommendation | Inspect the original lead manually |
| Budget mismatch | Confirm acceptable budget before offering |
| Timeline missing | Ask the customer for target timing |
| Portfolio requested | Select appropriate portfolio examples |
| Validation failed | Review raw input and fallback output |
| Persistence failed | Retry only the missing tracker operation |

---

# 20. Missing Context Formatting

Combine these fields:

```text
lead_output.missing_information
recommendation_output.missing_recommendation_context
```

Recommended conversion:

```javascript
const combinedMissingContext = [
  ...(leadOutput.missing_information ?? []),
  ...(recommendationOutput.missing_recommendation_context ?? []),
];

const missingContextText = [
  ...new Set(combinedMissingContext),
].join(", ");
```

When empty:

```text
No critical missing context recorded.
```

---

# 21. Risk Flag Formatting

Combine:

```text
lead_output.risk_flags
recommendation_output.recommendation_risk_flags
validation.warnings
```

Recommended conversion:

```javascript
const combinedRiskFlags = [
  ...(leadOutput.risk_flags ?? []),
  ...(recommendationOutput.recommendation_risk_flags ?? []),
  ...(validation.warnings ?? []),
];

const riskFlagText = [
  ...new Set(combinedRiskFlags),
].join(", ");
```

When empty:

```text
No blocking risk flags recorded.
```

---

# 22. Notification Data-Minimization Policy

The owner notification should contain enough information for decision-making without unnecessarily exposing sensitive data.

Include:

```text
lead name
business type
business inquiry
commercial context
recommendation
risk and review state
```

Avoid including unless operationally required:

```text
full private contact details
authentication data
API keys
internal credentials
raw system prompts
complete technical error stack traces
unredacted confidential customer data
```

Detailed technical errors may remain in workflow logs.

---

# 23. Follow-Up Draft Policy

The notification may display the follow-up draft when the selected channel supports readable formatting.

Otherwise, use:

```text
Follow-up draft available in the Lead Tracker.
```

The notification must always state:

```text
No customer message has been sent.
```

The draft must not be displayed as:

```text
Sent message
Customer message delivered
Message completed
```

---

# 24. Tracker Link Policy

Future notifications may include:

```text
Lead Tracker row link
Recommendation Tracker row link
Owner review dashboard link
```

Recommended placeholders:

```text
{lead_tracker_url}
{recommendation_tracker_url}
{owner_review_url}
```

Do not generate a fake URL when a real tracker link is unavailable.

Use:

```text
Tracker link not configured.
```

---

# 25. Notification Channel Guidance

## Email

Recommended content:

```text
subject
plain-text or HTML body
tracker links
full owner-action detail
```

## Telegram or Slack

Recommended content:

```text
short title
lead summary
recommendation summary
risk flags
owner action
tracker link
```

## WhatsApp Internal

Recommended content:

```text
compact summary
minimal sensitive data
direct owner action
clear no-auto-send warning
```

The current document remains channel-agnostic.

---

# 26. Suggested Email Subject Lines

## Ready for Review

```text
[AI Sales Assistant] New Lead Ready for Review — {lead_id}
```

## Needs Review

```text
[AI Sales Assistant] Lead Needs Discovery Review — {lead_id}
```

## Processing Failed

```text
[AI Sales Assistant] Processing Failed — Manual Review Required — {lead_id}
```

## Persistence Failed

```text
[AI Sales Assistant] Tracker Write Failed — {lead_id}
```

---

# 27. Suggested Compact Internal Message

```text
[{notification_priority}] {notification_type}

Lead: {lead_id} — {lead_name}
Category: {lead_category} ({lead_score}/100)
Recommendation: {recommended_offer_name}
Confidence: {recommendation_confidence} ({recommendation_score}/100)
Action: {offer_action}
Review status: pending_review
Tracker: {tracker_write_status}

Owner action:
{owner_action}

No customer message has been sent.
```

---

# 28. Notification Routing Rules

## Passed Validation

```text
validation_status = passed
mapping_status = ready
tracker writes = succeeded
```

Result:

```text
notification_type = ready_for_review
```

---

## Review-Required Validation

```text
validation_status = needs_review
or
mapping_status = needs_review
```

Result:

```text
notification_type = needs_review
```

---

## Processing Failure

```text
validation_status = failed
```

Result:

```text
notification_type = processing_failed
```

---

## Persistence Failure

```text
lead tracker write failed
or
recommendation tracker write failed
```

Result:

```text
notification_type = persistence_failed
```

Persistence failure has priority over a normal ready-for-review notification.

---

# 29. Notification Priority Resolution

Recommended deterministic order:

```text
1. persistence_failed -> critical
2. processing_failed -> critical
3. hot lead + high confidence -> high
4. needs_review -> medium or low based on lead priority
5. warm lead -> medium
6. cold lead -> low
```

For L006:

```text
lead priority = low
notification type = needs_review
notification priority = low
```

For a medium-confidence warm lead:

```text
notification priority = medium
```

---

# 30. Notification Validation Checklist

Before sending the internal notification, validate:

- [ ] Notification type is supported.
- [ ] Notification priority is supported.
- [ ] Lead ID is present when available.
- [ ] Recommendation ID is preserved when available.
- [ ] Lead category matches validated output.
- [ ] Recommendation offer matches validated output.
- [ ] Recommendation score was not recalculated.
- [ ] Recommendation confidence matches validated output.
- [ ] Missing context is represented accurately.
- [ ] Risk flags are represented accurately.
- [ ] Owner action is explicit.
- [ ] Tracker-write status is accurate.
- [ ] Notification does not claim customer delivery.
- [ ] Notification does not claim owner approval.
- [ ] Notification does not promise business results.
- [ ] `requires_human_review` equals true.
- [ ] Idempotency key exists.
- [ ] No unsupported sensitive data is included.

---

# 31. Notification Failure Conditions

Blocking notification errors:

```text
missing notification type
missing lead ID when known
unsupported notification type
unsupported priority
tracker status mismatch
notification claims message was sent
notification claims recommendation was approved
requires_human_review is false
missing idempotency key
```

Suggested error codes:

```text
missing_notification_type
missing_notification_lead_id
unsupported_notification_type
unsupported_notification_priority
notification_tracker_status_mismatch
notification_claims_customer_message_sent
notification_claims_owner_approval
notification_human_review_failed
missing_notification_idempotency_key
```

---

# 32. Notification Send Failure Handling

When the notification channel fails:

```text
Do not change tracker-write status.
Do not mark the customer message as sent.
Preserve the prepared notification payload.
Record notification_status = failed.
Retry using the same idempotency key.
```

A notification retry must not duplicate an already delivered notification.

---

# 33. Notification Audit Fields

Recommended fields:

```text
notification_id
notification_type
notification_priority
notification_channel
notification_status
idempotency_key
notification_created_at
notification_sent_at
notification_error
```

These fields may later be stored in:

```text
Notification Log
```

A separate notification log is outside the current MVP tracker scope.

---

# 34. Suggested n8n Node Structure

```text
Node 1:
Read Mapping Result

Node 2:
Resolve Notification Type

Node 3:
Resolve Notification Priority

Node 4:
Build Owner Notification Payload

Node 5:
Check Notification Idempotency

Node 6:
Send Internal Notification

Node 7:
Record Notification Result
```

For the MVP, Nodes 2–4 may be combined into one Code Node.

Recommended node name:

```text
Build Owner Review Notification
```

---

# 35. Suggested n8n Expressions

## Lead ID

```javascript
{{ $json.lead_tracker_row.lead_id }}
```

## Lead Name

```javascript
{{ $json.lead_tracker_row.lead_name }}
```

## Lead Category

```javascript
{{ $json.lead_tracker_row.lead_category }}
```

## Recommended Offer

```javascript
{{ $json.recommendation_tracker_row.recommended_offer_name }}
```

## Recommendation Confidence

```javascript
{{ $json.recommendation_tracker_row.recommendation_confidence }}
```

## Offer Action

```javascript
{{ $json.recommendation_tracker_row.offer_action }}
```

## Owner Review Status

```javascript
{{ $json.recommendation_tracker_row.human_review_status }}
```

## Final Message Sent

```javascript
{{ $json.recommendation_tracker_row.final_message_sent }}
```

---

# 36. Notification Payload Example — L001

```json
{
  "notification_id": "NOTIF-L001-ready_for_review-20260716T103500000Z",
  "notification_type": "ready_for_review",
  "notification_priority": "high",
  "notification_title": "New Qualified Lead Ready for Review — L001",
  "notification_summary": "A high-priority lead and service recommendation have been stored and are ready for owner review.",
  "lead_id": "L001",
  "customer_id": "C001",
  "recommendation_id": "REC-L001-20260716T103000000Z",
  "owner_action": "Review the recommendation and follow-up draft before manually contacting the customer.",
  "tracker_write_status": "succeeded",
  "notification_channel": "internal",
  "notification_status": "ready_to_send",
  "idempotency_key": "L001|REC-L001-20260716T103000000Z|ready_for_review|succeeded",
  "requires_human_review": true
}
```

---

# 37. Notification Payload Example — L006

```json
{
  "notification_id": "NOTIF-L006-needs_review-20260716T104000000Z",
  "notification_type": "needs_review",
  "notification_priority": "low",
  "notification_title": "Lead Requires Review Before Offer Recommendation — L006",
  "notification_summary": "The recommendation is valid as a discovery direction, but budget, timeline, and business context are incomplete.",
  "lead_id": "L006",
  "customer_id": "C006",
  "recommendation_id": "REC-L006-20260716T103900000Z",
  "owner_action": "Review the inquiry and confirm the discovery questions before presenting a service package.",
  "tracker_write_status": "succeeded",
  "notification_channel": "internal",
  "notification_status": "ready_to_send",
  "idempotency_key": "L006|REC-L006-20260716T103900000Z|needs_review|succeeded",
  "requires_human_review": true
}
```

---

# 38. Current MVP Scope

Included:

```text
ready-for-review notification
needs-review notification
processing-failed notification
persistence-failed notification
priority resolution
owner-action mapping
human-review warning
idempotency strategy
internal message templates
L001 example
L006 example
```

Not included:

```text
live email credentials
live Telegram credentials
live Slack credentials
live WhatsApp integration
automatic customer notification
owner approval buttons
notification database
production retry queue
```

---

# 39. Definition of Done

This owner-notification template is complete when it defines:

1. Notification purpose
2. Core safety rule
3. Architecture position
4. Notification responsibility
5. Supported notification states
6. Notification priority
7. Notification output contract
8. Allowed values
9. Required fields
10. Notification ID
11. Idempotency key
12. Notification timing
13. Formatting principles
14. Generic notification template
15. Ready-for-review template
16. Needs-review template
17. Processing-failed template
18. Persistence-failed template
19. L001 notification example
20. L006 notification example
21. Owner-action mapping
22. Missing-context formatting
23. Risk-flag formatting
24. Data-minimization policy
25. Follow-up draft policy
26. Tracker-link policy
27. Channel guidance
28. Email subject templates
29. Compact internal message
30. Routing rules
31. Priority resolution
32. Notification validation checklist
33. Failure conditions
34. Send-failure handling
35. Audit fields
36. Suggested n8n structure
37. Suggested n8n expressions
38. Notification payload examples
39. MVP scope boundaries