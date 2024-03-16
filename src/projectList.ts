export type ProjectType = {
  name: string;
  description: string;
  html_url: string;
  contributor: boolean;
  imageUrl: string;
};

export const projectsList: ProjectType[] = [
  {
    name: "Silent-Pay",
    description: "A wallet library for silent payments",
    html_url:
      "https://github.com/Bitshala-Incubator/silent-pay/commits?author=emjshrx",
    contributor: true,
    imageUrl: "https://avatars.githubusercontent.com/u/109231991?s=200&v=4",
  },
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
    name: "Bitshala Website V2",
    description: "The revamped Bitshala website for FOSS Bitcoin Education",
    html_url: "https://github.com/Bitshala/website-v2/commits?author=emjshrx",
    contributor: true,
    imageUrl: "https://avatars.githubusercontent.com/u/109231991?s=200&v=4",
  },
  {
    name: "Neobrutal-portfolio",
    description: "Portfolio in the style of neo-brutalism",
    html_url: "https://github.com/emjshrx/neobrutal-portfolio",
    contributor: false,
    imageUrl:
      "https://raw.githubusercontent.com/emjshrx/neobrutal-portfolio/main/img/thumbnail.png",
  },
];
