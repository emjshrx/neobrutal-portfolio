---
layout: "../../../layouts/LendingLayout.astro"
title: "Offer State Machine"
header: "Reference"
order: "2"
description: "Simplified P2P lending lifecycle — states and transitions."
---
<p class="meta">Reference · <a href="/learn/lending/lending-glossary">Glossary</a></p>
  <h1>Offer State Machine</h1>
  <p class="lead">Simplified P2P lending lifecycle from <a href="https://docs.simplicity-lang.org/use-cases/lending-protocol/">Simplicity lending docs</a> and <a href="https://github.com/BlockstreamResearch/simplicity-lending">simplicity-lending</a>.</p>

  <figure>
    <svg class="state-diagram" viewBox="0 0 520 320" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#5c5c5c"/>
        </marker>
      </defs>
      <!-- Start -->
      <circle cx="60" cy="40" r="18" fill="none" stroke="#5c5c5c" stroke-width="1.5"/>
      <text x="60" y="44" text-anchor="middle" font-size="11" font-family="system-ui">Start</text>
      <!-- Pending -->
      <rect x="130" y="20" width="120" height="44" rx="4" fill="#fff4dd" stroke="#d4a017" stroke-width="1.5"/>
      <text x="190" y="47" text-anchor="middle" font-size="11" font-family="system-ui">Collateral locked</text>
      <text x="190" y="58" text-anchor="middle" font-size="9" fill="#5c5c5c" font-family="system-ui">(pending offer)</text>
      <!-- Active -->
      <rect x="300" y="20" width="120" height="44" rx="4" fill="#fff4dd" stroke="#d4a017" stroke-width="1.5"/>
      <text x="360" y="47" text-anchor="middle" font-size="11" font-family="system-ui">Loan active</text>
      <!-- Terminal: cancelled -->
      <rect x="80" y="140" width="100" height="40" rx="4" fill="#eee" stroke="#999"/>
      <text x="130" y="165" text-anchor="middle" font-size="10" font-family="system-ui">Cancelled</text>
      <!-- Terminal: repaid -->
      <rect x="210" y="140" width="100" height="40" rx="4" fill="#d1fae5" stroke="#10b981"/>
      <text x="260" y="165" text-anchor="middle" font-size="10" font-family="system-ui">Repaid</text>
      <!-- Terminal: liquidated -->
      <rect x="340" y="140" width="100" height="40" rx="4" fill="#fee2e2" stroke="#ef4444"/>
      <text x="390" y="165" text-anchor="middle" font-size="10" font-family="system-ui">Liquidated</text>
      <!-- Arrows -->
      <line x1="78" y1="40" x2="128" y2="40" stroke="#5c5c5c" marker-end="url(#arrow)"/>
      <text x="100" y="32" font-size="8" fill="#5c5c5c" font-family="system-ui">propose</text>
      <line x1="190" y1="64" x2="150" y2="138" stroke="#5c5c5c" marker-end="url(#arrow)"/>
      <text x="155" y="100" font-size="8" fill="#5c5c5c" font-family="system-ui">borrower cancels</text>
      <line x1="250" y1="42" x2="298" y2="42" stroke="#5c5c5c" marker-end="url(#arrow)"/>
      <text x="268" y="34" font-size="8" fill="#5c5c5c" font-family="system-ui">lender accepts</text>
      <line x1="360" y1="64" x2="280" y2="138" stroke="#5c5c5c" marker-end="url(#arrow)"/>
      <text x="310" y="100" font-size="8" fill="#5c5c5c" font-family="system-ui">full repay</text>
      <line x1="400" y1="64" x2="400" y2="138" stroke="#5c5c5c" marker-end="url(#arrow)"/>
      <text x="410" y="100" font-size="8" fill="#5c5c5c" font-family="system-ui">term expires</text>
    </svg>
    <figcaption>Core states for the first (simplified) lending contract. Reference impl adds substates (e.g. repaid → claimed).</figcaption>
  </figure>

  <h2>Transitions at a glance</h2>
  <table>
    <thead>
      <tr><th>From</th><th>Actor</th><th>Action</th><th>To</th></tr>
    </thead>
    <tbody>
      <tr><td>—</td><td>Borrower</td><td>Lock collateral + publish terms</td><td>Pending</td></tr>
      <tr><td>Pending</td><td>Borrower</td><td>Cancel offer</td><td>Cancelled (collateral returned)</td></tr>
      <tr><td>Pending</td><td>Lender</td><td>Send principal, accept terms</td><td>Active</td></tr>
      <tr><td>Active</td><td>Borrower</td><td>Repay principal + loan fee</td><td>Repaid (collateral released)</td></tr>
      <tr><td>Active</td><td>Lender</td><td>After lending term, claim collateral</td><td>Liquidated</td></tr>
    </tbody>
  </table>

  <div class="callout">
    <strong>Reference implementation nuance</strong>
  <code>simplicity-lending</code> tracks <code>pending → active → repaid → claimed</code> (lender withdraws from repayment vault) or <code>liquidated</code> or <code>cancelled</code>. When reviewing code, map names to these transitions — not every label appears in the official docs diagram.
  </div>

  <h2>What moves on-chain at each step</h2>
  <table>
    <thead>
      <tr><th>Step</th><th>Asset B (principal)</th><th>Asset A (collateral)</th></tr>
    </thead>
    <tbody>
      <tr><td>Create offer</td><td>—</td><td>Locked in covenant</td></tr>
      <tr><td>Accept</td><td>Lender → borrower</td><td>Stays locked</td></tr>
      <tr><td>Repay</td><td>Borrower → lender (+ protocol fee)</td><td>Returned to borrower</td></tr>
      <tr><td>Liquidate</td><td>Lender keeps unfunded portion</td><td>Lender receives collateral</td></tr>
    </tbody>
  </table>

  <nav class="lesson-nav">
    <strong>Related</strong>
    <ul>
      <li><a href="/learn/lending/0001-lending-protocol-basics">Lesson 1</a></li>
      <li><a href="/learn/lending/parameter-encoding">Parameter encoding</a></li>
      <li><a href="https://demolending.distributedlab.com/">Live demo</a></li>
    </ul>
  </nav>