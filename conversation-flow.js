/**
 * Conversation Flow — State machine for guided legal intake.
 *
 * Strategy: Easy questions first → capture contact → hard details.
 * Three result buckets:
 *   A) Eligible   → close sale (Standard $1,395 / Rush $2,000)
 *   B) Needs Review → secure consult appointment
 *   C) Not Eligible → nurture + keep file open
 *
 * 3+ arrests → fork to intake form link.
 */

const { getStates, getOffenseCategories } = require('./eligibility-engine');

const INTAKE_FORM_URL = 'https://expungement.legal/intake';

// ─── Flow steps ────────────────────────────────────────────────────────────

const STEPS = {
    GREETING: {
        id: 'GREETING',
        message:
            "Hi! I'm here to help you clear your criminal record in Texas.\n\nWould you like to start your free eligibility determination now, or would you prefer to learn more about the record clearing process and the difference between expunctions and nondisclosures?",
        quickReplies: [
            { id: 'yes_start', label: "Start eligibility check" },
            { id: 'learn_more', label: 'Learn about the process' },
        ],
        next: (reply) => {
            if (reply === 'learn_more') return 'LEARN_MORE';
            return 'ASK_NAME';
        },
    },

    LEARN_MORE: {
        id: 'LEARN_MORE',
        message:
            "I'd be happy to explain! A record clearing (like an expunction or nondisclosure) seals or destroys your criminal record so it doesn't appear on background checks.\n\nWhat would you like to know? You can ask me any questions you have, or we can look at pricing. When you're ready, we can check if you qualify.",
        quickReplies: [
            { id: 'yes_start', label: "Check my eligibility" },
            { id: 'pricing', label: 'What does it cost?' },
        ],
        next: (reply) => {
            if (reply === 'pricing') return 'PRICING_INFO';
            return 'ASK_NAME';
        },
    },

    PRICING_INFO: {
        id: 'PRICING_INFO',
        message:
            "Our pricing:\n\n• **Standard processing** — $1,395\n• **Rush processing** — $2,000\n\nThe difference in speed between rush and standard could be anywhere from 30 to 90 days. While the majority of standard cases clear in 90-120 days, it can take longer.\n\nIf you really need to clear your record in less time, we strongly suggest **Rush**. We place your petition at the front of our queue and file it before any standard petitions.\n\n💳 Payment plans available, no interest. And if we can't file your petition, you get your money back.\n\nLet's first check if you're eligible — it's free and takes 2 minutes.",
        quickReplies: [
            { id: 'yes_start', label: 'Check my eligibility' },
        ],
        next: () => 'ASK_NAME',
    },

    // ── Easy questions first (low friction) ──────────────────────────────

    ASK_NAME: {
        id: 'ASK_NAME',
        message: "Great! First, what's your **first name**?",
        quickReplies: null,
        inputType: 'name',
        next: () => 'ASK_ARRESTS_COUNT',
    },

    ASK_ARRESTS_COUNT: {
        id: 'ASK_ARRESTS_COUNT',
        message: (session) => `Thanks, ${session.collectedData.firstName || 'there'}! How many arrests or cases are we looking at clearing up?`,
        quickReplies: [
            { id: '1', label: 'Just 1' },
            { id: '2', label: '2' },
            { id: '3', label: '3+' },
        ],
        inputType: 'arrests_count',
        next: (reply) => {
            const n = parseInt(reply, 10);
            if (n >= 3 || reply === '3') return 'FORK_INTAKE_FORM';
            return 'ASK_CONTACT';
        },
    },

    // ── Capture contact BEFORE hard details ──────────────────────────────

    ASK_CONTACT: {
        id: 'ASK_CONTACT',
        message: (session) =>
            `Perfect. Before we dive into the details, ${session.collectedData.firstName || ''} — what's the best **email** and **phone number** to reach you?\n\nThis way if we get disconnected, we can follow up with your results.`,
        quickReplies: null,
        inputType: 'contact_form',
        next: () => 'ASK_OFFENSE',
    },

    FORK_INTAKE_FORM: {
        id: 'FORK_INTAKE_FORM',
        message: (session) =>
            `Since you have a few cases, ${session.collectedData.firstName || ''}, it'll be easier to use our secure intake form so we don't miss anything.\n\n👉 **[Open Intake Form](${INTAKE_FORM_URL})**\n\nOr if you'd prefer, we can call you to go through everything over the phone.`,
        quickReplies: [
            { id: 'call_me', label: 'Call me instead' },
            { id: 'continue_chat', label: 'Continue in chat' },
        ],
        inputType: 'fork',
        next: (reply) => {
            if (reply === 'call_me') return 'LEAD_CAPTURE';
            return 'ASK_CONTACT';
        },
    },

    // ── Case details (after contact is captured) ─────────────────────────

    ASK_STATE: {
        id: 'ASK_STATE',
        message: 'What **state** was your case in?',
        quickReplies: null, // Populated dynamically
        inputType: 'state',
        next: () => 'ASK_OFFENSE',
    },

    ASK_OFFENSE: {
        id: 'ASK_OFFENSE',
        message: 'What were the **charges**? (You can list multiple if you have them)',
        quickReplies: null,
        inputType: 'offense',
        next: () => 'ASK_TIMELINE',
    },

    ASK_TIMELINE: {
        id: 'ASK_TIMELINE',
        message: 'How many **years ago** did you complete your sentence (including probation, fines, community service)?',
        quickReplies: [
            { id: '0', label: 'Still on probation' },
            { id: '1', label: '1–2 years ago' },
            { id: '3', label: '3–5 years ago' },
            { id: '6', label: '5–10 years ago' },
            { id: '11', label: '10+ years ago' },
            { id: 'unsure', label: 'Not sure' },
        ],
        inputType: 'years',
        next: () => 'ASK_PENDING',
    },

    ASK_PENDING: {
        id: 'ASK_PENDING',
        message: 'Do you currently have any **pending criminal charges**?',
        quickReplies: [
            { id: 'no', label: 'No' },
            { id: 'yes', label: 'Yes' },
            { id: 'unsure', label: 'Not sure' },
        ],
        inputType: 'pending',
        next: () => 'ELIGIBILITY_RESULT',
    },

    // ── Results: Three buckets ───────────────────────────────────────────

    ELIGIBILITY_RESULT: {
        id: 'ELIGIBILITY_RESULT',
        message: null, // Generated dynamically by the server
        quickReplies: null, // Set dynamically per bucket
        next: (reply) => {
            if (reply === 'rush') return 'PAYMENT_RUSH';
            if (reply === 'standard') return 'PAYMENT_STANDARD';
            if (reply === 'consult' || reply === 'call_me') return 'BOOK_CONSULT';
            if (reply === 'keep_file') return 'NURTURE_CAPTURE';
            if (reply === 'more_questions') return 'FREE_CHAT';
            return 'FREE_CHAT';
        },
    },

    // Bucket A: Eligible → close sale
    PAYMENT_RUSH: {
        id: 'PAYMENT_RUSH',
        message: "Excellent choice! Rush processing gets your case moving ASAP.\n\n👉 **[Complete Payment — $2,000](https://expungement.legal/pay/rush)**\n\nOnce payment is received, an attorney will contact you within 24 hours to begin your case.",
        quickReplies: [
            { id: 'standard', label: 'Switch to Standard ($1,395)' },
            { id: 'more_questions', label: 'I have questions first' },
        ],
        next: (reply) => {
            if (reply === 'standard') return 'PAYMENT_STANDARD';
            return 'FREE_CHAT';
        },
    },

    PAYMENT_STANDARD: {
        id: 'PAYMENT_STANDARD',
        message: "Great! Here's your payment link:\n\n👉 **[Complete Payment — $1,395](https://expungement.legal/pay/standard)**\n\nPayment plans are available at checkout. An attorney will contact you within 48 hours to get started.",
        quickReplies: [
            { id: 'rush', label: 'Upgrade to Rush ($2,000)' },
            { id: 'more_questions', label: 'I have questions first' },
        ],
        next: (reply) => {
            if (reply === 'rush') return 'PAYMENT_RUSH';
            return 'FREE_CHAT';
        },
    },

    // Bucket B: Needs Review → secure consult
    BOOK_CONSULT: {
        id: 'BOOK_CONSULT',
        message: (session) =>
            `We'll have one of our attorneys give you a call, ${session.collectedData.firstName || ''}. They handle cases like yours regularly.\n\nExpect a call within 1 business day. Is the contact info you provided the best way to reach you?`,
        quickReplies: [
            { id: 'yes_correct', label: 'Yes, that works' },
            { id: 'update_contact', label: 'Let me update it' },
        ],
        next: (reply) => {
            if (reply === 'update_contact') return 'LEAD_CAPTURE';
            return 'CONSULT_CONFIRMED';
        },
    },

    CONSULT_CONFIRMED: {
        id: 'CONSULT_CONFIRMED',
        message: "✅ Perfect, you're all set! Our attorney will reach out soon.\n\nIn the meantime, feel free to ask me anything else about the process.",
        quickReplies: [
            { id: 'more_questions', label: 'Ask a question' },
        ],
        next: () => 'FREE_CHAT',
    },

    // Bucket C: Not eligible → nurture
    NURTURE_CAPTURE: {
        id: 'NURTURE_CAPTURE',
        message: (session) =>
            `Absolutely, ${session.collectedData.firstName || ''}. We'll keep your file on record and reach out when you may become eligible.\n\nIs the contact info you provided still the best way to reach you?`,
        quickReplies: [
            { id: 'yes_correct', label: 'Yes, keep me updated' },
            { id: 'update_contact', label: 'Let me update it' },
        ],
        next: (reply) => {
            if (reply === 'update_contact') return 'LEAD_CAPTURE';
            return 'NURTURE_CONFIRMED';
        },
    },

    NURTURE_CONFIRMED: {
        id: 'NURTURE_CONFIRMED',
        message: "✅ Done! We'll be in touch when the time is right. In the meantime, feel free to reach out anytime.\n\nIs there anything else I can help with?",
        quickReplies: [
            { id: 'more_questions', label: 'Ask a question' },
        ],
        next: () => 'FREE_CHAT',
    },

    // ── Shared steps ─────────────────────────────────────────────────────

    LEAD_CAPTURE: {
        id: 'LEAD_CAPTURE',
        message: "To connect you with our team, share your contact info below. No obligation — we'll reach out within 1 business day.",
        quickReplies: null,
        inputType: 'lead_form',
        next: () => 'COMPLETE',
    },

    COMPLETE: {
        id: 'COMPLETE',
        message: "✅ Thank you! Our team will be in touch soon.\n\nFeel free to keep chatting if you have other questions.",
        quickReplies: [
            { id: 'more_questions', label: 'Ask another question' },
        ],
        next: () => 'FREE_CHAT',
    },

    FREE_CHAT: {
        id: 'FREE_CHAT',
        message: null, // AI handles this
        quickReplies: [
            { id: 'start_over', label: 'Check another record' },
        ],
        next: (reply) => {
            if (reply === 'start_over') return 'ASK_NAME';
            return 'FREE_CHAT';
        },
    },
};

// ─── Session state ─────────────────────────────────────────────────────────

function createSession() {
    return {
        currentStep: 'GREETING',
        collectedData: {
            firstName: null,
            email: null,
            phone: null,
            arrestsCount: null,
            state: null,
            offenseType: null,
            severity: null,
            yearsCompleted: null,
            pendingCharges: null,
        },
        eligibilityResult: null,
        bucket: null, // 'eligible' | 'needs_review' | 'not_eligible'
        lead: null,
        events: [],
        startedAt: new Date().toISOString(),
    };
}

/**
 * Get the current step definition with dynamic quick replies populated.
 */
function getCurrentStep(session) {
    const stepDef = STEPS[session.currentStep];
    if (!stepDef) return STEPS.FREE_CHAT;

    const step = { ...stepDef };

    // Resolve dynamic messages
    if (typeof step.message === 'function') {
        step.message = step.message(session);
    }

    // Populate dynamic quick replies
    if (step.id === 'ASK_STATE' && !step.quickReplies) {
        step.quickReplies = getStates().map((s) => ({ id: s.id, label: s.label }));
    }

    return step;
}

/**
 * Generate bucket-specific quick replies for the eligibility result step.
 */
function getResultQuickReplies(bucket) {
    switch (bucket) {
        case 'eligible':
            return [
                { id: 'rush', label: '⚡ Rush — $2,000' },
                { id: 'standard', label: 'Standard — $1,395' },
                { id: 'more_questions', label: 'I have questions' },
            ];
        case 'needs_review':
            return [
                { id: 'consult', label: '📞 Schedule a call' },
                { id: 'more_questions', label: 'I have questions' },
            ];
        case 'not_eligible':
            return [
                { id: 'keep_file', label: '📁 Keep my file open' },
                { id: 'consult', label: 'Talk to an attorney anyway' },
                { id: 'more_questions', label: 'Ask a question' },
            ];
        default:
            return [
                { id: 'consult', label: 'Talk to someone' },
                { id: 'more_questions', label: 'Ask a question' },
            ];
    }
}

/**
 * Process user input for the current step and advance the state machine.
 */
function processInput(session, input) {
    const step = STEPS[session.currentStep];
    if (!step) return { step: STEPS.FREE_CHAT, session };

    // Record event
    session.events.push({
        step: session.currentStep,
        input: step.inputType === 'contact_form' ? '[contact]' : input, // Don't log PII
        timestamp: new Date().toISOString(),
    });

    // Collect data based on input type
    switch (step.inputType) {
        case 'name':
            session.collectedData.firstName = (input || '').trim().split(/\s/)[0] || null;
            break;
        case 'arrests_count':
            session.collectedData.arrestsCount = parseInt(input, 10) || null;
            break;
        case 'contact_form':
            // input = { email, phone }
            if (input && typeof input === 'object') {
                session.collectedData.email = input.email || null;
                session.collectedData.phone = input.phone || null;
            }
            break;
        case 'state':
            session.collectedData.state = input?.toUpperCase() || null;
            break;
        case 'offense':
            session.collectedData.offenseType = input || null;
            break;
        case 'years': {
            const val = input === 'unsure' ? null : parseInt(input, 10);
            session.collectedData.yearsCompleted = isNaN(val) ? null : val;
            break;
        }
        case 'pending':
            session.collectedData.pendingCharges =
                input === 'yes' ? true : input === 'no' ? false : null;
            break;
        case 'lead_form':
            session.lead = input; // { name, email, phone }
            break;
    }

    // Determine next step
    const nextId = step.next(input);
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
