// modals.js

let activeModal = null;

// =========================
// HELPERS (GERENCIADOR)
// =========================

export function openModal(modal) {

    if (!modal) return;

    // fecha modal anterior
    if (activeModal && activeModal !== modal) {
        activeModal.classList.remove("visible");
    }

    modal.classList.add("visible");

    // 🔥 trava scroll
    document.body.style.overflow = "hidden";

    activeModal = modal;
}

export function closeModal(modal, force = false) {

    if (!modal) return;

    if (!force && modal.classList.contains("locked-modal")) {
        return;
    }

    modal.classList.remove("visible");

    if (activeModal === modal) {
        activeModal = null;

        // 🔥 RESTORE SCROLL (FIX PRINCIPAL)
        document.body.style.overflow = "";
    }
}

export function initConnectionsAccordion(toggle, panel) {

    if (!toggle || !panel) return;

    toggle.addEventListener("click", () => {

        const isOpen = panel.classList.toggle("open");

        toggle.setAttribute("aria-expanded", isOpen);

        toggle.innerHTML = isOpen
            ? '<i class="fas fa-chevron-up"></i> Ocultar conexões'
            : '<i class="fas fa-search"></i> Ver conexões';
    });
}

export function initModals(selectors = {}) {

    const {
        feedbackLink, feedbackModal, closeFeedbackModal, closeFeedbackBtn,
        donationLink, donationModal, closeDonationModal, closeDonationBtn,
        privacyLink, privacyModal, closePrivacyModal, acceptPrivacyBtn,
        giveUpBtn, giveUpModal, closeGiveUpModal, confirmGiveUp, cancelGiveUp,
        connectionsModal, closeModal: closeConnectionsModal,
        resultModal, closeResultModal
    } = selectors;

    // ------------------ FEEDBACK ------------------
    if (feedbackLink && feedbackModal) {
        feedbackLink.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(feedbackModal);
        });
    }

    closeFeedbackModal?.addEventListener("click", () => closeModal(feedbackModal));
    closeFeedbackBtn?.addEventListener("click", () => closeModal(feedbackModal));


    // ------------------ DONATION ------------------
    if (donationLink && donationModal) {
        donationLink.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(donationModal);
        });
    }

    closeDonationModal?.addEventListener("click", () => closeModal(donationModal));
    closeDonationBtn?.addEventListener("click", () => closeModal(donationModal));


    // ------------------ PRIVACY ------------------
    if (privacyLink && privacyModal) {
        privacyLink.addEventListener("click", (e) => {
            e.preventDefault();
            openModal(privacyModal);
        });
    }

    closePrivacyModal?.addEventListener("click", () => closeModal(privacyModal));

    acceptPrivacyBtn?.addEventListener("click", () => {
        localStorage.setItem('privacyAccepted', 'true');
        closeModal(privacyModal);
    });


    // ------------------ DESISTIR ------------------
    if (giveUpBtn && giveUpModal) {
        giveUpBtn.addEventListener("click", () => {
            openModal(giveUpModal);
        });
    }

    closeGiveUpModal?.addEventListener("click", () => closeModal(giveUpModal));
    cancelGiveUp?.addEventListener("click", () => closeModal(giveUpModal));

    confirmGiveUp?.addEventListener("click", () => {
        closeModal(giveUpModal);
        document.dispatchEvent(new CustomEvent("playerGiveUp"));
    });

    closeConnectionsModal?.addEventListener("click", () => {
        closeModal(connectionsModal);
    });

    // ------------------ RESULTADO ------------------
    closeResultModal?.addEventListener("click", () => {
        closeModal(resultModal);
    });
}
