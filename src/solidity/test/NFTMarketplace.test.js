const { expect } = require('chai');
const { ethers, waffle } = require('hardhat');

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe('NFTMarketplace', () => {
  let deployer, addr1, addr2, addr3, addr4, nft, marketplace;
  const feePercent = 1;
  const feeCollectionPercent = 1;
  const feeRoyaltiesPercent = 1;
  const collectionOwnerEarnPercent = 0;

  beforeEach(async () => {
    const NFT = await ethers.getContractFactory('NFT');
    const Marketplace = await ethers.getContractFactory('Marketplace');

    [deployer, addr1, addr2, addr3, addr4] = await ethers.getSigners();

    nft = await NFT.deploy();
    marketplace = await Marketplace.deploy(
      feePercent,
      feeCollectionPercent,
      feeRoyaltiesPercent
    );
  });

  describe('Deployment', () => {
    it('should track name and symbol of the nft collection', async () => {
      expect(await nft.name()).equal('Gaming Kardz NFT');
      expect(await nft.symbol()).equal('GKRDZ');
    });

    it('should track feeAccount and feePercent of the marketplace', async () => {
      expect(await marketplace.feeMarketplaceAccount()).equal(deployer.address);
      expect(await marketplace.feeMarketplacePercent()).equal(feePercent);
    });

    it('should track feeCollectionPercent and feeRoyaltiesPercent of the marketplace', async () => {
      expect(await marketplace.feeCollectionPercent()).equal(
        feeCollectionPercent
      );
      expect(await marketplace.feeRoyaltiesPercent()).equal(
        feeRoyaltiesPercent
      );
    });

    it('should change the fee percent of marketplace and fee percent of royalties', async () => {
      const newFeePercent = 2;
      const newFeePercentRoyalties = 2;

      marketplace.connect(deployer).changeFeePercent(newFeePercent);
      marketplace
        .connect(deployer)
        .changeFeeRoyaltiesPercent(newFeePercentRoyalties);

      expect(await marketplace.feeMarketplacePercent()).equal(newFeePercent);
      expect(await marketplace.feeRoyaltiesPercent()).equal(
        newFeePercentRoyalties
      );
    });
  });

  describe('Minting NFT collections', () => {
    it('should track each minted NFT Collection and emit Offered event', async () => {
      const tokenPrice = toWei(1);

      await nft.connect(deployer).setApprovalForAll(marketplace.address, true);

      // DEPLOY COLLECTION WITH 1 NFT
      await expect(
        marketplace
          .connect(deployer)
          .mintCollection(
            ['http://1'],
            addr1.address,
            collectionOwnerEarnPercent,
            nft.address,
            nft.address,
            [tokenPrice]
          )
      )
        .emit(marketplace, 'Offered')
        .withArgs(1, nft.address, tokenPrice, deployer.address);

      expect(await nft.tokenCount()).equal(1);
      expect(await nft.balanceOf(marketplace.address)).equal(1);
      expect(await nft.tokenURI(1)).equal('http://1');

      const secondTokenPrice1 = toWei(1);
      const secondTokenPrice2 = toWei(2);

      // DEPLOY COLLECTION WITH 2 NFTS
      await expect(
        marketplace
          .connect(deployer)
          .mintCollection(
            ['http://2', 'http://3'],
            addr1.address,
            collectionOwnerEarnPercent,
            nft.address,
            nft.address,
            [secondTokenPrice1, secondTokenPrice2]
          )
      )
        .emit(marketplace, 'Offered')
        .withArgs(2, nft.address, secondTokenPrice1, deployer.address)
        .withArgs(3, nft.address, secondTokenPrice2, deployer.address);

      expect(await nft.tokenCount()).equal(3);
      expect(await nft.balanceOf(marketplace.address)).equal(3);
      expect(await nft.tokenURI(2)).equal('http://2');
      expect(await nft.tokenURI(3)).equal('http://3');
    });
  });

  describe('Purchasing recently minted items', () => {
    let totalPriceInWei;

    it('should receive payment from buyer (marketplace and collection owner), transfer NFT to buyer, charge fees and emit a Bought event', async () => {
      const provider = waffle.provider;
      const tokenPrice = toWei(1);

      await nft.connect(deployer).setApprovalForAll(marketplace.address, true);

      // DEPLOY COLLECTION WITH 1 NFT
      await marketplace
        .connect(deployer)
        .mintCollection(
          ['http://1'],
          addr1.address,
          50,
          nft.address,
          nft.address,
          [tokenPrice]
        );

      // fetch items total price (market fees + item price)
      totalPriceInWei = await marketplace.getTotalPrice(1);

      await nft.connect(deployer).setApprovalForAll(marketplace.address, true);

      // addr2 purchases item
      await expect(
        marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei })
      )
        .emit(marketplace, 'Bought')
        .withArgs(
          1,
          nft.address,
          tokenPrice,
          totalPriceInWei,
          marketplace.address,
          addr2.address
        );

      expect(await nft.ownerOf(1)).equal(addr2.address);

      const balance = await provider.getBalance(marketplace.address);
      expect(balance).equal(totalPriceInWei);

      const balanceMarketplace = await marketplace.getAccountsBalance(
        marketplace.address
      );
      expect(balanceMarketplace).equal(toWei(0.5));

      const balanceCollectionOwner = await marketplace.getAccountsBalance(
        addr1.address
      );
      expect(balanceCollectionOwner).equal(toWei(0.51));

      const balanceOwnerMarketplace = await marketplace.getAccountsBalance(
        deployer.address
      );
      const feeAccount = await marketplace.getTotalFeeMarketplace(1);
      expect(balanceOwnerMarketplace).equal(feeAccount);
    });
  });

  describe('Purchasing marketplace items', () => {
    it('should buy a NFT, set to sale, emit ItemOnSale event, sell the NFT and every fee should sent to respective owners and claim earns', async () => {
      const provider = waffle.provider;
      const tokenPrice = toWei(1);

      await nft.connect(deployer).setApprovalForAll(marketplace.address, true);

      // DEPLOY COLLECTION WITH 1 NFT
      await marketplace
        .connect(deployer)
        .mintCollection(
          ['http://1'],
          addr1.address,
          collectionOwnerEarnPercent,
          nft.address,
          nft.address,
          [tokenPrice]
        );

      const totalPriceInWei = await marketplace.getTotalPrice(1);
      const feeMarketplace = await marketplace.getTotalFeeMarketplace(1);
      const feeCollection = await marketplace.getTotalFeeCollection(1);

      // addr2 purchase item
      await nft.connect(addr2).setApprovalForAll(marketplace.address, true);
      await marketplace
        .connect(addr2)
        .purchaseItem(1, { value: totalPriceInWei });

      // addr2 set item to sale to 2 ETH
      const tokenPriceAddr2 = toWei(2);
      await expect(
        await marketplace.connect(addr2).setItemOnSale(1, tokenPriceAddr2)
      )
        .emit(marketplace, 'ItemOnSale')
        .withArgs(1, 1, tokenPriceAddr2, addr2.address);

      const secondTotalPriceInWei = await marketplace.getTotalPrice(1);
      const secondFeeMarketplace = await marketplace.getTotalFeeMarketplace(1);
      const secondFeeCollection = await marketplace.getTotalFeeCollection(1);
      const feeRoyalties = await marketplace.getTotalFeeRoyalties(1);

      // addr3 purchase item on sale by addr2
      await nft.connect(addr3).setApprovalForAll(marketplace.address, true);
      await marketplace
        .connect(addr3)
        .purchaseItem(1, { value: secondTotalPriceInWei });

      // addr3 set item on sale to 3 ETH
      const tokenPriceAddr3 = toWei(3);
      await expect(
        await marketplace.connect(addr3).setItemOnSale(1, tokenPriceAddr3)
      )
        .emit(marketplace, 'ItemOnSale')
        .withArgs(1, 1, tokenPriceAddr3, addr3.address);

      const thirdTotalPriceInWei = await marketplace.getTotalPrice(1);
      const thirdFeeMarketplace = await marketplace.getTotalFeeMarketplace(1);
      const thirdFeeCollection = await marketplace.getTotalFeeCollection(1);
      const secondFeeRoyalties = await marketplace.getTotalFeeRoyalties(1);

      // addr4 purchase item on sale by addr3
      await nft.connect(addr4).setApprovalForAll(marketplace.address, true);
      await marketplace
        .connect(addr4)
        .purchaseItem(1, { value: thirdTotalPriceInWei });

      const balance = await provider.getBalance(marketplace.address);
      const sumPrices =
        +fromWei(totalPriceInWei) +
        +fromWei(secondTotalPriceInWei) +
        +fromWei(thirdTotalPriceInWei);
      expect(balance).equal(toWei(sumPrices));

      const balanceAddr2 = await marketplace.getAccountsBalance(addr2.address);
      expect(+fromWei(balanceAddr2)).equal(
        +fromWei(tokenPriceAddr2) +
          +fromWei(feeRoyalties) +
          +fromWei(secondFeeRoyalties)
      );

      const balanceAddr3 = await marketplace.getAccountsBalance(addr3.address);
      expect(balanceAddr3).equal(tokenPriceAddr3);

      const balanceAddr4 = await marketplace.getAccountsBalance(addr4.address);
      expect(balanceAddr4).equal(0);

      const balanceOwnerMarketplace = await marketplace.getAccountsBalance(
        deployer.address
      );
      expect(+fromWei(balanceOwnerMarketplace)).equal(
        +fromWei(feeMarketplace) +
          +fromWei(secondFeeMarketplace) +
          +fromWei(thirdFeeMarketplace)
      );

      const balanceOwnerCollection = await marketplace.getAccountsBalance(
        addr1.address
      );
      expect(+fromWei(balanceOwnerCollection)).equal(
        +fromWei(feeCollection) +
          +fromWei(secondFeeCollection) +
          +fromWei(thirdFeeCollection)
      );

      const balanceMarketplace = await marketplace.getAccountsBalance(
        marketplace.address
      );
      expect(balanceMarketplace).equal(tokenPrice);

      // CLAIM
      const balanceAddr3PreClaim = await provider.getBalance(addr3.address);
      await marketplace.connect(addr3).claimEarns();
      const balanceAddr3PostClaim = await provider.getBalance(addr3.address);
      expect(+balanceAddr3PostClaim).greaterThan(+balanceAddr3PreClaim);
    });

    it('should fail for invalid item ids and when not enough ether is paid', async () => {
      const tokenPrice = toWei(1);

      await nft.connect(deployer).setApprovalForAll(marketplace.address, true);

      // DEPLOY COLLECTION WITH 1 NFT
      await marketplace
        .connect(deployer)
        .mintCollection(
          ['http://1'],
          addr1.address,
          collectionOwnerEarnPercent,
          nft.address,
          nft.address,
          [tokenPrice]
        );

      await nft.connect(addr4).setApprovalForAll(marketplace.address, true);

      const totalPriceInWei = toWei(1);

      // fails for invalid item ids
      await expect(
        marketplace.connect(addr4).purchaseItem(20, { value: totalPriceInWei })
      ).revertedWith("item doesn't exists");
      await expect(
        marketplace.connect(addr4).purchaseItem(0, { value: totalPriceInWei })
      ).revertedWith("item doesn't exists");
      // Fails when not enough ether is paid with the transaction.
      await expect(
        marketplace.connect(addr4).purchaseItem(1, { value: toWei(0.1) })
      ).revertedWith('not enogh ether to cover item price and market fees');
    });
  });
});
