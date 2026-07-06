const header = document.querySelector("[data-header]");
const revealItems = [...document.querySelectorAll(".reveal")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const priceTiles = [...document.querySelectorAll("[data-price-filter]")];
const fleetCards = [...document.querySelectorAll("[data-category]")];
const bookingForm = document.querySelector("[data-booking-form]");
const bookingType = bookingForm.querySelector('select[name="type"]');
const heroImage = document.querySelector("[data-hero-image]");
const heroCaption = document.querySelector("[data-hero-caption]");
const heroProgress = document.querySelector("[data-hero-progress]");

const heroSlides = [
  {
    src: "assets/grey-hilux-road.jpeg",
    caption: "Double cabs from $120/day",
  },
  {
    src: "assets/white-fortuner-road.jpeg",
    caption: "SUVs from $120/day",
  },
  {
    src: "assets/mercedes-cla-silver.jpeg",
    caption: "Luxury Mercedes from $150/day",
  },
  {
    src: "assets/minibus-white.jpeg",
    caption: "Minibuses from $100/day",
  },
  {
    src: "assets/mazda-demio-blue.jpeg",
    caption: "Fuel savers from $50/day",
  },
  {
    src: "assets/honda-vezel-black.jpeg",
    caption: "Mid-size SUVs from $70/day",
  },
];

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle("is-visible", entry.isIntersecting);
      entry.target.classList.toggle("is-fading", !entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -8% 0px",
  }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 45, 220)}ms`;
  revealObserver.observe(item);
});

const typeLabels = {
  fuel: "Fuel Saver - from $50/day",
  midsize: "Mid-size SUV - from $70/day",
  doublecab: "Double Cab - from $120/day",
  suv: "SUV - from $120/day",
  luxury: "Luxury Mercedes - from $150/day",
  minibus: "Minibus - from $100/day",
};

const applyFleetFilter = (filter, shouldScroll = true) => {
  filterButtons.forEach((item) => item.classList.toggle("active", item.dataset.filter === filter));
  priceTiles.forEach((item) => item.classList.toggle("active", item.dataset.priceFilter === filter));

  fleetCards.forEach((card) => {
    const categories = card.dataset.category.split(" ");
    const shouldShow = filter === "all" || categories.includes(filter);
    card.classList.toggle("is-hidden", !shouldShow);
  });

  if (typeLabels[filter]) {
    bookingType.value = typeLabels[filter];
  }

  if (shouldScroll) {
    document.querySelector("#fleet").scrollIntoView({ behavior: "smooth", block: "start" });
  }
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    applyFleetFilter(button.dataset.filter);
  });
});

priceTiles.forEach((tile) => {
  tile.addEventListener("click", () => {
    applyFleetFilter(tile.dataset.priceFilter);
  });
});

bookingForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(bookingForm);
  const pickup = data.get("pickup") || "not specified";
  const dropoff = data.get("dropoff") || "not specified";
  const from = data.get("from") || "not specified";
  const to = data.get("to") || "not specified";
  const type = data.get("type") || "SUV";
  const message = `Hi Fambai, I would like to rent a ${type}. Pick-up: ${pickup}. Drop-off: ${dropoff}. Dates: ${from} to ${to}.`;

  window.location.href = `https://wa.me/263780391836?text=${encodeURIComponent(message)}`;
});

const setDateMinimums = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const dateString = `${yyyy}-${mm}-${dd}`;

  bookingForm.querySelectorAll('input[type="date"]').forEach((input) => {
    input.min = dateString;
  });
};

let heroSlideIndex = 0;

const restartHeroProgress = () => {
  if (!heroProgress) return;

  heroProgress.style.animation = "none";
  heroProgress.offsetHeight;
  heroProgress.style.animation = "";
};

const showHeroSlide = (nextIndex) => {
  if (!heroImage || !heroCaption) return;

  const slide = heroSlides[nextIndex];
  heroImage.classList.add("is-switching");

  setTimeout(() => {
    heroImage.src = slide.src;
    heroCaption.textContent = slide.caption;
    heroImage.classList.remove("is-switching");
    restartHeroProgress();
  }, 420);
};

const startHeroCarousel = () => {
  if (!heroImage || heroSlides.length < 2) return;

  restartHeroProgress();
  setInterval(() => {
    heroSlideIndex = (heroSlideIndex + 1) % heroSlides.length;
    showHeroSlide(heroSlideIndex);
  }, 8000);
};

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
setDateMinimums();
startHeroCarousel();
