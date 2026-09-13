const mainHeader = document.getElementById('mainHeader');

window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        mainHeader.classList.add('scrolled');
    } else {
        mainHeader.classList.remove('scrolled');
    }
});

/* Mobile nav drawer */
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const mobileNavOverlay = document.getElementById('mobileNavOverlay');
const mobileNavClose = document.getElementById('mobileNavClose');

function openMobileNav() {
    mobileNav.classList.add('open');
    mobileNavOverlay.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
    mobileNav.classList.remove('open');
    mobileNavOverlay.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openMobileNav);
mobileNavClose.addEventListener('click', closeMobileNav);
mobileNavOverlay.addEventListener('click', closeMobileNav);
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMobileNav));
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.classList.contains('open')) closeMobileNav();
});

/* FAQ accordion */
document.querySelectorAll('.faq-question').forEach((q) => {
    q.addEventListener('click', () => {
        const item = q.parentElement;
        const answer = item.querySelector('.faq-answer');
        const isOpen = item.classList.contains('open');

        document.querySelectorAll('.faq-item.open').forEach((openItem) => {
            openItem.classList.remove('open');
            openItem.querySelector('.faq-answer').style.maxHeight = null;
            openItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
        });

        if (!isOpen) {
            item.classList.add('open');
            answer.style.maxHeight = answer.scrollHeight + 'px';
            q.setAttribute('aria-expanded', 'true');
        }
    });
});

/* Portfolio filter */
document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        document.querySelectorAll('.portfolio-item').forEach((item) => {
            item.style.display = (filter === 'all' || item.dataset.cat === filter) ? '' : 'none';
        });
    });
});

/* Portfolio modal */
const projects = [
    {
        title: "Golden hour portraits", cat: "Portrait session", location: "Cairo, Egypt",
        desc: "A relaxed outdoor portrait session built around warm evening light, natural movement, and understated styling.",
        type: "Portrait", style: "Natural light",
        img: "images/golden_hour.jfif",
        link: "/work/golden-hour-portraits"
    },
    {
        title: "Class of 2026", cat: "Graduation photography", location: "Alexandria, Egypt",
        desc: "A celebratory graduation session mixing campus landmarks with candid, unposed moments among friends.",
        type: "Graduation", style: "Documentary",
        img: "images/grad1.jpg",
        link: "/work/class-of-2026"
    },
    {
        title: "Nour & Youssef", cat: "Couples photography", location: "Cairo, Egypt",
        desc: "An honest, easygoing couples session shot at dusk along the riverside, built around real conversation rather than posed setups.",
        type: "Couples", style: "Editorial",
        img: "images/couple2.jfif",
        link: "/work/nour-and-youssef"
    },
    {
        title: "The founder's portrait", cat: "Personal branding", location: "Cairo, Egypt",
        desc: "A personal branding session for a founder preparing a new website — confident, considered portraits paired with in-context working shots.",
        type: "Branding", style: "Studio + environmental",
        img: "images/founder.jfif",
        link: "/work/the-founders-portrait"
    },
    {
        title: "Quiet mornings", cat: "Portrait session", location: "Tanta, Egypt",
        desc: "A soft, early-morning portrait session leaning into stillness and natural window light.",
        type: "Portrait", style: "Natural light",
        img: "images/morning1.jpg",
        link: "/work/quiet-mornings"
    }
];

const modalBackdrop = document.getElementById('modalBackdrop');
let lastFocused = null;

function openModal(index) {
    const p = projects[index];
    document.getElementById('modalImg').src = p.img;
    document.getElementById('modalImg').alt = p.title;
    document.getElementById('modalCat').textContent = p.cat;
    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalLoc').textContent = p.location;
    document.getElementById('modalDesc').textContent = p.desc;
    document.getElementById('modalMetaType').textContent = p.type;
    document.getElementById('modalMetaStyle').textContent = p.style;
    document.getElementById('modalLink').setAttribute('href', p.link);

    lastFocused = document.activeElement;
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalClose').focus();
}

function closeModal() {
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
}

document.querySelectorAll('.portfolio-item').forEach((item) => {
    item.addEventListener('click', () => openModal(parseInt(item.dataset.project, 10)));
});

document.getElementById('modalClose').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('open')) closeModal();
});


/* Booking form */
const bookingForm = document.getElementById('bookingForm');
bookingForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const checks = {
        name: bookingForm.name.value.trim().length > 1,
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(bookingForm.email.value.trim()),
        date: bookingForm.date.value.trim().length > 0,
        type: bookingForm.type.value.trim().length > 0,
        details: bookingForm.details.value.trim().length > 4
    };

    let valid = true;
    Object.keys(checks).forEach((key) => {
        const field = bookingForm.querySelector(`[data-field="${key}"]`);
        field.classList.toggle('invalid', !checks[key]);
        if (!checks[key]) valid = false;
    });

    if (!valid) return;

    const submitBtn = bookingForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const formData = new FormData(bookingForm);
    formData.append('access_key', '3ded4b80-c6c7-45e9-a300-11fe68def20a');
    formData.append('subject', 'New booking inquiry — Luma Studio');
    formData.append('to', 'haneenhaytham67@gmail.com');

    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        if (!res.ok) throw new Error('Send failed');

        bookingForm.querySelectorAll('.form-field, button[type="submit"]').forEach((el) => {
            el.style.display = 'none';
        });
        document.getElementById('formSuccess').classList.add('show');
    } catch (err) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send inquiry';
        alert('Something went wrong sending your inquiry — please try again.');
    }
});

