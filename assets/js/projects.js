// Project data: each object becomes one card in the Projects section.
// To add a project, copy one object and edit its fields.
// "image" and the link fields are optional; leave them out if you don't have one.
const projects = [
  {
    title: "Court Finder",
    description: "A web app for finding public tennis and pickleball courts nearby, with live busy/free status.",
    image: "assets/img/project-courtfinder.png",
    tools: ["Next.js", "React", "TypeScript", "Supabase", "Mapbox", "Tailwind CSS", "Vitest", "Vercel"],
    highlights: [
      "Browse courts on an interactive map or search by postal code, sorted by distance.",
      "Report and see live busy/free court status, updated in real time.",
      "Filter by sport and amenities, and save favorite courts.",
      "Submit new courts, which go through a pending review before appearing."
    ],
    liveUrl: "https://courtfinder-psi.vercel.app/"
  },
  {
    title: "Fizzio",
    description: "A physical therapy app that corrects exercise form in real time and adapts workouts to recovery progress.",
    tools: ["React Native (Expo)", "TypeScript", "Python", "FastAPI", "MediaPipe", "Supabase"],
    highlights: [
      "Tracks 33 body landmarks on-device to measure joint angles and coach form live.",
      "Uses an AI agent to generate and adjust workout plans from performance and pain feedback.",
      "Shows progress over time, including range of motion, consistency and pain trends."
    ],
    codeUrl: "https://github.com/alex-an0406/GenAI"
  },
  {
    title: "FPGArageBand",
    description: "An interactive music production tool on an FPGA for making drum beats and recording piano and vocals.",
    tools: ["C", "FPGA", "PS/2 input", "VGA graphics", "Real-time audio"],
    highlights: [
      "Runs input polling, graphics rendering and real-time audio processing in parallel.",
      "Mouse-driven drum grid for toggling notes, managing playback and choosing instruments.",
      "Live piano synthesis from the keyboard and push buttons, with octave shifting."
    ],
    codeUrl: "https://github.com/alex-an0406/FPGArageBand"
  },
  {
    title: "GIS Mapping Application",
    description: "A geographic information system in C++ for exploring city maps built from OpenStreetMap data.",
    tools: ["C++", "OpenStreetMap", "EZGL", "GTK"],
    highlights: [
      "Loads real city map data and renders streets, features and points of interest.",
      "Searches streets by partial name and finds intersections between streets.",
      "Computes distances, travel times and paths between intersections."
    ]
  }
];

// Builds the HTML for one project card.
function projectCardHTML(project) {
  const image = project.image
    ? `<img alt="${project.title} screenshot" src="${project.image}" class="activator" style="height: 100%; width: 100%; object-fit: cover" />`
    : `<div class="activator project-placeholder">${project.title}</div>`;

  const highlights = project.highlights.map((item) => `<li>${item}</li>`).join("");

  let links = "";
  if (project.liveUrl) {
    links += `<a aria-label="Visit ${project.title}" href="${project.liveUrl}" target="_blank" data-position="top"
                data-tooltip="View Online" class="btn-floating btn-large waves-effect waves-light blue-grey tooltipped"><i
                class="fa fa-external-link"></i></a> `;
  }
  if (project.codeUrl) {
    links += `<a aria-label="View the source code for ${project.title}" href="${project.codeUrl}" target="_blank" data-position="top"
                data-tooltip="View Source" class="btn-floating btn-large waves-effect waves-light blue-grey tooltipped"><i
                class="fa fa-github"></i></a>`;
  }

  return `
    <div class="col s12 m6 l6">
      <div class="card medium">
        <div class="card-image waves-effect waves-block waves-light">${image}</div>
        <div class="card-content">
          <span class="card-title activator teal-text hoverline">${project.title}<i
              class="mdi-navigation-more-vert right"></i></span>
          <p>${project.description}</p>
        </div>
        <div class="card-reveal">
          <span class="card-title grey-text"><small>Accomplishments</small><i
              class="mdi-navigation-close right"></i></span>
          <ul>
            <li><b>Tools:</b> ${project.tools.join(", ")}</li>
            ${highlights}
          </ul>
          <div class="card-action">${links}</div>
        </div>
      </div>
    </div>`;
}

// How many projects are shown when the page first loads.
const INITIAL_PROJECT_COUNT = 2;

// Reads project data and inserts a card for each one into the container.
// Adds to what's already there, so it can be called again to show more.
function renderProjects(containerId, projectsToShow) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const cardsBefore = container.children.length;
  container.insertAdjacentHTML("beforeend", projectsToShow.map(projectCardHTML).join(""));
  const newCards = Array.from(container.children).slice(cardsBefore);

  // Materialize sets up tooltips on page load, so cards added later need it too.
  // Only the new cards, so tooltips aren't set up twice on the first ones.
  if (window.jQuery && jQuery.fn.tooltip) {
    jQuery(newCards).find(".tooltipped").tooltip();
  }
}

// Shows the first few projects. "Load More" shows the rest, then the same
// button becomes "Show Less", which hides them again.
function setUpProjects() {
  const button = document.getElementById("load-more-btn");
  const container = document.getElementById("project-list");
  let expanded = false;

  renderProjects("project-list", projects.slice(0, INITIAL_PROJECT_COUNT));

  if (!button || !container) return;
  if (projects.length <= INITIAL_PROJECT_COUNT) {
    button.style.display = "none";
    return;
  }

  // The cards after the first few, i.e. the ones Load More adds.
  function extraCards() {
    return Array.from(container.children).slice(INITIAL_PROJECT_COUNT);
  }

  button.addEventListener("click", function () {
    if (!expanded) {
      if (extraCards().length === 0) {
        // First time: build the remaining cards from the data.
        renderProjects("project-list", projects.slice(INITIAL_PROJECT_COUNT));
      } else {
        // Already built earlier: just show them again.
        extraCards().forEach((card) => (card.style.display = ""));
      }
      button.textContent = "Show Less";
    } else {
      extraCards().forEach((card) => (card.style.display = "none"));
      button.textContent = "Load More";
      // Keep the Projects section in view after the page gets shorter.
      document.getElementById("projects").scrollIntoView({ behavior: "smooth" });
    }
    expanded = !expanded;
  });
}

setUpProjects();
