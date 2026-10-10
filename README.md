# Shahd Magdy — Luxury Editorial & Cinematic Portfolio

> **VIDEO EDITOR | MOTION GRAPHICS | REELS**  
> *"Turning your ideas into creative visual stories."*

A luxury editorial, dark burgundy cinematic portfolio website and private administration dashboard designed and built for **Shahd Magdy**.

---

## ✦ Key Features

1. **Art Direction & Atmosphere**:
   - Palette: Deep Burgundy (`#5A0F18`), Dark Burgundy (`#2A070C`), Obsidian Black (`#070707`), Off-White (`#F2EEE9`), and subtle antique muted gold accents (`#C5A059`).
   - Atmospheric lighting: Animated SVG organic shapes, dark red light leaks, blurred radial glow, and subtle film grain overlay.
   - Editorial Typography: *Playfair Display* & *Cormorant Garamond* serifs paired with *Inter* modern sans-serif.

2. **Full Creative Curriculum Vitae (CV)**:
   - Personal introduction: 1 year of experience, 2 companies worked with, internship at Market Go with Certificate.
   - Compact luxury editorial CV metrics & service cards.
   - Post-production suite showcase: Adobe After Effects & Adobe Premiere Pro with staggered blur-to-sharp reveal animations.

3. **Horizontal Cinematic Portfolio Strip**:
   - 14 initial editable project placeholders across **Reels**, **Advertisements**, and **Motion Graphics**.
   - Smooth horizontal drag-to-scroll, mobile touch-swipe, and navigation arrows.
   - Interactive category filtering pills.
   - Cinematic Video Lightbox viewer with custom controls (play, pause, next project, previous project, close, keyboard arrow navigation).

4. **Private Admin Dashboard (`admin.html`)**:
   - Hidden authentication route protected by master passcode (`shahd2026`) and optional Supabase Auth.
   - Full CRUD capability:
     - Add new projects with custom title, category, description, software, video URL / file upload, thumbnail URL / file upload.
     - Edit existing projects.
     - Reorder projects (Move Up / Down).
     - Toggle visibility (Publish / Draft).
     - Delete projects.
   - Automatic live reactivity: changes immediately reflect on the public portfolio without touching code or rebuilding!

5. **Cloud Ready (Supabase)**:
   - Works 100% out of the box in offline/local storage mode with the 14 default placeholders.
   - Has a built-in Supabase Cloud configuration panel in the Admin Dashboard to easily connect live cloud database and file storage anytime.

---

## ✦ How to Open & View the Website

Simply double click or open [`index.html`](file:///c:/Users/omarm/OneDrive/Desktop/Replace%20Disk/index.html) in any modern browser (Google Chrome, Microsoft Edge, Brave, Safari, Firefox).

To access the private Admin Dashboard:
- Open [`admin.html`](file:///c:/Users/omarm/OneDrive/Desktop/Replace%20Disk/admin.html)
- Enter the default master passcode: `shahd2026` (or email: `shahdmagdy1115@gmail.com` with `shahd2026`)

---

## ✦ Supabase Setup (Optional Cloud Storage & Sync)

If you wish to host projects on Supabase Cloud:
1. Create a free project at [supabase.com](https://supabase.com).
2. Create a table named `portfolio_projects` in SQL Editor:
   ```sql
   create table portfolio_projects (
     id text primary key,
     "order" integer,
     title text,
     category text,
     description text,
     software text,
     aspectRatio text,
     videoUrl text,
     thumbnailUrl text,
     client text,
     year text,
     published boolean default true,
     created_at timestamp with time zone default timezone('utc'::text, now())
   );

   -- Allow public read access
   alter table portfolio_projects enable row level security;
   create policy "Public can view published projects" on portfolio_projects
     for select using (published = true);

   -- Allow authenticated users to perform all operations
   create policy "Admins can manage projects" on portfolio_projects
     for all using (auth.role() = 'authenticated');
   ```
3. Create a public Storage Bucket named `portfolio-media` for uploaded videos and thumbnails.
4. Go to `admin.html` -> **Cloud & Database Settings**, paste your **Project URL** and **Anon Key**, and click **Save**.

---

## ✦ Contact Information Included

- **Email**: `shahdmagdy1115@gmail.com`
- **Instagram**: `@shahdmesalm5`
- **WhatsApp**: `01224095633`
