import { Link } from "react-router-dom";
import { useMemo, useState } from "react";

type ClinicMode = "startup" | "expansion" | "refit";

type SystemKey = "operatories" | "imaging" | "sterilization" | "workflow";

const clinicModes: Array<{
  key: ClinicMode;
  label: string;
  title: string;
  summary: string;
  profile: { speed: number; precision: number; readiness: number };
}> = [
  {
    key: "startup",
    label: "Startup Clinic",
    title: "Launch-ready kit with fast commissioning",
    summary:
      "Prioritize essential systems, predictable delivery, and clean workflows that reduce setup friction.",
    profile: { speed: 88, precision: 70, readiness: 76 }
  },
  {
    key: "expansion",
    label: "Expansion",
    title: "Scale operatories without operational bottlenecks",
    summary:
      "Balance throughput, sterilization capacity, and imaging access as patient volume increases.",
    profile: { speed: 78, precision: 84, readiness: 86 }
  },
  {
    key: "refit",
    label: "Refit / Upgrade",
    title: "Upgrade performance while minimizing downtime",
    summary:
      "Plan phased replacement and installation around active chair schedules and staff workflows.",
    profile: { speed: 68, precision: 90, readiness: 82 }
  }
];

const draftSystems: Array<{
  key: SystemKey;
  label: string;
  brandHint: string;
  impact: string;
  score: number;
  estRange: [number, number];
}> = [
  {
    key: "operatories",
    label: "Operatories",
    brandHint: "A-dec class systems",
    impact: "Patient comfort + clinician ergonomics",
    score: 28,
    estRange: [120, 260]
  },
  {
    key: "imaging",
    label: "Imaging",
    brandHint: "Planmeca / Carestream tier",
    impact: "Diagnostics speed + planning clarity",
    score: 24,
    estRange: [90, 220]
  },
  {
    key: "sterilization",
    label: "Sterilization",
    brandHint: "W&H / Euronda workflow",
    impact: "Compliance + instrument turnover",
    score: 26,
    estRange: [60, 180]
  },
  {
    key: "workflow",
    label: "Workflow Tools",
    brandHint: "Cabinetry + support stations",
    impact: "Daily flow + prep efficiency",
    score: 16,
    estRange: [25, 90]
  }
];

const draftFlow = [
  {
    title: "Clinic Discovery",
    detail: "Capture room constraints, patient volume goals, and operator preferences."
  },
  {
    title: "Room Zoning",
    detail: "Map treatment, sterilization, imaging, and support areas into a practical layout."
  },
  {
    title: "Equipment Fit",
    detail: "Shortlist systems by reliability, footprint, and integration requirements."
  },
  {
    title: "Install Plan",
    detail: "Sequence delivery and commissioning to minimize disruption."
  }
];

const zoneHotspots = [
  {
    id: "operatory-a",
    label: "Operatory A",
    x: 10,
    y: 14,
    w: 36,
    h: 30,
    note: "Primary treatment room with chair, stool pair, and support cabinet."
  },
  {
    id: "operatory-b",
    label: "Operatory B",
    x: 50,
    y: 14,
    w: 36,
    h: 30,
    note: "Second chair room configured for turnover speed and imaging access."
  },
  {
    id: "steri",
    label: "Sterilization Zone",
    x: 10,
    y: 50,
    w: 44,
    h: 20,
    note: "Clear instrument flow from dirty to clean, with storage and packing area."
  },
  {
    id: "imaging",
    label: "Imaging Room",
    x: 58,
    y: 50,
    w: 28,
    h: 20,
    note: "Dedicated imaging zone positioned to reduce hallway congestion."
  }
] as const;

export default function InteractiveDrafts() {
  const [activeMode, setActiveMode] = useState<ClinicMode>("startup");
  const [selectedSystems, setSelectedSystems] = useState<SystemKey[]>([
    "operatories",
    "imaging",
    "sterilization"
  ]);
  const [activeFlowStep, setActiveFlowStep] = useState(0);
  const [activeZone, setActiveZone] = useState<(typeof zoneHotspots)[number]["id"]>("operatory-a");

  const modeData = clinicModes.find((mode) => mode.key === activeMode) ?? clinicModes[0];

  const selectedSystemDetails = draftSystems.filter((system) => selectedSystems.includes(system.key));

  const systemSummary = useMemo(() => {
    const score = selectedSystemDetails.reduce((sum, system) => sum + system.score, 0);
    const minBudget = selectedSystemDetails.reduce((sum, system) => sum + system.estRange[0], 0);
    const maxBudget = selectedSystemDetails.reduce((sum, system) => sum + system.estRange[1], 0);

    return {
      score,
      minBudget,
      maxBudget
    };
  }, [selectedSystemDetails]);

  const activeZoneData = zoneHotspots.find((zone) => zone.id === activeZone) ?? zoneHotspots[0];

  const toggleSystem = (key: SystemKey) => {
    setSelectedSystems((previous) => {
      if (previous.includes(key)) {
        if (previous.length === 1) {
          return previous;
        }
        return previous.filter((item) => item !== key);
      }

      return [...previous, key];
    });
  };

  return (
    <section className="section drafts-lab-section">
      <div className="drafts-lab-header">
        <div>
          <p className="eyebrow">Interaction Drafts</p>
          <h1>Three interactive directions to make the site feel more alive.</h1>
          <p className="section-subtitle">
            These are review-ready concepts you can test locally before we merge selected ideas into
            the main pages.
          </p>
        </div>
        <div className="drafts-lab-header-actions">
          <Link className="button ghost" to="/">
            Back to Home
          </Link>
          <Link className="button primary" to="/layout-studio">
            Open Layout Studio
          </Link>
        </div>
      </div>

      <div className="drafts-grid">
        <article className="draft-panel">
          <div className="draft-panel-head">
            <p className="eyebrow">Draft A</p>
            <h2>Clinic Scenario Switcher</h2>
            <p className="draft-panel-subtitle">
              A homepage hero enhancement: switch clinic scenarios and instantly update messaging +
              capability profile.
            </p>
          </div>

          <div className="draft-segmented" role="tablist" aria-label="Clinic scenarios">
            {clinicModes.map((mode) => (
              <button
                key={mode.key}
                type="button"
                role="tab"
                aria-selected={activeMode === mode.key}
                className={`draft-segment${activeMode === mode.key ? " active" : ""}`}
                onClick={() => setActiveMode(mode.key)}
              >
                {mode.label}
              </button>
            ))}
          </div>

          <div className="draft-mode-card">
            <h3>{modeData.title}</h3>
            <p>{modeData.summary}</p>
            <div className="draft-meter-list">
              <div className="draft-meter">
                <div className="draft-meter-label">
                  <span>Commissioning Speed</span>
                  <strong>{modeData.profile.speed}</strong>
                </div>
                <div className="draft-meter-track">
                  <span style={{ width: `${modeData.profile.speed}%` }} />
                </div>
              </div>
              <div className="draft-meter">
                <div className="draft-meter-label">
                  <span>Clinical Precision Fit</span>
                  <strong>{modeData.profile.precision}</strong>
                </div>
                <div className="draft-meter-track">
                  <span style={{ width: `${modeData.profile.precision}%` }} />
                </div>
              </div>
              <div className="draft-meter">
                <div className="draft-meter-label">
                  <span>Operational Readiness</span>
                  <strong>{modeData.profile.readiness}</strong>
                </div>
                <div className="draft-meter-track">
                  <span style={{ width: `${modeData.profile.readiness}%` }} />
                </div>
              </div>
            </div>
          </div>
        </article>

        <article className="draft-panel">
          <div className="draft-panel-head">
            <p className="eyebrow">Draft B</p>
            <h2>System Stack Builder</h2>
            <p className="draft-panel-subtitle">
              Interactive planning block for home or products page with live score and budget range.
            </p>
          </div>

          <div className="draft-chip-grid">
            {draftSystems.map((system) => (
              <button
                key={system.key}
                type="button"
                className={`draft-chip${selectedSystems.includes(system.key) ? " active" : ""}`}
                onClick={() => toggleSystem(system.key)}
                aria-pressed={selectedSystems.includes(system.key)}
              >
                <span>{system.label}</span>
                <small>{system.brandHint}</small>
              </button>
            ))}
          </div>

          <div className="draft-summary-shell">
            <div className="draft-summary-card">
              <p className="draft-summary-label">Readiness Score</p>
              <p className="draft-summary-value">{systemSummary.score}</p>
            </div>
            <div className="draft-summary-card">
              <p className="draft-summary-label">Estimated Budget Range (RM '000)</p>
              <p className="draft-summary-value">
                {systemSummary.minBudget} - {systemSummary.maxBudget}
              </p>
            </div>
          </div>

          <div className="draft-list">
            {selectedSystemDetails.map((system) => (
              <div key={system.key} className="draft-list-item">
                <div>
                  <p className="draft-list-title">{system.label}</p>
                  <p className="draft-list-subtitle">{system.impact}</p>
                </div>
                <span className="draft-list-pill">{system.brandHint}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="draft-panel draft-panel--wide">
          <div className="draft-panel-head">
            <p className="eyebrow">Draft C</p>
            <h2>Flow + Zone Preview</h2>
            <p className="draft-panel-subtitle">
              A lightweight interactive explainer that combines implementation steps with a clickable
              clinic zone preview.
            </p>
          </div>

          <div className="draft-flow-shell">
            <div className="draft-flow-steps" role="tablist" aria-label="Project flow steps">
              {draftFlow.map((step, index) => (
                <button
                  key={step.title}
                  type="button"
                  role="tab"
                  aria-selected={activeFlowStep === index}
                  className={`draft-flow-step${activeFlowStep === index ? " active" : ""}`}
                  onClick={() => setActiveFlowStep(index)}
                >
                  <span className="draft-flow-index">0{index + 1}</span>
                  <span>{step.title}</span>
                </button>
              ))}
              <div className="draft-flow-progress">
                <span
                  style={{
                    width: `${((activeFlowStep + 1) / draftFlow.length) * 100}%`
                  }}
                />
              </div>
              <p className="draft-flow-detail">{draftFlow[activeFlowStep]?.detail}</p>
            </div>

            <div className="draft-zone-shell">
              <div className="draft-zone-map" aria-label="Clinic zone preview">
                {zoneHotspots.map((zone) => (
                  <button
                    key={zone.id}
                    type="button"
                    className={`draft-zone-block${activeZone === zone.id ? " active" : ""}`}
                    style={{
                      left: `${zone.x}%`,
                      top: `${zone.y}%`,
                      width: `${zone.w}%`,
                      height: `${zone.h}%`
                    }}
                    onClick={() => setActiveZone(zone.id)}
                    aria-pressed={activeZone === zone.id}
                  >
                    <span>{zone.label}</span>
                  </button>
                ))}
                <div className="draft-zone-scale">1 square = 0.5m</div>
              </div>
              <div className="draft-zone-note">
                <p className="draft-summary-label">Selected Zone</p>
                <h3>{activeZoneData.label}</h3>
                <p>{activeZoneData.note}</p>
                <Link className="button ghost" to="/layout-studio">
                  Test full layout tool
                </Link>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
