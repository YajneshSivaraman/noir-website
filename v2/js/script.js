// Business details
const businessName = "NOIR Men's Grooming Studio";
const businessPhone = "+91 70105 08392";
const businessWhatsApp = "917010508392";
const businessAddress = "24, Example Street<br>Madurai, Tamil Nadu";
const businessHours = "Monday — Saturday<br>9:00 AM — 9:00 PM";

// Dynamic logo
const businessLogo = document.getElementById("businessLogo");

if (businessLogo) {
    businessLogo.textContent = businessName.split(" ")[0];
}

// Dynamic contact details
const addressElement = document.getElementById("businessAddress");
const phoneElement = document.getElementById("businessPhone");
const hoursElement = document.getElementById("businessHours");

if (addressElement) {
    addressElement.innerHTML = businessAddress;
}

if (phoneElement) {
    phoneElement.textContent = businessPhone;
}

if (hoursElement) {
    hoursElement.innerHTML = businessHours;
}

// WhatsApp booking
const whatsappButton = document.getElementById("whatsappBooking");

if (whatsappButton) {
    whatsappButton.addEventListener("click", function (event) {
        event.preventDefault();

        const message = `Hi! I'd like to book an appointment at ${businessName}.`;
        const whatsappUrl = `https://wa.me/${businessWhatsApp}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");
    });
}

// Mobile menu
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        menuToggle.classList.toggle("active");
        navLinks.classList.toggle("active");
    });
}

// Scroll reveal
const revealElements = document.querySelectorAll(
    ".reveal, " +
    ".hero-content, .hero-image, .intro, .featured-services, .feature-image, .experience, .booking-cta, " +
    ".gallery-hero-content, .gallery-hero-image, .gallery-intro, .gallery-feature, .gallery-split, .gallery-wide, .gallery-statement, .gallery-final, .gallery-closing, " +
    ".contact-hero-content, .contact-hero-image, .contact-details, .contact-booking, .contact-location, .contact-closing, " +
    ".about-hero-copy, .about-hero-image, .about-intro, .about-story, .about-values, .about-quote, .about-cta, " +
    ".services-hero-text, .services-hero-image, .service-category, .services-cta"
);

const revealObserver = new IntersectionObserver(
    function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            } else {
                entry.target.classList.remove("visible");
            }
        });
    },
    {
        threshold: 0.12,
        rootMargin: "0px 0px -60px 0px"
    }
);

revealElements.forEach(function (element) {
    revealObserver.observe(element);
});

// Page entrance
window.addEventListener("load", function () {
    requestAnimationFrame(function () {
        document.body.classList.add("page-loaded");
    });
});

// Smooth page transitions
const pageLinks = document.querySelectorAll("a");

pageLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        const href = link.getAttribute("href");

        if (!href || href.startsWith("#") || link.target === "_blank") {
            return;
        }

        if (
            href.startsWith("http") ||
            href.startsWith("mailto:") ||
            href.startsWith("tel:")
        ) {
            return;
        }

        event.preventDefault();

        document.body.classList.add("page-exit");

        setTimeout(function () {
            window.location.href = href;
        }, 450);
    });
});