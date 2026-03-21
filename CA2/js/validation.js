/* ==================================================================
   Student Feedback Form — JavaScript Validation (Sub-Task 3)
   ================================================================== */
(() => {
    'use strict';

    // ── DOM References ──────────────────────────────────────────────
    const form         = document.getElementById('feedbackForm');
    const toast        = document.getElementById('successToast');

    const fields = {
        name:     document.getElementById('studentName'),
        email:    document.getElementById('emailId'),
        mobile:   document.getElementById('mobileNumber'),
        dept:     document.getElementById('department'),
        feedback: document.getElementById('feedbackComments'),
    };

    const errors = {
        name:     document.getElementById('nameError'),
        email:    document.getElementById('emailError'),
        mobile:   document.getElementById('mobileError'),
        dept:     document.getElementById('deptError'),
        gender:   document.getElementById('genderError'),
        feedback: document.getElementById('feedbackError'),
    };

    const groups = {
        name:     document.getElementById('nameGroup'),
        email:    document.getElementById('emailGroup'),
        mobile:   document.getElementById('mobileGroup'),
        dept:     document.getElementById('deptGroup'),
        gender:   document.getElementById('genderGroup'),
        feedback: document.getElementById('feedbackGroup'),
    };

    const wordCountEl = document.getElementById('wordCount');

    // ── Utility ─────────────────────────────────────────────────────
    const EMAIL_RE  = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    const MOBILE_RE = /^\d{10}$/;

    /** Count words in a string (split on whitespace, ignore empties) */
    function countWords(str) {
        return str.trim().split(/\s+/).filter(Boolean).length;
    }

    /** Show an error on a field group */
    function showError(key, message) {
        groups[key].classList.add('has-error');
        errors[key].textContent = message;
        errors[key].classList.add('visible');
    }

    /** Clear an error on a field group */
    function clearError(key) {
        groups[key].classList.remove('has-error');
        errors[key].textContent = '';
        errors[key].classList.remove('visible');
    }

    /** Clear all errors */
    function clearAllErrors() {
        Object.keys(errors).forEach(clearError);
    }

    // ── Individual Validators ───────────────────────────────────────
    function validateName() {
        const val = fields.name.value.trim();
        if (!val) { showError('name', 'Student name is required.'); return false; }
        clearError('name');
        return true;
    }

    function validateEmail() {
        const val = fields.email.value.trim();
        if (!val) { showError('email', 'Email is required.'); return false; }
        if (!EMAIL_RE.test(val)) { showError('email', 'Please enter a valid email address.'); return false; }
        clearError('email');
        return true;
    }

    function validateMobile() {
        const val = fields.mobile.value.trim();
        if (!val) { showError('mobile', 'Mobile number is required.'); return false; }
        if (!MOBILE_RE.test(val)) { showError('mobile', 'Enter a valid 10-digit mobile number (digits only).'); return false; }
        clearError('mobile');
        return true;
    }

    function validateDept() {
        if (!fields.dept.value) { showError('dept', 'Please select a department.'); return false; }
        clearError('dept');
        return true;
    }

    function validateGender() {
        const checked = document.querySelector('input[name="gender"]:checked');
        if (!checked) { showError('gender', 'Please select your gender.'); return false; }
        clearError('gender');
        return true;
    }

    function validateFeedback() {
        const val = fields.feedback.value.trim();
        if (!val) { showError('feedback', 'Feedback comments are required.'); return false; }
        const wc = countWords(val);
        if (wc < 10) { showError('feedback', `Minimum 10 words required (currently ${wc}).`); return false; }
        clearError('feedback');
        return true;
    }

    // ── Full-form validation ────────────────────────────────────────
    function validateAll() {
        // Run every validator so ALL errors show at once
        const results = [
            validateName(),
            validateEmail(),
            validateMobile(),
            validateDept(),
            validateGender(),
            validateFeedback(),
        ];
        return results.every(Boolean);
    }

    // ── Toast helper ────────────────────────────────────────────────
    function showToast() {
        toast.hidden = false;
        setTimeout(() => { toast.hidden = true; }, 4000);
    }

    // ── Event Listeners ─────────────────────────────────────────────

    // Real-time validation on blur
    fields.name.addEventListener('blur', validateName);
    fields.email.addEventListener('blur', validateEmail);
    fields.mobile.addEventListener('blur', validateMobile);
    fields.dept.addEventListener('change', validateDept);
    fields.feedback.addEventListener('blur', validateFeedback);

    // Gender radios
    document.querySelectorAll('input[name="gender"]').forEach(radio => {
        radio.addEventListener('change', validateGender);
    });

    // Live word count
    fields.feedback.addEventListener('input', () => {
        const wc = countWords(fields.feedback.value);
        wordCountEl.textContent = `${wc} word${wc !== 1 ? 's' : ''}`;
    });

    // Submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (validateAll()) {
            showToast();
            form.reset();
            clearAllErrors();
            wordCountEl.textContent = '0 words';
        }
    });

    // Reset — clear errors and word count
    form.addEventListener('reset', () => {
        // Use setTimeout so the native reset clears values first
        setTimeout(() => {
            clearAllErrors();
            wordCountEl.textContent = '0 words';
        }, 0);
    });
})();
