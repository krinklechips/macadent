export type LayoutItemType =
  | "dental-chair"
  | "dentist-stool"
  | "assistant-stool"
  | "cabinet"
  | "sink"
  | "sterilizer"
  | "xray-imaging"
  | "pc-workstation"
  | "reception-desk";

export type LayoutItem = {
  id: string;
  type: LayoutItemType;
  x: number;
  y: number;
  rotation: number;
  width?: number;
  height?: number;
};

export type LayoutZoneType =
  | "operatory-room"
  | "imaging-room"
  | "sterilization-room"
  | "consult-room"
  | "reception-zone"
  | "storage-zone";

export type LayoutZone = {
  id: string;
  type: LayoutZoneType;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
};

export type LayoutItemDefinition = {
  type: LayoutItemType;
  label: string;
  footprint: {
    width: number;
    height: number;
  };
  resizable?: boolean;
  minSize?: {
    width: number;
    height: number;
  };
  maxSize?: {
    width: number;
    height: number;
  };
};

export type LayoutZoneDefinition = {
  type: LayoutZoneType;
  label: string;
  color: string;
  defaultSize: {
    width: number;
    height: number;
  };
};

export const GRID_SIZE = 20;

export const SCALE_LABEL = "1 square = 0.5m";

export const LAYOUT_ITEM_DEFINITIONS: LayoutItemDefinition[] = [
  {
    type: "dental-chair",
    label: "Dental Chair",
    footprint: { width: 130, height: 88 }
  },
  {
    type: "dentist-stool",
    label: "Dentist Stool",
    footprint: { width: 104, height: 78 }
  },
  {
    type: "assistant-stool",
    label: "Assistant Stool",
    footprint: { width: 104, height: 78 }
  },
  {
    type: "cabinet",
    label: "Cabinet",
    footprint: { width: 132, height: 84 },
    resizable: true,
    minSize: { width: 100, height: 70 },
    maxSize: { width: 260, height: 140 }
  },
  {
    type: "sink",
    label: "Sink",
    footprint: { width: 118, height: 82 }
  },
  {
    type: "sterilizer",
    label: "Sterilizer",
    footprint: { width: 124, height: 84 }
  },
  {
    type: "xray-imaging",
    label: "X-ray / Imaging",
    footprint: { width: 138, height: 92 }
  },
  {
    type: "pc-workstation",
    label: "PC / Workstation",
    footprint: { width: 128, height: 86 },
    resizable: true,
    minSize: { width: 100, height: 74 },
    maxSize: { width: 200, height: 120 }
  },
  {
    type: "reception-desk",
    label: "Reception Desk",
    footprint: { width: 152, height: 90 },
    resizable: true,
    minSize: { width: 120, height: 70 },
    maxSize: { width: 320, height: 180 }
  }
];

export const LAYOUT_ZONE_DEFINITIONS: LayoutZoneDefinition[] = [
  {
    type: "operatory-room",
    label: "Operatory Room",
    color: "#2f6fff",
    defaultSize: { width: 240, height: 180 }
  },
  {
    type: "imaging-room",
    label: "Imaging Room",
    color: "#0ea5a6",
    defaultSize: { width: 200, height: 160 }
  },
  {
    type: "sterilization-room",
    label: "Sterilization",
    color: "#10b981",
    defaultSize: { width: 220, height: 160 }
  },
  {
    type: "consult-room",
    label: "Consult Room",
    color: "#8b5cf6",
    defaultSize: { width: 180, height: 140 }
  },
  {
    type: "reception-zone",
    label: "Reception",
    color: "#f59e0b",
    defaultSize: { width: 240, height: 140 }
  },
  {
    type: "storage-zone",
    label: "Storage / Utility",
    color: "#64748b",
    defaultSize: { width: 180, height: 120 }
  }
];

export const LAYOUT_ITEM_BY_TYPE = Object.fromEntries(
  LAYOUT_ITEM_DEFINITIONS.map((definition) => [definition.type, definition])
) as Record<LayoutItemType, LayoutItemDefinition>;

export const LAYOUT_ZONE_BY_TYPE = Object.fromEntries(
  LAYOUT_ZONE_DEFINITIONS.map((definition) => [definition.type, definition])
) as Record<LayoutZoneType, LayoutZoneDefinition>;

export const isLayoutItemType = (value: string): value is LayoutItemType =>
  LAYOUT_ITEM_DEFINITIONS.some((definition) => definition.type === value);

export const isLayoutZoneType = (value: string): value is LayoutZoneType =>
  LAYOUT_ZONE_DEFINITIONS.some((definition) => definition.type === value);
