---
layout: "../../../layouts/LendingLayout.astro"
title: "Mission: Simplicity Lending Protocol"
header: "Overview"
order: "0"
description: "Learning goals for understanding the Simplicity Lending Protocol — protocol vocabulary, lifecycle semantics, and wallet integration."
---
# Mission: Simplicity Lending Protocol

## Why
You need to review four open pull requests on [emjshrx/lwk-dart](https://github.com/emjshrx/lwk-dart/pulls) with informed judgment — understanding what the lending protocol is supposed to do on-chain and off-chain, not just whether the code compiles. That requires protocol vocabulary, lifecycle semantics, and how wallet libraries fit around covenant transactions.

## Success looks like
- Trace a lending offer from creation through acceptance, repayment, or liquidation without consulting PR diffs
- Explain what utility NFTs, IssuanceFactory, and parameter encoding are for — and how they differ from ordinary wallet operations
- Describe what a lending indexer does, what it verifies, and what API consumers expect
- Read lwk-dart changes and ask: "does this match the protocol?" rather than "does this look like Rust?"

## Constraints
- Do **not** study the PR diffs as teaching material — concepts only, from primary protocol sources
- Ground teaching in [Simplicity lending docs](https://docs.simplicity-lang.org/use-cases/lending-protocol/), [simplicity-lending](https://github.com/BlockstreamResearch/simplicity-lending), and the [live demo](https://demolending.distributedlab.com/)
- Short lessons; retrieval practice over passive reading

## Out of scope
- Writing or reviewing SimplicityHL contract code line-by-line
- Liquid Network consensus rules beyond what the protocol needs
- Flutter/Dart UI patterns unrelated to wallet + protocol integration
