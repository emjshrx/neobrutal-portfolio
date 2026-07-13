---
layout: "../../../layouts/LendingLayout.astro"
title: "Asset Movements by Step"
header: "Reference"
order: "3"
description: "What moves on-chain at each step of the lending lifecycle."
---
<p class="meta">Reference · <a href="/learn/lending/offer-state-machine">State machine</a></p>
  <h1>What moves, and when?</h1>
  <p class="lead">Collateral and principal move at <em>different</em> steps. Acceptance never moves collateral.</p>

  <table>
    <thead>
      <tr><th>Step</th><th>Who acts</th><th>Asset A (collateral)</th><th>Asset B (principal)</th></tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Propose</strong></td>
        <td>Borrower</td>
        <td>Borrower → covenant (locked)</td>
        <td>—</td>
      </tr>
      <tr>
        <td><strong>Accept</strong></td>
        <td>Lender</td>
        <td><em>Stays locked</em></td>
        <td>Lender → borrower</td>
      </tr>
      <tr>
        <td><strong>Repay</strong></td>
        <td>Borrower</td>
        <td>Covenant → borrower</td>
        <td>Borrower → lender (+ protocol fee)</td>
      </tr>
      <tr>
        <td><strong>Cancel</strong> (pending only)</td>
        <td>Borrower</td>
        <td>Covenant → borrower</td>
        <td>—</td>
      </tr>
      <tr>
        <td><strong>Liquidate</strong></td>
        <td>Lender</td>
        <td>Covenant → lender</td>
        <td>Unrepaid portion stays with lender</td>
      </tr>
    </tbody>
  </table>

  <div class="callout">
    <strong>Memory hook</strong>
    Collateral is the borrower's <em>pledge</em> — it moves once at propose (into the covenant), then again only at the end (back to borrower or to lender). Principal is the lender's <em>funding</em> — it moves only at accept and repay.
  </div>

  <nav class="lesson-nav">
    <strong>Related</strong>
    <ul>
      <li><a href="/learn/lending/0001-lending-protocol-basics">Lesson 1</a></li>
      <li><a href="/learn/lending/lending-glossary">Glossary</a></li>
    </ul>
  </nav>