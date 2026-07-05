const header = document.querySelector("[data-header]");
const revealItems = [...document.querySelectorAll(".reveal")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const fleetCards = [...document.querySelectorAll("[data-category]")];
const bookingForm = document.querySelector("[data-booking-form]");

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

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));

    fleetCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });

    document.querySelector("#fleet").scrollIntoView({ behavior: "smooth", block: "start" });
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

window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
setDateMinimums();
