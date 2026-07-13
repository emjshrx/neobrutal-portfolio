---
layout: "../../../layouts/LendingLayout.astro"
title: "Lesson 4 — LWK & Flutter Rust Bridge"
header: "Lessons"
order: "4"
description: "Where the wallet library fits — how Flutter apps call Rust to sync, sign, and broadcast on Liquid."
duration: "~12 min"
---
<p class="meta">Lesson 4 · ~12 min · <a href="/learn/lending/0003-indexer-and-discovery">Lesson 3</a></p>
  <h1>Where the wallet library fits</h1>
  <p class="lead">Lessons 1–3 were the lending protocol. This lesson is the <em>mobile wallet layer</em> — how Flutter apps call Rust to sync, sign, and broadcast on Liquid.</p>

  <nav class="lesson-nav">
    <strong>In this lesson</strong>
    <ul>
      <li>Full stack map</li>
      <li>Liquid Wallet Kit (LWK)</li>
      <li>lwk-dart + Flutter Rust Bridge</li>
      <li>What belongs in wallet code vs protocol code</li>
    </ul>
    <strong>Read first</strong>: <a href="https://github.com/SatoshiPortal/lwk-dart">lwk-dart README</a>, <a href="https://github.com/Blockstream/lwk">Blockstream/lwk</a>
  </nav>

  <h2>The full stack (review)</h2>
  <figure>
    <svg class="state-diagram" viewBox="0 0 480 240" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="ar" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#5c5c5c"/>
        </marker>
      </defs>
      <rect x="160" y="8" width="160" height="36" rx="4" fill="#f5ebe3" stroke="#c45c26"/>
      <text x="240" y="30" text-anchor="middle" font-size="10" font-family="system-ui">Flutter app (Dart UI)</text>

      <rect x="160" y="58" width="160" height="36" rx="4" fill="#fff" stroke="#999"/>
      <text x="240" y="80" text-anchor="middle" font-size="9" font-family="system-ui">lwk-dart (FRB bindings)</text>

      <rect x="130" y="108" width="220" height="36" rx="4" fill="#fff4dd" stroke="#d4a017"/>
      <text x="240" y="130" text-anchor="middle" font-size="9" font-family="system-ui">LWK — Wollet, PSET, sync, sign</text>

      <rect x="20" y="168" width="130" height="36" rx="4" fill="#d1fae5" stroke="#10b981"/>
      <text x="85" y="190" text-anchor="middle" font-size="8" font-family="system-ui">Lending contracts</text>

      <rect x="175" y="168" width="130" height="36" rx="4" fill="#d1fae5" stroke="#10b981"/>
      <text x="240" y="190" text-anchor="middle" font-size="8" font-family="system-ui">Indexer HTTP</text>

      <rect x="330" y="168" width="130" height="36" rx="4" fill="#eee" stroke="#999"/>
      <text x="395" y="190" text-anchor="middle" font-size="8" font-family="system-ui">Esplora / Electrum</text>

      <line x1="240" y1="44" x2="240" y2="56" stroke="#5c5c5c" marker-end="url(#ar)"/>
      <line x1="240" y1="94" x2="240" y2="106" stroke="#5c5c5c" marker-end="url(#ar)"/>
      <line x1="200" y1="144" x2="85" y2="166" stroke="#5c5c5c" marker-end="url(#ar)"/>
      <line x1="240" y1="144" x2="240" y2="166" stroke="#5c5c5c" marker-end="url(#ar)"/>
      <line x1="280" y1="144" x2="395" y2="166" stroke="#5c5c5c" marker-end="url(#ar)"/>
    </svg>
    <figcaption>Mobile lending app: UI → lwk-dart → LWK for wallet ops; separate modules for covenant building and indexer reads.</figcaption>
  </figure>

  <p>The <a href="https://demolending.distributedlab.com/">web demo</a> uses TypeScript + <code>lwk-web</code> instead of Dart, but the split is the same: wallet library for keys/UTXOs/PSETs, separate code for covenants and indexer API.</p>

  <h2>Liquid Wallet Kit (LWK)</h2>
  <p><a href="https://github.com/Blockstream/lwk">LWK</a> is Blockstream’s Rust toolkit for Liquid wallets. Core concerns:</p>
  <ul style="font-size: 0.95rem;">
    <li><strong>Descriptors</strong> — confidential addresses, blinding keys</li>
    <li><strong>Sync</strong> — Electrum/Esplora to update UTXO set</li>
    <li><strong>Balances &amp; txs</strong> — per-asset amounts, transaction history</li>
    <li><strong>PSETs</strong> — build, sign, and broadcast Partially Signed Elements Transactions</li>
  </ul>
  <p>Base LWK does <em>not</em> know about lending covenants. It gives you wallet primitives; protocol logic lives in crates like <code>lending-contracts</code> (Rust) or TS mirrors in the web app.</p>

  <h2>lwk-dart: Dart meets Rust</h2>
  <p><a href="https://github.com/SatoshiPortal/lwk-dart">lwk-dart</a> wraps LWK for Flutter using <strong>Flutter Rust Bridge</strong> (FRB):</p>

  <pre style="font-family: var(--font-sans); font-size: 0.8rem; background: #fff; border: 1px solid var(--border); padding: 1rem;">
// Dart — once at startup
await LibLwk.init();   // loads native Rust binary

// Then use generated API: Wallet, Descriptor, balances, PSET helpers…
  </pre>

  <h3>Project layout</h3>
  <table>
    <thead><tr><th>Path</th><th>Role</th></tr></thead>
    <tbody>
      <tr><td><code>rust/src/api/*.rs</code></td><td>Rust API surface exported to Dart (<code>wallet.rs</code>, <code>types.rs</code>, …)</td></tr>
      <tr><td><code>lib/src/generated/</code></td><td>FRB codegen output — do not hand-edit</td></tr>
      <tr><td><code>flutter_rust_bridge.yaml</code></td><td>Codegen config (<code>rust_input</code>, <code>dart_output</code>)</td></tr>
      <tr><td><code>compile.native.sh</code></td><td>Build Rust binary + run <code>flutter_rust_bridge_codegen</code></td></tr>
    </tbody>
  </table>

  <h3>How FRB exposes Rust to Dart</h3>
  <p>Functions and types in <code>rust/src/api/</code> are annotated for export. Example pattern from the repo:</p>
  <ul style="font-size: 0.95rem;">
    <li><code>#[frb(sync)]</code> on simple helpers (e.g. balance lookups)</li>
    <li><code>Wallet</code> wraps <code>lwk_wollet::Wollet</code> in an opaque <code>RustOpaque&lt;Mutex&lt;…&gt;&gt;</code></li>
    <li>Rust structs like <code>Balance</code>, <code>Tx</code>, <code>Address</code> become Dart classes after codegen</li>
    <li>Errors map to <code>LwkError</code> on the Dart side</li>
  </ul>

  <div class="callout">
    <strong>Adding a new feature (e.g. lending)</strong>
    <ol style="margin: 0.5rem 0 0; font-size: 0.9rem;">
      <li>Implement Rust logic (wallet extension or dependency on lending crates)</li>
      <li>Export via <code>#[frb]</code> in <code>rust/src/api/</code></li>
      <li>Run compile script → regenerated Dart bindings</li>
      <li>Call from Flutter UI</li>
    </ol>
  </div>

  <h2>Division of labour (for code review)</h2>
  <table>
    <thead><tr><th>Concern</th><th>Typical home</th><th>Not wallet’s job</th></tr></thead>
    <tbody>
      <tr>
        <td>Hold keys, sync UTXOs</td>
        <td>LWK / <code>Wallet.sync</code></td>
        <td>—</td>
      </tr>
      <tr>
        <td>Build covenant transaction</td>
        <td>Rust lending / Simplicity layer</td>
        <td>Indexer</td>
      </tr>
      <tr>
        <td>Sign PSET</td>
        <td>LWK <code>sign_tx</code></td>
        <td>—</td>
      </tr>
      <tr>
        <td>List pending offers</td>
        <td>Indexer HTTP client</td>
        <td>LWK (no offer DB)</td>
      </tr>
      <tr>
        <td>Verify offer is real</td>
        <td>On-chain covenants (authoritative)</td>
        <td>Indexer alone</td>
      </tr>
    </tbody>
  </table>
  <p>When reviewing changes that add lending to <code>lwk-dart</code>, check: Rust types mirror protocol semantics (amounts, asset ids, status enums); FRB exports are complete; Dart gets async/error handling right; covenant logic stays in Rust, not reimplemented in Dart.</p>

  <h2>Web vs mobile (same protocol, different bridge)</h2>
  <table>
    <thead><tr><th></th><th>Web demo</th><th>Flutter (lwk-dart)</th></tr></thead>
    <tbody>
      <tr><td>Wallet</td><td><code>@lilbonekit/lwk-web</code></td><td>LWK via FRB</td></tr>
      <tr><td>Covenants</td><td>TS in <code>web/src/simplicity/</code></td><td>Rust (target for mobile PRs)</td></tr>
      <tr><td>Indexer</td><td>Fetch + Zod validation</td><td>Rust HTTP client → FRB → Dart</td></tr>
    </tbody>
  </table>

  <section class="quiz" data-quiz>
    <h2>Check your understanding</h2>

    <div class="question-block" data-answer="0">
      <p class="question">1. What does LibLwk.init do in a Flutter app?</p>
      <div class="options">
        <button class="option" type="button">Loads the native Rust wallet binary once at startup</button>
        <button class="option" type="button">Creates a new Liquid issuance factory for each borrower</button>
        <button class="option" type="button">Starts the lending indexer REST API server locally</button>
        <button class="option" type="button">Compiles SimplicityHL covenant source files at runtime</button>
      </div>
      <p class="feedback"></p>
    </div>

    <div class="question-block" data-answer="0">
      <p class="question">2. Where do new FRB-exported Rust APIs belong?</p>
      <div class="options">
        <button class="option" type="button">Inside the rust/src/api module tree in lwk-dart</button>
        <button class="option" type="button">Inside the lending indexer PostgreSQL database schema</button>
        <button class="option" type="button">Inside the demo web app Vite configuration file only</button>
        <button class="option" type="button">Inside the Simplicity official documentation website pages</button>
      </div>
      <p class="feedback"></p>
    </div>

    <div class="question-block" data-answer="0">
      <p class="question">3. What is LWK responsible for in the lending stack?</p>
      <div class="options">
        <button class="option" type="button">Wallet sync signing UTXOs and PSET transaction building</button>
        <button class="option" type="button">Replacing on-chain covenant enforcement with server trust</button>
        <button class="option" type="button">Indexing all Liquid blocks without any Esplora connection</button>
        <button class="option" type="button">Minting role NFTs without spending any factory UTXO ever</button>
      </div>
      <p class="feedback"></p>
    </div>

    <p class="score"></p>
  </section>

  <div class="callout">
    <strong>You’re ready to review</strong>
    You now have protocol vocabulary (Lessons 1–3) and wallet/bridge context (Lesson 4). When you open the lwk-dart PRs, map each change to a layer: covenant primitive, factory flow, indexer client, or offer creation — and ask whether it belongs there.
  </div>

  <div class="ask-teacher">
    <strong>Ask your teacher</strong><br>
    Ready to review a PR? Ask: “what should I check in the IssuanceFactory PR?” or “walk me through how FRB codegen fits the build.”
  </div>

  <nav class="lesson-nav">
    <strong>Next</strong>
    <ul>
      <li><a href="/learn/lending/0005-simplicity-primitives">Lesson 5: Simplicity primitives</a></li>
      <li><a href="/learn/lending/lwk-frb-stack">LWK stack reference</a></li>
    </ul>
  </nav>
