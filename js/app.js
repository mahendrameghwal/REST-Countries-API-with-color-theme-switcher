const datacontainer = document.querySelector(".data-container");
const searchInput = document.querySelector(".search");
const regionFilterBtn = document.querySelector(".region-filter");
const dropdownOptions = document.querySelectorAll(".region");
const dropdownAll = document.querySelector(".all");
const modal = document.getElementById("countryModal");
const modalBody = document.getElementById("modal-body");
const closeModalBtn = document.querySelector(".close-btn");

const URL = "https://restcountries.com/v3.1/all";
let countryData = [];

function GetCountry() {
  fetch(URL)
    .then((resp) => resp.json())
    .then((countries) => {
      countryData = countries;
      displayCountries(countries);
    });
}

function displayCountries(countries) {
  datacontainer.innerHTML = ''; // Clear previous content
  countries.forEach((country) => showcountry(country));
}

GetCountry();

function showcountry(country) {
  const createEl = document.createElement("div");
  createEl.classList.add("card-body");
  datacontainer.appendChild(createEl);

  createEl.innerHTML = `
    <img src="${country.flags["png"]}" alt="" class="country-image">
    <p class="countryname">${country.name.common}</p>
    <p class="population">Population: ${country.population.toLocaleString()}</p>
    <p class="countryRegion">Region: ${country.region}</p>
    <p class="capital">Capital: ${country.capital || "N/A"}</p>`;
  
  // Open country details in a modal on click
  createEl.addEventListener("click", () => showCountryDetails(country));
}

// Search filter
searchInput.addEventListener("input", (e) => {
  const searchValue = e.target.value.toLowerCase();
  const filteredCountries = countryData.filter((country) =>
    country.name.common.toLowerCase().includes(searchValue)
  );
  displayCountries(filteredCountries);
});

// Region filter
regionFilterBtn.addEventListener("click", () => {
  document.querySelector(".dropdownHide").classList.toggle("dropshow");
});

dropdownOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    const region = e.target.textContent;
    const filteredCountries = countryData.filter(
      (country) => country.region === region
    );
    displayCountries(filteredCountries);
    document.querySelector(".dropdownHide").classList.remove("dropshow");
  });
});

dropdownAll.addEventListener("click", () => {
  displayCountries(countryData);
  document.querySelector(".dropdownHide").classList.remove("dropshow");
});

// Population filter
const minPopInput = document.getElementById('min-population');
const maxPopInput = document.getElementById('max-population');
const popFilterBtn = document.querySelector('.pop-filter-btn');

popFilterBtn.addEventListener('click', () => {
  const minPop = parseInt(minPopInput.value) || 0;
  const maxPop = parseInt(maxPopInput.value) || Infinity;

  const filteredCountries = countryData.filter(country => {
    const population = country.population;
    return population >= minPop && population <= maxPop;
  });

  displayCountries(filteredCountries);
});

// Show country details in a modal
function showCountryDetails(country) {
  modalBody.innerHTML = `
    <h2>${country.name.common}</h2>
    <img src="${country.flags["png"]}" alt="Flag" style="width: 100px;">
    <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
    <p><strong>Region:</strong> ${country.region}</p>
    <p><strong>Capital:</strong> ${country.capital || "N/A"}</p>
    <p><strong>Languages:</strong> ${Object.values(country.languages || {}).join(", ")}</p>
    <p><strong>Currency:</strong> ${Object.values(country.currencies || {}).map(c => c.name).join(", ")}</p>
    <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
  `;
  modal.style.display = "flex";
}

// Close modal
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close modal when clicking outside of content
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});

// Dark Mode
const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  const darkModeEnabled = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", darkModeEnabled ? "enabled" : "disabled");
});

// Load theme on page load
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("darkMode");
  if (savedTheme === "enabled") {
    document.body.classList.add("dark-mode");
  }
});
