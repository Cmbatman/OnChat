import Link from "next/link";

const adTypes = [
  "Homepage banners",
  "Sidebar banners",
  "Mobile banners",
  "Sticky footer placements",
  "Sponsored profile placement",
  "Featured visibility zones",
  "Sponsored rooms and events later",
];

const plans = ["Global Reach", "Regional Targeting", "Advanced Geo Targeting"];

export default function PromotePage() {
  return (
    <main className="contentPage">
      <section className="contentHero">
        <p>OnChat for advertisers</p>
        <h1>Promote Your Brand on OnChat</h1>
        <span>
          Reach people inside a fast anonymous social platform built around live sessions,
          online discovery, and lightweight conversation.
        </span>
      </section>

      <section className="contentGrid">
        <article className="contentCard">
          <h2>Why Advertise on OnChat</h2>
          <p>
            OnChat gives brands, apps, creators, communities, and services a modern place
            to appear near real-time social activity without interrupting private chats.
          </p>
        </article>
        <article className="contentCard">
          <h2>Audience Snapshot</h2>
          <div className="statGrid">
            <strong><b>Live</b><span>Session-based users</span></strong>
            <strong><b>Global</b><span>Country and state discovery</span></strong>
            <strong><b>Mobile</b><span>Responsive chat-first UI</span></strong>
          </div>
        </article>
        <article className="contentCard">
          <h2>Ad Types Available</h2>
          <ul>{adTypes.map((type) => <li key={type}>{type}</li>)}</ul>
        </article>
        <article className="contentCard">
          <h2>Advertising Plans</h2>
          <div className="pillList">{plans.map((plan) => <span key={plan}>{plan}</span>)}</div>
          <p>Pricing is shared after fit, targeting, and placement are reviewed.</p>
        </article>
        <article className="contentCard">
          <h2>Ad Placement Preview</h2>
          <p>
            Placements are designed around clean cards, sidebar slots, mobile-safe banners,
            and sponsored visibility zones that do not mimic chat messages.
          </p>
        </article>
        <article className="contentCard">
          <h2>Safety for Advertisers</h2>
          <p>
            OnChat uses reporting, blocking, anti-spam rules, and moderation controls to keep
            advertiser placements away from harmful or misleading behavior.
          </p>
        </article>
      </section>

      <section className="contentCta">
        <h2>Ready to start advertising?</h2>
        <Link href="/faq">Contact Sales / Start Advertising</Link>
      </section>
    </main>
  );
}
