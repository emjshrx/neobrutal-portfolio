export type ProjectType = {
  name: string;
  description: string;
  html_url: string;
  contributor: boolean;
  imageUrl: string;
};

export const projectsList: ProjectType[] = [
  {
    name: "EttaWalletSP",
    description: "Fork of Etta Wallet designed for Silent Payments",
    html_url:
      "https://github.com/Bitshala-Incubator/EttaWalletSP/commits?author=emjshrx",
    contributor: true,
    imageUrl:
      "https://github.com/EttaWallet/EttaWallet/raw/next/etta-preview.png",
  },
  {
    name: "bcoin",
    description: "Javascript bitcoin library for node.js and browsers",
    html_url: "https://github.com/bcoin-org/bcoin/commits?author=emjshrx",
    contributor: true,
    imageUrl: "https://avatars.githubusercontent.com/u/17676391?s=200&v=4",
  },
  {
    name: "LBTCL-Cohort",
    description:
      "A cooperative study group for Learning Bitcoin From Command Line",
    html_url: "https://github.com/Bitshala/LBTCL-Cohort/commits?author=emjshrx",
    contributor: true,
    imageUrl: "https://avatars.githubusercontent.com/u/109231991?s=200&v=4",
  },
  {
    name: "neobrutal-portfolio",
    description: "Portfolio in the style of neo-brutalism",
    html_url: "https://github.com/emjshrx/neobrutal-portfolio",
    contributor: false,
    imageUrl:
      "https://raw.githubusercontent.com/emjshrx/neobrutal-portfolio/main/img/thumbnail.png",
  },
  {
    name: "central-nft-cli",
    description:
      "A centralised server to store NFTs instead of the expensive blockchain while still maintain ownership with Public/Private keys.",
    html_url: "https://github.com/emjshrx/central-nft-cli",
    contributor: false,
    imageUrl:
      "https://raw.githubusercontent.com/emjshrx/central-nft-cli/main/img/thumbnail.png",
  },
];
