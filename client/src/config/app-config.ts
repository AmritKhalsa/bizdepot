import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "BizDepot CRM",
  version: packageJson.version,
  copyright: `© ${currentYear}, Bizdepot CRM`,
  meta: {
    title: "S.W.A.T Team CRM",
    description:
      "CRM for Biz-deopt.co",
  },
};
