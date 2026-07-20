import type { ControlServiceId } from "./control-panel-data";
import styles from "./ServicesControlPanel.module.css";

type MechanismProps = {
  serviceId: ControlServiceId;
};

export default function ServiceMechanism({ serviceId }: MechanismProps) {
  switch (serviceId) {
    case "seo":
      return <SeoMechanism />;
    case "website-design":
      return <WebsiteMechanism />;
    case "paid-ads":
      return <PaidAdsMechanism />;
    case "social-media-management":
      return <SocialMechanism />;
    case "graphic-design":
      return <GraphicDesignMechanism />;
  }
}

function InstrumentHeader({
  channel,
  status = "READOUT READY",
}: {
  channel: string;
  status?: string;
}) {
  return (
    <div className={styles.instrumentHeader}>
      <span>{channel}</span>
      <span className={styles.instrumentStatus}>
        <i aria-hidden="true" />
        {status}
      </span>
    </div>
  );
}

function SeoMechanism() {
  return (
    <figure className={styles.mechanism + " " + styles.seoMechanism}>
      <InstrumentHeader channel="SEARCH / COMMERCIAL INTENT" />
      <div className={styles.seoReadout} aria-hidden="true">
        <div className={styles.rankDisplay}>
          <span>RANK POSITION</span>
          <strong data-seo-rank>3</strong>
          <small>ILLUSTRATIVE TARGET</small>
        </div>

        <div className={styles.rankBoard}>
          <div className={styles.queryBar}>
            <span>your service + city</span>
            <span>BUYER INTENT: HIGH</span>
          </div>
          <div className={styles.rankRows}>
            {[1, 2, 3, 4, 5, 6].map((position) => (
              <div className={styles.rankRow} key={position}>
                <span>{position}</span>
                <i />
                <i />
              </div>
            ))}
            <div className={styles.rankTarget} data-seo-target>
              <span data-seo-card-rank>3</span>
              <div>
                <strong>YOUR HIGH-INTENT PAGE</strong>
                <small>Service, location, proof, next step</small>
              </div>
              <b>QUALIFIED</b>
            </div>
            <div className={styles.rankStart}>
              <span>START</span>
              <strong>18</strong>
            </div>
          </div>
        </div>

        <div className={styles.seoSignals}>
          <div>
            <span>TECHNICAL HEALTH</span>
            <i>
              <b data-seo-health />
            </i>
          </div>
          <div>
            <span>INTENT MATCH</span>
            <i>
              <b data-seo-intent />
            </i>
          </div>
          <div>
            <span>CALL + FORM TRACKING</span>
            <strong>CONNECTED</strong>
          </div>
        </div>
      </div>
      <figcaption className={styles.mechanismCaption}>
        <span>What this readout proves</span>
        <p>
          Rankings are a checkpoint. Calls and forms decide whether the page is
          doing useful work.
        </p>
      </figcaption>
      <dl className="sr-only">
        <dt>Illustrative ranking movement</dt>
        <dd>From position 18 to position 3 for a commercial-intent page.</dd>
        <dt>Business measure</dt>
        <dd>Organic calls and forms are reported beside ranking movement.</dd>
      </dl>
    </figure>
  );
}

function WebsiteMechanism() {
  return (
    <figure className={styles.mechanism + " " + styles.websiteMechanism}>
      <InstrumentHeader channel="WEB / CONVERSION PATH" status="BUILD LAYERS ONLINE" />
      <div className={styles.websiteCanvas} aria-hidden="true">
        <svg
          viewBox="0 0 800 520"
          role="presentation"
          className={styles.websiteSvg}
        >
          <rect
            className={styles.webFrame}
            x="48"
            y="38"
            width="704"
            height="440"
            rx="10"
          />
          <path className={styles.webFrame} d="M48 94H752" />
          <circle className={styles.webChrome} cx="78" cy="66" r="5" />
          <circle className={styles.webChrome} cx="98" cy="66" r="5" />
          <circle className={styles.webChrome} cx="118" cy="66" r="5" />

          <g
            data-web-piece
            data-from-x="-150"
            data-from-y="-90"
            data-from-rotate="-8"
          >
            <rect className={styles.webWire} x="82" y="124" width="392" height="144" rx="5" />
            <rect className={styles.webLiveStrong} x="104" y="146" width="272" height="19" rx="2" />
            <rect className={styles.webLive} x="104" y="182" width="224" height="10" rx="2" />
            <rect className={styles.webLive} x="104" y="204" width="188" height="10" rx="2" />
            <rect className={styles.webCta} x="104" y="230" width="124" height="25" rx="3" />
          </g>

          <g
            data-web-piece
            data-from-x="170"
            data-from-y="-110"
            data-from-rotate="10"
          >
            <rect className={styles.webWire} x="498" y="124" width="220" height="144" rx="5" />
            <rect className={styles.webImage} x="516" y="142" width="184" height="108" rx="3" />
            <path className={styles.webImageLine} d="M516 250L582 184L620 218L662 174L700 214" />
          </g>

          <g
            data-web-piece
            data-from-x="-120"
            data-from-y="130"
            data-from-rotate="7"
          >
            <rect className={styles.webWire} x="82" y="292" width="202" height="132" rx="5" />
            <rect className={styles.webLive} x="100" y="312" width="166" height="62" rx="3" />
            <rect className={styles.webLiveStrong} x="100" y="390" width="116" height="10" rx="2" />
          </g>

          <g
            data-web-piece
            data-from-x="0"
            data-from-y="180"
            data-from-rotate="-6"
          >
            <rect className={styles.webWire} x="300" y="292" width="202" height="132" rx="5" />
            <rect className={styles.webLive} x="318" y="312" width="166" height="62" rx="3" />
            <rect className={styles.webLiveStrong} x="318" y="390" width="116" height="10" rx="2" />
          </g>

          <g
            data-web-piece
            data-from-x="150"
            data-from-y="140"
            data-from-rotate="8"
          >
            <rect className={styles.webWire} x="516" y="292" width="202" height="132" rx="5" />
            <rect className={styles.webLive} x="534" y="312" width="166" height="62" rx="3" />
            <rect className={styles.webLiveStrong} x="534" y="390" width="116" height="10" rx="2" />
          </g>

          <path
            data-web-route
            className={styles.webRoute}
            d="M166 242C220 278 258 274 314 340S470 424 592 350"
          />
          <circle className={styles.webRouteNode} cx="166" cy="242" r="7" />
          <circle className={styles.webRouteNode} cx="592" cy="350" r="7" />
        </svg>

        <div className={styles.buildLayers}>
          <span>Structure</span>
          <span>Content</span>
          <span>Build</span>
          <span className={styles.layerWin}>Measure</span>
        </div>
      </div>
      <figcaption className={styles.mechanismCaption}>
        <span>What this readout proves</span>
        <p>
          Structure, content, build, and measurement ship together. The CTA
          path is tested before launch.
        </p>
      </figcaption>
      <dl className="sr-only">
        <dt>Final state</dt>
        <dd>A complete responsive page with a clear enquiry route.</dd>
        <dt>Build layers</dt>
        <dd>Structure, content, development, forms, and measurement.</dd>
      </dl>
    </figure>
  );
}

function PaidAdsMechanism() {
  return (
    <figure className={styles.mechanism + " " + styles.adsMechanism}>
      <InstrumentHeader channel="MEDIA / SPEND CONTROL" status="MODEL: ILLUSTRATIVE" />
      <div className={styles.adsReadout} aria-hidden="true">
        <div className={styles.adsEquation}>
          <div>
            <span>AD SPEND</span>
            <strong>$6,000</strong>
          </div>
          <i>÷</i>
          <div>
            <span>QUALIFIED LEADS</span>
            <strong data-ads-leads>36</strong>
          </div>
          <i>=</i>
          <div className={styles.adsResult}>
            <span>COST / QUALIFIED LEAD</span>
            <strong>
              $<b data-ads-cpl>167</b>
            </strong>
          </div>
        </div>

        <div className={styles.budgetFlow}>
          <div className={styles.budgetPackets}>
            {Array.from({ length: 10 }, (_, index) => (
              <span data-ad-packet key={index} />
            ))}
          </div>
          <div className={styles.budgetGate}>
            <span>DEMAND</span>
            <i />
          </div>
          <div className={styles.budgetGate}>
            <span>MESSAGE</span>
            <i />
          </div>
          <div className={styles.budgetGate}>
            <span>LANDING PAGE</span>
            <i />
          </div>
          <div className={styles.budgetGate + " " + styles.budgetGateWin}>
            <span>QUALIFIED LEAD</span>
            <i />
          </div>
        </div>

        <div className={styles.adsControls}>
          <div>
            <span>WASTED SPEND</span>
            <i>
              <b data-ads-waste />
            </i>
            <strong>12%</strong>
          </div>
          <div>
            <span>BUYING-INTENT SHARE</span>
            <i>
              <b data-ads-quality />
            </i>
            <strong>86%</strong>
          </div>
        </div>
      </div>
      <figcaption className={styles.mechanismCaption}>
        <span>The equation we report</span>
        <p>Ad spend ÷ qualified leads = cost per qualified lead.</p>
      </figcaption>
      <dl className="sr-only">
        <dt>Illustrative ad spend</dt>
        <dd>Six thousand dollars.</dd>
        <dt>Illustrative qualified leads</dt>
        <dd>Thirty-six.</dd>
        <dt>Illustrative cost per qualified lead</dt>
        <dd>One hundred and sixty-seven dollars.</dd>
      </dl>
    </figure>
  );
}

function SocialMechanism() {
  const points = [
    [86, 378],
    [196, 328],
    [306, 346],
    [416, 240],
    [526, 270],
    [636, 146],
    [744, 102],
  ] as const;

  return (
    <figure className={styles.mechanism + " " + styles.socialMechanism}>
      <InstrumentHeader channel="SOCIAL / USEFUL ENGAGEMENT" status="30-DAY SAMPLE SIGNAL" />
      <div className={styles.socialReadout} aria-hidden="true">
        <div className={styles.socialMetrics}>
          <span>
            <small>SAVES</small>
            <strong data-social-saves>14</strong>
          </span>
          <span>
            <small>REPLIES</small>
            <strong data-social-replies>9</strong>
          </span>
          <span>
            <small>SITE VISITS</small>
            <strong data-social-visits>31</strong>
          </span>
        </div>
        <svg viewBox="0 0 820 470" role="presentation" className={styles.socialGraph}>
          <path className={styles.graphAxis} d="M48 36V414H784" />
          <path className={styles.graphGuide} d="M48 126H784M48 224H784M48 320H784" />
          <path
            data-social-area
            className={styles.graphArea}
            d="M86 378L196 328L306 346L416 240L526 270L636 146L744 102V414H86Z"
          />
          <path
            data-social-path
            className={styles.graphTrace}
            d="M86 378L196 328L306 346L416 240L526 270L636 146L744 102"
          />
          {points.map(([cx, cy], index) => (
            <g data-social-point key={cx}>
              <circle className={styles.graphPointHalo} cx={cx} cy={cy} r="13" />
              <circle className={styles.graphPoint} cx={cx} cy={cy} r="5" />
              {(index === 3 || index === 6) && (
                <text className={styles.graphPointLabel} x={cx + 12} y={cy - 16}>
                  {index === 3 ? "PROOF POST" : "SITE ACTION"}
                </text>
              )}
            </g>
          ))}
          <text className={styles.graphLabel} x="50" y="448">
            PUBLISHING RHYTHM
          </text>
          <text className={styles.graphLabel} x="620" y="448">
            BUSINESS SIGNAL
          </text>
        </svg>
      </div>
      <figcaption className={styles.mechanismCaption}>
        <span>What the line follows</span>
        <p>
          Saves, replies, and site visits carry more weight than passive reach.
          Each point is labelled, not colour-coded alone.
        </p>
      </figcaption>
      <dl className="sr-only">
        <dt>Illustrative thirty-day engagement signal</dt>
        <dd>Fourteen saves, nine replies, and thirty-one site visits.</dd>
        <dt>Reporting priority</dt>
        <dd>Useful engagement and movement from the feed to the website.</dd>
      </dl>
    </figure>
  );
}

function GraphicDesignMechanism() {
  return (
    <figure className={styles.mechanism + " " + styles.designMechanism}>
      <InstrumentHeader channel="DESIGN / RECOGNITION SYSTEM" status="MARK LOCKED" />
      <div className={styles.designReadout} aria-hidden="true">
        <svg viewBox="0 0 820 500" role="presentation" className={styles.designSvg}>
          <g className={styles.designGuides}>
            <circle cx="405" cy="244" r="170" />
            <path d="M166 134H670M166 354H670M276 58V438M554 58V438" />
          </g>

          <g className={styles.designSources} data-design-sources>
            <circle cx="88" cy="92" r="34" />
            <rect x="54" y="176" width="68" height="68" />
            <path d="M52 332H124L88 394Z" />
            <text x="46" y="454">BASE SHAPES</text>
          </g>

          <g className={styles.designMark}>
            <path
              data-design-part
              data-from-x="-250"
              data-from-y="-140"
              data-from-rotate="-28"
              d="M278 136V354"
            />
            <path
              data-design-part
              data-from-x="220"
              data-from-y="-160"
              data-from-rotate="34"
              d="M278 136H366A109 109 0 0 1 366 354H278"
            />
            <path
              data-design-part
              data-from-x="-210"
              data-from-y="170"
              data-from-rotate="24"
              d="M572 176A99 99 0 1 0 572 314V338H578V250H492"
            />
          </g>

          <path
            data-design-stroke
            className={styles.designLock}
            d="M236 398H630"
          />
          <circle className={styles.designWin} cx="434" cy="398" r="8" />
        </svg>

        <div className={styles.identityOutputs}>
          <span data-design-output>PROPOSAL</span>
          <span data-design-output>CAMPAIGN</span>
          <span data-design-output>SOCIAL</span>
          <span data-design-output>SIGNAGE</span>
        </div>
      </div>
      <figcaption className={styles.mechanismCaption}>
        <span>What the build creates</span>
        <p>
          A mark begins with reusable geometry, then carries one recognizable
          system across every sales touchpoint.
        </p>
      </figcaption>
      <dl className="sr-only">
        <dt>Final state</dt>
        <dd>A completed DG mark built from a stem, arcs, and bars.</dd>
        <dt>System applications</dt>
        <dd>Proposal, campaign, social, and signage templates.</dd>
      </dl>
    </figure>
  );
}
