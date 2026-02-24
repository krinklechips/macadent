import type { LayoutItemType } from "./types";
import { LAYOUT_ITEM_DEFINITIONS } from "./types";

type PaletteProps = {
  armedType: LayoutItemType | null;
  onArmTool: (type: LayoutItemType) => void;
};

type IconProps = {
  type: LayoutItemType;
};

function PaletteIcon({ type }: IconProps) {
  const commonProps = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const
  };

  switch (type) {
    case "dental-chair":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M6 11h8v4H6z" />
          <path {...commonProps} d="M10 7h6v4h-6z" />
          <path {...commonProps} d="M6 15v2M14 15v2M17 11h2v6" />
        </svg>
      );
    case "dentist-stool":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...commonProps} cx="12" cy="8" r="3.2" />
          <path {...commonProps} d="M12 11.3V16M8.3 16h7.4M10 16l-2 2M14 16l2 2" />
        </svg>
      );
    case "assistant-stool":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle {...commonProps} cx="12" cy="8" r="2.8" />
          <path {...commonProps} d="M12 10.8V16M9 16h6M10 16l-2 2M14 16l2 2" />
          <path {...commonProps} d="M7 7h2M15 7h2" />
        </svg>
      );
    case "cabinet":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...commonProps} x="4" y="6" width="16" height="12" rx="1.8" />
          <path {...commonProps} d="M12 6v12M10 10h1M13 10h1M10 14h1M13 14h1" />
        </svg>
      );
    case "sink":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...commonProps} x="5" y="10" width="14" height="7" rx="2.4" />
          <path {...commonProps} d="M9 10V7.5a2.5 2.5 0 0 1 5 0V9" />
          <path {...commonProps} d="M12 12.4v2.8" />
        </svg>
      );
    case "sterilizer":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...commonProps} x="5" y="5" width="14" height="14" rx="2.2" />
          <circle {...commonProps} cx="12" cy="11.5" r="3.2" />
          <path {...commonProps} d="M9 16h6" />
        </svg>
      );
    case "xray-imaging":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M8 6v5l-3 3 3 3v1" />
          <rect {...commonProps} x="11" y="6" width="8" height="12" rx="1.8" />
          <path {...commonProps} d="M13 9h4M13 12h4M13 15h3" />
        </svg>
      );
    case "pc-workstation":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect {...commonProps} x="4" y="5" width="16" height="10" rx="1.8" />
          <path {...commonProps} d="M10 19h4M12 15v4" />
          <rect {...commonProps} x="6.5" y="7.5" width="8" height="4" rx="0.8" />
        </svg>
      );
    case "reception-desk":
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path {...commonProps} d="M4 8h12a4 4 0 0 1 4 4v4H4z" />
          <path {...commonProps} d="M8 12h4M6 16h12" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Palette({ armedType, onArmTool }: PaletteProps) {
  return (
    <aside className="layout-palette" aria-label="Floor plan item palette">
      <p className="layout-panel-title">Palette</p>
      <p className="layout-panel-note">Drag to canvas, or tap then tap floor to place.</p>
      <div className="layout-palette-grid">
        {LAYOUT_ITEM_DEFINITIONS.map((item) => (
          <button
            key={item.type}
            type="button"
            className={`layout-palette-item${armedType === item.type ? " active" : ""}`}
            draggable
            onClick={() => onArmTool(item.type)}
            onDragStart={(event) => {
              event.dataTransfer.setData("application/x-layout-item", item.type);
              event.dataTransfer.effectAllowed = "copy";
            }}
          >
            <span className="layout-palette-icon" aria-hidden="true">
              <PaletteIcon type={item.type} />
            </span>
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
