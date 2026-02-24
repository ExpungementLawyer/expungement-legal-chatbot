/**
 * Eligibility Engine — Deterministic Texas record-clearing logic.
 *
 * Output buckets:
 *   - eligible
 *   - needs_review
 *   - not_eligible
 */

const rules = require('./eligibility-rules.json');

const DISCLAIMER =
    'This automated assessment provides general information and not legal advice. Final eligibility depends on full court records and attorney review.';

const TX = rules.texas;

const MS_PER_DAY = 24 * 60 * 60 * 1000;

function toDateFromYearMonth(value) {
    if (!value || typeof value !== 'string') return null;
    const match = value.match(/^(\d{4})-(\d{2})$/);
    if (!match) return null;

    const year = Number(match[1]);
    const month = Number(match[2]);
    if (year < 1950 || year > 2100 || month < 1 || month > 12) return null;

    return new Date(Date.UTC(year, month - 1, 1));
}

function addYears(date, years) {
    if (!date) return null;
    const next = new Date(date.getTime());
    next.setUTCFullYear(next.getUTCFullYear() + years);
    return next;
}

function addDays(date, days) {
    if (!date) return null;
    return new Date(date.getTime() + days * MS_PER_DAY);
}

function formatDate(date) {
    if (!date) return null;
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(date);
}

function computeEligibilityDate({ anchorDate, requiredYears = 0, requiredDays = 0 }) {
    if (!anchorDate) return null;
    const afterYears = addYears(anchorDate, requiredYears);
    return addDays(afterYears, requiredDays);
}

function isNowOrPast(date) {
    if (!date) return false;
    return date.getTime() <= Date.now();
}

function yearsUntil(date) {
    if (!date) return null;
    const diffMs = date.getTime() - Date.now();
    if (diffMs <= 0) return 0;
    return Math.max(0, Math.ceil((diffMs / (365.25 * MS_PER_DAY)) * 10) / 10);
}

function makeResult({
    bucket,
    status,
    pathway = null,
    confidence = 'medium',
    reason,
    nextSteps,
    eligibleOnDate = null,
}) {
    const normalizedSteps = String(nextSteps || '')
        .split(/\n+/)
        .map((line) => line.trim())
        .filter(Boolean)
        .join('\n');

    return {
        bucket,
        status,
        pathway,
        eligible:
            bucket === 'eligible' ? 'likely' : status === 'waitlist' ? 'not_yet' : bucket === 'needs_review' ? 'needs_review' : 'blocked',
        confidence,
        reason,
        nextSteps: normalizedSteps,
        disclaimer: DISCLAIMER,
        eligibleOnDate: formatDate(eligibleOnDate),
    };
}

function appendConservativeAssumption(result, input) {
    if (!input?.offenseLevelAssumed) return result;

    return {
        ...result,
        nextSteps:
            `${result.nextSteps}\n\n` +
            'Conservative estimate applied: because offense level was uncertain, timeline calculations used felony-level assumptions pending document confirmation.',
    };
}

function evaluateWaitGate({ anchorDate, requiredYears = 0, requiredDays = 0 }) {
    if (!anchorDate) {
        return {
            met: false,
            eligibleOnDate: null,
        };
    }

    const eligibleOnDate = computeEligibilityDate({ anchorDate, requiredYears, requiredDays });
    return {
        met: isNowOrPast(eligibleOnDate),
        eligibleOnDate,
    };
}

function contradictionDetected(input) {
    if (!input) return false;

    if (input.caseOutcome === 'deferred' && input.deferredBannedCharge === true) return true;

    if (input.caseOutcome !== 'deferred' && (input.deferredDischargeDate || input.deferredMisdCategory || input.interveningOffense !== null)) {
        return true;
    }

    if (input.caseOutcome !== 'convicted' && (input.priorHistory !== null || input.convictionSentenceDate)) {
        return true;
    }

    if (input.caseOutcome !== 'dismissed' && input.dismissedCategory && input.dismissedCategory !== 'not_sure') {
        return true;
    }

    return false;
}

function evaluateEligibility(input) {
    const name = input?.firstName || 'there';

    if (input?.jurisdiction !== 'TX') {
        return makeResult({
            bucket: 'not_eligible',
            status: 'not_texas',
            confidence: 'high',
            reason:
                `${name}, we only handle Texas state arrests and Texas state court charges. ` +
                'We do not handle federal cases or cases from other states.',
            nextSteps:
                '1. If any part of your history is in Texas state court, request a Texas-specific review.\n' +
                '2. For federal or out-of-state matters, use local counsel in that jurisdiction.',
        });
    }

    if (input?.lifetimeBar === true) {
        return makeResult({
            bucket: 'not_eligible',
            status: 'disqualified_lifetime_bar',
            confidence: 'high',
            reason:
                `${name}, based on your answer, standard expunction and nondisclosure pathways appear blocked by Texas lifetime statutory bars for specific offense categories.`,
            nextSteps:
                '1. Request an attorney consultation for advanced remedies.\n' +
                '2. Discuss whether pardon or post-conviction relief pathways may apply to your facts.',
        });
    }

    if (!input?.caseOutcome || input.caseOutcome === 'unsure') {
        return makeResult({
            bucket: 'needs_review',
            status: 'needs_discovery',
            confidence: 'high',
            reason:
                `${name}, your case outcome is unclear, so we should not guess. Texas eligibility depends on the exact final disposition shown on your official record.`,
            nextSteps:
                '1. Start the $49 Record Discovery & Strategy Session.\n' +
                '2. We pull your official DPS history and provide a verified legal pathway review.',
        });
    }

    if (contradictionDetected(input)) {
        return makeResult({
            bucket: 'needs_review',
            status: 'needs_human_review',
            confidence: 'high',
            reason:
                `${name}, one or more answers conflict with typical Texas statutory outcomes. This usually means the case paperwork classification is different than expected.`,
            nextSteps:
                '1. Route this file to priority human legal review.\n' +
                '2. Confirm the exact disposition from county/DPS records before filing.',
        });
    }

    // Criminal episode rule: one conviction in the same arrest can bar expunction for related dismissed counts.
    if (
        input?.multipleCharges === true &&
        input?.anyConvictionFromArrest === true &&
        ['dismissed', 'unfiled', 'acquitted'].includes(input?.caseOutcome)
    ) {
        return makeResult({
            bucket: 'needs_review',
            status: 'needs_human_review',
            confidence: 'high',
            reason:
                `${name}, because multiple charges were tied to one arrest and at least one ended in conviction/jail, the criminal-episode rule may block direct expunction for related counts.`,
            nextSteps:
                '1. Attorney review is required to isolate any remaining sealing pathway.\n' +
                '2. We can map charge-by-charge options from your complete docket history.',
        });
    }

    if (input.caseOutcome === 'acquitted') {
        return appendConservativeAssumption(
            makeResult({
                bucket: 'eligible',
                status: 'eligible_expunction',
                pathway: 'expunction',
                confidence: 'high',
                reason:
                    `Strong result, ${name}. A not-guilty acquittal is generally on the expunction pathway in Texas, meaning record destruction rather than simple sealing.`,
                nextSteps:
                    '1. Begin filing now to lock in removal from public-record channels.\n' +
                    '2. Choose Standard ($1,395) or Rush ($2,000) processing.',
            }),
            input
        );
    }

    if (input.caseOutcome === 'unfiled') {
        const arrestDate = toDateFromYearMonth(input.arrestDate);
        if (!arrestDate) {
            return makeResult({
                bucket: 'needs_review',
                status: 'needs_human_review',
                confidence: 'medium',
                reason:
                    `${name}, we need the arrest date to calculate statute-based waiting periods for unfiled arrests.`,
                nextSteps: '1. Confirm the arrest month/year from your records.\n2. Re-run this check or request legal review.',
            });
        }

        const level = input.offenseLevel || 'felony';
        const waitConfig = TX.waitPeriods.unfiled;

        const gate =
            level === 'class_c'
                ? evaluateWaitGate({ anchorDate: arrestDate, requiredDays: waitConfig.classCDays })
                : level === 'misdemeanor'
                    ? evaluateWaitGate({ anchorDate: arrestDate, requiredYears: waitConfig.misdemeanorYears })
                    : evaluateWaitGate({ anchorDate: arrestDate, requiredYears: waitConfig.felonyYears });

        if (gate.met) {
            return appendConservativeAssumption(
                makeResult({
                    bucket: 'eligible',
                    status: 'eligible_expunction',
                    pathway: 'expunction',
                    confidence: 'high',
                    reason:
                        `${name}, your unfiled-arrest timeline appears to satisfy Texas wait-period rules for expunction filing.`,
                    nextSteps:
                        '1. We can file your expunction petition now.\n' +
                        '2. Select Standard ($1,395) or Rush ($2,000) processing.',
                    eligibleOnDate: gate.eligibleOnDate,
                }),
                input
            );
        }

        const etaYears = yearsUntil(gate.eligibleOnDate);
        return appendConservativeAssumption(
            makeResult({
                bucket: 'not_eligible',
                status: 'waitlist',
                pathway: 'expunction',
                confidence: 'high',
                reason:
                    `${name}, you are on the expunction path, but the statutory wait period has not expired yet.`,
                nextSteps:
                    `1. Estimated eligibility date: ${formatDate(gate.eligibleOnDate)}.\n` +
                    `2. Join the priority waitlist and we will notify you when filing opens (about ${etaYears} year(s) remaining).`,
                eligibleOnDate: gate.eligibleOnDate,
            }),
            input
        );
    }

    if (input.caseOutcome === 'dismissed') {
        const arrestDate = toDateFromYearMonth(input.arrestDate);
        if (!arrestDate) {
            return makeResult({
                bucket: 'needs_review',
                status: 'needs_human_review',
                confidence: 'medium',
                reason:
                    `${name}, we need the arrest date to calculate statute-of-limitation timing for dismissed charges.`,
                nextSteps: '1. Confirm arrest month/year from your records.\n2. Re-run this check or request legal review.',
            });
        }

        const level = input.offenseLevel || 'felony';
        const dismissal = TX.waitPeriods.dismissed;

        let requiredYears = dismissal.misdemeanorYears;
        if (level === 'felony') {
            if (input.dismissedCategory === 'fraud_financial') requiredYears = dismissal.felonyFraudYears;
            else if (input.dismissedCategory === 'deed_theft') requiredYears = dismissal.felonyDeedTheftYears;
            else requiredYears = dismissal.felonyStandardYears;
        }

        const gate = evaluateWaitGate({ anchorDate: arrestDate, requiredYears });

        if (gate.met) {
            return appendConservativeAssumption(
                makeResult({
                    bucket: 'eligible',
                    status: 'eligible_expunction',
                    pathway: 'expunction',
                    confidence: 'medium',
                    reason:
                        `${name}, your dismissed-case timeline appears to satisfy current Texas statute timing for expunction filing.`,
                    nextSteps:
                        '1. Begin your expunction petition now.\n' +
                        '2. Choose Standard ($1,395) or Rush ($2,000) processing.',
                    eligibleOnDate: gate.eligibleOnDate,
                }),
                input
            );
        }

        const etaYears = yearsUntil(gate.eligibleOnDate);
        return appendConservativeAssumption(
            makeResult({
                bucket: 'not_eligible',
                status: 'waitlist',
                pathway: 'expunction',
                confidence: 'medium',
                reason:
                    `${name}, this dismissed charge appears to remain inside the current waiting window under Texas statute timing rules.`,
                nextSteps:
                    `1. Estimated eligibility date: ${formatDate(gate.eligibleOnDate)}.\n` +
                    `2. Join priority waitlist for automatic filing-window alerts (about ${etaYears} year(s) remaining).`,
                eligibleOnDate: gate.eligibleOnDate,
            }),
            input
        );
    }

    if (input.caseOutcome === 'deferred') {
        if (input.deferredBannedCharge === true) {
            return makeResult({
                bucket: 'needs_review',
                status: 'needs_human_review',
                confidence: 'high',
                reason:
                    `${name}, the offense category selected is typically restricted for deferred-adjudication sealing pathways. We should verify the exact disposition before moving forward.`,
                nextSteps:
                    '1. Route to priority legal review.\n' +
                    '2. Confirm charge coding and final order details from official records.',
            });
        }

        if (input.interveningOffense === true) {
            return makeResult({
                bucket: 'not_eligible',
                status: 'disqualified_intervening_offense',
                pathway: 'nondisclosure',
                confidence: 'high',
                reason:
                    `${name}, Texas clean-period rules can block nondisclosure when new arrests/convictions occur during the waiting window.`,
                nextSteps:
                    '1. Request attorney analysis for any remaining legal options.\n' +
                    '2. We can review whether alternate post-conviction remedies may apply.',
            });
        }

        const dischargeDate = toDateFromYearMonth(input.deferredDischargeDate);
        if (!dischargeDate) {
            return makeResult({
                bucket: 'needs_review',
                status: 'needs_human_review',
                confidence: 'medium',
                reason:
                    `${name}, we need your deferred discharge date to calculate nondisclosure waiting periods.`,
                nextSteps:
                    '1. Confirm discharge month/year from court records.\n' +
                    '2. Re-run this check or request legal review.',
            });
        }

        const level = input.offenseLevel || 'felony';
        let requiredYears = TX.waitPeriods.deferred.felonyYears;

        if (level === 'misdemeanor' || level === 'class_c') {
            requiredYears =
                input.deferredMisdCategory === 'minor_nonviolent'
                    ? TX.waitPeriods.deferred.misdemeanorMinorNonviolentYears
                    : TX.waitPeriods.deferred.misdemeanorYears;
        }

        const gate = evaluateWaitGate({ anchorDate: dischargeDate, requiredYears });

        if (gate.met) {
            return appendConservativeAssumption(
                makeResult({
                    bucket: 'eligible',
                    status: 'eligible_nondisclosure',
                    pathway: 'nondisclosure',
                    confidence: 'high',
                    reason:
                        `${name}, your deferred-adjudication timeline appears to satisfy Texas nondisclosure waiting requirements.`,
                    nextSteps:
                        '1. Start your nondisclosure filing now.\n' +
                        '2. Choose Standard ($1,395) or Rush ($2,000) processing.',
                    eligibleOnDate: gate.eligibleOnDate,
                }),
                input
            );
        }

        const etaYears = yearsUntil(gate.eligibleOnDate);
        return appendConservativeAssumption(
            makeResult({
                bucket: 'not_eligible',
                status: 'waitlist',
                pathway: 'nondisclosure',
                confidence: 'high',
                reason:
                    `${name}, you may qualify for nondisclosure, but the required post-discharge waiting window has not fully matured.`,
                nextSteps:
                    `1. Estimated eligibility date: ${formatDate(gate.eligibleOnDate)}.\n` +
                    `2. Join priority waitlist for automatic alerting (about ${etaYears} year(s) remaining).`,
                eligibleOnDate: gate.eligibleOnDate,
            }),
            input
        );
    }

    if (input.caseOutcome === 'convicted') {
        if (input.offenseLevel === 'felony') {
            return makeResult({
                bucket: 'not_eligible',
                status: 'disqualified_felony_conviction',
                confidence: 'high',
                reason:
                    `${name}, Texas generally does not allow nondisclosure for final felony convictions under standard pathways.`,
                nextSteps:
                    '1. Request attorney consultation for advanced remedies (pardon/habeas analysis).\n' +
                    '2. Review whether any separate non-felony records remain clearable.',
            });
        }

        if (input.priorHistory === true) {
            return makeResult({
                bucket: 'not_eligible',
                status: 'disqualified_repeat_history',
                pathway: 'nondisclosure',
                confidence: 'high',
                reason:
                    `${name}, first-time misdemeanor conviction sealing in Texas is narrow. Multiple prior convictions/probations can block the standard pathway.`,
                nextSteps:
                    '1. Request legal review for any alternative pathways.\n' +
                    '2. We can analyze whether any charge-specific relief remains available.',
            });
        }

        const sentenceDate = toDateFromYearMonth(input.convictionSentenceDate);
        if (!sentenceDate) {
            return makeResult({
                bucket: 'needs_review',
                status: 'needs_human_review',
                confidence: 'medium',
                reason:
                    `${name}, we need sentence completion date details to calculate the misdemeanor conviction waiting period.`,
                nextSteps:
                    '1. Confirm completion month/year.\n2. Re-run this check or request legal review.',
            });
        }

        const requiredYears = TX.waitPeriods.convictedMisdemeanorYears;
        const gate = evaluateWaitGate({ anchorDate: sentenceDate, requiredYears });

        if (gate.met) {
            return appendConservativeAssumption(
                makeResult({
                    bucket: 'eligible',
                    status: 'eligible_nondisclosure',
                    pathway: 'nondisclosure',
                    confidence: 'medium',
                    reason:
                        `${name}, your first-time misdemeanor conviction timeline appears to satisfy the standard Texas nondisclosure waiting period.`,
                    nextSteps:
                        '1. Start your nondisclosure filing now.\n' +
                        '2. Choose Standard ($1,395) or Rush ($2,000) processing.',
                    eligibleOnDate: gate.eligibleOnDate,
                }),
                input
            );
        }

        const etaYears = yearsUntil(gate.eligibleOnDate);
        return appendConservativeAssumption(
            makeResult({
                bucket: 'not_eligible',
                status: 'waitlist',
                pathway: 'nondisclosure',
                confidence: 'medium',
                reason:
                    `${name}, you appear to be on a nondisclosure path, but the post-sentence waiting period has not fully elapsed.`,
                nextSteps:
                    `1. Estimated eligibility date: ${formatDate(gate.eligibleOnDate)}.\n` +
                    `2. Join priority waitlist for a filing-window alert (about ${etaYears} year(s) remaining).`,
                eligibleOnDate: gate.eligibleOnDate,
            }),
            input
        );
    }

    return makeResult({
        bucket: 'needs_review',
        status: 'needs_human_review',
        confidence: 'medium',
        reason:
            `${name}, this case pattern needs direct legal review to avoid a misclassification.`,
        nextSteps: '1. Request priority callback.\n2. We will verify your records and map the correct path.',
    });
}

function buildEligibilityContext(result) {
    return [
        '## Eligibility Assessment (Texas)',
        `**Bucket**: ${result.bucket}`,
        `**Status**: ${result.status}`,
        result.pathway ? `**Pathway**: ${result.pathway}` : null,
        result.eligibleOnDate ? `**Estimated Eligibility Date**: ${result.eligibleOnDate}` : null,
        `**Assessment**: ${result.reason}`,
        `**Next Steps**: ${result.nextSteps}`,
        `\n⚠️ ${result.disclaimer}`,
    ]
        .filter(Boolean)
        .join('\n');
}

function getOffenseCategories() {
    return Object.entries(rules.offenseCategories || {}).map(([key, val]) => ({
        id: key,
        label: val.label,
    }));
}

function getStates() {
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
