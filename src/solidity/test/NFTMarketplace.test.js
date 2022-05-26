const { expect } = require('chai');
const { ethers } = require('hardhat');

const toWei = (num) => ethers.utils.parseEther(num.toString());
const fromWei = (num) => ethers.utils.formatEther(num);

describe('NFTMarketplace', () => {
    let deployer, addr1, addr2, addr3, addr4, addr5, nft, marketplace;
    let feePercent = 1;
    let feeCollectionPercent = 1;
    let feeRoyaltiesPercent = 1;

    beforeEach(async() => {
        const NFT = await ethers.getContractFactory("NFT");
        const Marketplace = await ethers.getContractFactory("Marketplace");
    
        [deployer, addr1, addr2, addr3, addr4, addr5] = await ethers.getSigners();
    
        nft = await NFT.deploy();
        marketplace = await Marketplace.deploy(feePercent, feeCollectionPercent, feeRoyaltiesPercent);
    });

    describe('Deployment', () => {
        it('should track name and symbol of the nft collection', async() => {
            expect(await nft.name()).equal('DApp NFT');
            expect(await nft.symbol()).equal('DAPP');
        });

        it('should track feeAccount and feePercent of the marketplace', async() => {
            expect(await marketplace.feeAccount()).equal(deployer.address);
            expect(await marketplace.feePercent()).equal(feePercent);
        });

        it('should track feeCollectionPercent and feeRoyaltiesPercent of the marketplace', async() => {
            expect(await marketplace.feeCollectionPercent()).equal(feeCollectionPercent);
            expect(await marketplace.feeRoyaltiesPercent()).equal(feeRoyaltiesPercent);
        });
    });

    describe('Minting NFT collections', () => {
        it('should track each minted NFT Collection and emit Offered event', async() => {
            // addr1 mints a collection with 1 nfts
            await expect(marketplace.connect(deployer).mintAndMakeCollection(['http://1'], addr1.address, nft.address, nft.address, [toWei(1)]))
            .emit(marketplace, 'Offered')
            .withArgs(
                1,
                nft.address,
                1,
                toWei(1),
                deployer.address
            );

            expect(await nft.tokenCount()).equal(1);
            expect(await nft.balanceOf(deployer.address)).equal(1);
            expect(await nft.tokenURI(1)).equal('http://1');

            // addr1 mints a collection with 2 nfts
            await expect(marketplace.connect(deployer).mintAndMakeCollection(['http://1', 'http://2'], addr1.address, nft.address, nft.address, [toWei(1), toWei(2)]))
            .emit(marketplace, 'Offered')
            .withArgs(
                2,
                nft.address,
                2,
                toWei(1),
                deployer.address
            )
            .withArgs(
                3,
                nft.address,
                3,
                toWei(2),
                deployer.address
            );

            expect(await nft.tokenCount()).equal(3);
            expect(await nft.balanceOf(deployer.address)).equal(3);
            expect(await nft.tokenURI(2)).equal('http://1');
            expect(await nft.tokenURI(3)).equal('http://2');
        });
    });

    describe('Purchasing recently minted items', () => {
        let totalPriceInWei;

        it('should receive payment from buyer, transfer NFT to buyer, charge fees and emit a Bought event', async() => {
            // addr1 mints a collection with 2 nfts
            await marketplace.connect(deployer).mintAndMakeCollection(['http://1', 'http://2'], addr1.address, nft.address, nft.address, [toWei(1), toWei(2)]);

            // fetch items total price (market fees + item price)
            totalPriceInWei = await marketplace.getTotalPrice(1);

            // addr2 purchases item
            await expect(marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei }))
            .emit(marketplace, 'Bought')
            .withArgs(
                1,
                nft.address,
                1,
                toWei(1),
                deployer.address,
                addr2.address
            );

            expect(await nft.ownerOf(1)).equal(addr2.address);
        });

        it('should buy a NFT, set to buy, emit ItemOnSale event and sell the NFT', async() => {
            // addr1 mints a collection with 2 nfts
            await marketplace.connect(deployer).mintAndMakeCollection(['http://1', 'http://2'], addr1.address, nft.address, nft.address, [toWei(1), toWei(2)]);

            // fetch items total price (market fees + item price)
            totalPriceInWei = await marketplace.getTotalPrice(1);

            // addr2 purchases item
            await expect(marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei }))
            .emit(marketplace, 'Bought')
            .withArgs(
                1,
                nft.address,
                1,
                toWei(1),
                deployer.address,
                addr2.address
            );

            expect(await nft.ownerOf(1)).equal(addr2.address);
        });
    });

    describe('Purchasing marketplace items', () => {
        let totalPriceInWei;

        beforeEach(async () => {
            // addr1 mints a collection with 2 nfts
            await marketplace.connect(deployer).mintAndMakeCollection(['http://1'], addr5.address, nft.address, nft.address, [toWei(1)]);
        });

        it('should buy a NFT, set to sale, emit ItemOnSale event, sell the NFT and every fee should sent to respective owners', async() => {
            // addr1 mints a collection with 2 nfts
            // await marketplace.connect(addr1).mintAndMakeCollection(['http://1'], addr5.address, nft.address, nft.address, [toWei(1)]);

            // fetch items total price (market fees + item price)
            totalPriceInWei = await marketplace.getTotalPrice(1);

            // addr2 purchase item
            await marketplace.connect(addr2).purchaseItem(1, { value: totalPriceInWei });

            // addr2 set item to sale
            await expect(await marketplace.connect(addr2).setItemOnSale(1, toWei(1)))
            .emit(marketplace, 'ItemOnSale')
            .withArgs(
                1,
                1,
                toWei(1),
                addr2.address
            );

            let feePercent = await marketplace.connect(addr3).feePercent();
            let feeCollection = await marketplace.connect(addr3).getTotalFeeCollection(1);
            let feeRoyalties = await marketplace.connect(addr3).getTotalFeeRoyalties(1);

            let firstNewTotalPriceInWei = await marketplace.getTotalPrice(1);

            // addr3 purchase item
            await marketplace.connect(addr3).purchaseItem(1, { value: firstNewTotalPriceInWei });

            await expect(await marketplace.connect(addr3).setItemOnSale(1, toWei(1)))
            .emit(marketplace, 'ItemOnSale')
            .withArgs(
                1,
                1,
                toWei(1),
                addr3.address
            );
            
            let secondNewTotalPriceInWei = await marketplace.getTotalPrice(1);
            
            let deployerInitialEthBal = await deployer.getBalance();
            const sellerInitialEthBal = await addr3.getBalance();
            let collectionOwnerInitialEthBal = await addr5.getBalance();
            let royaltiesOwnerInitialEthBal = await addr2.getBalance();

            // addr4 purchase item
            await marketplace.connect(addr4).purchaseItem(1, { value: secondNewTotalPriceInWei });

            let deployerFinalEthBal = await deployer.getBalance();
            const sellerFinalEthBal = await addr3.getBalance();
            let collectionOwnerFinalEthBal = await addr5.getBalance();
            let royaltiesOwnerFinalEthBal = await addr2.getBalance();

            // seller should receive payment
            expect(+fromWei(sellerFinalEthBal)).equal(+fromWei(sellerInitialEthBal) + 1);

            // marketplace should receive fee
            // expect(+fromWei(deployerFinalEthBal)).equal(+fromWei(deployerInitialEthBal) + +fromWei(numerito));

            // collection owner should receive fee
            expect(+fromWei(collectionOwnerFinalEthBal)).equal(+fromWei(collectionOwnerInitialEthBal) + +fromWei(feeCollection));

            // royalties owner should receive fee
            expect(+fromWei(royaltiesOwnerFinalEthBal)).equal(+fromWei(royaltiesOwnerInitialEthBal) + +fromWei(feeRoyalties));
        });

        it('should fail for invalid item ids and when not enough ether is paid', async() => {
            // fails for invalid item ids
            await expect(marketplace.connect(addr3).purchaseItem(20, { value: totalPriceInWei }))
            .revertedWith("item doesn't exists");
            await expect(marketplace.connect(addr3).purchaseItem(0, { value: totalPriceInWei }))
            .revertedWith("item doesn't exists");
            // Fails when not enough ether is paid with the transaction.
            await expect(marketplace.connect(addr3).purchaseItem(1, { value: toWei(1) }))
            .revertedWith('not enogh ether to cover item price and market fees');
        });
    });

})