---
layout: "../../../layouts/LendingLayout.astro"
title: "Lesson 3 — Indexer & Discovery"
header: "Lessons"
order: "3"
description: "How lenders discover offers — indexer verification, per-block pipeline, and REST API."
duration: "~12 min"
---
<p class="meta">Lesson 3 · ~12 min · <a href="/learn/lending/0002-utility-tokens-and-factory">Lesson 2</a></p>
  <h1>How lenders discover offers</h1>
  <p class="lead">Covenants enforce rules on-chain. The indexer watches the chain and serves data to wallets and the <a href="https://demolending.distributedlab.com/">demo UI</a>.</p>

  <nav class="lesson-nav">
    <strong>In this lesson</strong>
    <ul>
      <li>Why an indexer exists</li>
      <li>Discovery and verification</li>
      <li>Per-block indexing pipeline</li>
      <li>REST API for wallets</li>
    </ul>
    <strong>Read first</strong>: <a href="https://docs.simplicity-lang.org/use-cases/lending-protocol/#indexing-and-discovery-mechanism">Indexing and Discovery Mechanism</a> (official docs)
  </nav>

  <h2>Why not read the chain directly?</h2>
  <p>A wallet <em>could</em> scan every Liquid transaction. In practice that is slow, expensive, and error-prone. The lending indexer:</p>
  <ul style="font-size: 0.95rem;">
    <li>Recognizes protocol transactions by structure and covenant hashes</li>
    <li>Maintains a database of offers, statuses, and tracked UTXOs</li>
    <li>Exposes a REST API so apps list pending offers and show “your loans”</li>
  </ul>
  <p>The indexer does <strong>not</strong> hold private keys or sign transactions. Wallets still build and broadcast covenant spends; the indexer catches up afterward.</p>

  <h2>Two layers of trust</h2>
  <table>
    <thead><tr><th>Layer</th><th>Who</th><th>What it guarantees</th></tr></thead>
    <tbody>
      <tr>
        <td><strong>On-chain</strong></td>
        <td>Simplicity covenants</td>
        <td>Only valid witness paths can move funds</td>
      </tr>
      <tr>
        <td><strong>Off-chain</strong></td>
        <td>Indexer</td>
        <td>Correctly identifies and tracks protocol txs; serves queryable state</td>
      </tr>
    </tbody>
  </table>
  <p>When reviewing an indexer client (e.g. HTTP bindings in a wallet library), ask: does it parse the same fields the API returns, and does it treat indexer data as <em>hints</em> while the chain remains authoritative?</p>

  <h2>Offer discovery and verification</h2>

  <h3>Official docs (Pre-lock / parameter tokens)</h3>
  <p>From the <a href="https://docs.simplicity-lang.org/use-cases/lending-protocol/#pre-lock-transaction-discovery-and-verification">docs</a>, a valid offer-initialization tx must match a template (input/output counts, OP_RETURN with BIP340 pubkey, parameter UTXOs on inputs 0–1). The indexer then:</p>
  <ol>
    <li>Extracts parameters from the transaction</li>
    <li>Recompiles the Pre-lock covenant</li>
    <li>Compares the resulting <strong>CMR</strong> (script hash) to output 0</li>
  </ol>
  <p>If they match, the tx is a genuine offer — not a lookalike with fake terms.</p>

  <h3>Reference implementation (LendingOffer)</h3>
  <p>In <a href="https://github.com/BlockstreamResearch/simplicity-lending">simplicity-lending</a>, discovery uses <code>LendingOffer::try_from_tx</code>: parse OP_RETURN metadata, validate output layout, confirm covenant address. Offer creation is only attempted when the same transaction also spent a known <strong>IssuanceFactory</strong> (factory issued the role NFTs first). <a href="/learn/lending/factory-offer-detection">Detailed walkthrough →</a></p>

  <div class="callout">
    <strong>Stale README warning</strong>
    The indexer README still says “PreLock” in places. The code tracks <code>LendingOffer</code> and <code>pending_offer</code> UTXOs. Trust the implementation and tests when reviewing.
  </div>

  <h2>Per-block pipeline</h2>
  <p>For each block, the indexer worker (<a href="https://github.com/BlockstreamResearch/simplicity-lending/blob/main/crates/indexer/src/indexer/block_processor.rs">block processor</a>):</p>
  <ol style="font-size: 0.95rem;">
    <li>Fetches block txs from <strong>Esplora</strong></li>
    <li>For each transaction, runs trackers in order:</li>
  </ol>

  <figure>
    <svg class="state-diagram" viewBox="0 0 460 220" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="a" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#5c5c5c"/>
        </marker>
      </defs>
      <text x="230" y="18" text-anchor="middle" font-size="10" font-family="system-ui" font-weight="600">Per-transaction processing order</text>

      <rect x="20" y="35" width="95" height="32" rx="3" fill="#fff" stroke="#999"/>
      <text x="67" y="55" text-anchor="middle" font-size="8" font-family="system-ui">Factory spends</text>

      <rect x="130" y="35" width="95" height="32" rx="3" fill="#fff" stroke="#999"/>
      <text x="177" y="55" text-anchor="middle" font-size="8" font-family="system-ui">Auth NFT spends</text>

      <rect x="240" y="35" width="95" height="32" rx="3" fill="#fff4dd" stroke="#d4a017"/>
      <text x="287" y="55" text-anchor="middle" font-size="8" font-family="system-ui">Offer UTXO spends</text>

      <rect x="350" y="35" width="95" height="32" rx="3" fill="#fff4dd" stroke="#d4a017"/>
      <text x="397" y="55" text-anchor="middle" font-size="8" font-family="system-ui">Participant NFTs</text>

      <line x1="115" y1="51" x2="128" y2="51" stroke="#5c5c5c" marker-end="url(#a)"/>
      <line x1="225" y1="51" x2="238" y2="51" stroke="#5c5c5c" marker-end="url(#a)"/>
      <line x1="335" y1="51" x2="348" y2="51" stroke="#5c5c5c" marker-end="url(#a)"/>

      <rect x="80" y="100" width="120" height="36" rx="3" fill="#f5ebe3" stroke="#c45c26"/>
      <text x="140" y="122" text-anchor="middle" font-size="8" font-family="system-ui">Factory creation?</text>

      <rect x="260" y="100" width="140" height="36" rx="3" fill="#d1fae5" stroke="#10b981"/>
      <text x="330" y="122" text-anchor="middle" font-size="8" font-family="system-ui">Offer creation? (if factory issued)</text>

      <line x1="177" y1="67" x2="140" y2="98" stroke="#5c5c5c" stroke-dasharray="3,2" marker-end="url(#a)"/>
      <line x1="287" y1="67" x2="330" y2="98" stroke="#5c5c5c" stroke-dasharray="3,2" marker-end="url(#a)"/>

      <text x="230" y="165" text-anchor="middle" font-size="9" fill="#5c5c5c" font-family="system-ui">Spending a tracked UTXO triggers status transition</text>
      <text x="230" y="182" text-anchor="middle" font-size="8" fill="#5c5c5c" font-family="system-ui">pending_offer → active | cancelled · active_offer → repaid | liquidated</text>
    </svg>
    <figcaption>Spend detection drives state updates. New offers are detected only after factory issuance in the same tx.</figcaption>
  </figure>

  <h2>Status transitions (reference impl)</h2>
  <table>
    <thead><tr><th>Spend of…</th><th>Tx pattern</th><th>New status</th></tr></thead>
    <tbody>
      <tr><td><code>pending_offer</code></td><td>Cancellation outputs</td><td><code>cancelled</code></td></tr>
      <tr><td><code>pending_offer</code></td><td>Otherwise (acceptance)</td><td><code>active</code></td></tr>
      <tr><td><code>active_offer</code></td><td>Repayment outputs (5+ outs, pattern)</td><td><code>repaid</code></td></tr>
      <tr><td><code>active_offer</code></td><td>Otherwise</td><td><code>liquidated</code></td></tr>
      <tr><td><code>repayment</code> vault</td><td>Lender claim</td><td><code>claimed</code></td></tr>
    </tbody>
  </table>
  <p>Full status list and API fields: <a href="/learn/lending/indexer-api">Indexer API reference</a>.</p>

  <h2>What wallets consume</h2>
  <p>The <a href="https://demolending.distributedlab.com/">demo web app</a> reads the indexer for listings and details, then uses LWK to sign covenant transactions. Typical flow:</p>
  <ol style="font-size: 0.95rem;">
    <li><code>GET /offers?status=pending</code> — lender browses open offers</li>
    <li><code>GET /offers/{id}</code> — fetch NFT asset ids, UTXOs, amounts for tx building</li>
    <li><code>GET /borrowers/offers?script_pubkey=…</code> — borrower sees their loans</li>
    <li><code>GET /factories/by-script?script_pubkey=…</code> — borrower finds factory before creating offer</li>
  </ol>
  <p>Interest is quoted in <strong>basis points</strong> (<code>1000</code> = 10%). Amounts are decimal satoshi strings.</p>

  <div class="callout">
    <strong>Review lens</strong>
    An HTTP client wrapper should map API types faithfully (status enum, asset hex, factory UUID, expiration height). It should not re-derive covenant logic — that stays in the contracts layer.
  </div>

  <section class="quiz" data-quiz>
    <h2>Check your understanding</h2>

    <div class="question-block" data-answer="0">
      <p class="question">1. What verifies a new offer creation tx is genuine?</p>
      <div class="options">
        <button class="option" type="button">Recompiled covenant CMR matches output script hash</button>
        <button class="option" type="button">Borrower wallet signature on the indexer API request</button>
        <button class="option" type="button">Esplora node confirms sufficient Liquid mempool depth</button>
        <button class="option" type="button">Factory auth NFT burned during the same transaction</button>
      </div>
      <p class="feedback"></p>
    </div>

    <div class="question-block" data-answer="0">
      <p class="question">2. When does the indexer try to index a new offer?</p>
      <div class="options">
        <button class="option" type="button">After a known factory issuance in the same transaction</button>
        <button class="option" type="button">On every transaction with six or more output rows</button>
        <button class="option" type="button">When any OP_RETURN output appears in the block height</button>
        <button class="option" type="button">Only when the borrower calls the REST API directly</button>
      </div>
      <p class="feedback"></p>
    </div>

    <div class="question-block" data-answer="0">
      <p class="question">3. Spending a pending-offer UTXO updates status to?</p>
      <div class="options">
        <button class="option" type="button">Either active or cancelled depending on witness path</button>
        <button class="option" type="button">Either repaid or claimed depending on witness path</button>
        <button class="option" type="button">Either liquidated or cancelled depending on witness path</button>
        <button class="option" type="button">Either pending or active depending on witness path</button>
      </div>
      <p class="feedback"></p>
    </div>

    <p class="score"></p>
  </section>

  <div class="ask-teacher">
    <strong>Ask your teacher</strong><br>
    Try: “what’s the difference between repaid and claimed?” or “how would I test an indexer client without mainnet?”
  </div>

  <nav class="lesson-nav">
    <strong>Next</strong>
    <ul>
      <li><a href="/learn/lending/0004-lwk-and-frb">Lesson 4: LWK &amp; FRB</a></li>
      <li><a href="/learn/lending/indexer-api">Reference: indexer API</a></li>
      <li><a href="https://demolending.distributedlab.com/">Live demo</a></li>
    </ul>
  </nav>
