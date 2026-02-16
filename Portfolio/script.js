const CONFIG = {
    SCROLL_OFFSET: 180,
    REVEAL_OFFSET: 80,
    TIP_DURATION: 8000,
    TIP_DELAY: 2000,
    SUCCESS_MESSAGE_DURATION: 3000
};

document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const navbar = document.getElementById("navbar");
    const modal = document.getElementById("messageModal");
    const openBtn = document.getElementById("sendMessageBtn");
    const closeBtns = document.querySelectorAll(".close-btn");
    const form = document.getElementById("messageForm");
    const themeToggle = document.getElementById("themeToggle");
    const darkModeTip = document.getElementById("darkModeTip");

    function initTheme() {
        try {
            const savedTheme = localStorage.getItem("theme");
            const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            const theme = savedTheme || (systemDark ? "dark" : "light");
            document.documentElement.setAttribute("data-theme", theme);
            if (themeToggle) {
                themeToggle.checked = (theme === "dark");
            }
        } catch (e) {
            console.error('Theme initialization failed:', e);
            document.documentElement.setAttribute("data-theme", "light");
        }
    }

    function toggleTheme() {
        try {
            const currentTheme = document.documentElement.getAttribute("data-theme");
            const newTheme = currentTheme === "dark" ? "light" : "dark";
            document.documentElement.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            hideDarkModeTip();
        } catch (e) {
            console.error('Theme toggle failed:', e);
        }
    }

    function setupThemeToggle() {
        if (themeToggle) {
            themeToggle.addEventListener("change", toggleTheme);
            initTheme();
        }
    }

    function showDarkModeTip() {
        if (darkModeTip && !darkModeTip.classList.contains("show")) {
            darkModeTip.classList.add("show");
            setTimeout(hideDarkModeTip, CONFIG.TIP_DURATION);
        }
    }

    function hideDarkModeTip() {
        if (darkModeTip && darkModeTip.classList.contains("show")) {
            darkModeTip.classList.remove("show");
            try {
                localStorage.setItem("darkModeTipSeen", "true");
            } catch (e) {
                console.error('Failed to save tip state:', e);
            }
        }
    }

    function setupDarkModeTip() {
        try {
            const tipSeen = localStorage.getItem("darkModeTipSeen");
            if (!tipSeen && darkModeTip) {
                setTimeout(showDarkModeTip, CONFIG.TIP_DELAY);

                const tipCloseBtn = darkModeTip.querySelector(".tip-close");
                if (tipCloseBtn) {
                    tipCloseBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        hideDarkModeTip();
                    });
                }

                document.addEventListener("click", function (e) {
                    if (darkModeTip && darkModeTip.classList.contains("show")) {
                        const themeWrapper = document.querySelector(".theme-toggle-wrapper");
                        if (!darkModeTip.contains(e.target) &&
                            themeWrapper && !themeWrapper.contains(e.target)) {
                            hideDarkModeTip();
                        }
                    }
                });
            }
        } catch (e) {
            console.error('Dark mode tip setup failed:', e);
        }
    }

    function setupMobileMenu() {
        if (menuToggle && navbar) {
            menuToggle.addEventListener("change", function () {
                navbar.classList.toggle("active", menuToggle.checked);
            });

            const navLinks = document.querySelectorAll("nav a");
            navLinks.forEach(link => {
                link.addEventListener("click", function () {
                    navbar.classList.remove("active");
                    menuToggle.checked = false;
                });
            });
        }
    }

    let isScrolling = false;

    function handleScroll() {
        if (isScrolling) return;

        isScrolling = true;
        window.requestAnimationFrame(() => {
            updateActiveNav();
            revealElements();
            isScrolling = false;
        });
    }

    function updateActiveNav() {
        const scrollPosition = window.scrollY + CONFIG.SCROLL_OFFSET;
        const sections = document.querySelectorAll("section[id]");
        const allNavLinks = document.querySelectorAll("nav a");

        allNavLinks.forEach(link => link.classList.remove("active"));

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute("id");
            const navLink = document.querySelector(`nav a[href="#${sectionId}"]`);

            if (navLink && scrollPosition >= sectionTop &&
                scrollPosition < sectionTop + sectionHeight) {
                navLink.classList.add("active");
            }
        });
    }

    function revealElements() {
        const fadeElements = document.querySelectorAll(".fade-in");
        const windowHeight = window.innerHeight;

        fadeElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.top < windowHeight - CONFIG.REVEAL_OFFSET) {
                element.classList.add("visible");
            }
        });
    }

    function toggleModal(show) {
        if (!modal) return;

        if (show) {
            modal.classList.add("show");
            document.body.style.overflow = "hidden";

            requestAnimationFrame(() => {
                const firstInput = form?.querySelector("input");
                firstInput?.focus();
            });
        } else {
            modal.classList.remove("show");
            document.body.style.overflow = "auto";

            if (form) {
                form.reset();
                clearErrors();
                const successMsg = form.querySelector(".success-message");
                successMsg?.remove();
            }
        }
    }

    function clearErrors() {
        if (!form) return;

        const errorElements = form.querySelectorAll(".error-message");
        errorElements.forEach(error => error.textContent = "");

        const inputs = form.querySelectorAll("input, textarea");
        inputs.forEach(input => input.classList.remove("error"));
    }

    function showError(id, msg) {
        const errorElement = document.getElementById(id);
        const inputId = id.replace("Error", "");
        const inputElement = document.getElementById(inputId);

        if (errorElement) {
            errorElement.textContent = msg;
        }
        if (inputElement) {
            inputElement.classList.add("error");
        }
    }

    function validateField(input) {
        const id = input.id;
        const value = input.value.trim();
        let isValid = true;

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobilePattern = /^[+]?[\d\s\-()]{10,20}$/;

        if (id === "Name") {
            if (value.length < 2) {
                showError("nameError", "Name must be at least 2 characters");
                isValid = false;
            } else {
                document.getElementById("nameError").textContent = "";
                input.classList.remove("error");
            }
        }

        if (id === "Contact") {
            if (!emailPattern.test(value) && !mobilePattern.test(value.replace(/[\s\-()]/g, ''))) {
                showError("contactError", "Enter valid email or mobile number");
                isValid = false;
            } else {
                document.getElementById("contactError").textContent = "";
                input.classList.remove("error");
            }
        }

        if (id === "Message") {
            if (value.length < 10) {
                showError("messageError", "Message must be at least 10 characters");
                isValid = false;
            } else {
                document.getElementById("messageError").textContent = "";
                input.classList.remove("error");
            }
        }

        return isValid;
    }

    function validateForm() {
        clearErrors();
        let isValid = true;

        if (!form) return false;

        const nameInput = form.querySelector("#Name");
        const contactInput = form.querySelector("#Contact");
        const messageInput = form.querySelector("#Message");

        const name = nameInput?.value.trim() || "";
        const contact = contactInput?.value.trim() || "";
        const message = messageInput?.value.trim() || "";

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const mobilePattern = /^[+]?[\d\s\-()]{10,20}$/;

        if (name.length < 2) {
            showError("nameError", "Name must be at least 2 characters");
            isValid = false;
        }

        if (!emailPattern.test(contact) && !mobilePattern.test(contact.replace(/[\s\-()]/g, ''))) {
            showError("contactError", "Enter valid email or mobile number");
            isValid = false;
        }

        if (message.length < 10) {
            showError("messageError", "Message must be at least 10 characters");
            isValid = false;
        }

        return isValid;
    }

    function showInlineError(form, message) {

        const existingError = form.querySelector('.inline-error-message');
        if (existingError) {
            existingError.remove();
        }

        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message inline-error-message';
        errorDiv.style.cssText = 'display: block; text-align: center; margin-top: 1rem; padding: 0.75rem; background: #FEE2E2; color: #991B1B; border-radius: 8px; border: 1px solid #FCA5A5;';
        errorDiv.textContent = message;

        const submitBtn = form.querySelector("button[type='submit']");
        form.insertBefore(errorDiv, submitBtn);

        setTimeout(() => errorDiv.remove(), 5000);
    }

    function setupForm() {
        if (!form) return;

        form.addEventListener("submit", function (e) {
            e.preventDefault();

            if (validateForm()) {
                const formData = new FormData(form);
                const submitBtn = form.querySelector("button[type='submit']");

                if (submitBtn) {
                    submitBtn.disabled = true;
                    submitBtn.textContent = "Sending...";
                }

                fetch(form.action, {
                    method: "POST",
                    body: formData,
                    headers: {
                        "Accept": "application/json",
                    },
                })
                    .then(function (response) {
                        if (response.ok) {
                            form.innerHTML = `
                                <div class="success-message">
                                    Thank you! Your message has been sent successfully. 
                                    I'll get back to you soon.
                                </div>
                            `;
                            setTimeout(() => toggleModal(false), CONFIG.SUCCESS_MESSAGE_DURATION);
                        } else {
                            return response.json().then(function (data) {
                                const errorMsg = data?.errors?.[0]?.message ||
                                    "Something went wrong. Please try again.";

                                console.error('Form submission error:', data);
                                showInlineError(form, errorMsg);

                                if (submitBtn) {
                                    submitBtn.disabled = false;
                                    submitBtn.textContent = "Send Message";
                                }
                            });
                        }
                    })
                    .catch(function (error) {
                        console.error('Network error:', error);
                        showInlineError(form, 'Network error. Please check your connection and try again.');

                        if (submitBtn) {
                            submitBtn.disabled = false;
                            submitBtn.textContent = "Send Message";
                        }
                    });
            }
        });

        const inputs = form.querySelectorAll("input, textarea");
        inputs.forEach(input => {
            input.addEventListener("blur", function () {
                if (input.value.trim()) {
                    validateField(input);
                }
            });
        });
    }

    function setupEventListeners() {
        if (openBtn) {
            openBtn.addEventListener("click", () => toggleModal(true));
        }

        closeBtns.forEach(btn => {
            btn.addEventListener("click", () => toggleModal(false));
        });

        window.addEventListener("click", function (e) {
            if (e.target === modal) {
                toggleModal(false);
            }
        });

        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") {
                if (modal?.classList.contains("show")) {
                    toggleModal(false);
                }
                if (darkModeTip?.classList.contains("show")) {
                    hideDarkModeTip();
                }
                if (navbar?.classList.contains("active")) {
                    navbar.classList.remove("active");
                    if (menuToggle) menuToggle.checked = false;
                }
            }
        });

        window.addEventListener("scroll", handleScroll, { passive: true });
        handleScroll();
    }

    window.scrollToSection = function (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    };

    function init() {
        setupThemeToggle();
        setupDarkModeTip();
        setupMobileMenu();
        setupForm();
        setupEventListeners();
        document.body.classList.add("loaded");
    }

    init();
});

if ("IntersectionObserver" in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {

                    img.style.opacity = '0.5';
                    img.style.transition = 'opacity 0.3s ease';

                    img.src = img.dataset.src;

                    img.onload = () => {
                        img.style.opacity = '1';
                        img.removeAttribute("data-src");
                    };

                    img.onerror = () => {
                        console.error('Failed to load image:', img.dataset.src);
                        img.style.opacity = '1';
                    };

                    imageObserver.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll("img[data-src]").forEach(img => {
        imageObserver.observe(img);
    });
}

