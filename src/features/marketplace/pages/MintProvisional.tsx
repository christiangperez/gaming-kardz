import { useEffect, useState } from 'react';
import { Button, Container, Grid } from '@mui/material';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../redux/store/store';
import addCollection from '../../../addCollection.json';

export const MintProvisional = () => {
  const { nftContract, marketplaceContract } = useSelector(
    (state: IRootState) => state.market
  );

  const [image, setImage] = useState('');
  const [uris, setUris] = useState<string[]>([]);
  const [beginMint, setBeginMint] = useState(false);

  const client = ipfsHttpClient({ url: 'https://ipfs.infura.io:5001/api/v0' });

  const loadUris = async () => {
    let theUris: string[] = [];
    addCollection.nfts.forEach(async (element) => {
      const uriImage = element.image;
      const price = element.price;
      const name = element.name;
      const team = element.team;
      const game = element.game;
      const description = element.description;

      const result = await client.add(
        JSON.stringify({
          image: uriImage,
          price,
          name,
          team,
          game,
          description,
        })
      );
      const uri = `https://ipfs.infura.io/ipfs/${result.path}`;
      theUris.push(uri);

      setUris([...theUris]);
    });
  };

  const uploadToIPFS = async (event: any) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file);

        setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
      } catch (error) {
        console.log('ipfs image upload error: ', error);
      }
    }
  };

  const preMint = async () => {
    try {
      setBeginMint(true);
      await loadUris();
    } catch (error) {
      console.log('ipfs uri upload error: ', error);
    }
  };

  const finalMint = async () => {
    try {
      let prices: any[] = [];

      addCollection.nfts.forEach((element) => {
        prices.push(ethers.utils.parseEther(element.price.toString()));
      });

      if (uris.length !== prices.length) {
        // error in data
        return;
      }

      await (
        await marketplaceContract.mintAndMakeCollection(
          uris,
          addCollection.beneficiary ? addCollection.beneficiary : '0x0',
          nftContract.address,
          nftContract.address,
          prices
        )
      ).wait();

      setBeginMint(false);

      console.log('minted!');
    } catch (error) {
      setBeginMint(false);
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      beginMint &&
      uris.length > 0 &&
      uris.length === addCollection.nfts.length
    ) {
      finalMint();
      setBeginMint(false);
    }
  }, [uris]);

  return (
    <Container maxWidth="xl" sx={{ background: '#0c1410', paddingTop: 10 }}>
      <Grid
        container
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Button variant="outlined" component="label" onChange={uploadToIPFS}>
          Select & Upload File
          <input type="file" accept="image/*" hidden />
        </Button>
        <Button variant="outlined" component="label" onClick={preMint}>
          Mint
        </Button>
      </Grid>
    </Container>
  );
};
