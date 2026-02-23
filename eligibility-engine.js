/**
 * Eligibility Engine — Texas-specific decision tree for expungement/nondisclosure.
 *
 * Texas has two main paths:
 *   1. Expunction (Art. 55, CCP) — complete removal for acquittals, dismissals, pardons
 *   2. Nondisclosure (Gov. Code §411.071+) — sealing for completed deferred adjudication
 *
 * Returns a bucket classification:
 *   - "eligible"      → Bucket A (close sale)
 *   - "needs_review"  → Bucket B (book consult)
 *   - "not_eligible"  → Bucket C (nurture)
 */

const rules = require('./eligibility-rules.json');

const DISCLAIMER =
    'This is general information only and does not constitute legal advice. ' +
    'Eligibility depends on the specific facts of your case under Texas law.';

const TX = rules.texas;

/**
 * Evaluate eligibility.
 */
function evaluateEligibility(input) {
    const { offenseType, yearsCompleted, pendingCharges, firstName } = input;

    const offense = rules.offenseCategories[offenseType];
    const name = firstName || 'there';

    // ── Pending charges → not eligible (yet) ─────────────────────────────
    if (pendingCharges === true) {
        return {
            bucket: 'not_eligible',
            eligible: 'not_yet',
            confidence: 'high',
            reason: `${name}, pending criminal charges need to be resolved before we can move forward with expungement or nondisclosure in Texas. Once those are handled, you may very well qualify.`,
            nextSteps: 'We\'d love to keep your file open and follow up once your pending matters are resolved.',
            disclaimer: DISCLAIMER,
        };
    }

    // ── Currently on probation/sentence ──────────────────────────────────
    // If we don't know the offense severity, but they are currently on probation (0 years), they are not yet eligible.
    const severity = input.severity || (offense ? offense.typicalSeverity : 'unknown');

    if (yearsCompleted === 0 && severity !== 'arrest' && severity !== 'deferred') {
        return {
            bucket: 'not_eligible',
            eligible: 'not_yet',
            confidence: 'high',
            reason: `${name}, because you're currently completing your sentence or probation, you aren't eligible for expungement just yet. But that doesn't mean you won't be!`,
            nextSteps: 'We\'d like to reach out when your sentence is complete so you can get started right away. Can we keep your file open?',
            disclaimer: DISCLAIMER,
        };
    }

    // Unknown/custom text offense → needs human review
    if (!offense) {
        return {
            bucket: 'needs_review',
            eligible: 'needs_review',
            confidence: 'low',
            reason: `${name}, since your situation involves specific charges ("${offenseType}"), it requires an attorney's review to determine exact eligibility. The good news is we handle records like this in Texas all the time.`,
            nextSteps: 'We\'ll have an attorney review your case and give you a call.',
            disclaimer: DISCLAIMER,
        };
    }



    // ── Disqualifying offense ────────────────────────────────────────────
    const isDisqualified = TX.disqualifying.some(
        (d) => offenseType.includes(d) || d.includes(offenseType)
    );

    if (isDisqualified || !offense.generallyEligible) {
        return {
            bucket: 'needs_review',
            eligible: 'needs_review',
            confidence: 'medium',
            reason: `${name}, in Texas, ${offense.label.toLowerCase()} cases can be more complex. Your situation has some details that an attorney should review — but we handle cases like this regularly, and there may be options available to you.`,
            nextSteps: 'Our Texas attorneys can review your specific circumstances and let you know exactly what\'s possible.',
            disclaimer: DISCLAIMER,
        };
    }

    // ── Arrests / dismissals → Expunction (usually straightforward) ─────
    if (severity === 'arrest') {
        return {
            bucket: 'eligible',
            eligible: 'likely',
            confidence: 'high',
            reason: `Great news, ${name}! In Texas, arrests that didn't result in a conviction — including dismissed cases and acquittals — are generally eligible for expunction. This means the record can be completely removed, not just sealed.`,
            nextSteps:
                `Here's how we can get started:\n\n` +
                `⚡ **Rush Processing — $2,000** — expedited timeline\n` +
                `📋 **Standard Processing — $1,395** — 3–6 months\n\n` +
                `Both include full attorney representation, all filings, and court appearances. Payment plans available.`,
            disclaimer: DISCLAIMER,
        };
    }

    // ── Deferred adjudication → Nondisclosure ────────────────────────────
    if (severity === 'deferred' || offenseType === 'deferred_adjudication') {
        return {
            bucket: 'eligible',
            eligible: 'likely',
            confidence: 'high',
            reason: `Great news, ${name}! If you successfully completed deferred adjudication in Texas, you're likely eligible for a Nondisclosure Order. This seals your record from public view — employers and landlords won't see it on background checks.`,
            nextSteps:
                `Here's how we can get started:\n\n` +
                `⚡ **Rush Processing — $2,000** — expedited timeline\n` +
                `📋 **Standard Processing — $1,395** — 3–6 months\n\n` +
                `Both include full attorney representation, all filings, and court appearances. Payment plans available.`,
            disclaimer: DISCLAIMER,
        };
    }

    // ── Waiting period check ─────────────────────────────────────────────
    const requiredWait = TX.waitingPeriod[severity] ?? TX.waitingPeriod.misdemeanor_classAB;

    if (yearsCompleted !== undefined && yearsCompleted !== null && yearsCompleted < requiredWait) {
        const remaining = requiredWait - yearsCompleted;
        return {
            bucket: 'not_eligible',
            eligible: 'not_yet',
            confidence: 'medium',
            reason: `${name}, in Texas the waiting period for this type of offense is typically ${requiredWait} year(s) after completing your sentence. Based on what you've shared, you may need to wait approximately ${remaining} more year(s).`,
            nextSteps: 'We\'d like to keep your file open and reach out when you may become eligible. That way you\'re ready to go the moment the time comes.',
            disclaimer: DISCLAIMER,
        };
    }

    // ── ELIGIBLE (Bucket A) ──────────────────────────────────────────────
    let reason = `Great news, ${name}! Based on what you've shared, it looks like you may be eligible to clear your record in Texas.`;

    if (yearsCompleted !== undefined && yearsCompleted >= requiredWait) {
        reason += ` You appear to have met the required waiting period.`;
    }

    return {
        bucket: 'eligible',
        eligible: 'likely',
        confidence: yearsCompleted !== undefined ? 'high' : 'medium',
        reason,
        nextSteps:
            `Here's how we can get started:\n\n` +
            `⚡ **Rush Processing — $2,000** — expedited timeline\n` +
            `📋 **Standard Processing — $1,395** — 3–6 months\n\n` +
            `Both include full attorney representation, all filings, and court appearances. Payment plans available.`,
        disclaimer: DISCLAIMER,
    };
}

/**
 * Build AI context from eligibility result.
 */
function buildEligibilityContext(result) {
    return [
        '## Eligibility Assessment (Texas)',
        `**Bucket**: ${result.bucket}`,
        `**Assessment**: ${result.reason}`,
        `**Next Steps**: ${result.nextSteps}`,
        `\n⚠️ ${result.disclaimer}`,
    ].join('\n');
}

function getOffenseCategories() {
    return Object.entries(rules.offenseCategories).map(([key, val]) => ({
        id: key,
        label: val.label,
    }));
}

function getStates() {
    // Texas only — return single entry
    return [{ id: 'TX', label: 'Texas' }];
}

function getServices() {
    return Object.entries(rules.services).map(([key, val]) => ({ id: key, ...val }));
}

module.exports = {
    evaluateEligibility,
    buildEligibilityContext,
    getOffenseCategories,
    getStates,
    getServices,
    DISCLAIMER,
};
