---
layout: "../../../layouts/LendingLayout.astro"
title: "Lesson 6 — Offer State & Tx Layout"
header: "Lessons"
order: "6"
description: "On-chain state and transaction layout — output indices, storage slots, and supporting covenants."
duration: "~12 min"
---
<p class="meta">Lesson 6 · ~12 min · <a href="/learn/lending/0005-simplicity-primitives">Lesson 5</a></p>
  <h1>On-chain state &amp; transaction layout</h1>
  <p class="lead">PR #13 and #15 hinge on <em>where</em> outputs sit and <em>what</em> the covenant stores. This lesson fills that gap.</p>

  <nav class="lesson-nav">
    <strong>In this lesson</strong>
    <ul>
      <li>LendingOfferStorage slots</li>
      <li>Supporting covenants (high level)</li>
      <li>Fixed output indices</li>
    </ul>
    <strong>Read first</strong>: <a href="/learn/lending/tx-output-layout">Tx output layout reference</a>
  </nav>

  <h2>Mutable state on-chain</h2>
  <p>Offer <em>parameters</em> (rate, amounts, expiry) are fixed at creation. Two fields <em>change</em> during the loan — stored in Taproot data leaves via <code>LendingOfferStorage</code>:</p>
  <table>
    <thead><tr><th>Slot</th><th>Field</th><th>Pending offer</th><th>After accept</th></tr></thead>
    <tbody>
      <tr><td>0</td><td><code>is_active</code></td><td><code>false</code></td><td><code>true</code></td></tr>
      <tr><td>1</td><td><code>current_debt</code></td><td>principal + total fee</td><td>decreases on partial repay</td></tr>
    </tbody>
  </table>
  <p><code>new_pending</code> sets both slots before the collateral output is created. Acceptance flips <code>is_active</code>; repayment reduces <code>current_debt</code>. The indexer infers status from spends, but the covenant enforces debt math on-chain.</p>

  <h2>Supporting covenants</h2>
  <p><code>LendingOffer</code> is not alone — it delegates to smaller programs. See <a href="/learn/lending/supporting-covenants">supporting covenants reference</a> for detail. Summary:</p>
  <ul style="font-size: 0.95rem;">
    <li><strong>ScriptAuth</strong> — glues lender NFT to offer covenant until accept</li>
    <li><strong>AssetAuth</strong> — holds principal for borrower after accept</li>
    <li><strong>AssetAuthVault</strong> — holds repaid funds for lender/protocol claim</li>
  </ul>
  <p>PR #13’s spike implements <code>attach_creation</code> for pending offers: lender NFT gets a <code>ScriptAuth</code> output, then metadata, then collateral locked in the main covenant.</p>

  <h2>Output index map (offer creation)</h2>
  <p>The indexer’s <code>try_from_tx</code> assumes a <strong>fixed layout</strong>. From <a href="https://github.com/BlockstreamResearch/simplicity-lending">simplicity-lending</a>:</p>
  <table>
    <thead><tr><th>Index</th><th>Output</th></tr></thead>
    <tbody>
      <tr><td>2</td><td>Borrower NFT</td></tr>
      <tr><td>3</td><td>Lender NFT (ScriptAuth-locked)</td></tr>
      <tr><td>4</td><td>OP_RETURN — 50-byte creation metadata</td></tr>
      <tr><td>5</td><td>Pending offer (collateral in covenant)</td></tr>
    </tbody>
  </table>
  <p>Earlier outputs (0–1) come from factory issuance in the same transaction. If your code places metadata or collateral at the wrong index, the tx may confirm but the <strong>indexer will ignore it</strong>.</p>

  <div class="callout">
    <strong>Review checklist (PR #13)</strong>
    Does <code>attach_creation</code> produce 6+ outputs with metadata at index 4 and collateral covenant last? Does metadata encode 50 bytes (program id, principal asset, amount, expiry, rate)? Does <code>new_pending</code> set <code>is_active=false</code> and <code>current_debt=total repayable</code>?
  </div>

  <h2>Factory creation layout (PR #15)</h2>
  <table>
    <thead><tr><th>Index</th><th>Output</th></tr></thead>
    <tbody>
      <tr><td>0</td><td>Auth NFT</td></tr>
      <tr><td>1</td><td>Factory program UTXO</td></tr>
      <tr><td>2</td><td>OP_RETURN — 13-byte factory metadata</td></tr>
    </tbody>
  </table>
  <p>Full diagram: <a href="/learn/lending/tx-output-layout">tx-output-layout.html</a>.</p>

  <section class="quiz" data-quiz>
    <h2>Check your understanding</h2>

    <div class="question-block" data-answer="1">
      <p class="question">1. What does is_active=false mean for an offer?</p>
      <div class="options">
        <button class="option" type="button">The loan has been fully repaid by the borrower</button>
        <button class="option" type="button">The offer is pending awaiting lender acceptance</button>
        <button class="option" type="button">The factory covenant has been removed from chain</button>
        <button class="option" type="button">The indexer has marked the offer as cancelled</button>
      </div>
      <p class="feedback"></p>
    </div>

    <div class="question-block" data-answer="2">
      <p class="question">2. Where does the indexer read offer metadata?</p>
      <div class="options">
        <button class="option" type="button">From the borrower NFT amount field bit packing</button>
        <button class="option" type="button">From the factory auth NFT script hash bytes</button>
        <button class="option" type="button">From the OP_RETURN output at index four</button>
        <button class="option" type="button">From the pending offer collateral asset id only</button>
      </div>
      <p class="feedback"></p>
    </div>

    <div class="question-block" data-answer="0">
      <p class="question">3. What is ScriptAuth used for in offer creation?</p>
      <div class="options">
        <button class="option" type="button">Locking the lender NFT to the offer covenant</button>
        <button class="option" type="button">Indexing pending offers via the REST API</button>
        <button class="option" type="button">Minting factory auth NFTs during issuance flow</button>
        <button class="option" type="button">Storing current_debt in the Taproot data leaf</button>
      </div>
      <p class="feedback"></p>
    </div>

    <p class="score"></p>
  </section>

  <nav class="lesson-nav">
    <strong>Related</strong>
    <ul>
      <li><a href="/learn/lending/supporting-covenants">Supporting covenants</a></li>
      <li><a href="/learn/lending/indexer-api">Indexer API reference</a></li>
      <li><a href="/learn/lending/0003-indexer-and-discovery">Lesson 3: Indexer &amp; discovery</a></li>
    </ul>
  </nav>
