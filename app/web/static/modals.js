// modals.js
export function initModals(selectors = {}) {
    const {
        // Modais existentes
        feedbackLink, feedbackModal, closeFeedbackModal, closeFeedbackBtn,
        donationLink, donationModal, closeDonationModal, closeDonationBtn,
        privacyLink, privacyModal, closePrivacyModal, acceptPrivacyBtn,
        giveUpBtn, giveUpModal, closeGiveUpModal, confirmGiveUp, cancelGiveUp,
        showAuditBtn, connectionsModal, closeModal
    } = selectors;

    // ------------------ FEEDBACK ------------------
    if (feedbackLink && feedbackModal) {
        feedbackLink.addEventListener("click", (e) => {
            e.preventDefault();
            feedbackModal.style.display = "flex";
        });
    }
    if (closeFeedbackModal) closeFeedbackModal.addEventListener("click", () => { feedbackModal.style.display = "none"; });
    if (closeFeedbackBtn) closeFeedbackBtn.addEventListener("click", () => { feedbackModal.style.display = "none"; });

    // ------------------ DONATION ------------------
    if (donationLink && donationModal) {
        donationLink.addEventListener("click", (e) => {
            e.preventDefault();
            donationModal.style.display = "flex";
        });
    }
    if (closeDonationModal) closeDonationModal.addEventListener("click", () => { donationModal.style.display = "none"; });
    if (closeDonationBtn) closeDonationBtn.addEventListener("click", () => { donationModal.style.display = "none"; });

    // ------------------ PRIVACY ------------------
    if (privacyLink && privacyModal) {
        privacyLink.addEventListener("click", (e) => {
            e.preventDefault();
            privacyModal.style.display = "flex";
        });
    }
    if (closePrivacyModal) closePrivacyModal.addEventListener("click", () => { privacyModal.style.display = "none"; });
    if (acceptPrivacyBtn) acceptPrivacyBtn.addEventListener("click", () => {
        privacyModal.style.display = "none";
        localStorage.setItem('privacyAccepted', 'true');
    });

    // ------------------ DESISTIR ------------------
    if (giveUpBtn && giveUpModal) {
        giveUpBtn.addEventListener("click", () => {
            giveUpModal.classList.add("visible");
        });
    }
    if (closeGiveUpModal) closeGiveUpModal.addEventListener("click", () => {
        giveUpModal.classList.remove("visible");
    });
    if (cancelGiveUp) cancelGiveUp.addEventListener("click", () => {
        giveUpModal.classList.remove("visible");
    });
    if (confirmGiveUp) confirmGiveUp.addEventListener("click", async () => {
        giveUpModal.classList.remove("visible");
        // Solicita a palavra secreta ao servidor
        const res = await fetch("/give-up", { method: "POST" });
        const result = await res.json();
        // Mostra resultado usando UI existente
        selectors.ui.showResult(
            selectors.resultArea,
            selectors.finalWordEl,
            selectors.finalAttemptsEl,
            0,
            false,
            result.secret_word
        );
    });

    // ------------------ CONEXÕES ------------------
    if (showAuditBtn && connectionsModal) {
        showAuditBtn.addEventListener("click", () => {
            connectionsModal.classList.add("visible");
            // Aqui você pode preencher a lista de conexões se quiser
            // selectors.connectionsList.innerHTML = generateConnectionsHTML();
        });
    }
    if (closeModal) closeModal.addEventListener("click", () => {
        connectionsModal.classList.remove("visible");
    });
}
