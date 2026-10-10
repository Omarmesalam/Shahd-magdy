/**
 * SHAHD MAGDY PORTFOLIO — PROJECT DATA & STORAGE ENGINE
 * Manages the 14 initial project placeholders, local persistence,
 * and Supabase synchronization.
 */

const DEFAULT_PROJECTS = [
  {
    id: "proj-01",
    order: 1,
    title: "[Editable Project Title 01]",
    category: "Reels",
    description: "[Editable Project Description — Short-form dynamic editing, rhythm matching, typography animation]",
    software: "After Effects + Premiere Pro",
    aspectRatio: "9:16",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-41551-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    client: "Client / Brand 01",
    year: "2026",
    published: true
  },
  {
    id: "proj-02",
    order: 2,
    title: "[Editable Project Title 02]",
    category: "Advertisement",
    description: "[Editable Project Description — Commercial promo, cinematic color grading, sound design]",
    software: "Premiere Pro",
    aspectRatio: "16:9",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-41557-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    client: "Commercial Campaign",
    year: "2026",
    published: true
  },
  {
    id: "proj-03",
    order: 3,
    title: "[Editable Project Title 03]",
    category: "Motion Graphics",
    description: "[Editable Project Description — Kinetic title sequences, 2D vector animation, brand identity]",
    software: "After Effects",
    aspectRatio: "16:9",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-and-data-31913-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80",
    client: "Tech Brand",
    year: "2026",
    published: true
  },
  {
    id: "proj-04",
    order: 4,
    title: "[Editable Project Title 04]",
    category: "Reels",
    description: "[Editable Project Description — Viral pacing, fast-cut transitions, sound sync]",
    software: "Premiere Pro + After Effects",
    aspectRatio: "9:16",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
    client: "Fashion Label",
    year: "2026",
    published: true
  },
  {
    id: "proj-05",
    order: 5,
    title: "[Editable Project Title 05]",
    category: "Advertisement",
    description: "[Editable Project Description — Product showcase, high-end lighting treatment, narrative edit]",
    software: "Premiere Pro",
    aspectRatio: "16:9",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-car-lights-moving-fast-on-a-highway-at-night-42630-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80",
    client: "Automotive / Luxury",
    year: "2026",
    published: true
  },
  {
    id: "proj-06",
    order: 6,
    title: "[Editable Project Title 06]",
    category: "Motion Graphics",
    description: "[Editable Project Description — Logo reveal, 3D camera tracking, glowing particles]",
    software: "After Effects",
    aspectRatio: "16:9",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-animation-42514-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    client: "Creative Studio",
    year: "2026",
    published: true
  },
  {
    id: "proj-07",
    order: 7,
    title: "[Editable Project Title 07]",
    category: "Reels",
    description: "[Editable Project Description — Lifestyle social reel, color accenting, hook pacing]",
    software: "Premiere Pro",
    aspectRatio: "9:16",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-girl-walking-in-front-of-a-mirror-40453-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    client: "Lifestyle Creator",
    year: "2025",
    published: true
  },
  {
    id: "proj-08",
    order: 8,
    title: "[Editable Project Title 08]",
    category: "Advertisement",
    description: "[Editable Project Description — Social ad campaign, high-conversion visual layout, brand badges]",
    software: "Premiere Pro + After Effects",
    aspectRatio: "16:9",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunset-26070-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    client: "Agency Work",
    year: "2025",
    published: true
  },
  {
    id: "proj-09",
    order: 9,
    title: "[Editable Project Title 09]",
    category: "Motion Graphics",
    description: "[Editable Project Description — Infographic motion breakdown, custom lower thirds, smooth curves]",
    software: "After Effects",
    aspectRatio: "16:9",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-network-connection-with-plexus-effect-42790-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    client: "Fintech Client",
    year: "2025",
    published: true
  },
  {
    id: "proj-10",
    order: 10,
    title: "[Editable Project Title 10]",
    category: "Reels",
    description: "[Editable Project Description — Cinematic storytelling reel, beat-matched transitions, voiceover mix]",
    software: "Premiere Pro + After Effects",
    aspectRatio: "9:16",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-skater-doing-a-trick-in-the-street-40914-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
    client: "Urban Culture",
    year: "2025",
    published: true
  },
  {
    id: "proj-11",
    order: 11,
    title: "[Editable Project Title 11]",
    category: "Advertisement",
    description: "[Editable Project Description — Food & beverage promo, macro focus cuts, mouthwatering color grading]",
    software: "Premiere Pro",
    aspectRatio: "16:9",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-coffee-beans-falling-in-slow-motion-41837-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=800&q=80",
    client: "Hospitality Brand",
    year: "2025",
    published: true
  },
  {
    id: "proj-12",
    order: 12,
    title: "[Editable Project Title 12]",
    category: "Motion Graphics",
    description: "[Editable Project Description — Broadcast package, intro stinger, animated typography overlay]",
    software: "After Effects",
    aspectRatio: "16:9",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-futuristic-hud-display-with-data-elements-42512-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    client: "Media Network",
    year: "2025",
    published: true
  },
  {
    id: "proj-13",
    order: 13,
    title: "[Editable Project Title 13]",
    category: "Reels",
    description: "[Editable Project Description — E-commerce showcase reel, zoom transitions, hook-to-CTA flow]",
    software: "Premiere Pro",
    aspectRatio: "9:16",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-woman-applying-makeup-with-a-brush-42171-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
    client: "Beauty Brand",
    year: "2025",
    published: true
  },
  {
    id: "proj-14",
    order: 14,
    title: "[Editable Project Title 14]",
    category: "Advertisement",
    description: "[Editable Project Description — Corporate highlight reel, testimonials pacing, cinematic B-roll edit]",
    software: "Premiere Pro + After Effects",
    aspectRatio: "16:9",
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-silhouette-of-a-camera-operator-filming-at-sunset-34533-large.mp4",
    thumbnailUrl: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80",
    client: "Corporate Partner",
    year: "2025",
    published: true
  }
];

const STORAGE_KEY = "shahd_portfolio_projects_v1";
const SETTINGS_KEY = "shahd_portfolio_settings_v1";

const PortfolioStorage = {
  // Get all projects
  getProjects: async function() {
    // 1. Try Supabase if configured
    if (window.SupabaseIntegration && window.SupabaseIntegration.isConfigured()) {
      try {
        const remoteProjects = await window.SupabaseIntegration.fetchProjects();
        if (remoteProjects && remoteProjects.length > 0) {
          return remoteProjects;
        }
      } catch (err) {
        console.warn("Supabase fetch fallback to local storage:", err);
      }
    }

    // 2. Fallback to LocalStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.sort((a, b) => (a.order || 0) - (b.order || 0));
        }
      }
    } catch (e) {
      console.error("Local storage read error:", e);
    }

    // 3. Initialize default 14 placeholders
    this.saveProjectsLocally(DEFAULT_PROJECTS);
    return [...DEFAULT_PROJECTS];
  },

  // Save projects locally
  saveProjectsLocally: function(projects) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
      window.dispatchEvent(new CustomEvent("portfolio:updated", { detail: { count: projects.length } }));
      return true;
    } catch (e) {
      console.error("Failed to save projects locally:", e);
      return false;
    }
  },

  // Save project (Create or Update)
  saveProject: async function(projectData) {
    let projects = await this.getProjects();
    const isEdit = Boolean(projectData.id);

    if (isEdit) {
      const index = projects.findIndex(p => p.id === projectData.id);
      if (index !== -1) {
        projects[index] = { ...projects[index], ...projectData };
      } else {
        projects.push(projectData);
      }
    } else {
      const newId = "proj-" + Date.now();
      const newOrder = projects.length > 0 ? Math.max(...projects.map(p => p.order || 0)) + 1 : 1;
      const newProj = {
        id: newId,
        order: newOrder,
        published: true,
        year: new Date().getFullYear().toString(),
        ...projectData
      };
      projects.push(newProj);
    }

    // Save to local storage
    this.saveProjectsLocally(projects);

    // Sync to Supabase if configured
    if (window.SupabaseIntegration && window.SupabaseIntegration.isConfigured()) {
      try {
        await window.SupabaseIntegration.syncProject(projectData);
      } catch (err) {
        console.warn("Supabase sync warning:", err);
      }
    }

    return true;
  },

  // Delete project
  deleteProject: async function(id) {
    let projects = await this.getProjects();
    projects = projects.filter(p => p.id !== id);
    this.saveProjectsLocally(projects);

    if (window.SupabaseIntegration && window.SupabaseIntegration.isConfigured()) {
      try {
        await window.SupabaseIntegration.deleteProject(id);
      } catch (err) {
        console.warn("Supabase delete warning:", err);
      }
    }
    return true;
  },

  // Reorder projects
  reorderProject: async function(id, direction) {
    let projects = await this.getProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= projects.length) return;

    // Swap order values
    const tempOrder = projects[index].order;
    projects[index].order = projects[targetIndex].order;
    projects[targetIndex].order = tempOrder;

    // Swap positions
    const temp = projects[index];
    projects[index] = projects[targetIndex];
    projects[targetIndex] = temp;

    this.saveProjectsLocally(projects);
    return projects;
  },

  // Reset to default 14 placeholders
  resetDefaults: function() {
    this.saveProjectsLocally(DEFAULT_PROJECTS);
    return [...DEFAULT_PROJECTS];
  },

  // Export / Import JSON for backup
  exportJSON: async function() {
    const projects = await this.getProjects();
    return JSON.stringify(projects, null, 2);
  },

  importJSON: function(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (Array.isArray(data)) {
        this.saveProjectsLocally(data);
        return true;
      }
    } catch (e) {
      console.error("Invalid JSON:", e);
    }
    return false;
  }
};

window.PortfolioStorage = PortfolioStorage;
