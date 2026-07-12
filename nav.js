/**
 * Site-wide hamburger navigation.
 *
 * To add a new project in the future: add one entry to NAV_DATA below with
 * an `id`, `name`, and a `pages` array. To add a page to an existing
 * project, add one entry to that project's `pages` array. Every href is
 * relative to the site root (no leading slash) — this script resolves it
 * against the current page automatically.
 *
 * Each page includes this script with two data attributes:
 *   data-root  -> path back to the site root from this page ("./" or "../")
 *   data-page  -> the id of the current page, for highlighting + auto-open
 */
(function () {
  var NAV_DATA = [
    {
      id: "creative-developments",
      name: "Creative Developments",
      pages: [
        { id: "cd-home", label: "Home", href: "index.html" }
      ]
    },
    {
      id: "gym-match",
      name: "Gym Match",
      pages: [
        { id: "gym-match-home", label: "Home", href: "gym-match/index.html" },
        { id: "gym-match-support", label: "Support", href: "gym-match/support.html" },
        { id: "gym-match-privacy", label: "Privacy Policy", href: "gym-match/privacy.html" }
      ]
    }
  ];

  var currentScript = document.currentScript;
  var ROOT = (currentScript && currentScript.dataset.root) || "./";
  var CURRENT_PAGE_ID = currentScript && currentScript.dataset.page;

  function resolve(href) {
    return ROOT + href;
  }

  function findProjectByPageId(pageId) {
    for (var i = 0; i < NAV_DATA.length; i++) {
      for (var j = 0; j < NAV_DATA[i].pages.length; j++) {
        if (NAV_DATA[i].pages[j].id === pageId) return NAV_DATA[i];
      }
    }
    return null;
  }

  function el(tag, className, html) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (html !== undefined) node.innerHTML = html;
    return node;
  }

  function buildNav() {
    var root = el("div", "cdnav-root");

    var toggle = el(
      "button",
      "cdnav-toggle",
      '<span class="cdnav-bar"></span><span class="cdnav-bar"></span><span class="cdnav-bar"></span>'
    );
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open menu");
    toggle.setAttribute("aria-expanded", "false");

    var overlay = el("div", "cdnav-overlay");

    var panel = el("aside", "cdnav-panel");
    panel.setAttribute("aria-hidden", "true");

    var track = el("div", "cdnav-track");

    // --- Projects view ---
    var projectsView = el("div", "cdnav-view cdnav-view-projects");
    var projectsHeader = el("div", "cdnav-header");
    projectsHeader.appendChild(el("span", "cdnav-title", "Projects"));
    projectsView.appendChild(projectsHeader);

    var projectsList = el("ul", "cdnav-list");
    NAV_DATA.forEach(function (project) {
      var li = el("li");
      var row = el(
        "button",
        "cdnav-row",
        '<span>' + project.name + "</span>" + '<span class="cdnav-chevron">\u203a</span>'
      );
      row.type = "button";
      row.dataset.projectId = project.id;
      li.appendChild(row);
      projectsList.appendChild(li);
    });
    projectsView.appendChild(projectsList);

    // --- Pages view ---
    var pagesView = el("div", "cdnav-view cdnav-view-pages");
    var pagesHeader = el("div", "cdnav-header");
    var backBtn = el("button", "cdnav-back", '\u2039 Projects');
    backBtn.type = "button";
    pagesHeader.appendChild(backBtn);
    pagesView.appendChild(pagesHeader);

    var projectName = el("div", "cdnav-project-name", "");
    pagesView.appendChild(projectName);

    var pagesList = el("ul", "cdnav-list");
    pagesView.appendChild(pagesList);

    track.appendChild(projectsView);
    track.appendChild(pagesView);
    panel.appendChild(track);

    root.appendChild(toggle);
    root.appendChild(overlay);
    root.appendChild(panel);
    document.body.appendChild(root);

    function renderPages(project) {
      projectName.textContent = project.name;
      pagesList.innerHTML = "";
      project.pages.forEach(function (page) {
        var li = el("li");
        var isCurrent = page.id === CURRENT_PAGE_ID;
        var a = el(
          "a",
          "cdnav-page-link" + (isCurrent ? " is-current" : ""),
          page.label
        );
        a.href = resolve(page.href);
        if (isCurrent) a.setAttribute("aria-current", "page");
        li.appendChild(a);
        pagesList.appendChild(li);
      });
    }

    function showProjects() {
      panel.dataset.view = "projects";
    }

    function showPages(project) {
      renderPages(project);
      panel.dataset.view = "pages";
    }

    function openPanel() {
      root.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      panel.setAttribute("aria-hidden", "false");

      var currentProject = CURRENT_PAGE_ID && findProjectByPageId(CURRENT_PAGE_ID);
      if (currentProject) {
        showPages(currentProject);
      } else {
        showProjects();
      }
    }

    function closePanel() {
      root.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      panel.setAttribute("aria-hidden", "true");
    }

    toggle.addEventListener("click", function () {
      if (root.classList.contains("is-open")) {
        closePanel();
      } else {
        openPanel();
      }
    });

    overlay.addEventListener("click", closePanel);
    backBtn.addEventListener("click", showProjects);

    projectsList.addEventListener("click", function (e) {
      var row = e.target.closest(".cdnav-row");
      if (!row) return;
      var project = NAV_DATA.filter(function (p) {
        return p.id === row.dataset.projectId;
      })[0];
      if (project) showPages(project);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.classList.contains("is-open")) {
        closePanel();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildNav);
  } else {
    buildNav();
  }
})();
