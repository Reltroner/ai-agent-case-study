# Lead Scoring Rules — AI Lead Follow-Up Assistant

## Purpose

This document defines the deterministic lead scoring rules used in the AI Lead Follow-Up Assistant simulation.

The goal is to classify incoming leads into hot, warm, or cold categories based on four business signals:

1. Budget clarity
2. Timeline urgency
3. Service clarity
4. Buying intent

The scoring system helps the agent prioritize leads in a structured and explainable way.

---

## Scoring Categories

Each lead is scored from 0 to 100 points.

The total score is calculated from four criteria:

| Criteria         | Maximum Points |
| ---------------- | -------------: |
| Budget clarity   |             25 |
| Timeline urgency |             25 |
| Service clarity  |             25 |
| Buying intent    |             25 |
| **Total**        |        **100** |

---

## 1. Budget Clarity

Budget clarity measures whether the lead has mentioned a usable budget range.

| Condition                              | Points |
| -------------------------------------- | -----: |
| Clear monthly/project budget mentioned |     25 |
| Budget mentioned but low or limited    |     15 |
| Budget unclear or not finalized        |     10 |
| Budget not mentioned                   |      0 |

Examples:

* “2-3 juta/bulan” → 25
* “Di bawah 1 juta” → 15
* “Belum ada budget” → 10
* “Tidak disebutkan” → 0

---

## 2. Timeline Urgency

Timeline urgency measures how soon the lead wants to start.

| Condition                                   | Points |
| ------------------------------------------- | -----: |
| Immediate / as soon as possible / this week |     25 |
| This month / next week / within 2 weeks     |     20 |
| Next month                                  |     15 |
| Unclear / not decided yet                   |      5 |
| Not mentioned                               |      0 |

Examples:

* “Secepatnya” → 25
* “Bulan ini” → 20
* “Minggu depan” → 20
* “2 minggu lagi” → 20
* “Bulan depan” → 15
* “Belum pasti” → 5
* “Tidak disebutkan” → 0

---

## 3. Service Clarity

Service clarity measures whether the lead clearly knows what service they need.

| Condition                                               | Points |
| ------------------------------------------------------- | -----: |
| Specific service requested                              |     25 |
| Service category is clear but scope needs clarification |     20 |
| General marketing/design help requested                 |     10 |
| No clear service need                                   |      0 |

Examples:

* “Social Media Management” → 25
* “Landing Page” → 25
* “Website and Content Strategy” → 25
* “Marketing Consultation” → 10

---

## 4. Buying Intent

Buying intent measures how serious the lead sounds based on the message.

| Condition                                             | Points |
| ----------------------------------------------------- | -----: |
| Strong intent, directly needs help, project is active |     25 |
| Interested and likely evaluating options              |     20 |
| Asking for price or general information               |     10 |
| Passive curiosity only                                |      5 |

Examples:

* “Saya butuh campaign...” → 25
* “Kami butuh bantuan...” → 25
* “Bisa bantu...” → 20
* “Mau tanya harga...” → 10
* “Saya ingin tahu jasa apa saja...” → 5

---

## Lead Category

| Score Range | Category  | Priority |
| ----------- | --------- | -------- |
| 75-100      | Hot Lead  | High     |
| 45-74       | Warm Lead | Medium   |
| 0-44        | Cold Lead | Low      |

---

## CRM Status Mapping

| Lead Category                | CRM Status     |
| ---------------------------- | -------------- |
| Hot Lead                     | qualified_hot  |
| Warm Lead                    | qualified_warm |
| Cold Lead                    | qualified_cold |
| Missing critical information | needs_review   |

---

## Lead Status Lifecycle

The lead status lifecycle simulates how a real CRM process may work.

```text
new
-> qualified_hot / qualified_warm / qualified_cold
-> contacted
-> waiting_response
-> follow_up_needed
-> proposal_sent
-> deal_won / deal_lost / inactive
```

Example hot lead path:

```text
new
-> qualified_hot
-> contacted
-> waiting_response
-> proposal_sent
-> deal_won
```

Example warm lead path:

```text
new
-> qualified_warm
-> contacted
-> follow_up_needed
-> inactive
```

Example cold lead path:

```text
new
-> qualified_cold
-> contacted
-> inactive
```

---

## Expected Classification for Sample Dataset

| Lead ID | Name  | Expected Category | Reason                                                                       |
| ------- | ----- | ----------------- | ---------------------------------------------------------------------------- |
| L001    | Dinda | Hot               | Clear service, clear budget, this-month timeline, strong buying intent       |
| L002    | Rama  | Warm              | Clear service but low budget and unclear timeline                            |
| L003    | Nadia | Hot               | Clear budget, clear timeline, active content need                            |
| L004    | Andi  | Warm              | Clear service and urgent timeline, but budget missing                        |
| L005    | Salsa | Hot               | Clear service, clear budget, near timeline, strong project intent            |
| L006    | Bima  | Cold              | General inquiry, no budget, no timeline, unclear intent                      |
| L007    | Clara | Hot               | Clear service, clear budget, clear business need                             |
| L008    | Fajar | Hot               | Strong urgency, clear campaign need, clear budget                            |
| L009    | Mira  | Warm              | Clear service interest but budget and timeline are uncertain                 |
| L010    | Yusuf | Hot               | Clear budget, clear service scope, this-month timeline, strong business need |

---

## Human Review Rule

The AI must never auto-send a follow-up message.

Every output must include:

```json
{
  "requires_human_review": true
}
```

Human review is mandatory because:

1. The AI may misread business context.
2. The message may need tone adjustment.
3. The owner must approve the final response.
4. The system is designed as AI-assisted workflow, not full autonomous sales automation.

---

## Fallback Rule

If the AI cannot classify the lead safely, it must return:

```json
{
  "lead_category": "needs_review",
  "lead_score": null,
  "crm_status": "needs_review",
  "next_best_action": "Manual review required",
  "requires_human_review": true
}
```

Fallback should be used when:

* Required fields are missing
* The lead message is too vague
* The budget and timeline are both unclear
* The AI output cannot produce valid JSON
* The lead appears duplicated
* The message contains unclear or risky context
