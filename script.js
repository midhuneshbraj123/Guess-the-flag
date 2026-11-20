const API_URL = "https://restcountries.com/v3.1/all?fields=name,flags,region,capital";

const countriesContainer = document.getElementById("countriesContainer");
const loadingEl = document.getElementById("loading");
const searchInput = document.getElementById("searchInput");
const regionFilter = document.getElementById("regionFilter");

let allCountries = [];

// Fetch data from API
async function fetchCountries() {
    try {
        const response = await fetch(API_URL);
        allCountries = await response.json();
        
        // Sort alphabetically by common name
        allCountries.sort((a, b) => a.name.common.localeCompare(b.name.common));
        
        loadingEl.style.display = "none";
        renderCountries(allCountries);
    } catch (error) {
        loadingEl.textContent = "Failed to load country data. Please check your internet connection.";
        console.error("Error fetching data:", error);
    }
}

// Render countries grouped by region sections
function renderCountries(countries) {
    countriesContainer.innerHTML = "";

    if (countries.length === 0) {
        countriesContainer.innerHTML = `<p class="loading">No countries found matching your criteria.</p>`;
        return;
    }

    // Group countries by region
    const regions = countries.reduce((acc, country) => {
        const region = country.region || "Other";
        if (!acc[region]) {
            acc[region] = [];
        }
        acc[region].push(country);
        return acc;
    }, {});

    // Create sections for each region
    for (const [region, regionCountries] of Object.entries(regions)) {
        const section = document.createElement("div");
        section.classList.add("region-section");

        const title = document.createElement("h2");
        title.classList.add("region-title");
        title.textContent = region;
        section.appendChild(title);

        const grid = document.createElement("div");
        grid.classList.add("countries-grid");

        regionCountries.forEach(country => {
            const card = document.createElement("div");
            card.classList.add("country-card");

            const capital = country.capital ? country.capital[0] : "N/A";
            const flagUrl = country.flags.svg || country.flags.png;

            card.innerHTML = `
                <div class="flag-container">
                    <img src="${flagUrl}" alt="Flag of ${country.name.common}" loading="lazy">
                </div>
                <div class="country-info">
                    <h3>${country.name.common}</h3>
                    <p><strong>Capital:</strong> ${capital}</p>
                </div>
            `;
            grid.appendChild(card);
        });

        section.appendChild(grid);
        countriesContainer.appendChild(section);
    }
}

// Filter logic for search bar and dropdown
function filterCountries() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedRegion = regionFilter.value;

    const filtered = allCountries.filter(country => {
        const matchesSearch = country.name.common.toLowerCase().includes(searchTerm);
        const matchesRegion = selectedRegion === "all" || country.region === selectedRegion;
        return matchesSearch && matchesRegion;
    });

    renderCountries(filtered);
}

// Event Listeners
searchInput.addEventListener("input", filterCountries);
regionFilter.addEventListener("change", filterCountries);

// Initialize app on load
fetchCountries();