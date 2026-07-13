---
layout: "../../../layouts/LendingLayout.astro"
title: "Lesson 5 — Simplicity Primitives"
header: "Lessons"
order: "5"
description: "Simplicity primitives for covenant review — Taproot trees, witness inputs, and UTXOs the wallet doesn't own."
duration: "~12 min"
---
<p class="meta">Lesson 5 · ~12 min · <a href="/learn/lending/0004-lwk-and-frb">Lesson 4</a></p>
  <h1>Inside the covenant: Simplicity primitives</h1>
  <p class="lead">Before reviewing PR #16, understand how lwk-dart builds Simplicity covenants internally — Taproot trees, witness inputs, and UTXOs the wallet doesn’t own.</p>

  <nav class="lesson-nav">
    <strong>In this lesson</strong>
    <ul>
      <li>SimplicityProgram &amp; CMR</li>
      <li>StateTaprootBuilder (program + data leaves)</li>
      <li>ExternalUtxo &amp; witness UTXO</li>
      <li>Signing: output key vs internal key</li>
    </ul>
    <strong>Read first</strong>: <a href="https://github.com/emjshrx/lwk-dart/blob/feat/simplicity-primitives/doc/simplicity.md">doc/simplicity.md</a> (PR #16)
  </nav>

  <h2>Why a primitives layer?</h2>
  <p>LWK handles <em>wallet</em> concerns (keys, sync, sign). Lending covenants need extra machinery: compile <code>.simf</code> sources, build Taproot addresses with on-chain state, construct PSETs that spend covenant outputs. PR #16 adds this as <strong>Rust-only</strong> code under <code>rust/src/contracts/</code> — not exported to Dart yet.</p>

  <h2>Core building blocks</h2>
  <table>
    <thead><tr><th>Primitive</th><th>Purpose</th></tr></thead>
    <tbody>
      <tr><td><code>SimplicityProgram</code></td><td>Compile/run <code>.simf</code>; produces <strong>CMR</strong> (commitment root)</td></tr>
      <tr><td><code>SimplicityArguments</code></td><td>Typed compile-time parameters (asset IDs, amounts, hashes)</td></tr>
      <tr><td><code>SimplicityWitnessValues</code></td><td>Runtime witness for a spend path (<code>Either</code> branches)</td></tr>
      <tr><td><code>StateTaprootBuilder</code></td><td>Taproot tree: program leaf + optional 32-byte data leaves</td></tr>
      <tr><td><code>ExternalUtxo</code></td><td>Covenant UTXO not in wallet DB — outpoint + txout + secrets</td></tr>
      <tr><td><code>Pset</code> / <code>PsetBuilder</code></td><td>Low-level Elements transaction construction</td></tr>
    </tbody>
  </table>

  <h2>Stateful Taproot: program + storage</h2>
  <p>Lending offers store mutable state on-chain in <strong>data leaves</strong> beside the Simplicity program leaf:</p>
  <pre style="font-family: var(--font-sans); font-size: 0.8rem; background: #fff; border: 1px solid var(--border); padding: 1rem;">
StateTaprootBuilder
  .addSimplicityLeaf(depth, program CMR)     ← covenant logic
  .addDataLeaf(depth, slot_0: 32 bytes)      ← e.g. is_active
  .addDataLeaf(depth, slot_1: 32 bytes)      ← e.g. current_debt
  .finalize(unspendable internal key)
  → scriptPubkey for the covenant output
  </pre>
  <p>Many protocols use the standard <strong>unspendable internal key</strong> (BIP-341 NUMS point) so only the script path can spend. The lending <code>CovenantProgram</code> wrapper (PR #13) builds this tree automatically.</p>

  <h2>ExternalUtxo: not your wallet’s money</h2>
  <p>When spending a <em>covenant</em> output, that UTXO often isn’t tracked as a normal wallet balance — it’s locked by Simplicity. <code>ExternalUtxo</code> describes it for tx building:</p>
  <ul style="font-size: 0.95rem;">
    <li>Outpoint (txid + vout)</li>
    <li>Full <code>TxOut</code> (script, asset, amount)</li>
    <li>Unblinded secrets (needed for confidential assets)</li>
  </ul>
  <p>The wallet still <em>signs</em> its own inputs; covenant inputs use Simplicity witness stacks instead of a simple ECDSA signature.</p>

  <h2>Witness UTXO: what the chain sees</h2>
  <p>Elements/Bitcoin PSET inputs often need a <strong>witness UTXO</strong> — the prevout’s explicit txout data attached to the input so validators know what is being spent. In FRB APIs you may see:</p>
  <ul style="font-size: 0.95rem;">
    <li><code>witnessUtxoScriptHex</code></li>
    <li><code>witnessUtxoAssetId</code></li>
    <li><code>witnessUtxoAmount</code></li>
  </ul>
  <p>This is <em>not</em> the Simplicity witness (branch values). It is standard tx metadata required when adding covenant or issuance inputs to a PSET. PR #15’s factory methods take these parameters for that reason.</p>

  <div class="callout">
    <strong>Two different “witness” words</strong>
    <strong>Witness UTXO</strong> = prevout data on a tx input (PSET field). <strong>Simplicity witness</strong> = <code>PATH</code> and branch values proving which covenant branch executes. Don’t confuse them in review.
  </div>

  <h2>Signing: use the output key</h2>
  <table>
    <thead><tr><th>Taproot style</th><th>Key for sighash / finalize</th></tr></thead>
    <tbody>
      <tr><td>Simple P2TR (no state)</td><td>Internal x-only key</td></tr>
      <tr><td>Stateful (<code>StateTaprootBuilder</code>)</td><td><strong>outputKey()</strong> from spend info — not internal key</td></tr>
    </tbody>
  </table>
  <p>Wrong key → invalid signature or node rejection. Finalized Simplicity inputs have a 4-element witness stack: <code>[witness_bytes, program_bytes, cmr_bytes, control_block]</code>.</p>

  <section class="quiz" data-quiz>
    <h2>Check your understanding</h2>

    <div class="question-block" data-answer="1">
      <p class="question">1. What does a StateTaproot data leaf store?</p>
      <div class="options">
        <button class="option" type="button">The borrower’s BIP39 mnemonic seed phrase bytes</button>
        <button class="option" type="button">Thirty-two bytes of on-chain covenant state data</button>
        <button class="option" type="button">The indexer REST API base URL string value</button>
        <button class="option" type="button">The Esplora block hash at creation height only</button>
      </div>
      <p class="feedback"></p>
    </div>

    <div class="question-block" data-answer="2">
      <p class="question">2. When is ExternalUtxo used in transaction building?</p>
      <div class="options">
        <button class="option" type="button">For every normal LBTC change output in wallet</button>
        <button class="option" type="button">Only when broadcasting via the indexer HTTP API</button>
        <button class="option" type="button">For covenant outputs not tracked as wallet balances</button>
        <button class="option" type="button">For OP_RETURN metadata outputs in factory creation</button>
      </div>
      <p class="feedback"></p>
    </div>

    <div class="question-block" data-answer="0">
      <p class="question">3. For stateful Taproot finalize, which key signs?</p>
      <div class="options">
        <button class="option" type="button">The output key from StateTaprootSpendInfo object</button>
        <button class="option" type="button">The unspendable internal NUMS point key always</button>
        <button class="option" type="button">The lender NFT asset id hex string value</button>
        <button class="option" type="button">The factory auth NFT script hash bytes value</button>
      </div>
      <p class="feedback"></p>
    </div>

    <p class="score"></p>
  </section>

  <nav class="lesson-nav">
    <strong>Next</strong>
    <ul>
      <li><a href="/learn/lending/0006-offer-state-and-tx-layout">Lesson 6: State &amp; tx layout</a></li>
      <li><a href="/learn/lending/lwk-frb-stack">LWK stack reference</a></li>
    </ul>
  </nav>
