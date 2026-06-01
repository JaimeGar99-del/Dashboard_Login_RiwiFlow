// --- INYECCIÓN DE CONFIGURACIÓN TAILWIND Y ESTILOS GLOBALES ---

export function injectTailwindConfig() {
  const cfg = document.createElement("script");
  cfg.textContent = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface-container-lowest":  "#ffffff",
            "surface-container-low":     "#f9f1ff",
            "surface-container":         "#f3ebf9",
            "surface-container-high":    "#ede5f3",
            "surface-container-highest": "#e8e0ee",
            "surface-dim":               "#dfd7e5",
            "surface-bright":            "#fef7ff",
            "surface":                   "#fef7ff",
            "surface-variant":           "#e8e0ee",
            "background":                "#fef7ff",
            "primary":                    "#5300b7",
            "primary-container":          "#6d28d9",
            "primary-fixed":              "#ebddff",
            "primary-fixed-dim":          "#d3bbff",
            "inverse-primary":            "#d3bbff",
            "on-primary":                 "#ffffff",
            "on-primary-fixed":           "#250059",
            "on-primary-fixed-variant":   "#5b00c5",
            "on-primary-container":       "#dac5ff",
            "secondary":                  "#5d5d67",
            "secondary-container":        "#e3e1ed",
            "secondary-fixed":            "#e3e1ed",
            "secondary-fixed-dim":        "#c7c5d1",
            "on-secondary":               "#ffffff",
            "on-secondary-fixed":         "#1a1b23",
            "on-secondary-fixed-variant": "#46464f",
            "on-secondary-container":     "#64636d",
            "tertiary":                   "#6b3000",
            "tertiary-container":         "#8f4200",
            "tertiary-fixed":             "#ffdbc8",
            "tertiary-fixed-dim":         "#ffb68b",
            "on-tertiary":                "#ffffff",
            "on-tertiary-fixed":          "#321300",
            "on-tertiary-fixed-variant":  "#743400",
            "on-tertiary-container":      "#ffc19e",
            "error":              "#ba1a1a",
            "error-container":    "#ffdad6",
            "on-error":           "#ffffff",
            "on-error-container": "#93000a",
            "outline":             "#7b7486",
            "outline-variant":     "#ccc3d7",
            "on-surface":          "#1d1a24",
            "on-surface-variant":  "#4a4455",
            "on-background":       "#1d1a24",
            "inverse-surface":     "#332f39",
            "inverse-on-surface":  "#f6eefc",
            "surface-tint":        "#7331df",
          },
          borderRadius: {
            DEFAULT: "0.125rem",
            lg:      "0.25rem",
            xl:      "0.5rem",
            full:    "0.75rem",
          },
          spacing: {
            xs:             "4px",
            sm:             "8px",
            md:             "16px",
            lg:             "24px",
            xl:             "32px",
            xxl:            "48px",
            gutter:         "24px",
            "margin-mobile":"16px",
          },
          fontFamily: { sans: ["Inter", "sans-serif"] },
          fontSize: {
            "body-sm":     ["14px", { lineHeight: "20px", fontWeight: "400" }],
            "body-md":     ["16px", { lineHeight: "24px", fontWeight: "400" }],
            "label-sm":    ["12px", { lineHeight: "16px", letterSpacing: "0.05em", fontWeight: "600" }],
            "label-md":    ["14px", { lineHeight: "20px", fontWeight: "500" }],
            "title-sm":    ["18px", { lineHeight: "28px", fontWeight: "500" }],
            "headline-md": ["24px", { lineHeight: "32px", letterSpacing: "-0.01em", fontWeight: "600" }],
            "display-lg":  ["36px", { lineHeight: "44px", letterSpacing: "-0.02em", fontWeight: "600" }],
          },
        },
      },
    };`;
  document.head.appendChild(cfg);
}

export function injectGlobalStyles() {
  const style = document.createElement("style");
  style.textContent = `
    body { font-family: 'Inter', sans-serif; background: #fef7ff; }
    .material-symbols-outlined {
      font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24;
      display: inline-block;
      vertical-align: middle;
      line-height: 1;
    }
    .input-focus-ring:focus {
      outline: none;
      border-color: #5300b7;
      box-shadow: 0 0 0 2px #ebddff;
    }
    .task-card { transition: all 0.2s ease; }
    .task-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(83, 0, 183, 0.10); }
    .kanban-column { min-width: 280px; }
    .custom-scrollbar::-webkit-scrollbar       { width: 6px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #ccc3d7; border-radius: 10px; }
    #toast-container > div { transition: opacity 0.3s ease, transform 0.3s ease; }
    @keyframes fadeInOverlay { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUpModal  { from { opacity: 0; transform: translateY(24px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
  `;
  document.head.appendChild(style);
}
