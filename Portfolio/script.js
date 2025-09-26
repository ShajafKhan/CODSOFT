document.addEventListener("DOMContentLoaded", function () {
    var menuToggle = document.getElementById("menu-toggle");
    var navbar = document.getElementById("navbar");
    var modal = document.getElementById("messageModal");
    var openBtn = document.getElementById("sendMessageBtn");
    var closeBtns = document.querySelectorAll(".close-btn");
    var form = document.getElementById("messageForm");
    var themeToggle = document.getElementById("themeToggle");
    var darkModeTip = document.getElementById("darkModeTip");

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

            setTimeout(function () {
                hideDarkModeTip();
            }, 8000);
        }
    }

    function hideDarkModeTip() {
        if (darkModeTip && darkModeTip.classList.contains("show")) {
            darkModeTip.classList.remove("show");
            try {
                localStorage.setItem("darkModeTipSeen", "true");
            } catch (e) {

            }
        }
    }

    function setupDarkModeTip() {
        try {
            const tipSeen = localStorage.getItem("darkModeTipSeen");

            if (!tipSeen && darkModeTip) {

                setTimeout(function () {
                    showDarkModeTip();
                }, 2000);

                var tipCloseBtn = darkModeTip.querySelector(".tip-close");
                if (tipCloseBtn) {
                    tipCloseBtn.addEventListener("click", function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        hideDarkModeTip();
                    });
                }

                document.addEventListener("click", function (e) {
                    if (darkModeTip && darkModeTip.classList.contains("show")) {
                        if (!darkModeTip.contains(e.target) && !themeToggle.contains(e.target)) {
                            hideDarkModeTip();
                        }
                    }
                });
            }
        } catch (e) {

        }
    }

    function setupMobileMenu() {
        if (menuToggle && navbar) {
            menuToggle.addEventListener("change", function () {
                if (menuToggle.checked) {
                    navbar.classList.add("active");
                } else {
                    navbar.classList.remove("active");
                }
            });

            var navLinks = document.querySelectorAll("nav a");
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].addEventListener("click", function () {
                    navbar.classList.remove("active");
                    menuToggle.checked = false;
                });
            }
        }
    }

    function handleScroll() {
        var scrollPosition = window.scrollY + 180;
        var sections = document.querySelectorAll("section[id]");
        var allNavLinks = document.querySelectorAll("nav a");

        for (var j = 0; j < allNavLinks.length; j++) {
            allNavLinks[j].classList.remove("active");
        }

        for (var i = 0; i < sections.length; i++) {
            var section = sections[i];
            var sectionTop = section.offsetTop;
            var sectionHeight = section.offsetHeight;
            var sectionId = section.getAttribute("id");
            var navLink = document.querySelector('nav a[href="#' + sectionId + '"]');

            if (navLink && scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLink.classList.add("active");
            }
        }

        var fadeElements = document.querySelectorAll(".fade-in");
        for (var k = 0; k < fadeElements.length; k++) {
            var element = fadeElements[k];
            var rect = element.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) {
                element.classList.add("visible");
            }
        }
    }

    function toggleModal(show) {
        if (modal) {
            if (show) {
                modal.classList.add("show");
                document.body.style.overflow = "hidden";
            } else {
                modal.classList.remove("show");
                document.body.style.overflow = "auto";
                if (form) {
                    form.reset();
                    clearErrors();
                    var successMsg = form.querySelector(".success-message");
                    if (successMsg) {
                        successMsg.remove();
                    }
                }
            }
        }
    }

    function clearErrors() {
        if (form) {
            var errorElements = form.querySelectorAll(".error-message");
            for (var i = 0; i < errorElements.length; i++) {
                errorElements[i].textContent = "";
            }
        }
    }

    function showError(id, msg) {
        var errorElement = document.getElementById(id);
        if (errorElement) {
            errorElement.textContent = msg;
        }
    }

    function validateForm() {
        clearErrors();
        var isValid = true;

        if (form) {
            var nameInput = form.querySelector("#Name");
            var contactInput = form.querySelector("#Contact");
            var messageInput = form.querySelector("#Message");

            var name = nameInput ? nameInput.value.trim() : "";
            var contact = contactInput ? contactInput.value.trim() : "";
            var message = messageInput ? messageInput.value.trim() : "";

            var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var mobilePattern = /^[+]?\d{10,15}$/;

            if (name.length < 2) {
                showError("nameError", "Name must be at least 2 characters");
                isValid = false;
            }

            if (!emailPattern.test(contact) && !mobilePattern.test(contact)) {
                showError("contactError", "Enter valid email or mobile number");
                isValid = false;
            }

            if (message.length < 10) {
                showError("messageError", "Message must be at least 10 characters");
                isValid = false;
            }
        }

        return isValid;
    }

    function setupForm() {
        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();

                if (validateForm()) {
                    var formData = new FormData(form);

                    fetch(form.action, {
                        method: "POST",
                        body: formData,
                        headers: {
                            Accept: "application/json",
                        },
                    })
                        .then(function (response) {
                            if (response.ok) {
                                form.innerHTML = '<div class="success-message"><h4>Message Sent Successfully!</h4><p>Thank you for reaching out. I will reply soon.</p></div>';
                            } else {
                                return response.json().then(function (data) {
                                    var errorMsg = "Something went wrong. Please try again.";
                                    if (data && data.errors && data.errors.length > 0) {
                                        errorMsg = data.errors[0].message;
                                    }
                                    alert(errorMsg);
                                });
                            }
                        })
                        .catch(function (error) {
                            alert("Network error. Please check your connection and try again.");
                        });
                }
            });
        }
    }

    setupThemeToggle();
    setupDarkModeTip();
    setupMobileMenu();
    setupForm();

    if (openBtn) {
        openBtn.addEventListener("click", function () {
            toggleModal(true);
        });
    }

    for (var i = 0; i < closeBtns.length; i++) {
        closeBtns[i].addEventListener("click", function () {
            toggleModal(false);
        });
    }

    window.addEventListener("click", function (e) {
        if (e.target === modal) {
            toggleModal(false);
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            if (modal && modal.classList.contains("show")) {
                toggleModal(false);
            }
            if (darkModeTip && darkModeTip.classList.contains("show")) {
                hideDarkModeTip();
            }
        }
    });

    window.addEventListener("scroll", handleScroll);
    handleScroll();
});

function scrollToSection(sectionId) {
    var section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}