const businessName = "NOIR Men's Grooming Studio";
const businessPhone = "+91 70105 08392";
const businessWhatsApp = "917010508392";
const businessAddress = "24, Example Street<br>Madurai, Tamil Nadu";
const businessInstagram = "";
const businessHours = "Monday — Saturday<br>9:00 AM — 9:00 PM";

const businessLogo = document.getElementById("businessLogo");

if (businessLogo) {
    businessLogo.textContent = businessName.split(" ")[0];
}
const addressElement = document.getElementById("businessAddress");
const phoneElement = document.getElementById("businessPhone");

if (addressElement) {
    addressElement.innerHTML = businessAddress;
}

if (phoneElement) {
    phoneElement.textContent = businessPhone;
}

// business hours
const hoursElement = document.getElementById("businessHours");

if (hoursElement) {
    hoursElement.innerHTML = businessHours;
}

// -------------------------------------------------------------------------------------

const whatsappButton = document.getElementById("whatsappBooking");

if (whatsappButton) {
    whatsappButton.addEventListener("click", function (event) {
        event.preventDefault();

        const phoneNumber = businessWhatsApp;

        const message = `Hi! I'd like to book an appointment at ${businessName}.`;

        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

        window.open(whatsappUrl, "_blank");
    });
}

/*reveal*/

const revealElements = document.querySelectorAll(".reveal");

function revealOnScroll() {
    revealElements.forEach(function (element) {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (elementTop < windowHeight - 100 && elementTop > -element.offsetHeight + 100) {
            element.classList.add("active");
        } else {
            element.classList.remove("active");
        }
    });
}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// hamburg
/* mobile menu */
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", function () {
        menuToggle.classList.toggle("active");
        navLinks.classList.toggle("active");
    });
}

/* page trans */
const pageLinks = document.querySelectorAll("a");

pageLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        const href = link.getAttribute("href");

        if (!href || href.startsWith("#") || link.target === "_blank") {
            return;
        }

        if (href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) {
            return;
        }

        event.preventDefault();

        document.body.classList.add("page-exit");

        setTimeout(function () {
            window.location.href = href;
        }, 400);
    });
});