---
layout: "../../../layouts/LendingLayout.astro"
title: "Lesson 2 — Utility Tokens & IssuanceFactory"
header: "Lessons"
order: "2"
description: "How offer terms survive on-chain via utility tokens, parameter encoding, and IssuanceFactory."
duration: "~12 min"
---
<p class="meta">Lesson 2 · ~12 min · <a href="/learn/lending/0001-lending-protocol-basics">Lesson 1</a></p>
  <h1>How offer terms survive on-chain</h1>
  <p class="lead">Lesson 1 was the economic story. This lesson is the machinery: tokens and factories that carry terms and roles across multiple covenant transactions.</p>

  <nav class="lesson-nav">
    <strong>In this lesson</strong>
    <ul>
      <li>Why utility tokens exist</li>
      <li>Parameter encoding (docs design)</li>
      <li>IssuanceFactory (reference implementation)</li>
      <li>Role NFTs and the covenant chain</li>
    </ul>
    <strong>Read first</strong>: <a href="https://docs.simplicity-lang.org/use-cases/lending-protocol/#creation-of-utility-tokens">Creation of Utility Tokens</a> (official docs)
  </nav>

  <h2>The problem</h2>
  <p>Creating a lending offer is not one transaction — it is a <em>chain</em> of covenant spends: mint tokens → lock collateral → accept → repay or liquidate. Each step must know the same terms (amounts, rate, expiry) and which party is acting.</p>
  <p>Off-chain servers can lie or go offline. So the protocol embeds data <em>in the chain itself</em> — inside assets and transaction metadata.</p>

  <h2>Two ways to carry terms</h2>
  <table>
    <thead><tr><th>Approach</th><th>Where terms live</th><th>Source</th></tr></thead>
    <tbody>
      <tr>
        <td><strong>Parameter tokens</strong></td>
        <td>Bit-packed into the <em>amount field</em> of 1-unit NFT UTXOs</td>
        <td><a href="https://docs.simplicity-lang.org/use-cases/lending-protocol/">Official docs</a></td>
      </tr>
      <tr>
        <td><strong>OP_RETURN metadata</strong></td>
        <td>Fixed-length blob in offer-creation tx (rate, expiry, principal asset, amounts)</td>
        <td><a href="https://github.com/BlockstreamResearch/simplicity-lending">simplicity-lending</a></td>
      </tr>
    </tbody>
  </table>
  <p>Both solve the same problem: <strong>immutable offer parameters across covenant spends</strong>. When reviewing code, check which pattern it implements — the indexer verification rules differ. Details: <a href="/learn/lending/parameter-encoding">Parameter encoding reference</a>.</p>

  <h2>Parameter tokens (official docs)</h2>
  <p>Liquid limits how much data fits in a UTXO amount (51 bits). The docs split parameters across two NFTs:</p>
  <ul style="font-size: 0.95rem;">
    <li><code>FIRST_PARAMETERS_NFT</code> — interest rate, loan expiration block, decimal exponents</li>
    <li><code>SECOND_PARAMETERS_NFT</code> — base collateral amount, base principal amount</li>
  </ul>
  <p>An indexer can extract these amounts, recompile the Pre-lock covenant, and compare its CMR (script hash) to output 0 — proving the tx is a genuine offer initialization.</p>

  <h2>Utility NFTs: terms + roles</h2>
  <p>Beyond parameters, the protocol mints <strong>role tokens</strong> — each a 1-unit Liquid asset glued to covenant logic:</p>
  <table>
    <thead><tr><th>NFT</th><th>Purpose</th></tr></thead>
    <tbody>
      <tr><td><strong>Borrower NFT</strong></td><td>Proves the borrower is spending; required to repay; burned on cancel/full repay</td></tr>
      <tr><td><strong>Lender NFT</strong></td><td>Identifies the lender; unlocked when accepting; burned on liquidation</td></tr>
      <tr><td><strong>Protocol fee keeper</strong></td><td>Authorizes withdrawals from the protocol-fee vault on repayment</td></tr>
    </tbody>
  </table>
  <p>These are not collectibles — they are <em>capabilities</em>. Holding a borrower NFT means you can act as borrower in covenant spends. The indexer tracks NFT UTXOs to know who participates in each offer.</p>

  <div class="callout">
    <strong>Secondary markets</strong>
    Docs note that one-time role assets enable selling or transferring loan positions. The covenant enforces <em>who</em> can act; the NFT UTXO shows <em>which address</em> currently holds that role.
  </div>

  <h2>IssuanceFactory</h2>
  <p>In the <a href="https://github.com/BlockstreamResearch/simplicity-lending">reference implementation</a>, each borrower sets up a personal <strong>IssuanceFactory</strong> covenant once. It mints the utility NFTs needed for each new offer.</p>

  <figure>
    <svg class="state-diagram" viewBox="0 0 480 200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <marker id="arr" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#5c5c5c"/>
        </marker>
      </defs>
      <rect x="10" y="70" width="100" height="44" rx="4" fill="#fff" stroke="#c45c26" stroke-width="1.5"/>
      <text x="60" y="97" text-anchor="middle" font-size="10" font-family="system-ui">Borrower wallet</text>
      <rect x="140" y="50" width="110" height="84" rx="4" fill="#f5ebe3" stroke="#c45c26" stroke-width="1.5"/>
      <text x="195" y="78" text-anchor="middle" font-size="10" font-family="system-ui" font-weight="600">IssuanceFactory</text>
      <text x="195" y="94" text-anchor="middle" font-size="8" fill="#5c5c5c" font-family="system-ui">+ auth NFT (1 unit)</text>
      <text x="195" y="118" text-anchor="middle" font-size="8" fill="#5c5c5c" font-family="system-ui">IssueAssets | RemoveFactory</text>
      <rect x="290" y="30" width="90" height="36" rx="4" fill="#fff4dd" stroke="#d4a017"/>
      <text x="335" y="52" text-anchor="middle" font-size="9" font-family="system-ui">Borrower NFT</text>
      <rect x="290" y="82" width="90" height="36" rx="4" fill="#fff4dd" stroke="#d4a017"/>
      <text x="335" y="104" text-anchor="middle" font-size="9" font-family="system-ui">Lender NFT</text>
      <rect x="290" y="134" width="90" height="36" rx="4" fill="#fff4dd" stroke="#d4a017"/>
      <text x="335" y="156" text-anchor="middle" font-size="9" font-family="system-ui">Protocol NFT</text>
      <rect x="410" y="70" width="60" height="44" rx="4" fill="#d1fae5" stroke="#10b981"/>
      <text x="440" y="92" text-anchor="middle" font-size="9" font-family="system-ui">Lending</text>
      <text x="440" y="104" text-anchor="middle" font-size="9" font-family="system-ui">offer</text>
      <line x1="110" y1="92" x2="138" y2="92" stroke="#5c5c5c" marker-end="url(#arr)"/>
      <text x="120" y="84" font-size="7" fill="#5c5c5c" font-family="system-ui">create once</text>
      <line x1="250" y1="78" x2="288" y2="48" stroke="#5c5c5c" marker-end="url(#arr)"/>
      <line x1="250" y1="92" x2="288" y2="100" stroke="#5c5c5c" marker-end="url(#arr)"/>
      <line x1="250" y1="106" x2="288" y2="152" stroke="#5c5c5c" marker-end="url(#arr)"/>
      <text x="258" y="62" font-size="7" fill="#5c5c5c" font-family="system-ui">IssueAssets</text>
      <line x1="380" y1="100" x2="408" y2="92" stroke="#5c5c5c" marker-end="url(#arr)"/>
      <text x="386" y="92" font-size="7" fill="#5c5c5c" font-family="system-ui">create offer</text>
    </svg>
    <figcaption>Reference-impl flow: factory mints role NFTs per offer; those feed into the LendingOffer covenant.</figcaption>
  </figure>

  <p>The factory covenant has two witness paths (from <code>issuance_factory.simf</code>):</p>
  <ul style="font-size: 0.95rem;">
    <li><strong>IssueAssets</strong> — spends auth NFT + factory UTXO; issues new assets via Liquid issuance inputs; outputs role NFTs for one offer</li>
    <li><strong>RemoveFactory</strong> — burns factory and auth NFTs when the borrower is done</li>
  </ul>
  <p>Factory creation also writes <code>OP_RETURN</code> metadata: program id, issuing UTXO count, reissuance flags bitmask.</p>

  <h2>Covenant chain (tying it together)</h2>
  <p>Official docs order the first implementation as:</p>
  <ol>
    <li><strong>Create utility tokens</strong> — parameter data + role NFTs (via factory in reference impl)</li>
    <li><strong>Lock collateral</strong> — borrower builds lock / pending-offer covenant</li>
    <li><strong>Set up lending</strong> — lender accepts, funds principal</li>
    <li><strong>Settle lending</strong> — repay or liquidate</li>
  </ol>
  <p>Lesson 1 reminder: collateral locks at step 2 (propose). Role NFTs are already minted at step 1 so the covenant knows who may spend which branch later.</p>

  <section class="quiz" data-quiz>
    <h2>Check your understanding</h2>
    <div class="question-block" data-answer="0">
      <p class="question">1. What do parameter tokens carry across covenant spends?</p>
      <div class="options">
        <button class="option" type="button">Loan terms encoded inside the token amount field</button>
        <button class="option" type="button">Private signing keys for borrower wallet recovery only</button>
        <button class="option" type="button">Esplora API credentials for indexer authentication use</button>
        <button class="option" type="button">Liquid block headers used for timelock verification only</button>
      </div>
      <p class="feedback"></p>
    </div>
    <div class="question-block" data-answer="1">
      <p class="question">2. Who typically creates an IssuanceFactory covenant first?</p>
      <div class="options">
        <button class="option" type="button">Each lender once before accepting any loan offers</button>
        <button class="option" type="button">Each borrower once before posting their first offer</button>
        <button class="option" type="button">The protocol indexer at every new indexed block height</button>
        <button class="option" type="button">Any third party liquidator after the lending term expires</button>
      </div>
      <p class="feedback"></p>
    </div>
    <div class="question-block" data-answer="0">
      <p class="question">3. What must a borrower NFT prove during repayment?</p>
      <div class="options">
        <button class="option" type="button">The spending party is the loan's designated borrower role</button>
        <button class="option" type="button">The collateral asset uses exactly zero decimal precision</button>
        <button class="option" type="button">The lender has already claimed all protocol fee shares</button>
        <button class="option" type="button">The factory covenant was fully removed from the chain</button>
      </div>
      <p class="feedback"></p>
    </div>
    <p class="score"></p>
  </section>

  <div class="ask-teacher">
    <strong>Ask your teacher</strong><br>
    Try: “how does IssueAssets relate to create offer?” or “what’s the difference between parameter tokens and OP_RETURN metadata?”
  </div>

  <nav class="lesson-nav">
    <strong>Next</strong>
    <ul>
      <li><a href="/learn/lending/0005-offer-state-and-tx-layout">Lesson 5: State &amp; tx layout</a></li>
      <li><a href="/learn/lending/0003-indexer-and-discovery">Lesson 3: Indexer &amp; discovery</a></li>
      <li><a href="/learn/lending/parameter-encoding">Reference: parameter encoding</a></li>
      <li><a href="/learn/lending/lending-glossary">Glossary</a></li>
    </ul>
  </nav>
