import { useCallback, useEffect, useMemo, useRef, useState, type DragEvent } from "react";
import Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { Circle, Group, Layer, Line, Rect, Stage, Text } from "react-konva";
import Palette from "../components/layout-studio/Palette";
import StudioToolbar from "../components/layout-studio/StudioToolbar";
import {
  GRID_SIZE,
  LAYOUT_ITEM_BY_TYPE,
  LAYOUT_ZONE_BY_TYPE,
  LAYOUT_ZONE_DEFINITIONS,
  SCALE_LABEL,
  type LayoutItem,
  type LayoutItemType,
  type LayoutZone,
  type LayoutZoneType,
  isLayoutItemType,
  isLayoutZoneType
} from "../components/layout-studio/types";

type StageSize = {
  width: number;
  height: number;
};

type RoomRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const STORAGE_KEY = "macadent-layout-studio-v1";
const MIN_ZONE_SIZE = GRID_SIZE * 4;

const snapToGrid = (value: number) => Math.round(value / GRID_SIZE) * GRID_SIZE;
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const overlaps = (
  a: { left: number; right: number; top: number; bottom: number },
  b: { left: number; right: number; top: number; bottom: number }
) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;

const hexToRgba = (hex: string, alpha: number) => {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((char) => `${char}${char}`)
          .join("")
      : normalized;

  const r = Number.parseInt(expanded.slice(0, 2), 16);
  const g = Number.parseInt(expanded.slice(2, 4), 16);
  const b = Number.parseInt(expanded.slice(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const ITEM_TONES: Record<
  LayoutItemType,
  { stroke: string; surface: string; border: string; shadow: string; badge: string }
> = {
  "dental-chair": {
    stroke: "#2563eb",
    surface: "#f7fbff",
    border: "#bfdbfe",
    shadow: hexToRgba("#2563eb", 0.12),
    badge: "#dbeafe"
  },
  "dentist-stool": {
    stroke: "#0ea5a6",
    surface: "#f2fffe",
    border: "#a5f3fc",
    shadow: hexToRgba("#0ea5a6", 0.11),
    badge: "#ccfbf1"
  },
  "assistant-stool": {
    stroke: "#14b8a6",
    surface: "#f1fffc",
    border: "#99f6e4",
    shadow: hexToRgba("#14b8a6", 0.1),
    badge: "#ccfbf1"
  },
  cabinet: {
    stroke: "#475569",
    surface: "#f8fafc",
    border: "#cbd5e1",
    shadow: hexToRgba("#475569", 0.1),
    badge: "#e2e8f0"
  },
  sink: {
    stroke: "#0891b2",
    surface: "#f2fbff",
    border: "#bae6fd",
    shadow: hexToRgba("#0891b2", 0.1),
    badge: "#dbeafe"
  },
  sterilizer: {
    stroke: "#10b981",
    surface: "#f3fff9",
    border: "#a7f3d0",
    shadow: hexToRgba("#10b981", 0.1),
    badge: "#d1fae5"
  },
  "xray-imaging": {
    stroke: "#7c3aed",
    surface: "#fbf8ff",
    border: "#ddd6fe",
    shadow: hexToRgba("#7c3aed", 0.11),
    badge: "#ede9fe"
  },
  "pc-workstation": {
    stroke: "#0f766e",
    surface: "#f1fffb",
    border: "#99f6e4",
    shadow: hexToRgba("#0f766e", 0.1),
    badge: "#ccfbf1"
  },
  "reception-desk": {
    stroke: "#f59e0b",
    surface: "#fffaf0",
    border: "#fde68a",
    shadow: hexToRgba("#f59e0b", 0.12),
    badge: "#fef3c7"
  }
};

const createItemId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `item-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const getRoomRect = ({ width, height }: StageSize): RoomRect => {
  const horizontalMargin = width < 900 ? 24 : 36;
  const verticalMargin = 26;
  const roomWidth = Math.max(280, width - horizontalMargin * 2);
  const roomHeight = Math.max(320, height - verticalMargin * 2);

  return {
    x: (width - roomWidth) / 2,
    y: (height - roomHeight) / 2,
    width: roomWidth,
    height: roomHeight
  };
};

type LayoutStudioState = {
  items: LayoutItem[];
  zones: LayoutZone[];
};

const restoreLayoutState = (): LayoutStudioState => {
  if (typeof window === "undefined") {
    return { items: [], zones: [] };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { items: [], zones: [] };
    }

    const parsed = JSON.parse(raw) as unknown;

    const isValidItem = (entry: unknown): entry is LayoutItem =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as LayoutItem).id === "string" &&
      isLayoutItemType((entry as LayoutItem).type) &&
      typeof (entry as LayoutItem).x === "number" &&
      typeof (entry as LayoutItem).y === "number" &&
      typeof (entry as LayoutItem).rotation === "number" &&
      ((entry as LayoutItem).width === undefined || typeof (entry as LayoutItem).width === "number") &&
      ((entry as LayoutItem).height === undefined || typeof (entry as LayoutItem).height === "number");

    const isValidZone = (entry: unknown): entry is LayoutZone =>
      typeof entry === "object" &&
      entry !== null &&
      typeof (entry as LayoutZone).id === "string" &&
      isLayoutZoneType((entry as LayoutZone).type) &&
      typeof (entry as LayoutZone).label === "string" &&
      typeof (entry as LayoutZone).x === "number" &&
      typeof (entry as LayoutZone).y === "number" &&
      typeof (entry as LayoutZone).width === "number" &&
      typeof (entry as LayoutZone).height === "number" &&
      typeof (entry as LayoutZone).color === "string";

    if (Array.isArray(parsed)) {
      return {
        items: parsed.filter(isValidItem),
        zones: []
      };
    }

    if (typeof parsed === "object" && parsed !== null) {
      const candidate = parsed as { items?: unknown; zones?: unknown };
      return {
        items: Array.isArray(candidate.items) ? candidate.items.filter(isValidItem) : [],
        zones: Array.isArray(candidate.zones) ? candidate.zones.filter(isValidZone) : []
      };
    }

    return { items: [], zones: [] };
  } catch {
    return { items: [], zones: [] };
  }
};

function CanvasGlyph({ type, stroke = "#1b5bd6" }: { type: LayoutItemType; stroke?: string }) {
  const commonStroke = {
    stroke,
    strokeWidth: 1.7,
    lineCap: "round" as const,
    lineJoin: "round" as const
  };

  switch (type) {
    case "dental-chair":
      return (
        <>
          <Rect x={-16} y={-8} width={24} height={12} cornerRadius={3} {...commonStroke} />
          <Rect x={-2} y={-18} width={18} height={10} cornerRadius={3} {...commonStroke} />
          <Line points={[-16, 5, -16, 10]} {...commonStroke} />
          <Line points={[8, 5, 8, 10]} {...commonStroke} />
        </>
      );
    case "dentist-stool":
      return (
        <>
          <Circle x={0} y={-10} radius={5} {...commonStroke} />
          <Line points={[0, -5, 0, 4]} {...commonStroke} />
          <Line points={[-8, 4, 8, 4]} {...commonStroke} />
          <Line points={[-4, 4, -8, 9]} {...commonStroke} />
          <Line points={[4, 4, 8, 9]} {...commonStroke} />
        </>
      );
    case "assistant-stool":
      return (
        <>
          <Circle x={0} y={-10} radius={4.5} {...commonStroke} />
          <Line points={[0, -5, 0, 4]} {...commonStroke} />
          <Line points={[-7, 4, 7, 4]} {...commonStroke} />
          <Line points={[-3, 4, -7, 9]} {...commonStroke} />
          <Line points={[3, 4, 7, 9]} {...commonStroke} />
          <Line points={[-10, -10, -6, -10]} {...commonStroke} />
        </>
      );
    case "cabinet":
      return (
        <>
          <Rect x={-16} y={-16} width={32} height={24} cornerRadius={3} {...commonStroke} />
          <Line points={[0, -16, 0, 8]} {...commonStroke} />
          <Circle x={-4} y={-6} radius={0.9} fill={stroke} />
          <Circle x={4} y={-6} radius={0.9} fill={stroke} />
          <Circle x={-4} y={2} radius={0.9} fill={stroke} />
          <Circle x={4} y={2} radius={0.9} fill={stroke} />
        </>
      );
    case "sink":
      return (
        <>
          <Rect x={-15} y={-8} width={30} height={16} cornerRadius={5} {...commonStroke} />
          <Line points={[-6, -8, -6, -13]} {...commonStroke} />
          <Line points={[-6, -13, 5, -13]} {...commonStroke} />
          <Circle x={0} y={0} radius={2} {...commonStroke} />
        </>
      );
    case "sterilizer":
      return (
        <>
          <Rect x={-15} y={-15} width={30} height={24} cornerRadius={4} {...commonStroke} />
          <Circle x={0} y={-4} radius={6} {...commonStroke} />
          <Line points={[-8, 7, 8, 7]} {...commonStroke} />
        </>
      );
    case "xray-imaging":
      return (
        <>
          <Line points={[-16, -6, -6, -6, -6, 5, -16, 5]} {...commonStroke} />
          <Line points={[-6, -1, -2, -1]} {...commonStroke} />
          <Rect x={1} y={-14} width={14} height={24} cornerRadius={2.5} {...commonStroke} />
          <Line points={[3, -8, 11, -8]} {...commonStroke} />
          <Line points={[3, -2, 11, -2]} {...commonStroke} />
          <Line points={[3, 4, 9, 4]} {...commonStroke} />
        </>
      );
    case "pc-workstation":
      return (
        <>
          <Rect x={-16} y={-14} width={32} height={20} cornerRadius={3} {...commonStroke} />
          <Rect x={-9} y={-9} width={12} height={8} cornerRadius={1.5} {...commonStroke} />
          <Line points={[-3, 6, -3, 12]} {...commonStroke} />
          <Line points={[-8, 12, 4, 12]} {...commonStroke} />
        </>
      );
    case "reception-desk":
      return (
        <>
          <Line points={[-16, -10, 10, -10, 16, -4, 16, 8, -16, 8, -16, -10]} {...commonStroke} />
          <Line points={[-4, 1, 6, 1]} {...commonStroke} />
        </>
      );
    default:
      return null;
  }
}

export default function LayoutStudio() {
  const stageRef = useRef<Konva.Stage | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);
  const initialStateRef = useRef<LayoutStudioState | null>(null);

  if (!initialStateRef.current) {
    initialStateRef.current = restoreLayoutState();
  }

  const [items, setItems] = useState<LayoutItem[]>(() => initialStateRef.current?.items ?? []);
  const [zones, setZones] = useState<LayoutZone[]>(() => initialStateRef.current?.zones ?? []);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);
  const [armedType, setArmedType] = useState<LayoutItemType | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [draggingZoneId, setDraggingZoneId] = useState<string | null>(null);
  const [stageSize, setStageSize] = useState<StageSize>({ width: 1040, height: 680 });
  const [zoom, setZoom] = useState(1);

  const roomRect = useMemo(() => getRoomRect(stageSize), [stageSize]);
  const contentOffset = useMemo(
    () => ({
      x: (stageSize.width - stageSize.width * zoom) / 2,
      y: (stageSize.height - stageSize.height * zoom) / 2
    }),
    [stageSize, zoom]
  );
  const toCanvasPoint = useCallback(
    (point: { x: number; y: number }) => ({
      x: (point.x - contentOffset.x) / zoom,
      y: (point.y - contentOffset.y) / zoom
    }),
    [contentOffset.x, contentOffset.y, zoom]
  );

  const getItemDimensions = useCallback((item: Pick<LayoutItem, "type" | "width" | "height">) => {
    const definition = LAYOUT_ITEM_BY_TYPE[item.type];
    return {
      width: item.width ?? definition.footprint.width,
      height: item.height ?? definition.footprint.height
    };
  }, []);

  const getItemBounds = useCallback(
    (item: Pick<LayoutItem, "type" | "x" | "y" | "rotation" | "width" | "height">) => {
      const { width, height } = getItemDimensions(item);
      const rotated = Math.abs(item.rotation % 180) === 90;
      const visualWidth = rotated ? height : width;
      const visualHeight = rotated ? width : height;

      return {
        left: item.x - visualWidth / 2,
        right: item.x + visualWidth / 2,
        top: item.y - visualHeight / 2,
        bottom: item.y + visualHeight / 2
      };
    },
    [getItemDimensions]
  );

  const fitItemToRoom = useCallback(
    (item: Pick<LayoutItem, "type" | "rotation" | "width" | "height">, x: number, y: number) => {
      const { width, height } = getItemDimensions(item);
      const rotated = Math.abs(item.rotation % 180) === 90;
      const visualWidth = rotated ? height : width;
      const visualHeight = rotated ? width : height;
      const halfWidth = visualWidth / 2;
      const halfHeight = visualHeight / 2;

      return {
        x: clamp(snapToGrid(x), roomRect.x + halfWidth, roomRect.x + roomRect.width - halfWidth),
        y: clamp(snapToGrid(y), roomRect.y + halfHeight, roomRect.y + roomRect.height - halfHeight)
      };
    },
    [getItemDimensions, roomRect]
  );

  const canPlaceItem = useCallback(
    (
      candidate: Pick<LayoutItem, "id" | "type" | "x" | "y" | "rotation" | "width" | "height">,
      excludeId?: string
    ) => {
      const candidateBounds = getItemBounds(candidate);
      return !items.some((entry) => {
        if (entry.id === (excludeId ?? candidate.id)) {
          return false;
        }
        return overlaps(candidateBounds, getItemBounds(entry));
      });
    },
    [getItemBounds, items]
  );

  const fitItemResize = useCallback(
    (
      item: Pick<LayoutItem, "id" | "type" | "x" | "y" | "rotation" | "width" | "height">,
      proposedWidth: number,
      proposedHeight: number
    ) => {
      const definition = LAYOUT_ITEM_BY_TYPE[item.type];
      const defaultSize = getItemDimensions(item);
      const minSize = definition.minSize ?? {
        width: Math.max(80, Math.round(defaultSize.width * 0.7)),
        height: Math.max(60, Math.round(defaultSize.height * 0.7))
      };
      const maxSize = definition.maxSize ?? {
        width: Math.round(defaultSize.width * 1.8),
        height: Math.round(defaultSize.height * 1.8)
      };

      const width = clamp(snapToGrid(proposedWidth), minSize.width, maxSize.width);
      const height = clamp(snapToGrid(proposedHeight), minSize.height, maxSize.height);
      const nextPosition = fitItemToRoom({ ...item, width, height }, item.x, item.y);

      return { width, height, x: nextPosition.x, y: nextPosition.y };
    },
    [fitItemToRoom, getItemDimensions]
  );

  const findFreeItemPosition = useCallback(
    (candidate: Pick<LayoutItem, "id" | "type" | "rotation" | "width" | "height">, x: number, y: number) => {
      const first = fitItemToRoom(candidate, x, y);
      const firstCandidate = { ...candidate, ...first };
      if (canPlaceItem(firstCandidate, candidate.id)) {
        return first;
      }

      const maxRadius = 24;
      for (let ring = 1; ring <= maxRadius; ring += 1) {
        for (let dx = -ring; dx <= ring; dx += 1) {
          for (let dy = -ring; dy <= ring; dy += 1) {
            if (Math.abs(dx) !== ring && Math.abs(dy) !== ring) {
              continue;
            }

            const next = fitItemToRoom(candidate, x + dx * GRID_SIZE, y + dy * GRID_SIZE);
            const nextCandidate = { ...candidate, ...next };
            if (canPlaceItem(nextCandidate, candidate.id)) {
              return next;
            }
          }
        }
      }

      return null;
    },
    [canPlaceItem, fitItemToRoom]
  );

  const fitZoneRect = useCallback(
    (zone: Pick<LayoutZone, "x" | "y" | "width" | "height">) => {
      const maxWidth = roomRect.x + roomRect.width - zone.x;
      const maxHeight = roomRect.y + roomRect.height - zone.y;
      const width = clamp(snapToGrid(zone.width), MIN_ZONE_SIZE, Math.max(MIN_ZONE_SIZE, maxWidth));
      const height = clamp(
        snapToGrid(zone.height),
        MIN_ZONE_SIZE,
        Math.max(MIN_ZONE_SIZE, maxHeight)
      );

      const x = clamp(snapToGrid(zone.x), roomRect.x, roomRect.x + roomRect.width - width);
      const y = clamp(snapToGrid(zone.y), roomRect.y, roomRect.y + roomRect.height - height);

      return { x, y, width, height };
    },
    [roomRect]
  );

  const addItem = useCallback(
    (type: LayoutItemType, x: number, y: number) => {
      const definition = LAYOUT_ITEM_BY_TYPE[type];
      const seed: LayoutItem = {
        id: createItemId(),
        type,
        x,
        y,
        rotation: 0,
        width: definition.footprint.width,
        height: definition.footprint.height
      };
      const nextPosition = findFreeItemPosition(seed, x, y);
      if (!nextPosition) {
        return;
      }

      const nextItem: LayoutItem = {
        ...seed,
        x: nextPosition.x,
        y: nextPosition.y
      };

      setItems((previous) => [...previous, nextItem]);
      setSelectedId(nextItem.id);
      setSelectedZoneId(null);
      setArmedType(null);
    },
    [findFreeItemPosition]
  );

  const addZone = useCallback(
    (type: LayoutZoneType) => {
      const definition = LAYOUT_ZONE_BY_TYPE[type];
      const existingCount = zones.filter((zone) => zone.type === type).length;
      const seeded = fitZoneRect({
        x: roomRect.x + GRID_SIZE * (2 + (existingCount % 4)),
        y: roomRect.y + GRID_SIZE * (2 + (existingCount % 3)),
        width: definition.defaultSize.width,
        height: definition.defaultSize.height
      });

      const nextZone: LayoutZone = {
        id: createItemId(),
        type,
        label: existingCount > 0 ? `${definition.label} ${existingCount + 1}` : definition.label,
        color: definition.color,
        ...seeded
      };

      setZones((previous) => [...previous, nextZone]);
      setSelectedZoneId(nextZone.id);
      setSelectedId(null);
      setArmedType(null);
    },
    [fitZoneRect, roomRect, zones]
  );

  const removeItem = useCallback((id: string) => {
    setItems((previous) => previous.filter((item) => item.id !== id));
    setSelectedId((previous) => (previous === id ? null : previous));
  }, []);

  const removeZone = useCallback((id: string) => {
    setZones((previous) => previous.filter((zone) => zone.id !== id));
    setSelectedZoneId((previous) => (previous === id ? null : previous));
  }, []);

  const rotateItem = useCallback((id: string) => {
    setItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              rotation: (item.rotation + 90) % 360
            }
          : item
      )
    );
  }, []);

  const duplicateItem = useCallback(
    (id: string) => {
      const sourceItem = items.find((item) => item.id === id);
      if (!sourceItem) {
        return;
      }

      const duplicatedId = createItemId();
      const nextPosition = findFreeItemPosition(
        { ...sourceItem, id: duplicatedId },
        sourceItem.x + GRID_SIZE,
        sourceItem.y + GRID_SIZE
      );
      if (!nextPosition) {
        return;
      }

      setItems((previous) => [
        ...previous,
        {
          ...sourceItem,
          id: duplicatedId,
          x: nextPosition.x,
          y: nextPosition.y
        }
      ]);
      setSelectedId(duplicatedId);
      setSelectedZoneId(null);
    },
    [findFreeItemPosition, items]
  );

  const duplicateZone = useCallback(
    (id: string) => {
      const sourceZone = zones.find((zone) => zone.id === id);
      if (!sourceZone) {
        return;
      }

      const nextId = createItemId();
      const nextRect = fitZoneRect({
        x: sourceZone.x + GRID_SIZE,
        y: sourceZone.y + GRID_SIZE,
        width: sourceZone.width,
        height: sourceZone.height
      });

      setZones((previous) => [
        ...previous,
        {
          ...sourceZone,
          ...nextRect,
          id: nextId,
          label: `${sourceZone.label} Copy`
        }
      ]);
      setSelectedZoneId(nextId);
      setSelectedId(null);
    },
    [fitZoneRect, zones]
  );

  const onCanvasDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const rawType = event.dataTransfer.getData("application/x-layout-item");

    if (!isLayoutItemType(rawType)) {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const point = toCanvasPoint({
      x: event.clientX - bounds.left,
      y: event.clientY - bounds.top
    });
    addItem(rawType, point.x, point.y);
  };

  const onStagePointerDown = (
    event: KonvaEventObject<MouseEvent | TouchEvent | PointerEvent>
  ) => {
    const stage = event.target.getStage();
    if (!stage) {
      return;
    }

    const pointer = stage.getPointerPosition();
    if (!pointer) {
      return;
    }

    const isCanvasSurface = event.target === stage || event.target.hasName("room-surface");

    if (armedType && isCanvasSurface) {
      const canvasPointer = toCanvasPoint(pointer);
      addItem(armedType, canvasPointer.x, canvasPointer.y);
      return;
    }

    if (isCanvasSurface) {
      setSelectedId(null);
      setSelectedZoneId(null);
      setArmedType(null);
    }
  };

  const buildExportPayload = () => ({
    exportedAt: new Date().toISOString(),
    scale: SCALE_LABEL,
    roomBoundary: roomRect,
    zones: zones.map(({ id, type, label, x, y, width, height }) => ({
      id,
      type,
      label,
      x,
      y,
      width,
      height
    })),
    items
  });

  const exportJson = () => {
    const payload = JSON.stringify(buildExportPayload(), null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "clinic-layout.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportPng = () => {
    const stage = stageRef.current;
    if (!stage) {
      return;
    }

    const uri = stage.toDataURL({ pixelRatio: 2 });
    const anchor = document.createElement("a");
    anchor.href = uri;
    anchor.download = "clinic-layout.png";
    anchor.click();
  };

  const emailSales = () => {
    exportPng();
    exportJson();

    const zoneSummary = zones.map((zone) => `- ${zone.label} (${zone.width}x${zone.height})`).join("\n");
    const itemSummary = items
      .map((item) => `- ${LAYOUT_ITEM_BY_TYPE[item.type].label} @ (${item.x}, ${item.y})`)
      .slice(0, 12)
      .join("\n");

    const bodyLines = [
      "Hi Sales Team,",
      "",
      "Please find my clinic layout draft attached (PNG + JSON were downloaded from Layout Studio).",
      "",
      `Zones: ${zones.length}`,
      `Equipment items: ${items.length}`,
      "",
      zones.length ? "Room zoning:" : "Room zoning: (not defined yet)",
      zoneSummary || "-",
      "",
      items.length ? "Equipment placed (sample):" : "Equipment placed: (none yet)",
      itemSummary || "-",
      "",
      "Notes:",
      ""
    ];

    const mailto = `mailto:sales@macadent.com.my?subject=${encodeURIComponent(
      "Clinic Layout Draft Submission"
    )}&body=${encodeURIComponent(bodyLines.join("\n"))}`;

    window.location.href = mailto;
  };

  const resetLayout = () => {
    setItems([]);
    setZones([]);
    setSelectedId(null);
    setSelectedZoneId(null);
    setArmedType(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ items, zones }));
  }, [items, zones]);

  useEffect(() => {
    const wrapper = canvasWrapRef.current;
    if (!wrapper) {
      return;
    }

    const updateSize = () => {
      setStageSize({
        width: Math.max(320, Math.round(wrapper.clientWidth)),
        height: Math.max(460, Math.round(wrapper.clientHeight))
      });
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(wrapper);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const activeItemId = selectedId;
      const activeZoneId = selectedZoneId;

      if (!activeItemId && !activeZoneId) {
        return;
      }

      const target = event.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) {
        return;
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "d") {
        event.preventDefault();
        if (activeItemId) {
          duplicateItem(activeItemId);
        } else if (activeZoneId) {
          duplicateZone(activeZoneId);
        }
        return;
      }

      if (event.key.toLowerCase() === "r" && activeItemId) {
        event.preventDefault();
        rotateItem(activeItemId);
        return;
      }

      if (event.key === "Delete" || event.key === "Backspace") {
        event.preventDefault();
        if (activeItemId) {
          removeItem(activeItemId);
        } else if (activeZoneId) {
          removeZone(activeZoneId);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [duplicateItem, duplicateZone, removeItem, removeZone, rotateItem, selectedId, selectedZoneId]);

  const gridLines = useMemo(() => {
    const lines: Array<{ points: number[]; key: string }> = [];

    for (let x = roomRect.x; x <= roomRect.x + roomRect.width; x += GRID_SIZE) {
      lines.push({
        key: `v-${x}`,
        points: [x, roomRect.y, x, roomRect.y + roomRect.height]
      });
    }

    for (let y = roomRect.y; y <= roomRect.y + roomRect.height; y += GRID_SIZE) {
      lines.push({
        key: `h-${y}`,
        points: [roomRect.x, y, roomRect.x + roomRect.width, y]
      });
    }

    return lines;
  }, [roomRect]);

  const selectionLabel = useMemo(() => {
    if (selectedId) {
      return "Item selected";
    }
    if (selectedZoneId) {
      return "Zone selected";
    }
    return "No selection";
  }, [selectedId, selectedZoneId]);

  const roomZoneCount = zones.length;
  const equipmentCount = items.length;
  const operatoryZoneCount = zones.filter((zone) => zone.type === "operatory-room").length;
  const showCanvasEmptyState = roomZoneCount === 0 && equipmentCount === 0;

  return (
    <section className="section layout-studio-section">
      <div className="layout-studio-shell">
        <StudioToolbar
          selectionLabel={selectionLabel}
          onReset={resetLayout}
          onExportPng={exportPng}
          onExportJson={exportJson}
          onEmailSales={emailSales}
        />

        <div className="layout-studio-intro">
          <div className="layout-studio-intro-copy">
            <p className="eyebrow">Professional Planning Workspace</p>
            <h3>Build room zones first, then place equipment with collision-safe layouting.</h3>
            <p>
              Use the zoning presets to define treatment, sterilization, imaging and support areas.
              The studio will auto-snap to grid, prevent equipment overlap, and export a clean draft
              for review with sales.
            </p>
          </div>
          <div className="layout-studio-stats" aria-label="Layout studio summary">
            <div className="layout-studio-stat">
              <span className="layout-studio-stat-label">Room Zones</span>
              <strong>{roomZoneCount}</strong>
            </div>
            <div className="layout-studio-stat">
              <span className="layout-studio-stat-label">Equipment Items</span>
              <strong>{equipmentCount}</strong>
            </div>
            <div className="layout-studio-stat">
              <span className="layout-studio-stat-label">Operatories</span>
              <strong>{operatoryZoneCount}</strong>
            </div>
          </div>
        </div>

        <div className="layout-studio-workspace">
          <div className="layout-sidebar-stack">
            <Palette
              armedType={armedType}
              onArmTool={(type) => setArmedType((previous) => (previous === type ? null : type))}
            />

            <aside className="layout-zone-panel" aria-label="Room zoning tools">
              <div>
                <p className="layout-panel-title">Room Zoning</p>
                <p className="layout-panel-note">
                  Add room blocks first, then drag and resize them inside the clinic boundary.
                </p>
              </div>

              <div className="layout-zone-grid">
                {LAYOUT_ZONE_DEFINITIONS.map((zone) => (
                  <button
                    key={zone.type}
                    type="button"
                    className="layout-zone-preset"
                    onClick={() => addZone(zone.type)}
                  >
                    <span
                      className="layout-zone-swatch"
                      style={{ backgroundColor: `${zone.color}1f`, borderColor: `${zone.color}55` }}
                      aria-hidden="true"
                    />
                    <span>{zone.label}</span>
                  </button>
                ))}
              </div>

              <div className="layout-zone-panel-foot">
                <p className="layout-panel-note">
                  Selected zone: drag to move, drag the corner handle to resize, <kbd>Delete</kbd> to
                  remove.
                </p>
                <p className="layout-panel-note">Total zones: {zones.length}</p>
              </div>
            </aside>
          </div>

          <div className="layout-stage-panel">
            <div className="layout-stage-topbar">
              <div className="layout-stage-header">
                <div>
                  <p className="layout-stage-title">Clinic Floor Plan</p>
                  <p className="layout-stage-subtitle">
                    Room boundary + snap grid with zone-first planning and equipment placement
                  </p>
                </div>
                <div className="layout-stage-header-tools">
                  <div className="layout-stage-legend" aria-label="Canvas legend">
                    <span className="zones"><i className="layout-stage-legend-dot zones" /> Zones</span>
                    <span className="items"><i className="layout-stage-legend-dot items" /> Equipment</span>
                  </div>

                  <div className="layout-stage-controls-wrap">
                    <span className="layout-stage-controls-label">View</span>
                    <div className="layout-stage-controls" aria-label="Canvas zoom controls">
                      <button
                        type="button"
                        className="layout-stage-control"
                        onClick={() =>
                          setZoom((previous) => clamp(Number((previous - 0.1).toFixed(2)), 0.5, 1.4))
                        }
                        aria-label="Zoom out"
                      >
                        -
                      </button>
                      <span className="layout-stage-zoom-label">{Math.round(zoom * 100)}%</span>
                      <button
                        type="button"
                        className="layout-stage-control"
                        onClick={() =>
                          setZoom((previous) => clamp(Number((previous + 0.1).toFixed(2)), 0.5, 1.4))
                        }
                        aria-label="Zoom in"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        className="layout-stage-control layout-stage-control--fit"
                        onClick={() => setZoom(1)}
                      >
                        Fit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="layout-stage-shell"
              ref={canvasWrapRef}
              onDrop={onCanvasDrop}
              onDragOver={(event) => event.preventDefault()}
            >
              {showCanvasEmptyState && (
                <div className="layout-stage-empty-state" aria-live="polite">
                  <p className="layout-stage-empty-eyebrow">Start Here</p>
                  <h4>Create your clinic zoning</h4>
                  <p>
                    Add an operatory or reception zone from the left panel, then place chairs,
                    cabinets, imaging, and sterilization systems inside the layout.
                  </p>
                </div>
              )}

              <Stage
                width={stageSize.width}
                height={stageSize.height}
                ref={stageRef}
                onMouseDown={onStagePointerDown}
                onTouchStart={onStagePointerDown}
              >
              <Layer>
                <Rect x={0} y={0} width={stageSize.width} height={stageSize.height} fill="#f4f7fc" />
                <Group x={contentOffset.x} y={contentOffset.y} scaleX={zoom} scaleY={zoom}>
                <Rect
                  x={roomRect.x}
                  y={roomRect.y}
                  width={roomRect.width}
                  height={roomRect.height}
                  cornerRadius={18}
                  fill="#fbfdff"
                  stroke="rgba(148, 163, 184, 0.45)"
                  strokeWidth={1.2}
                  name="room-surface"
                />

                {gridLines.map((line) => (
                  <Line
                    key={line.key}
                    points={line.points}
                    stroke="rgba(37, 99, 235, 0.07)"
                    strokeWidth={1}
                    listening={false}
                  />
                ))}

                {zones.map((zone) => {
                  const isSelected = selectedZoneId === zone.id;
                  const isDraggingZone = draggingZoneId === zone.id;
                  const zoneFill = hexToRgba(zone.color, isSelected ? 0.16 : 0.09);
                  const zoneStroke = hexToRgba(zone.color, isSelected ? 0.9 : 0.48);
                  const zoneChipBg = hexToRgba(zone.color, 0.12);
                  const zoneChipBorder = hexToRgba(zone.color, 0.24);

                  return (
                    <Group
                      key={zone.id}
                      x={zone.x}
                      y={zone.y}
                      draggable
                      onClick={() => {
                        setSelectedZoneId(zone.id);
                        setSelectedId(null);
                        setArmedType(null);
                      }}
                      onTap={() => {
                        setSelectedZoneId(zone.id);
                        setSelectedId(null);
                        setArmedType(null);
                      }}
                      onDragStart={(event) => {
                        event.target.getStage()?.container().style.setProperty("cursor", "grabbing");
                        setDraggingZoneId(zone.id);
                        setSelectedZoneId(zone.id);
                        setSelectedId(null);
                      }}
                      onDragMove={(event) => {
                        const nextRect = fitZoneRect({
                          x: event.target.x(),
                          y: event.target.y(),
                          width: zone.width,
                          height: zone.height
                        });
                        event.target.position({ x: nextRect.x, y: nextRect.y });
                      }}
                      onDragEnd={(event) => {
                        const nextRect = fitZoneRect({
                          x: event.target.x(),
                          y: event.target.y(),
                          width: zone.width,
                          height: zone.height
                        });
                        event.target.position({ x: nextRect.x, y: nextRect.y });
                        setZones((previous) =>
                          previous.map((entry) =>
                            entry.id === zone.id ? { ...entry, x: nextRect.x, y: nextRect.y } : entry
                          )
                        );
                        setDraggingZoneId(null);
                        event.target.getStage()?.container().style.setProperty("cursor", "default");
                      }}
                      onMouseEnter={(event) => {
                        if (!draggingZoneId && !draggingId) {
                          event.target.getStage()?.container().style.setProperty("cursor", "grab");
                        }
                      }}
                      onMouseLeave={(event) => {
                        if (!draggingZoneId && !draggingId) {
                          event.target.getStage()?.container().style.setProperty("cursor", "default");
                        }
                      }}
                    >
                      <Rect
                        width={zone.width}
                        height={zone.height}
                        cornerRadius={12}
                        fill={zoneFill}
                        stroke={zoneStroke}
                        strokeWidth={isSelected ? 2 : 1.2}
                        dash={isSelected ? [10, 6] : [7, 6]}
                        shadowColor="#0f172a"
                        shadowBlur={isDraggingZone ? 14 : 0}
                        shadowOpacity={isDraggingZone ? 0.08 : 0}
                        shadowOffsetY={isDraggingZone ? 4 : 0}
                      />

                      <Rect
                        x={10}
                        y={10}
                        width={Math.min(zone.width - 20, 156)}
                        height={26}
                        cornerRadius={999}
                        fill={zoneChipBg}
                        stroke={zoneChipBorder}
                        strokeWidth={1}
                        listening={false}
                      />

                      <Text
                        x={20}
                        y={16}
                        width={Math.max(80, Math.min(zone.width - 38, 142))}
                        text={zone.label}
                        fontSize={11}
                        fontStyle="bold"
                        fill={zone.color}
                        listening={false}
                      />

                      {isSelected && (
                        <>
                          <Group x={zone.width - 6} y={zone.height - 6} draggable
                            onMouseDown={(event) => {
                              event.cancelBubble = true;
                            }}
                            onTouchStart={(event) => {
                              event.cancelBubble = true;
                            }}
                            onDragStart={(event) => {
                              event.cancelBubble = true;
                              setDraggingZoneId(zone.id);
                            }}
                            onDragMove={(event) => {
                              event.cancelBubble = true;
                              const nextRect = fitZoneRect({
                                x: zone.x,
                                y: zone.y,
                                width: event.target.x() + 6,
                                height: event.target.y() + 6
                              });
                              setZones((previous) =>
                                previous.map((entry) =>
                                  entry.id === zone.id
                                    ? { ...entry, width: nextRect.width, height: nextRect.height }
                                    : entry
                                )
                              );
                            }}
                            onDragEnd={(event) => {
                              event.cancelBubble = true;
                              const nextRect = fitZoneRect({
                                x: zone.x,
                                y: zone.y,
                                width: event.target.x() + 6,
                                height: event.target.y() + 6
                              });
                              setZones((previous) =>
                                previous.map((entry) =>
                                  entry.id === zone.id
                                    ? { ...entry, width: nextRect.width, height: nextRect.height }
                                    : entry
                                )
                              );
                              setDraggingZoneId(null);
                            }}
                          >
                            <Rect
                              x={-6}
                              y={-6}
                              width={12}
                              height={12}
                              cornerRadius={4}
                              fill="#ffffff"
                              stroke={zoneStroke}
                              strokeWidth={1.2}
                            />
                          </Group>

                          <Group x={zone.width + 10} y={10}>
                            <Group
                              onMouseDown={(event) => {
                                event.cancelBubble = true;
                              }}
                              onTouchStart={(event) => {
                                event.cancelBubble = true;
                              }}
                              onClick={(event) => {
                                event.cancelBubble = true;
                                duplicateZone(zone.id);
                              }}
                              onTap={(event) => {
                                event.cancelBubble = true;
                                duplicateZone(zone.id);
                              }}
                            >
                              <Circle radius={11} fill="#ffffff" stroke="rgba(15, 23, 42, 0.18)" />
                              <Text x={-4} y={-6} text="+" fontSize={12} fill="#0f172a" />
                            </Group>

                            <Group
                              y={28}
                              onMouseDown={(event) => {
                                event.cancelBubble = true;
                              }}
                              onTouchStart={(event) => {
                                event.cancelBubble = true;
                              }}
                              onClick={(event) => {
                                event.cancelBubble = true;
                                removeZone(zone.id);
                              }}
                              onTap={(event) => {
                                event.cancelBubble = true;
                                removeZone(zone.id);
                              }}
                            >
                              <Circle radius={11} fill="#fff4f4" stroke="rgba(220, 38, 38, 0.34)" />
                              <Text x={-3.5} y={-6} text="×" fontSize={12} fill="#b42318" />
                            </Group>
                          </Group>
                        </>
                      )}
                    </Group>
                  );
                })}

                <Text
                  x={roomRect.x + 14}
                  y={roomRect.y + roomRect.height - 26}
                  text={SCALE_LABEL}
                  fontSize={12}
                  fill="#607087"
                  listening={false}
                />

                {items.map((item) => {
                  const definition = LAYOUT_ITEM_BY_TYPE[item.type];
                  const tone = ITEM_TONES[item.type];
                  const { width, height } = getItemDimensions(item);
                  const isSelected = selectedId === item.id;
                  const isDragging = draggingId === item.id;

                  return (
                    <Group
                      key={item.id}
                      x={item.x}
                      y={item.y}
                      offsetX={width / 2}
                      offsetY={height / 2}
                      rotation={item.rotation}
                      draggable
                      onClick={() => {
                        setSelectedId(item.id);
                        setSelectedZoneId(null);
                        setArmedType(null);
                      }}
                      onTap={() => {
                        setSelectedId(item.id);
                        setSelectedZoneId(null);
                        setArmedType(null);
                      }}
                      onDragStart={(event) => {
                        event.target.getStage()?.container().style.setProperty("cursor", "grabbing");
                        setDraggingId(item.id);
                        setSelectedId(item.id);
                        setSelectedZoneId(null);
                        event.target.setAttr("lastValidX", item.x);
                        event.target.setAttr("lastValidY", item.y);
                      }}
                      onDragMove={(event) => {
                        const nextPosition = fitItemToRoom(item, event.target.x(), event.target.y());
                        const nextCandidate = { ...item, ...nextPosition };
                        if (canPlaceItem(nextCandidate, item.id)) {
                          event.target.position(nextPosition);
                          event.target.setAttr("lastValidX", nextPosition.x);
                          event.target.setAttr("lastValidY", nextPosition.y);
                        } else {
                          event.target.position({
                            x: Number(event.target.getAttr("lastValidX")) || item.x,
                            y: Number(event.target.getAttr("lastValidY")) || item.y
                          });
                        }
                      }}
                      onDragEnd={(event) => {
                        const lastValid = {
                          x: Number(event.target.getAttr("lastValidX")) || item.x,
                          y: Number(event.target.getAttr("lastValidY")) || item.y
                        };
                        const snappedPosition = fitItemToRoom(item, lastValid.x, lastValid.y);
                        const nextCandidate = { ...item, ...snappedPosition };
                        if (canPlaceItem(nextCandidate, item.id)) {
                          event.target.position(snappedPosition);
                          setItems((previous) =>
                            previous.map((entry) =>
                              entry.id === item.id ? { ...entry, ...snappedPosition } : entry
                            )
                          );
                        } else {
                          event.target.position({ x: item.x, y: item.y });
                        }
                        setDraggingId(null);
                        event.target.getStage()?.container().style.setProperty("cursor", "default");
                      }}
                      onMouseEnter={(event) => {
                        if (!draggingId) {
                          event.target.getStage()?.container().style.setProperty("cursor", "grab");
                        }
                      }}
                      onMouseLeave={(event) => {
                        if (!draggingId) {
                          event.target.getStage()?.container().style.setProperty("cursor", "default");
                        }
                      }}
                    >
                      <Rect
                        width={width}
                        height={height}
                        cornerRadius={14}
                        fill={tone.surface}
                        stroke={isSelected ? tone.stroke : tone.border}
                        strokeWidth={1}
                        shadowColor={isSelected ? tone.shadow : "#0f172a"}
                        shadowBlur={isDragging ? 24 : 14}
                        shadowOpacity={isDragging ? 0.22 : isSelected ? 0.14 : 0.08}
                        shadowOffsetY={isDragging ? 10 : 6}
                      />

                      <Rect
                        x={0}
                        y={0}
                        width={width}
                        height={6}
                        cornerRadius={[14, 14, 8, 8]}
                        fill={tone.badge}
                        listening={false}
                      />

                      {isSelected && (
                        <Rect
                          x={-4}
                          y={-4}
                          width={width + 8}
                          height={height + 8}
                          cornerRadius={16}
                          stroke={tone.stroke}
                          strokeWidth={2}
                          dash={[8, 6]}
                        />
                      )}

                      <Group x={width / 2} y={Math.min(36, Math.max(28, height * 0.38))} listening={false}>
                        <CanvasGlyph type={item.type} stroke={tone.stroke} />
                      </Group>

                      <Circle
                        x={14}
                        y={14}
                        radius={4}
                        fill={tone.stroke}
                        opacity={0.9}
                        listening={false}
                      />

                      <Text
                        y={Math.max(height - 24, 12)}
                        width={width}
                        align="center"
                        text={definition.label}
                        fontSize={12}
                        fill="#243447"
                        listening={false}
                      />

                      {isSelected && definition.resizable && (
                        <Group
                          x={width - 6}
                          y={height - 6}
                          draggable
                          onMouseDown={(event) => {
                            event.cancelBubble = true;
                          }}
                          onTouchStart={(event) => {
                            event.cancelBubble = true;
                          }}
                          onDragMove={(event) => {
                            event.cancelBubble = true;
                            const next = fitItemResize(item, event.target.x() + 6, event.target.y() + 6);
                            const nextCandidate = { ...item, ...next };
                            if (!canPlaceItem(nextCandidate, item.id)) {
                              event.target.position({ x: width - 6, y: height - 6 });
                              return;
                            }

                            setItems((previous) =>
                              previous.map((entry) =>
                                entry.id === item.id ? { ...entry, ...next } : entry
                              )
                            );
                            event.target.position({ x: next.width - 6, y: next.height - 6 });
                          }}
                          onDragEnd={(event) => {
                            event.cancelBubble = true;
                            event.target.position({ x: width - 6, y: height - 6 });
                          }}
                        >
                          <Rect
                            x={-6}
                            y={-6}
                            width={12}
                            height={12}
                            cornerRadius={4}
                            fill="#ffffff"
                            stroke={tone.stroke}
                            strokeWidth={1.2}
                          />
                        </Group>
                      )}

                      {isSelected && (
                        <Group x={width + 10} y={10}>
                          <Group
                            onMouseDown={(event) => {
                              event.cancelBubble = true;
                            }}
                            onTouchStart={(event) => {
                              event.cancelBubble = true;
                            }}
                            onClick={(event) => {
                              event.cancelBubble = true;
                              rotateItem(item.id);
                            }}
                            onTap={(event) => {
                              event.cancelBubble = true;
                              rotateItem(item.id);
                            }}
                          >
                            <Circle radius={11} fill="#ffffff" stroke="rgba(15, 23, 42, 0.18)" />
                            <Text x={-4} y={-6} text="R" fontSize={10} fill="#0f172a" />
                          </Group>

                          <Group
                            y={28}
                            onMouseDown={(event) => {
                              event.cancelBubble = true;
                            }}
                            onTouchStart={(event) => {
                              event.cancelBubble = true;
                            }}
                            onClick={(event) => {
                              event.cancelBubble = true;
                              duplicateItem(item.id);
                            }}
                            onTap={(event) => {
                              event.cancelBubble = true;
                              duplicateItem(item.id);
                            }}
                          >
                            <Circle radius={11} fill="#ffffff" stroke="rgba(15, 23, 42, 0.18)" />
                            <Text x={-4} y={-6} text="+" fontSize={12} fill="#0f172a" />
                          </Group>

                          <Group
                            y={56}
                            onMouseDown={(event) => {
                              event.cancelBubble = true;
                            }}
                            onTouchStart={(event) => {
                              event.cancelBubble = true;
                            }}
                            onClick={(event) => {
                              event.cancelBubble = true;
                              removeItem(item.id);
                            }}
                            onTap={(event) => {
                              event.cancelBubble = true;
                              removeItem(item.id);
                            }}
                          >
                            <Circle radius={11} fill="#fff4f4" stroke="rgba(220, 38, 38, 0.34)" />
                            <Text x={-3.5} y={-6} text="×" fontSize={12} fill="#b42318" />
                          </Group>
                        </Group>
                      )}
                    </Group>
                  );
                })}
                </Group>
              </Layer>
              </Stage>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
