// --- TAILWIND CONFIGURATION AND GLOBAL STYLES INJECTION ---

export function injectTailwindConfig() {
  const cfg = document.createElement("script");
  cfg.textContent = `
    tailwind.config = {
      darkMode: "class",
      theme: {
        extend: {
          colors: {
            "surface-container-lowest":  "var(--surface-container-lowest)",
            "surface-container-low":     "var(--surface-container-low)",
            "surface-container":         "var(--surface-container)",
            "surface-container-high":    "var(--surface-container-high)",
            "surface-container-highest": "var(--surface-container-highest)",
            "surface-dim":               "var(--surface-dim)",
            "surface-bright":            "var(--surface-bright)",
            "surface":                   "var(--surface)",
            "surface-variant":           "var(--surface-variant)",
            "background":                "var(--background)",
            "primary":                   "var(--primary)",
            "primary-container":         "var(--primary-container)",
            "primary-fixed":             "var(--primary-fixed)",
            "primary-fixed-dim":         "var(--primary-fixed-dim)",
            "inverse-primary":           "var(--inverse-primary)",
            "on-primary":                "var(--on-primary)",
            "on-primary-fixed":          "var(--on-primary-fixed)",
            "on-primary-fixed-variant":  "var(--on-primary-fixed-variant)",
            "on-primary-container":      "var(--on-primary-container)",
            "secondary":                 "var(--secondary)",
            "secondary-container":       "var(--secondary-container)",
            "secondary-fixed":           "var(--secondary-fixed)",
            "secondary-fixed-dim":       "var(--secondary-fixed-dim)",
            "on-secondary":              "var(--on-secondary)",
            "on-secondary-fixed":        "var(--on-secondary-fixed)",
            "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",
            "on-secondary-container":    "var(--on-secondary-container)",
            "tertiary":                  "var(--tertiary)",
            "tertiary-container":        "var(--tertiary-container)",
            "tertiary-fixed":            "var(--tertiary-fixed)",
            "tertiary-fixed-dim":        "var(--tertiary-fixed-dim)",
            "on-tertiary":               "var(--on-tertiary)",
            "on-tertiary-fixed":         "var(--on-tertiary-fixed)",
            "on-tertiary-fixed-variant": "var(--on-tertiary-fixed-variant)",
            "on-tertiary-container":     "var(--on-tertiary-container)",
            "error":                     "var(--error)",
            "error-container":           "var(--error-container)",
            "on-error":                  "var(--on-error)",
            "on-error-container":        "var(--on-error-container)",
            "outline":                   "var(--outline)",
            "outline-variant":           "var(--outline-variant)",
            "on-surface":                "var(--on-surface)",
            "on-surface-variant":        "var(--on-surface-variant)",
            "on-background":             "var(--on-background)",
            "inverse-surface":           "var(--inverse-surface)",
            "inverse-on-surface":        "var(--inverse-on-surface)",
            "surface-tint":              "var(--surface-tint)",
          },
          borderRadius: {
            DEFAULT: "0.125rem",
            lg:      "0.25rem",
            xl:      "0.5rem",
            full:    "0.75rem",
          },
          spacing: {
            xs:              "4px",
            sm:              "8px",
            md:              "16px",
            lg:              "24px",
            xl:              "32px",
            xxl:             "48px",
            gutter:          "24px",
            "margin-mobile": "16px",
          },
          fontFamily: {
            sans: ["Inter", "sans-serif"]
          },
          fontSize: {
            "body-sm": [
              "14px",
              { lineHeight: "20px", fontWeight: "400" }
            ],
            "body-md": [
              "16px",
              { lineHeight: "24px", fontWeight: "400" }
            ],
            "label-sm": [
              "12px",
              {
                lineHeight: "16px",
                letterSpacing: "0.05em",
                fontWeight: "600"
              }
            ],
            "label-md": [
              "14px",
              { lineHeight: "20px", fontWeight: "500" }
            ],
            "title-sm": [
              "18px",
              { lineHeight: "28px", fontWeight: "500" }
            ],
            "headline-md": [
              "24px",
              {
                lineHeight: "32px",
                letterSpacing: "-0.01em",
                fontWeight: "600"
              }
            ],
            "display-lg": [
              "36px",
              {
                lineHeight: "44px",
                letterSpacing: "-0.02em",
                fontWeight: "600"
              }
            ],
          },
        },
      },
    };
  `;
  document.head.appendChild(cfg);
}
export function injectGlobalStyles() {
  const style = document.createElement("style");

  style.textContent = `
    :root {
      --surface-container-lowest: #ffffff;
      --surface-container-low: #f9f1ff;
      --surface-container: #f3ebf9;
      --surface-container-high: #ede5f3;
      --surface-container-highest: #e8e0ee;
      --surface-dim: #dfd7e5;
      --surface-bright: #fef7ff;
      --surface: #fef7ff;
      --surface-variant: #e8e0ee;
      --background: #fef7ff;
      --primary: #5300b7;
      --primary-container: #6d28d9;
      --primary-fixed: #ebddff;
      --primary-fixed-dim: #d3bbff;
      --inverse-primary: #d3bbff;
      --on-primary: #ffffff;
      --on-primary-fixed: #250059;
      --on-primary-fixed-variant: #5b00c5;
      --on-primary-container: #dac5ff;
      --secondary: #5d5d67;
      --secondary-container: #e3e1ed;
      --secondary-fixed: #e3e1ed;
      --secondary-fixed-dim: #c7c5d1;
      --on-secondary: #ffffff;
      --on-secondary-fixed: #1a1b23;
      --on-secondary-fixed-variant: #46464f;
      --on-secondary-container: #64636d;
      --tertiary: #6b3000;
      --tertiary-container: #8f4200;
      --tertiary-fixed: #ffdbc8;
      --tertiary-fixed-dim: #ffb68b;
      --on-tertiary: #ffffff;
      --on-tertiary-fixed: #321300;
      --on-tertiary-fixed-variant: #743400;
      --on-tertiary-container: #ffc19e;
      --error: #ba1a1a;
      --error-container: #ffdad6;
      --on-error: #ffffff;
      --on-error-container: #93000a;
      --outline: #7b7486;
      --outline-variant: #ccc3d7;
      --on-surface: #1d1a24;
      --on-surface-variant: #4a4455;
      --on-background: #1d1a24;
      --inverse-surface: #332f39;
      --inverse-on-surface: #f6eefc;
      --surface-tint: #7331df;
    }

    .dark {
      --surface-container-lowest: #0f0d14;
      --surface-container-low: #16141b;
      --surface-container: #1a1820;
      --surface-container-high: #221f29;
      --surface-container-highest: #2a2734;
      --surface-dim: #110f15;
      --surface-bright: #312e3b;
      --surface: #1a1820;
      --surface-variant: #2a2734;
      --background: #110f15;
      --primary: #a88dff;
      --primary-container: #3a2c5a;
      --primary-fixed: #2f224b;
      --primary-fixed-dim: #48376e;
      --inverse-primary: #5300b7;
      --on-primary: #20085a;
      --on-primary-fixed: #f3edff;
      --on-primary-fixed-variant: #bdaaff;
      --on-primary-container: #f3edff;
      --secondary: #a3a0b1;
      --secondary-container: #2c2a35;
      --secondary-fixed: #2d2b36;
      --secondary-fixed-dim: #43414f;
      --on-secondary: #26242e;
      --on-secondary-fixed: #e5e1e6;
      --on-secondary-fixed-variant: #a3a0b1;
      --on-secondary-container: #e5e1e6;
      --tertiary: #ffb2a0;
      --tertiary-container: #471d15;
      --tertiary-fixed: #ffdad2;
      --tertiary-fixed-dim: #ffb2a0;
      --on-tertiary: #531f16;
      --on-tertiary-fixed: #ffe4de;
      --on-tertiary-fixed-variant: #471d15;
      --on-tertiary-container: #ffe4de;
      --error: #ffb4ab;
      --error-container: #4f100b;
      --on-error: #531f1a;
      --on-error-container: #ffe4e0;
      --outline: #625f69;
      --outline-variant: #39373f;
      --on-surface: #e5e1e6;
      --on-surface-variant: #a5a1ab;
      --on-background: #e5e1e6;
      --inverse-surface: #e5e1e6;
      --inverse-on-surface: #1a1820;
      --surface-tint: #a88dff;
    }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--background);
    }
    .material-symbols-outlined {
      font-variation-settings:
        "FILL" 0,
        "wght" 400,
        "GRAD" 0,
        "opsz" 24;
      display: inline-block;
      vertical-align: middle;
      line-height: 1;
    }
    .input-focus-ring:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-fixed);
    }
    .task-card {
      transition: all 0.2s ease;
    }
    .task-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 16px rgba(83, 0, 183, 0.10);
    }
    .kanban-column {
      min-width: 280px;
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: transparent;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: var(--outline-variant);
      border-radius: 10px;
    }
    #toast-container > div {
      transition:
        opacity 0.3s ease,
        transform 0.3s ease;
    }
    @keyframes fadeInOverlay {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes slideUpModal {
      from {
        opacity: 0;
        transform: translateY(24px) scale(0.97);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `;
  document.head.appendChild(style);
}