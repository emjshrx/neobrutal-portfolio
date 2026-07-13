---
layout: "../../../layouts/LendingLayout.astro"
title: "Lending Glossary"
header: "Reference"
order: "1"
description: "Compressed vocabulary for reviewing wallet and indexer code."
---
<p class="meta">Reference · <a href="/learn/lending/mission">Mission</a></p>
  <h1>Lending Protocol Glossary</h1>
  <p class="lead">Compressed vocabulary for reviewing wallet and indexer code. Citations: <a href="https://docs.simplicity-lang.org/use-cases/lending-protocol/">Simplicity docs</a>, <a href="https://github.com/BlockstreamResearch/simplicity-lending">simplicity-lending</a>.</p>

  <dl>
    <dt>Borrower <span class="tag">party</span></dt>
    <dd>Holds collateral asset A (e.g. LBTC). Posts an offer, may cancel before acceptance, repays principal + fee before expiry, or loses collateral on default.</dd>

    <dt>Lender <span class="tag">party</span></dt>
    <dd>Holds loan asset B (e.g. USDT). Accepts an offer by funding principal; receives repayment or liquidated collateral.</dd>

    <dt>Collateral <span class="tag">asset</span></dt>
    <dd>Asset A locked by the borrower to secure the loan. Returned on full repayment; transferred to lender on liquidation.</dd>

    <dt>Principal / Loan amount <span class="tag">asset</span></dt>
    <dd>Asset B the borrower receives from the lender when the offer is accepted.</dd>

    <dt>Lending term <span class="tag">time</span></dt>
    <dd>Deadline (block height or timestamp) by which the borrower must repay. After expiry, lender may liquidate.</dd>

    <dt>Loan fee <span class="tag">fee</span></dt>
    <dd>Fixed fee in asset B paid on repayment — interest for a fixed-term loan in the simplified contract.</dd>

    <dt>Origination fee <span class="tag">fee</span></dt>
    <dd>Fixed fee in asset A paid from borrower to lender at loan origination.</dd>

    <dt>Protocol fee <span class="tag">fee</span></dt>
    <dd>Share of the loan fee (reserve factor) paid to a protocol address on repayment.</dd>

    <dt>Covenant <span class="tag">on-chain</span></dt>
    <dd>A Simplicity smart contract attached to a UTXO. Spending requires a valid witness proving branch conditions.</dd>

    <dt>Lending offer <span class="tag">covenant</span></dt>
    <dd>The main protocol covenant governing pending → active → settled/liquidated transitions. Reference impl: single <code>LendingOffer</code> program with witness branches.</dd>

    <dt>Pre-lock <span class="tag">covenant</span></dt>
    <dd>Earlier design stage in official docs: initialization covenant detected by indexer via tx template (5+ inputs, 6+ outputs, OP_RETURN pubkey, parameter UTXOs).</dd>

    <dt>Utility NFT <span class="tag">token</span></dt>
    <dd>One-unit Liquid asset encoding a role (borrower, lender, protocol keeper). Glued to covenant logic; enables tracking and secondary transfer of positions.</dd>

    <dt>Parameter token <span class="tag">token</span></dt>
    <dd>NFT whose <em>amount field</em> bit-packs offer parameters (rate, expiry, base amounts). Docs: <code>FIRST_PARAMETERS_NFT</code>, <code>SECOND_PARAMETERS_NFT</code>.</dd>

    <dt>IssuanceFactory <span class="tag">covenant</span></dt>
    <dd>Per-borrower factory covenant that mints utility NFTs for new offers. Created once; <code>IssueAssets</code> path issues role tokens per offer.</dd>

    <dt>Indexer <span class="tag">off-chain</span></dt>
    <dd>Service scanning Liquid blocks, verifying offer txs, maintaining offer DB, exposing REST API for discovery and status updates.</dd>

    <dt>CMR <span class="tag">crypto</span></dt>
    <dd>Commitment Merkle root — script hash of a Simplicity program. Indexer recompiles covenant from extracted params and compares CMR to output script.</dd>

  </dl>

  <nav class="lesson-nav">
    <strong>Related</strong>
    <ul>
      <li><a href="/learn/lending/offer-state-machine">Offer state machine</a></li>
      <li><a href="/learn/lending/parameter-encoding">Parameter encoding</a></li>
      <li><a href="/learn/lending/indexer-api">Indexer API reference</a></li>
      <li><a href="/learn/lending/0004-simplicity-primitives">Lesson 4: Simplicity primitives</a></li>
      <li><a href="/learn/lending/0005-offer-state-and-tx-layout">Lesson 5: Tx layout</a></li>
    </ul>
  </nav>