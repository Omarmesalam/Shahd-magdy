/**
 * SUPABASE INTEGRATION MODULE
 * Provides authentication, database CRUD, and storage upload capabilities
 * with seamless fallback to localStorage.
 */

const SUPABASE_CONFIG_KEY = "shahd_supabase_credentials_v1";

const SupabaseIntegration = {
  client: null,

  getConfig: function() {
    try {
      const stored = localStorage.getItem(SUPABASE_CONFIG_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not load Supabase config:", e);
    }
    return {
      url: "",
      anonKey: "",
      configured: false
    };
  },

  saveConfig: function(url, anonKey) {
    const config = {
      url: url.trim(),
      anonKey: anonKey.trim(),
      configured: Boolean(url.trim() && anonKey.trim())
    };
    localStorage.setItem(SUPABASE_CONFIG_KEY, JSON.stringify(config));
    this.init();
    return config.configured;
  },

  isConfigured: function() {
    const cfg = this.getConfig();
    return Boolean(cfg.configured && cfg.url && cfg.anonKey && window.supabase);
  },

  init: function() {
    const cfg = this.getConfig();
    if (cfg.configured && window.supabase) {
      try {
        this.client = window.supabase.createClient(cfg.url, cfg.anonKey);
        console.log("Supabase client initialized successfully.");
        return true;
      } catch (e) {
        console.error("Failed to initialize Supabase client:", e);
      }
    }
    return false;
  },

  // Authentication
  signIn: async function(email, password) {
    if (this.isConfigured() && this.client) {
      const { data, error } = await this.client.auth.signInWithPassword({
        email: email,
        password: password
      });
      if (error) throw error;
      return data;
    } else {
      // Local Master Passcode fallback (default: shahd2026 or custom)
      const storedPasscode = localStorage.getItem("shahd_admin_passcode") || "shahd2026";
      if (password === storedPasscode || (email === "shahdmagdy1115@gmail.com" && password === storedPasscode)) {
        const dummySession = {
          user: { email: email || "shahdmagdy1115@gmail.com", role: "admin" },
          token: "local-session-" + Date.now()
        };
        sessionStorage.setItem("shahd_admin_auth", JSON.stringify(dummySession));
        return { session: dummySession, user: dummySession.user };
      } else {
        throw new Error("Invalid password. Default passcode is 'shahd2026' or connect your Supabase.");
      }
    }
  },

  signOut: async function() {
    if (this.isConfigured() && this.client) {
      await this.client.auth.signOut();
    }
    sessionStorage.removeItem("shahd_admin_auth");
  },

  getCurrentUser: async function() {
    if (this.isConfigured() && this.client) {
      const { data: { session } } = await this.client.auth.getSession();
      return session ? session.user : null;
    } else {
      try {
        const auth = sessionStorage.getItem("shahd_admin_auth");
        return auth ? JSON.parse(auth).user : null;
      } catch (e) {
        return null;
      }
    }
  },

  isAuthenticated: async function() {
    const user = await this.getCurrentUser();
    return Boolean(user);
  },

  // Database operations
  fetchProjects: async function() {
    if (!this.isConfigured() || !this.client) return null;
    try {
      const { data, error } = await this.client
        .from("portfolio_projects")
        .select("*")
        .order("order", { ascending: true });

      if (error) {
        console.warn("Supabase query error:", error);
        return null;
      }
      return data;
    } catch (e) {
      console.warn("Supabase fetch failed:", e);
      return null;
    }
  },

  syncProject: async function(project) {
    if (!this.isConfigured() || !this.client) return null;
    try {
      const { data, error } = await this.client
        .from("portfolio_projects")
        .upsert(project, { onConflict: "id" })
        .select();

      if (error) throw error;
      return data;
    } catch (e) {
      console.error("Supabase upsert failed:", e);
      throw e;
    }
  },

  deleteProject: async function(id) {
    if (!this.isConfigured() || !this.client) return null;
    try {
      const { error } = await this.client
        .from("portfolio_projects")
        .delete()
        .eq("id", id);
      if (error) throw error;
    } catch (e) {
      console.error("Supabase delete failed:", e);
      throw e;
    }
  },

  // Storage Upload (Video / Thumbnail)
  uploadMedia: async function(file, bucket = "portfolio-media") {
    if (!this.isConfigured() || !this.client) {
      // Local Base64 or Object URL fallback for immediate offline demonstration
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    }

    try {
      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await this.client.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = this.client.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (e) {
      console.error("Supabase storage upload error:", e);
      throw e;
    }
  }
};

// Auto initialize on load
window.SupabaseIntegration = SupabaseIntegration;
document.addEventListener("DOMContentLoaded", () => {
  SupabaseIntegration.init();
});
