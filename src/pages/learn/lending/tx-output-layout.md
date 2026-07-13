---
layout: "../../../layouts/LendingLayout.astro"
title: "Tx Output Layout Reference"
header: "Reference"
order: "7"
description: "Fixed output indices and OP_RETURN layout for offer creation transactions."
---
<p class="meta">Reference · <a href="/learn/lending/factory-offer-detection">Factory detection</a></p>
  <h1>Transaction output layout</h1>
  <p class="lead">Fixed output indices used by <a href="https://github.com/BlockstreamResearch/simplicity-lending">simplicity-lending</a> and mirrored in lwk-dart PRs #13/#15. Indices are <strong>0-based</strong>.</p>

  <h2>IssuanceFactory creation</h2>
  <table>
    <thead><tr><th>Output</th><th>Content</th></tr></thead>
    <tbody>
      <tr><td>0</td><td>Auth NFT (1 unit, wallet address)</td></tr>
      <tr><td>1</td><td>Factory program UTXO (1 unit, covenant)</td></tr>
      <tr><td><strong>2</strong></td><td><strong>OP_RETURN</strong> — 13-byte creation metadata (program id, issuing_utxos_count, reissuance_flags)</td></tr>
    </tbody>
  </table>

  <h2>Lending offer creation (full tx)</h2>
  <p>Factory issuance outputs come first (auth NFT, factory, borrower NFT, lender NFT, protocol NFT…). Then <code>attach_creation</code> appends:</p>
  <table>
    <thead><tr><th>Output</th><th>Content</th></tr></thead>
    <tbody>
      <tr><td>0–1</td><td>Factory + auth (from issuance step)</td></tr>
      <tr><td><strong>2</strong></td><td><strong>Borrower NFT</strong> (1 unit)</td></tr>
      <tr><td><strong>3</strong></td><td><strong>Lender NFT</strong> (locked via ScriptAuth)</td></tr>
      <tr><td>4</td><td>Protocol fee keeper NFT (when present)</td></tr>
      <tr><td><strong>4 or 5</strong></td><td><strong>OP_RETURN</strong> — 50-byte offer metadata (upstream: index <strong>4</strong>)</td></tr>
      <tr><td><strong>5</strong></td><td><strong>Pending offer</strong> — collateral locked in LendingOffer covenant (upstream: index <strong>5</strong>)</td></tr>
    </tbody>
  </table>

  <h2>50-byte offer metadata (OP_RETURN)</h2>
  <table>
    <thead><tr><th>Bytes</th><th>Field</th></tr></thead>
    <tbody>
      <tr><td>0–3</td><td>Program id (first 4 bytes of SHA256 of source)</td></tr>
      <tr><td>4–35</td><td>Principal asset id (32 bytes)</td></tr>
      <tr><td>36–43</td><td>Principal amount (u64 LE)</td></tr>
      <tr><td>44–47</td><td>Loan expiration block height (u32 LE)</td></tr>
      <tr><td>48–49</td><td>Interest rate basis points (u16 LE)</td></tr>
    </tbody>
  </table>
  <p>Collateral amount comes from the <strong>pending offer output value</strong>, not the metadata blob.</p>

  <h2>Indexer parsing</h2>
  <p><code>LendingOffer::try_from_tx</code> reads outputs 2, 3, 5 and metadata at 4. Wrong indices → offers invisible to indexer even if tx confirms on-chain.</p>

  <nav class="lesson-nav">
    <strong>Related</strong>
    <ul>
      <li><a href="/learn/lending/0005-offer-state-and-tx-layout">Lesson 5</a></li>
      <li><a href="/learn/lending/parameter-encoding">Parameter encoding (docs design)</a></li>
    </ul>
  </nav>