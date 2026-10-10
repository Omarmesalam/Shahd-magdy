/**
 * SHAHD MAGDY — PRIVATE ADMIN DASHBOARD CONTROLLER
 * Full management system for projects, authentication, Supabase sync,
 * reordering, publishing, and file uploads.
 */

document.addEventListener("DOMContentLoaded", async () => {
  // Elements
  const authContainer = document.getElementById("authContainer");
  const dashboardShell = document.getElementById("dashboardShell");
  const loginForm = document.getElementById("loginForm");
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");
  const authError = document.getElementById("authError");
  const btnLogout = document.getElementById("btnLogout");

  // Project List Elements
  const projectList = document.getElementById("projectList");
  const btnAddNew = document.getElementById("btnAddNew");
  const projectModal = document.getElementById("projectModal");
  const modalClose = document.getElementById("modalClose");
  const modalBackdrop = document.getElementById("modalBackdrop");
  const modalTitle = document.getElementById("modalTitle");
  const projectForm = document.getElementById("projectForm");

  // Form Fields
  const fieldId = document.getElementById("fieldId");
  const fieldTitle = document.getElementById("fieldTitle");
  const fieldCategory = document.getElementById("fieldCategory");
  const fieldDescription = document.getElementById("fieldDescription");
  const fieldSoftware = document.getElementById("fieldSoftware");
  const fieldVideoUrl = document.getElementById("fieldVideoUrl");
  const fieldVideoFile = document.getElementById("fieldVideoFile");
  const fieldThumbnailUrl = document.getElementById("fieldThumbnailUrl");
  const fieldThumbnailFile = document.getElementById("fieldThumbnailFile");
  const fieldAspectRatio = document.getElementById("fieldAspectRatio");
  const fieldPublished = document.getElementById("fieldPublished");

  // Settings & Tabs
  const tabProjects = document.getElementById("tabProjects");
  const tabSettings = document.getElementById("tabSettings");
  const viewProjects = document.getElementById("viewProjects");
  const viewSettings = document.getElementById("viewSettings");
  const supabaseForm = document.getElementById("supabaseForm");
  const inputSupabaseUrl = document.getElementById("inputSupabaseUrl");
  const inputSupabaseKey = document.getElementById("inputSupabaseKey");
  const supabaseStatus = document.getElementById("supabaseStatus");
  const btnExportJson = document.getElementById("btnExportJson");
  const btnImportJson = document.getElementById("btnImportJson");
  const fileImportJson = document.getElementById("fileImportJson");
  const btnResetDefaults = document.getElementById("btnResetDefaults");

  let projects = [];

  // -------------------------------------------------------------------------
  // 1. AUTHENTICATION
  // -------------------------------------------------------------------------
  async function checkAuth() {
    const isAuthed = await window.SupabaseIntegration.isAuthenticated();
    if (isAuthed) {
      showDashboard();
    } else {
      showLogin();
    }
  }

  function showLogin() {
    authContainer.style.display = "flex";
    dashboardShell.style.display = "none";
  }

  function showDashboard() {
    authContainer.style.display = "none";
    dashboardShell.style.display = "flex";
    loadProjects();
    loadSupabaseSettings();
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    authError.style.display = "none";
    const email = loginEmail.value.trim();
    const pass = loginPassword.value.trim();

    try {
      await window.SupabaseIntegration.signIn(email, pass);
      showDashboard();
    } catch (err) {
      authError.textContent = err.message || "Invalid credentials.";
      authError.style.display = "block";
    }
  });

  btnLogout.addEventListener("click", async () => {
    await window.SupabaseIntegration.signOut();
    showLogin();
  });

  // -------------------------------------------------------------------------
  // 2. PROJECT LIST RENDERING & MANAGEMENT
  // -------------------------------------------------------------------------
  async function loadProjects() {
    projects = await window.PortfolioStorage.getProjects();
    renderProjectList();
  }

  function renderProjectList() {
    if (!projectList) return;

    if (projects.length === 0) {
      projectList.innerHTML = `<div style="text-align: center; padding: 48px; color: var(--admin-muted);">No projects found. Click "+ ADD NEW PROJECT" to create one.</div>`;
      return;
    }

    projectList.innerHTML = projects.map((p, idx) => {
      const orderNum = String(idx + 1).padStart(2, "0");
      const isPublished = p.published !== false;
      const thumb = p.thumbnailUrl || "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=400&q=80";

      return `
        <div class="project-item" data-id="${p.id}">
          <div class="project-item__order">${orderNum}</div>
          <img src="${thumb}" alt="${escapeHtml(p.title)}" class="project-item__thumb" />
          <div class="project-item__details">
            <h4 class="project-item__title">${escapeHtml(p.title)}</h4>
            <div class="project-item__meta">
              <span>${escapeHtml(p.software || "Premiere Pro")}</span>
              <span>•</span>
              <span>${p.aspectRatio || "16:9"}</span>
            </div>
          </div>
          <div class="project-item__category">${escapeHtml(p.category || "Reels")}</div>
          <div>
            <span class="project-item__status ${isPublished ? 'project-item__status--published' : 'project-item__status--draft'}">
              ${isPublished ? 'Published' : 'Hidden'}
            </span>
          </div>
          <div class="project-item__actions">
            <button class="btn-action btn-action--reorder" onclick="handleReorder('${p.id}', 'up')" title="Move Up">↑</button>
            <button class="btn-action btn-action--reorder" onclick="handleReorder('${p.id}', 'down')" title="Move Down">↓</button>
            <button class="btn-action" onclick="handleTogglePublish('${p.id}')">
              ${isPublished ? 'Hide' : 'Publish'}
            </button>
            <button class="btn-action" onclick="handleEdit('${p.id}')">Edit</button>
            <button class="btn-action btn-action--delete" onclick="handleDelete('${p.id}')">Delete</button>
          </div>
        </div>
      `;
    }).join("");
  }

  function escapeHtml(str) {
    if (!str) return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // -------------------------------------------------------------------------
  // 3. MODAL ACTIONS (ADD / EDIT)
  // -------------------------------------------------------------------------
  function openModal(isEdit = false, project = null) {
    projectModal.classList.add("is-open");
    modalTitle.textContent = isEdit ? "EDIT PROJECT" : "ADD NEW PROJECT";
    projectForm.reset();

    if (isEdit && project) {
      fieldId.value = project.id || "";
      fieldTitle.value = project.title || "";
      fieldCategory.value = project.category || "Reels";
      fieldDescription.value = project.description || "";
      fieldSoftware.value = project.software || "";
      fieldVideoUrl.value = project.videoUrl || "";
      fieldThumbnailUrl.value = project.thumbnailUrl || "";
      fieldAspectRatio.value = project.aspectRatio || "9:16";
      fieldPublished.checked = project.published !== false;
    } else {
      fieldId.value = "";
      fieldCategory.value = "Reels";
      fieldAspectRatio.value = "9:16";
      fieldPublished.checked = true;
    }
  }

  function closeModal() {
    projectModal.classList.remove("is-open");
  }

  btnAddNew.addEventListener("click", () => openModal(false));
  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);

  // Form Submit
  projectForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = projectForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "SAVING...";
    submitBtn.disabled = true;

    try {
      let videoUrl = fieldVideoUrl.value.trim();
      let thumbnailUrl = fieldThumbnailUrl.value.trim();

      // Handle direct video file upload if provided
      if (fieldVideoFile.files && fieldVideoFile.files[0]) {
        videoUrl = await window.SupabaseIntegration.uploadMedia(fieldVideoFile.files[0], "portfolio-media");
      }

      // Handle direct thumbnail file upload if provided
      if (fieldThumbnailFile.files && fieldThumbnailFile.files[0]) {
        thumbnailUrl = await window.SupabaseIntegration.uploadMedia(fieldThumbnailFile.files[0], "portfolio-media");
      }

      const projectData = {
        title: fieldTitle.value.trim() || "Untitled Project",
        category: fieldCategory.value,
        description: fieldDescription.value.trim(),
        software: fieldSoftware.value.trim(),
        videoUrl: videoUrl,
        thumbnailUrl: thumbnailUrl,
        aspectRatio: fieldAspectRatio.value,
        published: fieldPublished.checked
      };

      if (fieldId.value) {
        projectData.id = fieldId.value;
      }

      await window.PortfolioStorage.saveProject(projectData);
      closeModal();
      await loadProjects();
    } catch (err) {
      alert("Error saving project: " + err.message);
    } finally {
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }
  });

  // Global window functions for inline onclick handlers
  window.handleEdit = function(id) {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      openModal(true, proj);
    }
  };

  window.handleDelete = async function(id) {
    const proj = projects.find(p => p.id === id);
    const title = proj ? proj.title : "this project";
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await window.PortfolioStorage.deleteProject(id);
      await loadProjects();
    }
  };

  window.handleTogglePublish = async function(id) {
    const proj = projects.find(p => p.id === id);
    if (proj) {
      proj.published = !proj.published;
      await window.PortfolioStorage.saveProject(proj);
      await loadProjects();
    }
  };

  window.handleReorder = async function(id, direction) {
    await window.PortfolioStorage.reorderProject(id, direction);
    await loadProjects();
  };

  // -------------------------------------------------------------------------
  // 4. TABS & SETTINGS
  // -------------------------------------------------------------------------
  tabProjects.addEventListener("click", () => {
    tabProjects.classList.add("is-active");
    tabSettings.classList.remove("is-active");
    viewProjects.style.display = "block";
    viewSettings.classList.remove("is-active");
  });

  tabSettings.addEventListener("click", () => {
    tabSettings.classList.add("is-active");
    tabProjects.classList.remove("is-active");
    viewProjects.style.display = "none";
    viewSettings.classList.add("is-active");
  });

  function loadSupabaseSettings() {
    const cfg = window.SupabaseIntegration.getConfig();
    inputSupabaseUrl.value = cfg.url || "";
    inputSupabaseKey.value = cfg.anonKey || "";

    if (window.SupabaseIntegration.isConfigured()) {
      supabaseStatus.className = "status-badge status-badge--connected";
      supabaseStatus.textContent = "● Connected to Supabase Cloud";
    } else {
      supabaseStatus.className = "status-badge status-badge--local";
      supabaseStatus.textContent = "● Local Storage Mode (Offline Ready)";
    }
  }

  supabaseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = inputSupabaseUrl.value.trim();
    const key = inputSupabaseKey.value.trim();
    window.SupabaseIntegration.saveConfig(url, key);
    loadSupabaseSettings();
    alert("Supabase settings saved successfully!");
  });

  // Export / Import JSON Backup
  btnExportJson.addEventListener("click", async () => {
    const jsonStr = await window.PortfolioStorage.exportJSON();
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `shahd-magdy-portfolio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  btnImportJson.addEventListener("click", () => {
    fileImportJson.click();
  });

  fileImportJson.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      const ok = window.PortfolioStorage.importJSON(event.target.result);
      if (ok) {
        alert("Projects imported successfully!");
        await loadProjects();
      } else {
        alert("Invalid JSON backup file.");
      }
    };
    reader.readAsText(file);
  });

  btnResetDefaults.addEventListener("click", async () => {
    if (confirm("Reset portfolio to the 14 default editable placeholders? This will overwrite local changes.")) {
      window.PortfolioStorage.resetDefaults();
      await loadProjects();
      alert("Reset to default 14 placeholders complete.");
    }
  });

  // Initialize Auth Check
  checkAuth();
});
