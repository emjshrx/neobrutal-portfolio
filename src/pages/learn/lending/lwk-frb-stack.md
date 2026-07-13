---
layout: "../../../layouts/LendingLayout.astro"
title: "LWK & FRB Stack Reference"
header: "Reference"
order: "8"
description: "How LWK, Flutter Rust Bridge, and lwk-dart layer together."
---
<p class="meta">Reference · <a href="/learn/lending/lending-glossary">Glossary</a></p>
  <h1>LWK &amp; FRB stack</h1>
  <p class="lead">How mobile wallets talk to Liquid — <a href="https://github.com/Blockstream/lwk">LWK</a>, <a href="https://github.com/SatoshiPortal/lwk-dart">lwk-dart</a>.</p>

  <h2>Layers</h2>
  <table>
    <thead><tr><th>Layer</th><th>Tech</th><th>Responsibility</th></tr></thead>
    <tbody>
      <tr><td>App</td><td>Flutter / Dart</td><td>UI, calls generated FRB bindings</td></tr>
      <tr><td>Bridge</td><td>Flutter Rust Bridge</td><td>FFI codegen between Dart and Rust</td></tr>
      <tr><td>Wallet</td><td>LWK (<code>lwk_wollet</code>)</td><td>Descriptor, sync, balances, UTXOs, PSET sign</td></tr>
      <tr><td>Protocol</td><td>lending-contracts / Simplex</td><td>Covenant tx building (not in base LWK)</td></tr>
      <tr><td>Discovery</td><td>lending-indexer REST</td><td>Offer lists, status (separate HTTP client)</td></tr>
      <tr><td>Chain</td><td>Esplora / Electrum</td><td>Block/tx data, broadcast</td></tr>
    </tbody>
  </table>

  <h2>lwk-dart layout</h2>
  <pre style="font-family: var(--font-sans); font-size: 0.8rem; background: #fff; border: 1px solid var(--border); padding: 1rem;">
rust/src/api/          ← FRB-exported Rust (wallet, types, transaction…)
lib/src/generated/     ← codegen output (do not hand-edit)
flutter_rust_bridge.yaml
compile.native.sh      ← build Rust + run codegen
  </pre>

  <h2>Key Dart types (base LWK)</h2>
  <table>
    <thead><tr><th>Type</th><th>Purpose</th></tr></thead>
    <tbody>
      <tr><td><code>Wallet</code></td><td>Main wallet handle (opaque Rust Wollet)</td></tr>
      <tr><td><code>Descriptor</code></td><td>Confidential descriptor for init</td></tr>
      <tr><td><code>Balance</code></td><td>Per-asset balance</td></tr>
      <tr><td><code>Tx</code> / PSET helpers</td><td>Build, sign, decode transactions</td></tr>
      <tr><td><code>LwkError</code></td><td>Rust errors surfaced to Dart</td></tr>
    </tbody>
  </table>

  <h2>Adding a new capability</h2>
  <ol style="font-size: 0.9rem;">
    <li>Implement logic in Rust (<code>rust/src/api/</code> or dependency crate)</li>
    <li>Expose with <code>#[frb]</code> on functions / types</li>
    <li>Run <code>./compile.native.sh</code> (build + codegen)</li>
    <li>Call from Dart via <code>lib/src/generated/</code></li>
  </ol>

  <nav class="lesson-nav">
    <strong>Related</strong>
    <ul>
      <li><a href="/learn/lending/0004-lwk-and-frb">Lesson 4</a></li>
      <li><a href="/learn/lending/indexer-api">Indexer API</a></li>
    </ul>
  </nav>