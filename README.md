# Egypt AI Readiness · جاهزية الشركات المصرية للذكاء الاصطناعي

A 10-minute self-assessment for Egyptian companies: an AI readiness score, the biggest gaps, the use cases that fit **today**, and a 90-day plan with a pilot budget.

**Live:** https://islamelsabahy.github.io/egypt-ai-readiness/

## What it does

- **32 questions across 8 dimensions:** strategy, data, infrastructure, systems & integration, people, governance & legal (including Egypt's Personal Data Protection Law 151/2020), security, value tracking. Each answer is 0 to 4.
- **Weighted score and level:** Unaware → Exploring → Ready to pilot → Ready to scale → Leading, plus a radar chart.
- **Use cases filtered by sector and readiness:** each use case declares the minimum foundation it needs (e.g. a WhatsApp sales agent needs systems ≥ 45, data ≥ 45, governance ≥ 35). You see the ones you can start now and, for the rest, exactly which gap blocks them.
- **90-day plan:** fix the weakest foundations first (days 0–30), pilot the two best-fit ready use cases (31–60), then measure and unblock the next ones (61–90).
- **Editable cost assumptions:** EGP per small, medium and large project; the pilot budget recalculates.
- **Shareable result link:** answers are encoded in the URL hash, nothing is uploaded. Arabic/English, print to PDF, CSV export.
- **Optional AI layer:** paste your own Anthropic API key to get a CEO memo written from the result. The key stays in the page and is never stored; without it everything still works.

## For consultants

Send a client the link, they answer, and they send back the result link. You get the same score, gaps and plan in your own browser, and can start the conversation from the roadmap.

## Engine

`docs/app/readiness.js` holds the questions, weights, use-case prerequisites and roadmap rules as plain data plus pure functions, so they are easy to review and change. Tests: `node tests/test_readiness.js`.

## Limits

This is a self-assessment: the score is only as honest as the answers. Costs are indicative bands, not quotations. Not legal advice on Law 151/2020.

Author: Islam El-Sherbiny · MIT License

## Limitations
- Demonstration tool built on **fictional sample data**. Outputs are decision support, not legal, tax or investment advice.
- Results depend on the assumptions you enter; check them against your own numbers before relying on them.
- Local by default: calculations run in your browser and nothing is sent to a server. Where a page offers an **optional AI mode**, turning it on sends the text/data you entered (and the computed results it needs) to `api.anthropic.com` using your own API key. Do not enable it with confidential customer, inventory or finance data. See [SECURITY.md](SECURITY.md).
