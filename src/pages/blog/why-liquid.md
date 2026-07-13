---
layout: "../../layouts/BlogLayout.astro"
title: "Why Liquid?"
header: "Bitcoin"
description: "Bitcoin is digital gold. Liquid gives you supercharged rails to build on it."
image: "/blog/why-liquid/liquid.png"
---

# Why Build on Liquid?

> Bitcoin is digital gold. Liquid gives you supercharged rails to build on it.

## What is Liquid?

![Liquid Network](../../../blog/why-liquid/liquid.png)

Liquid is an open-source settlement network for Bitcoin capital markets. Conceived in 2014 by Adam Back, Andrew Poelstra, and other cypherpunks, it was Bitcoin's first sidechain, and it remains the leading one. Today the network holds roughly $5 billion in total value locked, with average fee rates around 0.1 sat/vB.

At its core, Liquid offers a few things Bitcoin mainchain cannot easily provide on its own:

- **LBTC**: a 1:1 pegged representation of Bitcoin on the sidechain
- **Confidential Transactions**: amounts and asset types are hidden by default
- **Multi-asset capability**: stablecoins, tokenized securities, and other issued assets on the same rails
- **Fast settlement**: one-minute block times with predictable, low fees
- **Next-gen smart contracting**: Simplicity, PSET, and AMP for financial products

Lightning and Liquid are not rivals. They solve different problems and interoperate through trustless atomic swaps. The [Liquid merchants page](https://liquid.net/merchants) lays out the comparison.

## 1. No Inbound Liquidity

One of Lightning's most persistent headaches is inbound liquidity. To receive a payment, you need someone to have opened a channel toward you with sufficient capacity. Services sell inbound liquidity. Node operators rebalance constantly. For a merchant who just wants to get paid, this is friction that should not exist.

On Liquid, there is no channel graph and no inbound capacity problem. You generate a receive address, share it, and funds arrive. When Lightning interoperability is needed, atomic swaps through services like [Boltz](https://boltz.exchange) handle the conversion. The receiver does not need to manage channel liquidity at all.

## 2. No Routing

Lightning payments route through multiple hops. Each hop introduces failure modes: insufficient channel capacity, routing failures, fee uncertainty. Multi-hop circular rebalancing, the most common approach to channel management, is unreliable and often parasitic on other nodes' liquidity.

Liquid transactions do not route. They settle directly on the sidechain. When two Liquid wallet users on the same platform pay each other, the payment can settle as L-BTC directly on the sidechain: no Lightning hops, no double swaps, no routing failures.

## 3. Offline Receive

Lightning requires your node or wallet to be online to receive payments. If you are offline when someone tries to pay you, the payment fails. This is a fundamental constraint of HTLC-based channels.

Liquid sidechain transactions do not have this requirement. You can receive L-BTC while your wallet is offline. The transaction is confirmed on-chain (well, on-sidechain) and waiting for you when you come back.

## 4. Hardware Wallet Custody

Lightning channels require hot wallets. Your channel state lives in memory on an online device. While multisig and watchtowers improve security, the model is inherently "online-first."

Liquid uses Bitcoin's UTXO model. You can hold L-BTC in cold storage on hardware wallets like [Blockstream Jade](https://blockstream.com/jade/)

## 5. Better Developer Experience

Building on Lightning means managing channels, liquidity, routing, and uptime. 

Liquid is built on the Elements codebase, which extends Bitcoin Core. If you have worked with `bitcoind`, `bitcoin-cli`, or Bitcoin's JSON-RPC interface, you already understand most of Liquid. You run `elementsd` and `elements-cli` instead, call familiar methods like `getnewaddress`, `sendtoaddress`, and `listunspent`, and configure nodes through the same style of config files. Wallet and backend code written for Bitcoin often ports to Liquid with minimal changes. That similarity is a major reason the developer experience feels approachable: you are not learning a new paradigm, you are extending one you likely already know.

The [Liquid developer hub](https://docs.liquid.net/docs/building-on-liquid) documents the deltas (confidential transactions, asset issuance, PSET), but the foundation is Bitcoin's UTXO model, RPC patterns, and transaction structure. For teams already running Bitcoin infrastructure, adding Liquid support is closer to deploying another node than adopting an entirely different stack.

## 6. Pay with Stablecoins

Bitcoin is volatile. Merchants want to accept bitcoin without experiencing that volatility. Customers in developing economies want to save and transact in dollar-denominated assets. Liquid's multi-asset capability solves both.

The network hosts a global portfolio of stablecoins (USDt, EURx, MEX, DePix, and others) alongside LBTC. A merchant can accept bitcoin payments and auto-convert to USDt on Liquid. 

## 7. Simplicity Smart Contracts and Opcodes

Bitcoin mainchain script is deliberately limited. That conservatism keeps the base layer secure, but it also means advanced financial contracts (vaults, options, covenants, multisig with complex spending conditions) are hard or impossible to express safely in Script alone.

Liquid extends Bitcoin's scripting model through the Elements codebase and ships opcodes that mainchain does not yet have. Features like SegWit, Schnorr signatures, and `OP_CSV` were activated on Liquid before they arrived on Bitcoin, making the sidechain a practical proving ground for new script capabilities.

Liquid also supports covenant-style opcodes such as `OP_CSFS` (CheckSigFromStack) and `OP_CAT` (concatenation), which enable more expressive spending conditions than standard Bitcoin Script. Together with PSET (Partially Signed Elements Transactions), developers can build and sign complex multi-party transactions involving confidential assets.

On top of these opcodes sits **Simplicity**, a formal smart contract language designed for Bitcoin-style systems. Unlike general-purpose contract platforms, Simplicity is built for analyzability: contracts can be reasoned about, their resource usage bounded, and their behavior verified before deployment. This matters for financial applications where a scripting bug can mean lost funds. Simplicity contracts on Liquid can power vaults, decentralized exchanges, pooled wallets, and other trust-minimized financial tools that would be impractical to implement on Bitcoin mainchain today.

## 8. Low Fees

Bitcoin mainchain fees spike during congestion. Lightning avoids on-chain fees for individual payments but still requires on-chain transactions to open and close channels, and those operations become expensive when fees are high.

Liquid offers consistently low fees with one-minute block times. The network's average fee rate sits around 0.1 sat/vB. For consolidating UTXOs, batching payments, or moving larger amounts, Liquid is often the cheapest path. When two Liquid wallet users settle directly on the sidechain instead of through a Lightning swap, fees drop further: no double swap, no routing fees.

## 9. Issuance and Trading Venues

Bitcoin was designed as money, not as a platform for securities. Liquid was designed for both. Through Blockstream's Asset Management Platform (AMP), issuers can create, distribute, and manage tokenized financial products: securities, bonds, stocks, promissory notes, debt instruments, and stablecoins.

Liquid has no separate governance token. It uses bitcoin as its native token, avoiding the misaligned incentives that plague token-sale platforms. Issuance is confidential by default but selectively auditable for regulatory compliance.

## 10. Large Transactions

Lightning channels have capacity limits. A channel opened with 1 BTC can never route more than 1 BTC. For large settlements (inter-exchange transfers, B2B payments, treasury movements), this is a hard constraint.

Liquid has no channel capacity. A single transaction can move any amount the sender holds. Exchanges and trading desks use LBTC and USDt on Liquid for faster, more confidential inter-platform settlement, reducing times and seizing arbitrage opportunities that would be impossible on mainchain during high-fee periods.

## The Federation

![Liquid Federation](../../../blog/why-liquid/federation.png)

Liquid's security model is a federated sidechain. Geographically and geopolitically dispersed functionaries around the world maintain the peg between BTC and LBTC. A threshold of 11 out of 15 functionaries must agree and sign each block.

Governance is maintained by three boards:

- **Membership Board**: reviews and votes on new federation member applications
- **Oversight Board**: provides external accountability
- **Technology Board**: guides technical development and upgrades

There is no altcoin or governance token. Any company may apply to become a federation member. The federation includes exchanges, trading desks, infrastructure providers, and wallet companies: a cross-section of the Bitcoin ecosystem with aligned incentives.

The trust assumption is straightforward: the LBTC peg requires that at least 2/3 of federation functionaries remain honest. This is a different tradeoff than Lightning's P2P model, but it is an honest one, and for settlement, issuance, and capital markets, it has proven reliable since 2018.

## Lightning, Ark, and Liquid


> "Bitcoin Core won't kill Bitcoin, but Arkade will change the Lightning Network." - Giacomo Zucco

Ark is an ambitious proposal to solve Lightning's liquidity problem through Ark Service Providers (ASPs) and Virtual Transaction Outputs (VTXOs). It addresses a real pain point. But Ark is not instantaneous. Creating Lightning channels with Ark VTXOs introduces latency. It is still in beta, and the fee structure is not yet clear.

The fundamental tradeoff is trust. Ark relies on an ASP, making it structurally similar to Liquid in some respects but without Liquid's production track record, federation governance, or multi-asset issuance capability. Ark may prove to be a valuable addition to the Lightning ecosystem. Liquid already is a valuable addition to the Bitcoin ecosystem. They are not mutually exclusive.

## How AQUA Wallet Serves Lightning Users

AQUA tackles this in two ways: one for individuals receiving payments, one for merchants running a store.

### AQUA Lightning Addresses

![AQUA Lightning Address](../../../blog/why-liquid/aqua-lightning-address.png)

For everyday receiving, [AQUA Lightning Addresses](https://jan3.com/blog/aqua-lightning-addresses-arrive) let a Liquid wallet present itself as a Lightning Address. A sender on any Lightning wallet pays `user@aqua.net`. They never need to know the recipient uses Liquid. L-BTC lands in a self-custodial AQUA wallet: no amount required upfront, no inbound liquidity needed on the recipient's side.

### SamRock Protocol

![SamRock Protocol](../../../blog/why-liquid/samrock.jpg)

For merchants, the problem is different. Lightning customers expect to pay an invoice at checkout. But a Liquid wallet merchant does not want to run a Lightning node, host private keys on a server, or manually configure XPUBs and Liquid blinding keys in BTCPay Server.

The [SamRock Protocol](https://jan3.com/blog/samrock-protocol), developed by JAN3 and the BTCPay Server team, lets a Liquid wallet accept Lightning payments through an invoicing system while keeping keys in the wallet. SamRock connects AQUA to BTCPay Server with a QR scan: public key data (including Liquid blinding keys) flows to the server, private keys never do. Lightning invoices are served to customers via Liquid-based submarine swaps through Boltz, so the merchant does not run or manage a Lightning node.


