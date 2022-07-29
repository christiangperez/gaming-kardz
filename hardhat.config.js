require('@nomiclabs/hardhat-waffle');
require('@nomiclabs/hardhat-etherscan');

module.exports = {
  solidity: '0.8.4',
  paths: {
    artifacts: './src/solidity/artifacts',
    sources: './src/solidity/contracts',
    cache: './src/solidity/cache',
    tests: './src/solidity/test'
  },
  networks: {
    rinkeby: {
      url: 'https://rinkeby.infura.io/v3/df6c4cf80846468194475546b3d70642',
      accounts: [
        '0x341ad0919511e32326479f6b1fd6983d096810742f66083d6d2037b5bce70e82'
      ]
    }
  },
  etherscan: {
    apiKey: 'MVB2FJBBS85FIMG5EJNCI2ZWIPUR78JKE8'
  }
};
