---
layout: "../../../layouts/LendingLayout.astro"
title: "Lesson 1 — Lending Protocol Basics"
header: "Lessons"
order: "1"
description: "Two assets, two parties, one deadline — the economic story of P2P collateralized lending on Liquid."
duration: "~10 min"
---
<p class="meta">Lesson 1 · ~10 min · <a href="/learn/lending/mission">Mission</a></p>
  <h1>What is being lent, and who moves what?</h1>
  <p class="lead">Before reading any wallet code, nail the economic story: two assets, two parties, one deadline.</p>

  <nav class="lesson-nav">
    <strong>In this lesson</strong>
    <ul>
      <li>Parties and assets</li>
      <li>The offer lifecycle</li>
      <li>Retrieval quiz</li>
    </ul>
    <strong>Read first</strong>: <a href="https://docs.simplicity-lang.org/use-cases/lending-protocol/">Simplicity Lending Protocol</a> (sections through “P2P Simplified Lending Contract”)
  </nav>

  <h2>Two assets, two roles</h2>
  <p>The protocol is <em>peer-to-peer collateralized lending</em> on Liquid. Docs illustrate USDT (loan asset) against LBTC (collateral), but any tokenized pair works.</p>

  <table>
    <thead><tr><th>Role</th><th>Starts with</th><th>Wants</th></tr></thead>
    <tbody>
      <tr><td><strong>Borrower</strong></td><td>Collateral (asset A)</td><td>Principal (asset B) now; collateral back later</td></tr>
      <tr><td><strong>Lender</strong></td><td>Principal (asset B)</td><td>Interest/fee on asset B; collateral if borrower defaults</td></tr>
    </tbody>
  </table>

  <p>Terms are agreed <em>before</em> acceptance: collateral amount, principal amount, lending term (deadline), loan fee (fixed interest), optional origination fee, protocol fee share.</p>

  <h2>The lifecycle in plain language</h2>
  <ol>
    <li><strong>Propose</strong> — Borrower locks collateral and publishes terms. Offer is visible to lenders (via indexer / demo UI).</li>
    <li><strong>Cancel</strong> — While still pending, borrower can abort and recover collateral.</li>
    <li><strong>Accept</strong> — A lender sends principal; loan becomes active.</li>
    <li><strong>Repay</strong> — Before the deadline, borrower returns principal + loan fee; collateral is released.</li>
    <li><strong>Liquidate</strong> — After the deadline without full repayment, lender claims the collateral.</li>
  </ol>

  <p>See the diagram in <a href="/learn/lending/offer-state-machine">Offer state machine</a> or try the <a href="https://demolending.distributedlab.com/">live demo</a> as a lender browsing pending offers.</p>

  <div class="callout">
    <strong>On-chain vs off-chain</strong>
    Smart contracts enforce <em>who can spend which UTXO when</em>. Discovery — listing open offers, showing your loans — needs an <strong>indexer</strong> that watches the chain. Wallet libraries (LWK) build and sign transactions; they do not replace the indexer.
  </div>

  <h2>Terms you will see in code reviews</h2>
  <ul style="font-size: 0.95rem;">
    <li><strong>Pending offer</strong> — collateral locked, waiting for a lender</li>
    <li><strong>Active loan</strong> — principal delivered, clock running</li>
    <li><strong>Covenant</strong> — Simplicity program locking a UTXO until a valid witness path is provided</li>
    <li><strong>Loan fee / interest</strong> — in the simplified contract, a fixed fee on repayment (reference impl: basis points on principal)</li>
  </ul>
  <p>Full definitions: <a href="/learn/lending/lending-glossary">Glossary</a>.</p>

  <section class="quiz" data-quiz>
    <h2>Check your understanding</h2>
    <p style="font-size: 0.85rem; color: var(--muted);">Pick the best answer. Options are equal length on purpose.</p>

    <div class="question-block" data-answer="1">
      <p class="question">1. When a lender accepts a pending offer, what happens?</p>
      <div class="options">
        <button class="option" type="button">Collateral moves from lender to borrower on-chain.</button>
        <button class="option" type="button">Principal moves from lender to borrower on-chain.</button>
        <button class="option" type="button">Principal moves from borrower to lender on-chain.</button>
        <button class="option" type="button">Collateral moves from borrower to lender on-chain.</button>
      </div>
      <p class="feedback"></p>
    </div>

    <div class="question-block" data-answer="2">
      <p class="question">2. After the lending term expires without repayment, who gets the collateral?</p>
      <div class="options">
        <button class="option" type="button">The borrower always keeps the locked collateral asset.</button>
        <button class="option" type="button">The protocol burns the collateral asset on Liquid Network.</button>
        <button class="option" type="button">The lender may liquidate and claim the collateral asset.</button>
        <button class="option" type="button">The indexer returns the collateral asset off-chain only.</button>
      </div>
      <p class="feedback"></p>
    </div>

    <div class="question-block" data-answer="0">
      <p class="question">3. What is the indexer’s main job for lenders?</p>
      <div class="options">
        <button class="option" type="button">Discover and track offers so UI can list them.</button>
        <button class="option" type="button">Hold private keys for borrowers on the server side.</button>
        <button class="option" type="button">Mint new Liquid assets without a covenant spend.</button>
        <button class="option" type="button">Replace Simplicity contracts with simpler scripts.</button>
      </div>
      <p class="feedback"></p>
    </div>

    <p class="score"></p>
  </section>

  <div class="ask-teacher">
    <strong>Ask your teacher</strong><br>
    Anything unclear? Ask in chat — e.g. “what’s the difference between loan fee and origination fee?” or “walk me through the demo as a borrower.”
  </div>

  <nav class="lesson-nav">
    <strong>Next</strong>
    <ul>
      <li><a href="/learn/lending/asset-movements">Reference: what moves when</a></li>
      <li><a href="/learn/lending/0002-utility-tokens-and-factory">Lesson 2: Utility tokens &amp; IssuanceFactory</a> (when ready)</li>
      <li><a href="/learn/lending/offer-state-machine">Reference: state machine</a></li>
    </ul>
  </nav>
