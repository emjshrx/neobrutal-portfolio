---
layout: "../../../layouts/LendingLayout.astro"
title: "Indexer API & Status Reference"
header: "Reference"
order: "5"
description: "Quick lookup for lending-indexer statuses, UTXO types, and REST endpoints."
---
<p class="meta">Reference · <a href="/learn/lending/lending-glossary">Glossary</a></p>
  <h1>Indexer API &amp; Status Reference</h1>
  <p class="lead">Quick lookup for <a href="https://github.com/BlockstreamResearch/simplicity-lending/tree/main/crates/indexer">lending-indexer</a>. Swagger at <code>/swagger-ui/</code> when API is running.</p>

  <h2>Offer statuses</h2>
  <table>
    <thead><tr><th>Status</th><th>Meaning</th></tr></thead>
    <tbody>
      <tr><td><code>pending</code></td><td>Collateral locked; waiting for lender</td></tr>
      <tr><td><code>active</code></td><td>Lender funded principal; loan running</td></tr>
      <tr><td><code>repaid</code></td><td>Borrower repaid; lender vault awaiting claim</td></tr>
      <tr><td><code>claimed</code></td><td>Lender withdrew from repayment vault</td></tr>
      <tr><td><code>liquidated</code></td><td>Term expired; lender took collateral</td></tr>
      <tr><td><code>cancelled</code></td><td>Borrower cancelled pending offer</td></tr>
    </tbody>
  </table>

  <h2>Tracked UTXO types</h2>
  <table>
    <thead><tr><th>Type</th><th>When created</th></tr></thead>
    <tbody>
      <tr><td><code>pending_offer</code></td><td>Offer creation tx</td></tr>
      <tr><td><code>active_offer</code></td><td>Lender acceptance tx (output 0)</td></tr>
      <tr><td><code>borrower_principal</code></td><td>Acceptance tx (output 1) — principal locked for borrower</td></tr>
      <tr><td><code>repayment</code></td><td>Full repayment tx — lender vault</td></tr>
      <tr><td><code>cancellation</code></td><td>Cancel tx (audit trail)</td></tr>
      <tr><td><code>liquidation</code></td><td>Liquidation tx (audit trail)</td></tr>
      <tr><td><code>claim</code></td><td>Lender vault claim tx</td></tr>
    </tbody>
  </table>

  <h2>Key endpoints</h2>
  <table>
    <thead><tr><th>Method</th><th>Path</th><th>Use</th></tr></thead>
    <tbody>
      <tr><td>GET</td><td><code>/offers</code></td><td>Browse offers (filter by <code>status</code>, assets, factory)</td></tr>
      <tr><td>GET</td><td><code>/offers/{id}</code></td><td>Full detail: NFT ids, participant UTXOs, unspent offer UTXOs</td></tr>
      <tr><td>GET</td><td><code>/offers/by-script</code></td><td>Offer IDs for wallet holding participant NFT</td></tr>
      <tr><td>GET</td><td><code>/borrowers/offers</code></td><td>Offers where <code>script_pubkey</code> is borrower</td></tr>
      <tr><td>GET</td><td><code>/lenders/offers</code></td><td>Offers where <code>script_pubkey</code> is lender</td></tr>
      <tr><td>GET</td><td><code>/factories/by-script</code></td><td>Factories owned by wallet</td></tr>
      <tr><td>GET</td><td><code>/factories/{id}</code></td><td>Factory detail + auth/program UTXOs</td></tr>
    </tbody>
  </table>

  <h2>Response fields (short offer)</h2>
  <ul style="font-family: var(--font-sans); font-size: 0.9rem;">
    <li><code>interest_rate</code> — basis points (1000 = 10%)</li>
    <li><code>loan_expiration_height</code> — block height</li>
    <li><code>collateral_amount</code>, <code>principal_amount</code> — decimal satoshi strings</li>
    <li><code>issuance_factory_id</code> — links offer to borrower factory</li>
    <li><code>participants</code> — latest borrower/lender script pubkeys</li>
  </ul>

  <nav class="lesson-nav">
    <strong>Related</strong>
    <ul>
      <li><a href="/learn/lending/0003-indexer-and-discovery">Lesson 3</a></li>
      <li><a href="/learn/lending/offer-state-machine">State machine</a></li>
    </ul>
  </nav>