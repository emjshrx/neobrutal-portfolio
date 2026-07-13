---
layout: "../../../layouts/LendingLayout.astro"
title: "Parameter Encoding"
header: "Reference"
order: "4"
description: "How offer terms travel across covenants via parameter tokens."
---
<p class="meta">Reference · <a href="/learn/lending/lending-glossary">Glossary</a></p>
  <h1>Parameter Encoding</h1>
  <p class="lead">How offer terms travel across covenants — from <a href="https://docs.simplicity-lang.org/use-cases/lending-protocol/#creation-of-utility-tokens">official docs</a>.</p>

  <div class="callout">
    <strong>Docs vs reference repo</strong>
    Official docs describe bit-packed <em>parameter tokens</em> and Pre-lock detection. The current <a href="https://github.com/BlockstreamResearch/simplicity-lending">simplicity-lending</a> main branch also uses OP_RETURN metadata and IssuanceFactory-minted utility NFTs. Both patterns solve the same problem: immutable offer terms across chained covenant spends.
  </div>

  <h2>Why encode parameters in assets?</h2>
  <p>A lending flow spans multiple covenant transactions. Parameters (amounts, rate, expiry) must survive each spend without trusting an off-chain server. Parameter tokens carry data in the <em>amount field</em> of a 1-unit UTXO (max 51 bits on Liquid).</p>

  <h2>FIRST_PARAMETERS_NFT (bits 0–50)</h2>
  <table>
    <thead><tr><th>Bits</th><th>Field</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>[0..15]</td><td>Interest rate</td><td>16-bit; scale 10,000 = 100%</td></tr>
      <tr><td>[16..42]</td><td>Loan expiration</td><td>27-bit block height</td></tr>
      <tr><td>[43..46]</td><td>Collateral decimals mantissa</td><td>4-bit exponent</td></tr>
      <tr><td>[47..50]</td><td>Principal decimals mantissa</td><td>4-bit exponent</td></tr>
    </tbody>
  </table>

  <h2>SECOND_PARAMETERS_NFT (bits 0–50)</h2>
  <table>
    <thead><tr><th>Bits</th><th>Field</th><th>Notes</th></tr></thead>
    <tbody>
      <tr><td>[0..24]</td><td>Base collateral amount</td><td>25-bit integer × mantissa</td></tr>
      <tr><td>[25..49]</td><td>Base principal amount</td><td>25-bit integer × mantissa</td></tr>
      <tr><td>[50]</td><td>Free</td><td>—</td></tr>
    </tbody>
  </table>

  <h2>Indexer verification (Pre-lock template)</h2>
  <p>From the docs, a valid offer-initialization tx must:</p>
  <ul style="font-family: var(--font-sans); font-size: 0.9rem;">
    <li>Have ≥ 5 inputs and ≥ 6 outputs</li>
    <li>Include an <code>OP_RETURN</code> with a BIP340 public key</li>
    <li>Use parameter UTXOs on inputs 0–1 with amounts matching the bit layout</li>
    <li>Recompile the Pre-lock covenant; CMR must match output 0’s script hash</li>
  </ul>

  <h2>Covenant chain (first implementation)</h2>
  <ol style="font-family: var(--font-sans); font-size: 0.9rem;">
    <li><strong>Create utility tokens</strong> — parameter + role NFTs</li>
    <li><strong>Lock collateral</strong> — borrower constructs lock covenant</li>
    <li><strong>Set up lending</strong> — lender funds principal</li>
    <li><strong>Settle lending</strong> — repay or liquidate</li>
  </ol>

  <nav class="lesson-nav">
    <strong>Related</strong>
    <ul>
      <li><a href="/learn/lending/offer-state-machine">Offer state machine</a></li>
      <li><a href="/learn/lending/0002-utility-tokens-and-factory">Lesson 2: Utility tokens &amp; factory</a></li>
    </ul>
  </nav>