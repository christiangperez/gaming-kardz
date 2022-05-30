import { useEffect, useState } from 'react';
import { Button, Container, Grid, TextField, Typography } from '@mui/material';
import { create as ipfsHttpClient } from 'ipfs-http-client';
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { IRootState } from '../../../redux/store/store';
import addCollection from '../../../addCollectionAstralisNavi.json';
import collectionExample from '../../../collectionExample.json';
import { IJsonCollection } from '../../../interfaces/marketplaceInterfaces';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export const MintScreen = () => {
  const { nftContract, marketplaceContract, enqueueSnackbar } = useSelector(
    (state: IRootState) => state.market
  );

  const [image, setImage] = useState('');
  const [uris, setUris] = useState<string[]>([]);
  const [beginMint, setBeginMint] = useState(false);
  const [jsonCollectionStr, setJsonCollectionStr] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy');

  const client = ipfsHttpClient({ url: 'https://ipfs.infura.io:5001/api/v0' });

  const uploadToIPFS = async (event: any) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        const result = await client.add(file);

        setImage(`https://ipfs.infura.io/ipfs/${result.path}`);
        setCopyButtonText('Copy');
      } catch (error) {
        console.log('ipfs image upload error: ', error);
      }
    }
  };

  function onReaderLoad(event: any) {
    setJsonCollectionStr(event.target.result);
  }

  useEffect(() => {
    const loadUris = async () => {
      let theUris: string[] = [];
      // addCollection.nfts.forEach(async (element) => {
      if (jsonCollectionStr) {
        let jsonCollection: IJsonCollection = JSON.parse(jsonCollectionStr);
        // console.log(jsonCollection.nfts, 'jsonCollection.nfts');
        jsonCollection.nfts.forEach(async (element) => {
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
      }
    };

    const beginProcess = async () => {
      setBeginMint(true);
      await loadUris();
    };

    if (jsonCollectionStr) {
      beginProcess();
    }
  }, [jsonCollectionStr]);

  const preMint = async (event: any) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (typeof file !== 'undefined') {
      try {
        var reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(event.target.files[0]);

        // setBeginMint(true);
        // await loadUris();
      } catch (error) {
        console.log('ipfs uri upload error: ', error);
      }
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
      if (enqueueSnackbar) {
        enqueueSnackbar('The transaction has been sent', { variant: 'info' });
      }
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

  const handleClickCopy = () => {
    if (image) {
      copyToClipboard(image);
    }
  };

  const copyToClipboard = (content: any) => {
    const el = document.createElement('textarea');
    el.value = content;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    el.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(el);
    setCopyButtonText('Copied');
    // alert('Copied the text: ' + content);
  };

  var data = { a: 1, b: 2 };

  return (
    <>
      <Container
        maxWidth="xl"
        sx={{ paddingTop: 4 }}
        style={{
          background: 'linear-gradient(to right bottom, #0c1410, #192112)',
        }}
      >
        <Grid display="flex" justifyContent="center">
          <Grid>
            <Typography color="white" variant="subtitle1" textAlign="center">
              Mint
            </Typography>
            <Typography color="white" variant="h2">
              Minting Collection
            </Typography>
          </Grid>
        </Grid>
        <Grid
          container
          direction="column"
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{ marginTop: 5 }}
        >
          <Typography color="white">
            Use this button to upload your NFT Images to IPFS and get the URI to
            create your JSON Collection file.
          </Typography>
          <Typography color="white">
            Once you upload your NFT Image, copy your URI and continue uploading
            all NFT Images and saving the URIs to create the JSON file with all
            data.
          </Typography>
          <Button
            variant="outlined"
            component="label"
            onChange={uploadToIPFS}
            sx={{ marginTop: 4 }}
          >
            Upload File
            <input type="file" accept="image/*" hidden />
          </Button>

          <TextField
            id="outlined-basic"
            label="URI"
            variant="outlined"
            value={image}
            InputLabelProps={{
              style: { color: '#fff' },
            }}
            sx={{
              marginTop: 4,
              input: { color: 'white' },
              '& .MuiInputLabel-root': { color: '#dbdbdb' },
              '& .MuiOutlinedInput-root': {
                '& > fieldset': { borderColor: '#dbdbdb' },
              },
              '& .MuiOutlinedInput-root.Mui-focused': {
                '& > fieldset': {
                  borderColor: 'primary',
                },
              },
              '& .MuiOutlinedInput-root:hover': {
                '& > fieldset': {
                  borderColor: 'primary.main',
                },
              },
            }}
          />
          <Button onClick={handleClickCopy} sx={{ marginBottom: 5 }}>
            {copyButtonText}{' '}
            <ContentCopyIcon sx={{ marginLeft: 1 }} onClick={handleClickCopy} />
          </Button>
        </Grid>
      </Container>
      <Grid container sx={{ pt: 0, pb: 2, background: '#d0f177' }}>
        <Container>
          <Typography variant="h6" sx={{ marginTop: 4 }}>
            JSON File Example
          </Typography>
          <Typography variant="caption">
            <pre>{JSON.stringify(collectionExample, null, 2)}</pre>
          </Typography>
        </Container>
      </Grid>
      <Container
        maxWidth="xl"
        style={{
          background: 'linear-gradient(to right bottom, #0c1410, #192112)',
        }}
      >
        <Grid display="flex" justifyContent="center">
          <Button
            variant="outlined"
            component="label"
            onChange={preMint}
            sx={{ marginTop: 5, marginBottom: 5 }}
          >
            Mint Collection from JSON
            <input type="file" accept="application/json" hidden />
          </Button>
        </Grid>
      </Container>
    </>
  );
};
