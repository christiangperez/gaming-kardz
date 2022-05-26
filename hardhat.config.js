require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.4",
  paths: {
    artifacts: "./src/solidity/artifacts",
    sources: "./src/solidity/contracts",
    cache: "./src/solidity/cache",
    tests: "./src/solidity/test"
  },
};
