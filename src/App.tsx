import React, {ChangeEvent, useEffect, useState} from 'react';
import './App.css';
import CanvasImage from "./components/Canvas";
import {Fab, Tooltip} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {makeStyles} from "@material-ui/core/styles";

import BLACKPINK from './static/img/blackpink.jpg';

const useStyles = makeStyles({
    upload: {
        position: 'fixed',
        bottom: '15px',
        right: '15px',
        zIndex: 5
    }
})

function App() {
    const classes = useStyles();
    const [ imageFile, setImageFile ] = useState<File | null>(null);
    const [ srcImg, setSrcImg ] = useState<HTMLImageElement | null>(null);

    useEffect(() => {
        let loadImg = new Image();

        loadImg.src = BLACKPINK;
        loadImg.onload = (e: Event) => {
            setSrcImg(loadImg);
        }

        const file = new File([new ArrayBuffer(1)], 'default.jpeg', {type: 'image/jpeg'});
        setImageFile(file);
    }, []);

    const handleFile = async(event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const file = await event.target.files[0];
            const reader = new FileReader();

            setImageFile(file)
            reader.onabort = (event: ProgressEvent<FileReader>) => {
                console.error(`Aborted . . .`, event);
                reader.abort();
            }
            reader.onerror = (event: ProgressEvent<FileReader>) => {
                console.error(`Error appeared . . .`, reader.error);
                reader.abort();
            }
            reader.onload = async(event: ProgressEvent<FileReader>) => {
                const value: any = reader.result;

                const readedSrcImg: HTMLImageElement = new Image();
                if (value !== null) {
                    readedSrcImg.src = value;
                    setSrcImg(readedSrcImg);
                }
            }

            reader.readAsDataURL(file);
        }
    }

  return (
    <div className="App">
        <Tooltip title={"Upload Image"}>
            <Fab className={classes.upload} component={"label"}>
                <CloudUploadIcon />
                <input onChange={handleFile} type="file" accept={"image/*"} style={{display: 'none'}} />
            </Fab>
        </Tooltip>
        {
            srcImg !== null ? <CanvasImage file={imageFile} img={srcImg} /> : ''
        }
    </div>
  );
}

export default App;
