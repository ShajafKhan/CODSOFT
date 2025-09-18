document.addEventListener("DOMContentLoaded", function () {
    console.log("Page loaded successfully!");
    console.log("Portfolio website initialized");

    var menuToggle = document.getElementById("menu-toggle");
    var navbar = document.getElementById("navbar");
    var modal = document.getElementById("messageModal");
    var openBtn = document.getElementById("sendMessageBtn");
    var closeBtns = document.querySelectorAll(".close-btn");
    var form = document.getElementById("messageForm");

    function setupMobileMenu() {
        console.log("Setting up mobile menu...");
        if (menuToggle && navbar) {
            menuToggle.addEventListener("change", function () {
                console.log("Menu toggle clicked, state:", menuToggle.checked);
                if (menuToggle.checked == true) {
                    navbar.classList.add("active");
                    console.log("Mobile menu opened");
                } else {
                    navbar.classList.remove("active");
                    console.log("Mobile menu closed");
                }
            });

            var navLinks = document.querySelectorAll("nav a");
            for (var i = 0; i < navLinks.length; i++) {
                navLinks[i].addEventListener("click", function () {
                    console.log("Nav link clicked, closing menu");
                    navbar.classList.remove("active");
                    menuToggle.checked = false;
                });
            }
        } else {
            console.log("Warning: Mobile menu elements not found!");
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
                console.log("Active section:", sectionId);
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
        console.log("Toggling modal:", show);
        if (modal) {
            if (show == true) {
                modal.classList.add("show");
                document.body.style.overflow = "hidden";
                console.log("Modal opened");
            } else {
                modal.classList.remove("show");
                document.body.style.overflow = "auto";
                console.log("Modal closed");
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
        console.log("Clearing form errors");
        if (form) {
            var errorElements = form.querySelectorAll(".error-message");
            for (var i = 0; i < errorElements.length; i++) {
                errorElements[i].textContent = "";
            }
        }
    }

    function showError(id, msg) {
        console.log("Showing error for " + id + ":", msg);
        var errorElement = document.getElementById(id);
        if (errorElement) {
            errorElement.textContent = msg;
        }
    }

    function validateForm() {
        console.log("Validating form...");
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

            if (emailPattern.test(contact) == false && mobilePattern.test(contact) == false) {
                showError("contactError", "Enter valid email or mobile number");
                isValid = false;
            }

            if (message.length < 10) {
                showError("messageError", "Message must be at least 10 characters");
                isValid = false;
            }
        }

        console.log("Form validation result:", isValid);
        return isValid;
    }

    function setupForm() {
        console.log("Setting up form handlers...");
        if (form) {
            form.addEventListener("submit", function (e) {
                e.preventDefault();
                console.log("Form submitted");

                if (validateForm() == true) {
                    console.log("Validation passed, sending form...");
                    var formData = new FormData(form);

                    fetch(form.action, {
                        method: "POST",
                        body: formData,
                        headers: {
                            Accept: "application/json",
                        },
                    })
                        .then(function (response) {
                            console.log("Got response:", response.ok);
                            if (response.ok == true) {
                                form.innerHTML = '<div class="success-message"><h4>Message Sent Successfully!</h4><p>Thank you for reaching out. I will reply soon.</p></div>';
                                console.log("Message sent successfully!");
                            } else {
                                response.json().then(function (data) {
                                    var errorMsg = "Something went wrong. Please try again.";
                                    if (data && data.errors && data.errors.length > 0) {
                                        errorMsg = data.errors[0].message;
                                    }
                                    alert(errorMsg);
                                    console.log("Server error:", errorMsg);
                                });
                            }
                        })
                        .catch(function (error) {
                            console.error("Network error:", error);
                            alert("Network error. Please check your connection and try again.");
                        });
                } else {
                    console.log("Validation failed");
                }
            });
        }
    }

    setupMobileMenu();
    setupForm();

    if (openBtn) {
        openBtn.addEventListener("click", function () {
            console.log("Open modal button clicked");
            toggleModal(true);
        });
    }

    for (var i = 0; i < closeBtns.length; i++) {
        closeBtns[i].addEventListener("click", function () {
            console.log("Close button clicked");
            toggleModal(false);
        });
    }

    window.addEventListener("click", function (e) {
        if (e.target == modal) {
            console.log("Clicked outside modal");
            toggleModal(false);
        }
    });

    document.addEventListener("keydown", function (e) {
        if (e.key == "Escape" && modal && modal.classList.contains("show")) {
            console.log("Escape key pressed");
            toggleModal(false);
        }
    });

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    console.log("All JavaScript setup complete!");
});

console.log("JavaScript file loaded completely");

window.addEventListener("resize", function () {
    console.log("Window resized to: " + window.innerWidth + "x" + window.innerHeight);
});

function scrollToSection(sectionId) {
    console.log("Scrolling to section:", sectionId);
    var section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
        console.log("Scrolled to:", sectionId);
    } else {
        console.log("Section not found:", sectionId);
    }
}