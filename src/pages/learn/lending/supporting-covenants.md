---
layout: "../../../layouts/LendingLayout.astro"
title: "Supporting Covenants Reference"
header: "Reference"
order: "6"
description: "Small Simplicity programs the main LendingOffer covenant composes with."
---
<p class="meta">Reference · <a href="/learn/lending/lending-glossary">Glossary</a></p>
  <h1>Supporting covenants</h1>
  <p class="lead">Small Simplicity programs the main <code>LendingOffer</code> covenant composes with. Source: <a href="https://github.com/BlockstreamResearch/simplicity-lending/tree/main/crates/contracts/simf">simplicity-lending simf</a>.</p>

  <table>
    <thead><tr><th>Covenant</th><th>Role in lending</th></tr></thead>
    <tbody>
      <tr>
        <td><strong>ScriptAuth</strong></td>
        <td>Locks the <em>lender NFT</em> to the LendingOffer script hash. Unlocks when the parent covenant spends (e.g. accept). Prevents lender NFT moving independently before acceptance.</td>
      </tr>
      <tr>
        <td><strong>AssetAuth</strong></td>
        <td>Locks <em>principal</em> to the borrower NFT until conditions met. On accept, borrower’s principal output is wrapped in AssetAuth.</td>
      </tr>
      <tr>
        <td><strong>AssetAuthVault</strong></td>
        <td>Holds repaid principal. <strong>Keeper</strong> NFT (lender or protocol) authorizes withdrawal; <strong>supplier</strong> NFT (borrower) governs deposits during repayment. Active vs finalized variants.</td>
      </tr>
      <tr>
        <td><strong>IssuanceFactory</strong></td>
        <td>Mints per-offer utility NFTs (Lesson 2).</td>
      </tr>
      <tr>
        <td><strong>LendingOffer</strong></td>
        <td>Main lifecycle covenant: pending → active → repay / liquidate / cancel.</td>
      </tr>
    </tbody>
  </table>

  <h2>How they chain (accept example)</h2>
  <ol style="font-size: 0.95rem;">
    <li>Spend <code>pending_offer</code> with <code>OfferAcceptance</code> witness</li>
    <li>Co-spend lender NFT via <code>ScriptAuth</code> unlock</li>
    <li>Update storage: <code>is_active = true</code></li>
    <li>Create new <code>active_offer</code> output + <code>AssetAuth</code> principal for borrower</li>
  </ol>

  <p>PR #13 wires these for <strong>pending creation</strong> only (<code>ScriptAuth.attach_creation</code> for lender NFT). Accept/repay paths come in later PRs.</p>

  <nav class="lesson-nav">
    <strong>Related</strong>
    <ul>
      <li><a href="/learn/lending/0006-offer-state-and-tx-layout">Lesson 6</a></li>
      <li><a href="/learn/lending/offer-state-machine">State machine</a></li>
    </ul>
  </nav>