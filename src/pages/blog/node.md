---
layout: "../../layouts/BlogLayout.astro"
title: "Guide: Build a Node"
header: "Bitcoin"
---
# Build your own hardened Bitcoin node

> This is a simplified version of the guide by `sunknudsen`. You can find the original [guide here](https://github.com/sunknudsen/privacy-guides/tree/master/how-to-self-host-hardened-bitcoin-node).

Every Bitcoiner wants to run their own Bitcoin node, but it can be quite overwhelming as the options are endless on how to configure it and maintain the best privacy practices. Despite all the noise, building a hardened node that is safe from external attacks and allows private Bitcoin transactions can be easy. Actually building one instead of using pre-built tools can help us learn how everything works.

## VPN

We will be using WireGuard for the VPN client and Mullvad for the server. There are other alternatives for the client (like OpenVPN) and server (like LnVPN) that you can try yourself.

### Mullvad

1. Go to [mullvad.net](https://mullvad.net/)
2. Create an account. Note that there is no KYC or identity link and just a random number as the username. Please keep this number safe.
3. Fund your account by adding time. [Payment in Bitcoin](https://mullvad.net/en/account/payment/bitcoin) is preferred.
4. Wait until the transaction is confirmed and the time under `PAID UNTIL` reflects the amount paid for.
5. Download the WireGuard configuration after selecting the options you need and the preferred country/server.

### WireGuard

1. `apt install wireguard`
2. `cp <location of mullvad-wireguard config> /etc/wireguard/`
3. `systemctl enable wg-quick@<Mullvad Endpoint name>`. The endpoint name is usually the Mullvad WireGuard config file name without `.conf`
4. `systemctl start wg-quick@<Mullvad Endpoint name>`
5. `curl https://am.i.mullvad.net/connected`

## TOR

Tor uses an onion-style routing technique for transmitting data. When you use the Tor browser to digitally communicate or access a website, the Tor network does not directly connect your computer to that website. Instead, the traffic from your browser is intercepted by Tor and bounced to a random number of other Tor users’ computers before passing the request to its final website destination.

1. `apt install tor`
2. `curl -x socks5h://localhost:9050 -s https://check.torproject.org/api/ip`

## Firewall

Since we will be having incoming and outgoing traffic, it is quite important to set up the policies required to protect and harden our node with a firewall. We will be using `UFW` as it's a simple way to get started.

1. `apt install ufw`
2. Use the [documentation](https://help.ubuntu.com/community/UFW) to generate your own rules.

## Bitcoin Core
You can follow the [official guide here](https://github.com/bitcoin/bitcoin/blob/master/doc/build-unix.md)
1. `git clone https://github.com/bitcoin/bitcoin.git`
2. cd into the directory and checkout the latest release.
3. `sudo apt-get install build-essential libtool autotools-dev automake pkg-config bsdmainutils python3`
4. `sudo apt-get install libevent-dev libboost-dev`
5. `./autogen.sh`
6. `./configure`
7. `make` (you might have to try sudo)
8. `make install`
9. `bitcoind`