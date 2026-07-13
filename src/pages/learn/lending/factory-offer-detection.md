---
layout: "../../../layouts/LendingLayout.astro"
title: "Factory Issuance → Offer Detection"
header: "Reference"
order: "9"
description: "How the indexer detects a new lending offer from factory issuance."
---
<p class="meta">Reference · <a href="/learn/lending/indexer-api">Indexer API</a></p>
  <h1>Factory issuance → offer detection</h1>
  <p class="lead">How the indexer knows “this transaction created a new lending offer.”</p>

  <h2>Two separate problems</h2>
  <table>
    <thead><tr><th>Problem</th><th>Solution</th></tr></thead>
    <tbody>
      <tr><td>Mint fresh role NFTs per offer</td><td><strong>IssuanceFactory</strong> — <code>IssueAssets</code> path</td></tr>
      <tr><td>Lock collateral + publish terms</td><td><strong>LendingOffer</strong> covenant in the same tx</td></tr>
      <tr><td>Find new offers among all Liquid txs</td><td>Indexer gate: only parse txs that just <em>issued from a known factory</em></td></tr>
    </tbody>
  </table>

  <h2>One transaction, both steps</h2>
  <p>Creating an offer is typically <strong>one transaction</strong> that does both:</p>
  <ol style="font-size: 0.95rem;">
    <li>Spends the borrower’s <strong>factory</strong> + <strong>auth NFT</strong> → mints new borrower/lender NFTs via Liquid issuance inputs</li>
    <li>Locks <strong>collateral</strong> in a <code>pending_offer</code> output + writes <strong>OP_RETURN metadata</strong> (rate, expiry, principal)</li>
  </ol>

  <pre style="font-family: var(--font-sans); font-size: 0.75rem; overflow-x: auto; background: #fff; border: 1px solid var(--border); padding: 1rem;">
CREATE-OFFER TRANSACTION (simplified)

  INPUTS                          OUTPUTS
  ───────                         ───────
  auth NFT (1 unit)        →      auth NFT back
  factory covenant UTXO    →      factory covenant back
  issuance input(s)        →      borrower NFT  (output 2)
  collateral (LBTC…)       →      lender NFT    (output 3)
                                  OP_RETURN     (output 4) ← terms metadata
                                  …             (output 5)
                                  pending_offer (output 5) ← collateral locked here
  </pre>

  <h2>Indexer logic (per transaction)</h2>
  <pre style="font-family: var(--font-sans); font-size: 0.8rem; background: #fff; border: 1px solid var(--border); padding: 1rem;">
1. Did this tx spend a tracked FACTORY program UTXO?
   AND did the factory program reappear in outputs?
   → Yes: mark effect = AssetsIssued(factory_id)

2. Did this tx spend an existing OFFER UTXO?
   → Yes: update status (accept / cancel / repay / liquidate). STOP.

3. If effect = AssetsIssued AND no offer was spent:
   → Try LendingOffer::try_from_tx(tx)
   → If valid: insert new offer (status = pending), watch pending_offer UTXO
   → If invalid: ignore (factory issued assets but not an offer tx)
  </pre>
  <p>Source: <a href="https://github.com/BlockstreamResearch/simplicity-lending/blob/main/crates/indexer/src/indexer/trackers/registry.rs">tracker registry</a>, <a href="https://github.com/BlockstreamResearch/simplicity-lending/blob/main/crates/indexer/src/indexer/trackers/offers_creation/core.rs">offer creation tracker</a>.</p>

  <h2>Why gate on factory issuance?</h2>
  <ul style="font-size: 0.95rem;">
    <li><strong>Efficiency</strong> — don’t run offer parsing on every tx in every block</li>
    <li><strong>Provenance</strong> — every offer links to <code>issuance_factory_id</code> (which borrower account)</li>
    <li><strong>Correct minting</strong> — role NFTs only exist if factory authorized them; offer covenant expects those asset IDs</li>
  </ul>

  <h2>What <code>try_from_tx</code> checks</h2>
  <p>Even after the factory gate, the indexer still verifies the tx is a real offer:</p>
  <ul style="font-size: 0.95rem;">
    <li>≥ 7 outputs; output 4 is OP_RETURN with valid creation metadata</li>
    <li>Program id in metadata matches <code>LendingOffer</code></li>
    <li>Collateral amount from pending-offer output; principal/rate/expiry from metadata</li>
    <li>Borrower/lender NFT asset IDs from outputs 2–3</li>
  </ul>

  <div class="callout">
    <strong>Memory hook</strong>
    Factory issuance = “new NFTs were minted for this borrower.” Offer detection = “those NFTs were immediately used to lock collateral with valid metadata.” Same tx, two checks.
  </div>

  <nav class="lesson-nav">
    <strong>Related</strong>
    <ul>
      <li><a href="/learn/lending/0002-utility-tokens-and-factory">Lesson 2: Factory</a></li>
      <li><a href="/learn/lending/0003-indexer-and-discovery">Lesson 3: Indexer</a></li>
    </ul>
  </nav>