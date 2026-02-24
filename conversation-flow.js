/**
 * Conversation Flow — Deterministic Texas record-clearing intake.
 *
 * Four phases:
 *   1) Intake & Gatekeeping
 *   2) Disposition Routing
 *   3) Statutory Validation + Edge Case Handling
 *   4) Resolution + Conversion
 */

const INTAKE_FORM_URL = 'https://expungement.legal/intake';
const DISCOVERY_URL = 'https://expungement.legal/record-discovery';
const PAYMENT_STANDARD_URL = 'https://expungement.legal/pay/standard';
const PAYMENT_RUSH_URL = 'https://expungement.legal/pay/rush';
const PAYMENT_PLAN_URL = 'https://expungement.legal/payment-plan';

function monthNameToNumber(name) {
    const map = {
        january: 1,
        jan: 1,
        february: 2,
        feb: 2,
        march: 3,
        mar: 3,
        april: 4,
        apr: 4,
        may: 5,
        june: 6,
        jun: 6,
        july: 7,
        jul: 7,
        august: 8,
        aug: 8,
        september: 9,
        sep: 9,
        sept: 9,
        october: 10,
        oct: 10,
        november: 11,
        nov: 11,
        december: 12,
        dec: 12,
    };
    return map[String(name || '').toLowerCase()] || null;
}

function parseYearMonthInput(input) {
    if (typeof input !== 'string') return null;

    const raw = input.trim();
    if (!raw) return null;

    let match = raw.match(/^(\d{4})$/);
    if (match) {
        const year = Number(match[1]);
        if (year >= 1950 && year <= 2100) return `${year}-01`;
        return null;
    }

    match = raw.match(/^(\d{1,2})[/-](\d{4})$/);
    if (match) {
        const month = Number(match[1]);
        const year = Number(match[2]);
        if (month < 1 || month > 12 || year < 1950 || year > 2100) return null;
        return `${year}-${String(month).padStart(2, '0')}`;
    }

    match = raw.match(/^(\d{4})-(\d{1,2})$/);
    if (match) {
        const year = Number(match[1]);
        const month = Number(match[2]);
        if (month < 1 || month > 12 || year < 1950 || year > 2100) return null;
        return `${year}-${String(month).padStart(2, '0')}`;
    }

    match = raw.match(/^([A-Za-z]+)\s+(\d{4})$/);
    if (match) {
        const month = monthNameToNumber(match[1]);
        const year = Number(match[2]);
        if (!month || year < 1950 || year > 2100) return null;
        return `${year}-${String(month).padStart(2, '0')}`;
    }

    return null;
}

const STEPS = {
    GREETING: {
        id: 'GREETING',
        message:
            "A criminal record should not be a life sentence. Recent Texas law updates have expanded record-clearing pathways. Let's run your automated eligibility check now.\n\nNote: This tool reviews public-record eligibility only. It is general information, not legal advice. Please do not share details of undiscovered crimes.",
        quickReplies: [
            { id: 'start_check', label: 'Start Eligibility Check' },
            { id: 'learn_more', label: 'Learn How This Works' },
        ],
        next: (reply) => (reply === 'learn_more' ? 'LEARN_MORE' : 'ASK_TEXAS_CASE'),
    },

    LEARN_MORE: {
        id: 'LEARN_MORE',
        message:
            "We evaluate your path under Texas expunction and nondisclosure rules using a deterministic checklist. If your case needs document verification, we route you to a legal review step instead of guessing.\n\nReady to continue?",
        quickReplies: [
            { id: 'continue', label: 'Continue Eligibility Check' },
            { id: 'pricing', label: 'Show Pricing First' },
        ],
        next: (reply) => (reply === 'pricing' ? 'PRICING_PREVIEW' : 'ASK_TEXAS_CASE'),
    },

    PRICING_PREVIEW: {
        id: 'PRICING_PREVIEW',
        message:
            'Our flat-fee options:\n\n• Standard Processing — $1,395\n• Rush Processing — $2,000\n• Payment plans available\n\nWe recommend completing eligibility first so pricing is matched to the correct legal pathway.',
        quickReplies: [{ id: 'continue', label: 'Continue Eligibility Check' }],
        next: () => 'ASK_TEXAS_CASE',
    },

    ASK_TEXAS_CASE: {
        id: 'ASK_TEXAS_CASE',
        message: 'Phase 1 of 4 — Checking State Qualifications. Did the arrest or court case happen in Texas?',
        quickReplies: [
            { id: 'tx_yes', label: 'Yes, Texas' },
            { id: 'other_state', label: 'No, Another State' },
            { id: 'federal', label: 'Federal Court' },
        ],
        inputType: 'jurisdiction',
        next: (reply) => (reply === 'tx_yes' ? 'ASK_LIFETIME_BAN' : 'ELIGIBILITY_RESULT'),
    },

    ASK_LIFETIME_BAN: {
        id: 'ASK_LIFETIME_BAN',
        message:
            "Have you ever been convicted of, or placed on probation for, sex offenses, murder, kidnapping, human trafficking, or family/domestic violence?\n\nIf one of these was only arrested and fully dismissed/not guilty, select 'No'.",
        quickReplies: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
        ],
        inputType: 'lifetime_bar',
        next: (_reply, session) => {
            if (session.collectedData.jurisdiction !== 'TX') return 'ELIGIBILITY_RESULT';
            if (session.collectedData.lifetimeBar === true) return 'ELIGIBILITY_RESULT';
            return 'ASK_NAME';
        },
    },

    ASK_NAME: {
        id: 'ASK_NAME',
        message: 'Great. What is your first name?',
        quickReplies: null,
        inputType: 'name',
        next: () => 'ASK_CONTACT',
    },

    ASK_CONTACT: {
        id: 'ASK_CONTACT',
        message:
            "Before we run the legal matrix, share your best email and mobile number so we can save your progress if the session disconnects.\n\n🔒 Your data is encrypted and never sold.",
        quickReplies: null,
        inputType: 'contact_form',
        next: () => 'ASK_OFFENSE_LEVEL',
    },

    ASK_OFFENSE_LEVEL: {
        id: 'ASK_OFFENSE_LEVEL',
        message: 'Phase 2 of 4 — Analyzing Chapter 55A Pathways. What level of offense are we evaluating?',
        quickReplies: [
            { id: 'class_c', label: 'Class C Misdemeanor' },
            { id: 'misdemeanor', label: 'Misdemeanor (A/B)' },
            { id: 'felony', label: 'Felony' },
            { id: 'unsure', label: "I'm Not Sure" },
        ],
        inputType: 'offense_level',
        next: () => 'ASK_MULTIPLE_CHARGES',
    },

    ASK_MULTIPLE_CHARGES: {
        id: 'ASK_MULTIPLE_CHARGES',
        message:
            'For that same arrest event, were you charged with one offense or multiple offenses at the same time?',
        quickReplies: [
            { id: 'single', label: 'One Charge' },
            { id: 'multiple', label: 'Multiple Charges' },
        ],
        inputType: 'multiple_charges',
        next: (reply) => (reply === 'multiple' ? 'ASK_ANY_CONVICTION_FROM_ARREST' : 'ASK_CASE_OUTCOME'),
    },

    ASK_ANY_CONVICTION_FROM_ARREST: {
        id: 'ASK_ANY_CONVICTION_FROM_ARREST',
        message:
            'If there were multiple charges from that same arrest, did any of them end in a final guilty conviction or jail sentence?',
        quickReplies: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
        ],
        inputType: 'any_conviction_from_arrest',
        next: () => 'ASK_CASE_OUTCOME',
    },

    ASK_CASE_OUTCOME: {
        id: 'ASK_CASE_OUTCOME',
        message: 'What was the final result of the specific case you want to clear?',
        quickReplies: [
            { id: 'dismissed', label: 'Filed, Then Dismissed' },
            { id: 'unfiled', label: 'Arrested, Charges Never Filed' },
            { id: 'acquitted', label: 'Found Not Guilty (Acquitted)' },
            { id: 'deferred', label: 'Deferred Adjudication Completed' },
            { id: 'convicted', label: 'Convicted' },
            { id: 'unsure', label: "I'm Not Sure" },
        ],
        inputType: 'case_outcome',
        next: (reply, session) => {
            if (reply === 'unsure') return 'ELIGIBILITY_RESULT';
            if (reply === 'deferred') return 'ASK_DEFERRED_DISCHARGE_DATE';
            if (reply === 'convicted') {
                if (session.collectedData.offenseLevel === 'felony') return 'ELIGIBILITY_RESULT';
                return 'ASK_PRIOR_HISTORY';
            }
            return 'ASK_ARREST_DATE';
        },
    },

    ASK_ARREST_DATE: {
        id: 'ASK_ARREST_DATE',
        message:
            "What month and year did the arrest happen?\n\nExamples: 2021, 04/2021, or April 2021.",
        quickReplies: null,
        inputType: 'arrest_date',
        next: (_reply, session) => {
            if (session.collectedData.caseOutcome === 'dismissed') return 'ASK_DISMISSED_CATEGORY';
            return 'ELIGIBILITY_RESULT';
        },
    },

    ASK_DISMISSED_CATEGORY: {
        id: 'ASK_DISMISSED_CATEGORY',
        message:
            'For dismissed cases, some offense categories carry longer statutes of limitation. Which best matches the dismissed charge?',
        quickReplies: [
            { id: 'standard', label: 'Standard Offense' },
            { id: 'fraud_financial', label: 'Fraud / Financial Crime' },
            { id: 'deed_theft', label: 'Deed / Document Transfer Theft' },
            { id: 'not_sure', label: 'Not Sure' },
        ],
        inputType: 'dismissed_category',
        next: () => 'ELIGIBILITY_RESULT',
    },

    ASK_DEFERRED_DISCHARGE_DATE: {
        id: 'ASK_DEFERRED_DISCHARGE_DATE',
        message:
            "What month and year did you successfully finish deferred adjudication and get discharged?\n\nExamples: 2020, 09/2020, or September 2020.",
        quickReplies: null,
        inputType: 'deferred_discharge_date',
        next: (_reply, session) => {
            if (session.collectedData.offenseLevel === 'misdemeanor' || session.collectedData.offenseLevel === 'class_c') {
                return 'ASK_DEFERRED_MISD_CATEGORY';
            }
            return 'ASK_DEFERRED_BANNED_CHARGE';
        },
    },

    ASK_DEFERRED_MISD_CATEGORY: {
        id: 'ASK_DEFERRED_MISD_CATEGORY',
        message: 'Was this a minor non-violent misdemeanor, or a standard misdemeanor category?',
        quickReplies: [
            { id: 'minor_nonviolent', label: 'Minor Non-Violent Misdemeanor' },
            { id: 'standard_or_unsure', label: 'Standard or Not Sure' },
        ],
        inputType: 'deferred_misd_category',
        next: () => 'ASK_DEFERRED_BANNED_CHARGE',
    },

    ASK_DEFERRED_BANNED_CHARGE: {
        id: 'ASK_DEFERRED_BANNED_CHARGE',
        message:
            'Was this deferred case for murder, a sex offense, kidnapping, trafficking, or family violence?',
        quickReplies: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
            { id: 'not_sure', label: 'Not Sure' },
        ],
        inputType: 'deferred_banned_charge',
        next: () => 'ASK_CLEAN_PERIOD',
    },

    ASK_CLEAN_PERIOD: {
        id: 'ASK_CLEAN_PERIOD',
        message:
            'Since discharge on this case, have you been arrested or convicted for any new crimes (other than traffic tickets)?',
        quickReplies: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
        ],
        inputType: 'intervening_offense',
        next: () => 'ELIGIBILITY_RESULT',
    },

    ASK_PRIOR_HISTORY: {
        id: 'ASK_PRIOR_HISTORY',
        message:
            'For first-time misdemeanor conviction sealing, this must be your only offense ever. Do you have any other convictions or probations in your lifetime?',
        quickReplies: [
            { id: 'yes', label: 'Yes' },
            { id: 'no', label: 'No' },
        ],
        inputType: 'prior_history',
        next: (reply) => (reply === 'yes' ? 'ELIGIBILITY_RESULT' : 'ASK_CONVICTION_SENTENCE_DATE'),
    },

    ASK_CONVICTION_SENTENCE_DATE: {
        id: 'ASK_CONVICTION_SENTENCE_DATE',
        message:
            "What month and year did you complete all terms of sentence (including probation)?\n\nExamples: 2019, 07/2019, or July 2019.",
        quickReplies: null,
        inputType: 'conviction_sentence_date',
        next: () => 'ELIGIBILITY_RESULT',
    },

    ELIGIBILITY_RESULT: {
        id: 'ELIGIBILITY_RESULT',
        message: 'Phase 4 of 4 — Finalizing Eligibility Report. Here is your tailored pathway analysis.',
        quickReplies: null,
        next: (reply) => {
            if (reply === 'retain_rush') return 'PAYMENT_RUSH';
            if (reply === 'retain_standard') return 'PAYMENT_STANDARD';
            if (reply === 'payment_plan') return 'PAYMENT_PLAN';
            if (reply === 'discovery_49') return 'DISCOVERY_CHECKOUT';
            if (reply === 'join_waitlist') return 'WAITLIST_CAPTURE';
            if (reply === 'schedule_consult' || reply === 'schedule_priority_call') return 'BOOK_CONSULT';
            if (reply === 'start_over') return 'ASK_TEXAS_CASE';
            return 'FREE_CHAT';
        },
    },

    PAYMENT_RUSH: {
        id: 'PAYMENT_RUSH',
        message:
            `Rush selected.\n\n👉 [Complete Rush Retainer — $2,000](${PAYMENT_RUSH_URL})\n\nWe prioritize drafting and filing to shorten your time-to-clearance where legally possible.`,
        quickReplies: [
            { id: 'retain_standard', label: 'Switch to Standard' },
            { id: 'schedule_consult', label: 'Speak With Legal Team' },
            { id: 'start_over', label: 'Check Another Record' },
        ],
        next: (reply) => {
            if (reply === 'retain_standard') return 'PAYMENT_STANDARD';
            if (reply === 'schedule_consult') return 'BOOK_CONSULT';
            if (reply === 'start_over') return 'ASK_TEXAS_CASE';
            return 'FREE_CHAT';
        },
    },

    PAYMENT_STANDARD: {
        id: 'PAYMENT_STANDARD',
        message:
            `Standard selected.\n\n👉 [Complete Standard Retainer — $1,395](${PAYMENT_STANDARD_URL})\n\nWe handle the petition, filing, prosecutor notice, and final order process start-to-finish.`,
        quickReplies: [
            { id: 'retain_rush', label: 'Upgrade to Rush' },
            { id: 'payment_plan', label: 'View Payment Plans' },
            { id: 'schedule_consult', label: 'Speak With Legal Team' },
        ],
        next: (reply) => {
            if (reply === 'retain_rush') return 'PAYMENT_RUSH';
            if (reply === 'payment_plan') return 'PAYMENT_PLAN';
            if (reply === 'schedule_consult') return 'BOOK_CONSULT';
            return 'FREE_CHAT';
        },
    },

    PAYMENT_PLAN: {
        id: 'PAYMENT_PLAN',
        message:
            `Payment plan options are available with no interest.\n\n👉 [Review Payment Plan Options](${PAYMENT_PLAN_URL})\n\nIf you prefer, our team can walk you through the best option live.`,
        quickReplies: [
            { id: 'retain_standard', label: 'Proceed With Standard' },
            { id: 'retain_rush', label: 'Proceed With Rush' },
            { id: 'schedule_consult', label: 'Call Me to Review Options' },
        ],
        next: (reply) => {
            if (reply === 'retain_standard') return 'PAYMENT_STANDARD';
            if (reply === 'retain_rush') return 'PAYMENT_RUSH';
            if (reply === 'schedule_consult') return 'BOOK_CONSULT';
            return 'FREE_CHAT';
        },
    },

    DISCOVERY_CHECKOUT: {
        id: 'DISCOVERY_CHECKOUT',
        message:
            `To avoid guessing on court outcomes, we offer a Record Discovery & Strategy Session.\n\n👉 [Start Record Discovery — $49](${DISCOVERY_URL})\n\nWe pull the official DPS history and provide a legal strategy review.`,
        quickReplies: [
            { id: 'schedule_consult', label: 'Speak With Legal Team First' },
            { id: 'start_over', label: 'Restart Eligibility Check' },
        ],
        next: (reply) => {
            if (reply === 'schedule_consult') return 'BOOK_CONSULT';
            if (reply === 'start_over') return 'ASK_TEXAS_CASE';
            return 'FREE_CHAT';
        },
    },

    WAITLIST_CAPTURE: {
        id: 'WAITLIST_CAPTURE',
        message: (session) =>
            `${session.collectedData.firstName || 'You'} are on the right path. We can place your file on our priority waitlist and notify you as soon as your eligibility window opens. Is your current contact information correct?`,
        quickReplies: [
            { id: 'yes_correct', label: 'Yes, Keep Me Updated' },
            { id: 'update_contact', label: 'Update Contact Info' },
        ],
        next: (reply, session) => {
            if (reply === 'update_contact') {
                session.returnAfterLead = 'WAITLIST_CONFIRMED';
                return 'LEAD_CAPTURE';
            }
            return 'WAITLIST_CONFIRMED';
        },
    },

    WAITLIST_CONFIRMED: {
        id: 'WAITLIST_CONFIRMED',
        message:
            'Done. We saved your file and will alert you when your statutory waiting period is met. You can still ask additional questions now.',
        quickReplies: [
            { id: 'more_questions', label: 'Ask a Question' },
            { id: 'start_over', label: 'Check Another Record' },
        ],
        next: (reply) => (reply === 'start_over' ? 'ASK_TEXAS_CASE' : 'FREE_CHAT'),
    },

    BOOK_CONSULT: {
        id: 'BOOK_CONSULT',
        message: (session) =>
            `We can route this to a legal specialist for direct review. ${session.collectedData.firstName || ''} is the current contact information still best for callback?`,
        quickReplies: [
            { id: 'yes_correct', label: 'Yes, Contact Me There' },
            { id: 'update_contact', label: 'Update Contact Info' },
        ],
        next: (reply, session) => {
            if (reply === 'update_contact') {
                session.returnAfterLead = 'CONSULT_CONFIRMED';
                return 'LEAD_CAPTURE';
            }
            return 'CONSULT_CONFIRMED';
        },
    },

    CONSULT_CONFIRMED: {
        id: 'CONSULT_CONFIRMED',
        message:
            'Confirmed. Our legal team will follow up within one business day. You can continue chatting if you want help preparing documents in the meantime.',
        quickReplies: [
            { id: 'more_questions', label: 'Ask a Question' },
            { id: 'start_over', label: 'Check Another Record' },
        ],
        next: (reply) => (reply === 'start_over' ? 'ASK_TEXAS_CASE' : 'FREE_CHAT'),
    },

    LEAD_CAPTURE: {
        id: 'LEAD_CAPTURE',
        message: 'Share updated contact details and our team will follow up within one business day.',
        quickReplies: null,
        inputType: 'lead_form',
        next: (_reply, session) => session.returnAfterLead || 'COMPLETE',
    },

    COMPLETE: {
        id: 'COMPLETE',
        message: 'Thank you. Your request was logged successfully. You can continue chatting or run another check.',
        quickReplies: [
            { id: 'start_over', label: 'Run Another Eligibility Check' },
            { id: 'more_questions', label: 'Ask a Question' },
        ],
        next: (reply) => (reply === 'start_over' ? 'ASK_TEXAS_CASE' : 'FREE_CHAT'),
    },

    FREE_CHAT: {
        id: 'FREE_CHAT',
        message: null,
        quickReplies: [{ id: 'start_over', label: 'Run Eligibility Check Again' }],
        next: (reply) => (reply === 'start_over' ? 'ASK_TEXAS_CASE' : 'FREE_CHAT'),
    },
};

function createSession() {
    return {
        currentStep: 'GREETING',
        collectedData: {
            firstName: null,
            email: null,
            phone: null,
            jurisdiction: null,
            lifetimeBar: null,
            offenseLevel: null,
            offenseLevelAssumed: false,
            multipleCharges: null,
            anyConvictionFromArrest: null,
            caseOutcome: null,
            arrestDate: null,
            dismissedCategory: null,
            deferredDischargeDate: null,
            deferredMisdCategory: null,
            deferredBannedCharge: null,
            interveningOffense: null,
            priorHistory: null,
            convictionSentenceDate: null,
        },
        eligibilityResult: null,
        bucket: null,
        status: null,
        lead: null,
        returnAfterLead: null,
        events: [],
        startedAt: new Date().toISOString(),
    };
}

function getCurrentStep(session) {
    const stepDef = STEPS[session.currentStep] || STEPS.FREE_CHAT;
    const step = { ...stepDef };

    if (typeof step.message === 'function') {
        step.message = step.message(session);
    }

    return step;
}

function getResultQuickReplies(result) {
    if (!result || !result.status) {
        return [
            { id: 'schedule_consult', label: 'Speak With Legal Team' },
            { id: 'ask_questions', label: 'Ask a Question' },
        ];
    }

    switch (result.status) {
        case 'eligible_expunction':
        case 'eligible_nondisclosure':
            return [
                { id: 'retain_standard', label: 'Start Standard — $1,395' },
                { id: 'retain_rush', label: 'Start Rush — $2,000' },
                { id: 'payment_plan', label: 'See Payment Plan Options' },
                { id: 'schedule_consult', label: 'Speak With Legal Team' },
            ];
        case 'waitlist':
            return [
                { id: 'join_waitlist', label: 'Join Priority Waitlist' },
                { id: 'schedule_consult', label: 'Request Legal Review' },
                { id: 'ask_questions', label: 'Ask a Question' },
            ];
        case 'needs_discovery':
            return [
                { id: 'discovery_49', label: 'Start Record Discovery — $49' },
                { id: 'schedule_consult', label: 'Speak With Legal Team' },
                { id: 'ask_questions', label: 'Ask a Question' },
            ];
        case 'needs_human_review':
            return [
                { id: 'schedule_priority_call', label: 'Request Priority Callback' },
                { id: 'ask_questions', label: 'Ask a Question' },
            ];
        case 'not_texas':
            return [
                { id: 'schedule_consult', label: 'Discuss Texas-Specific Portion' },
                { id: 'start_over', label: 'Restart Check' },
            ];
        default:
            return [
                { id: 'schedule_consult', label: 'Speak With Legal Team' },
                { id: 'ask_questions', label: 'Ask a Question' },
            ];
    }
}

function processInput(session, input) {
    const step = STEPS[session.currentStep];
    if (!step) return { step: STEPS.FREE_CHAT, session };

    session.events.push({
        step: session.currentStep,
        input: step.inputType === 'contact_form' || step.inputType === 'lead_form' ? '[contact]' : input,
        timestamp: new Date().toISOString(),
    });

    let validationError = null;

    switch (step.inputType) {
        case 'jurisdiction': {
            if (input === 'tx_yes') session.collectedData.jurisdiction = 'TX';
            else if (input === 'federal') session.collectedData.jurisdiction = 'FEDERAL';
            else session.collectedData.jurisdiction = 'OTHER';
            break;
        }
        case 'lifetime_bar':
            session.collectedData.lifetimeBar = input === 'yes';
            break;
        case 'name': {
            const first = String(input || '').trim().split(/\s+/)[0] || '';
            if (!first) validationError = 'Please share at least your first name so we can continue.';
            else session.collectedData.firstName = first;
            break;
        }
        case 'contact_form':
            if (input && typeof input === 'object') {
                session.collectedData.email = input.email || null;
                session.collectedData.phone = input.phone || null;
            }
            break;
        case 'offense_level':
            if (input === 'class_c' || input === 'misdemeanor' || input === 'felony') {
                session.collectedData.offenseLevel = input;
                session.collectedData.offenseLevelAssumed = false;
            } else {
                // Conservative default when user is unsure.
                session.collectedData.offenseLevel = 'felony';
                session.collectedData.offenseLevelAssumed = true;
            }
            break;
        case 'multiple_charges':
            session.collectedData.multipleCharges = input === 'multiple';
            break;
        case 'any_conviction_from_arrest':
            session.collectedData.anyConvictionFromArrest = input === 'yes';
            break;
        case 'case_outcome': {
            const valid = ['dismissed', 'unfiled', 'acquitted', 'deferred', 'convicted', 'unsure'];
            session.collectedData.caseOutcome = valid.includes(input) ? input : 'unsure';
            break;
        }
        case 'arrest_date': {
            const parsed = parseYearMonthInput(String(input || ''));
            if (!parsed) {
                validationError = 'Please enter the arrest date as YYYY, MM/YYYY, or Month YYYY (example: 2021 or 04/2021).';
            } else {
                session.collectedData.arrestDate = parsed;
            }
            break;
        }
        case 'dismissed_category':
            session.collectedData.dismissedCategory = input || 'not_sure';
            break;
        case 'deferred_discharge_date': {
            const parsed = parseYearMonthInput(String(input || ''));
            if (!parsed) {
                validationError = 'Please enter the deferred discharge date as YYYY, MM/YYYY, or Month YYYY.';
            } else {
                session.collectedData.deferredDischargeDate = parsed;
            }
            break;
        }
        case 'deferred_misd_category':
            session.collectedData.deferredMisdCategory = input === 'minor_nonviolent' ? 'minor_nonviolent' : 'standard_or_unsure';
            break;
        case 'deferred_banned_charge':
            session.collectedData.deferredBannedCharge = input === 'yes' ? true : input === 'no' ? false : null;
            break;
        case 'intervening_offense':
            session.collectedData.interveningOffense = input === 'yes';
            break;
        case 'prior_history':
            session.collectedData.priorHistory = input === 'yes';
            break;
        case 'conviction_sentence_date': {
            const parsed = parseYearMonthInput(String(input || ''));
            if (!parsed) {
                validationError = 'Please enter the sentence completion date as YYYY, MM/YYYY, or Month YYYY.';
            } else {
                session.collectedData.convictionSentenceDate = parsed;
            }
            break;
        }
        case 'lead_form':
            session.lead = input || null;
            break;
    }

    if (validationError) {
        const retryStep = getCurrentStep(session);
        retryStep.message = `${validationError}\n\n${retryStep.message}`;
        return {
            step: retryStep,
            session,
            needsEligibility: false,
            eligibilityInput: null,
        };
    }

    const nextId = step.next(input, session) || 'FREE_CHAT';
    session.currentStep = nextId;

    const nextStep = getCurrentStep(session);
    const needsEligibility = nextId === 'ELIGIBILITY_RESULT';

    return {
        step: nextStep,
        session,
        needsEligibility,
        eligibilityInput: needsEligibility ? session.collectedData : null,
    };
}

module.exports = {
    STEPS,
    createSession,
    getCurrentStep,
    processInput,
    getResultQuickReplies,
    INTAKE_FORM_URL,
};
