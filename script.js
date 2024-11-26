// Add this security function at the top of your script.js
function sanitizeInput(input) {
    return input.replace(/[<>]/g, ''); // Basic XSS prevention
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navigation background change on scroll
window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    if (window.scrollY > 50) {
        nav.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        nav.style.background = 'rgba(0, 0, 0, 0.9)';
    }
});

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Form submission handling
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show loading state
    const button = this.querySelector('button');
    const originalText = button.textContent;
    button.textContent = 'Sending...';
    button.disabled = true;

    // Get and sanitize form values
    const senderName = sanitizeInput(document.getElementById('name').value);
    const senderEmail = sanitizeInput(document.getElementById('email').value);
    const message = sanitizeInput(document.getElementById('message').value);

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(senderEmail)) {
        alert('Please enter a valid email address');
        button.textContent = originalText;
        button.disabled = false;
        return;
    }

    // Rate limiting (prevent spam)
    const lastSubmission = localStorage.getItem('lastSubmission');
    const now = Date.now();
    if (lastSubmission && now - parseInt(lastSubmission) < 30000) { // 30 seconds cooldown
        alert('Please wait 30 seconds before sending another message');
        button.textContent = originalText;
        button.disabled = false;
        return;
    }

    // Prepare the email parameters with additional security
    const templateParams = {
        to_name: "Ijlal",
        from_name: senderName,
        from_email: senderEmail,
        message: message,
        reply_to: senderEmail,
        'g-recaptcha-response': '', // If you add reCAPTCHA later
    };

    // Send the email using EmailJS with error handling
    emailjs.send('service_mfqi7ot', 'template_fsc9j0s', templateParams)
        .then(function(response) {
            if (response.status === 200) {
                console.log('SUCCESS!', response.status, response.text);
                alert(`Message sent successfully!\nFrom: ${senderName} (${senderEmail})`);
                document.getElementById('contact-form').reset();
                localStorage.setItem('lastSubmission', now.toString());
            } else {
                throw new Error('Email sending failed');
            }
        })
        .catch(function(error) {
            console.error('FAILED...', error);
            alert('Failed to send message. Please try again later.');
        })
        .finally(function() {
            button.textContent = originalText;
            button.disabled = false;
        });
});

// Animation on scroll
window.addEventListener('scroll', function() {
    const gameCards = document.querySelectorAll('.game-card');
    const statItems = document.querySelectorAll('.stat-item');
    
    gameCards.forEach(card => {
        if (isElementInViewport(card)) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
    
    statItems.forEach(item => {
        if (isElementInViewport(item)) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add protection against common attacks
document.addEventListener('DOMContentLoaded', function() {
    // Prevent clickjacking
    if (window.self !== window.top) {
        window.top.location = window.self.location;
    }

    // Disable right-click (basic protection)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

    // Disable developer tools shortcut (basic protection)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
            e.preventDefault();
        }
    });
}); 