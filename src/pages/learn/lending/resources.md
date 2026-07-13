---
layout: "../../../layouts/LendingLayout.astro"
title: "Simplicity Lending Resources"
header: "Overview"
order: "1"
description: "Primary protocol sources, reference repos, and communities for lending review prep."
---
# Simplicity Lending Resources

## Knowledge

- [Simplicity Lending Protocol (official docs)](https://docs.simplicity-lang.org/use-cases/lending-protocol/)
  Canonical protocol design: P2P lending variants, utility/parameter tokens, covenant decomposition, indexer discovery rules. Use for: financial terms, state machine, bit-packed parameters, Pre-lock verification template.
- [BlockstreamResearch/simplicity-lending](https://github.com/BlockstreamResearch/simplicity-lending)
  Reference implementation: Rust contracts crate, indexer API, CLI, React demo. Use for: how offers are created/indexed in practice (may differ from older doc sections).
- [Simplicity Lending demo](https://demolending.distributedlab.com/)
  Live borrower/lender UX on testnet. Use for: seeing the offer lifecycle end-to-end before reading code.
- [Blockstream/lwk](https://github.com/Blockstream/lwk)
  Liquid Wallet Kit (Rust). Use for: what wallet primitives exist underneath Dart bindings.
- [SatoshiPortal/lwk-dart](https://github.com/SatoshiPortal/lwk-dart)
  Dart/Flutter bindings for LWK via Flutter Rust Bridge. Use for: how mobile apps call Rust wallet logic — not for PR-specific lending code.

## Wisdom (Communities)

- [Simplicity Telegram group](https://t.me/simplicity_lang) (linked from Simplicity docs)
  Use for: protocol design questions, covenant semantics.
- [BlockstreamResearch/simplicity-lending Issues](https://github.com/BlockstreamResearch/simplicity-lending/issues)
  Use for: implementation intent, known gaps (e.g. partial repayment indexing).

## Gaps

- No single doc reconciles **official parameter-token / Pre-lock design** with the **current IssuanceFactory + LendingOffer** model in `simplicity-lending` main. Lessons flag this; verify against the reference repo when reviewing.
