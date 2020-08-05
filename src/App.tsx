import React, {ChangeEvent, useEffect, useState} from 'react';
import './App.css';
import CanvasImage from "./components/Canvas";
import {Fab} from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {makeStyles} from "@material-ui/core/styles";

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
    const [ parsedFile, setParsedFile ] = useState<string | ArrayBuffer | null>(null);
    const [ srcImg, setSrcImg ] = useState<HTMLImageElement | null>(null);

    useEffect(() => {

    }, [srcImg])

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
                setParsedFile(value);

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
        <Fab className={classes.upload} component={"label"}>
            <CloudUploadIcon />
            <input onChange={handleFile} type="file" accept={"image/*"} style={{display: 'none'}} />
        </Fab>
        {
            typeof parsedFile === 'string' && srcImg !== null ? <CanvasImage img={srcImg} width={800} height={600} data={parsedFile}/> : ''
        }
    </div>
  );
}

export default App;
