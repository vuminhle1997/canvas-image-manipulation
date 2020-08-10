import React, {useState, useEffect, useRef, ChangeEvent} from 'react';
import {Card, CardActionArea, CardMedia, CardContent, Typography, Paper, Grid, Slider, Input, Fab} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Brightness5Icon from '@material-ui/icons/Brightness5';
import RestoreIcon from '@material-ui/icons/Restore';
import SaveIcon from '@material-ui/icons/Save';

import { ImageFilterController } from './ImageFilterController';

const useStyles = makeStyles({
    root: {
        overflowY: 'auto',
        display: "flex",
        flexDirection: 'row',
    },
    card: {
        minWidth: '20vw'
    },
    media: {
        height: 150
    },
    sliders: {
        position: 'absolute',
        top: '50px',
        right: '50px',
        width: '250px',
        padding: "2em",
        opacity: 0.45,
        "&:hover": {
            opacity: 1
        }
    },
    input: {
        width: 50
    }
});

export default function CanvasImage({img, file}: {img: HTMLImageElement, file: File | null}) {
    const classes = useStyles();
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [ width, setWidth ] = useState<number>(window.innerWidth);
    const [ height, setHeight ] = useState<number>(window.innerHeight);
    const [ canvas, setCanvas ] = useState<HTMLCanvasElement>();
    const [ canvasContext, setCanvasContext ] = useState<CanvasRenderingContext2D | null>(null);

    const [filter, setFilter] = useState<string>('original');
    const [showSliders, setShowSliders] = useState<boolean>(true);
    const [brightness, setBrightness] = useState<number>(0);
    const [contrast, setContrast] = useState<number>(0);
    const [saturation, setSaturation] = useState<number>(0);

    useEffect(() => {
        if (!img) return;

        setHeight(img.height);
        setWidth(img.width);

        if (!canvasRef.current) return;

        const canvas: HTMLCanvasElement  = canvasRef.current;
        setCanvas(canvas);
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");
        setCanvasContext(ctx);

        img.onload = () => {
            ctx?.drawImage(img, 0, 0, img.width, img.height);
        }
        return () => {
            console.log('cleared');
        }
    }, []);

    useEffect(() => {
        reloadImg();
    }, [img]);

    const reloadImg = () => {
        if (!canvasContext) return;

        setTimeout(() => {
            setHeight(img.height);
            setWidth(img.width);
            setFilter('original');
            setBrightness(0);
            setContrast(0);

            canvasContext.drawImage(img, 0, 0, img.width, img.height);
        }, 1);
    }

    const applyFilter = (filter: string) => {
        setFilter(filter);

        if (!canvasContext) return;

        const imgData: ImageData = canvasContext.getImageData(0, 0, img.width, img.height);
        canvasContext.drawImage(img, 0, 0, img.width, img.height);

        switch (filter) {
            case 'original':
                ImageFilterController.originalFilter(img, imgData, canvasContext, width, height);
                break;
            case 'blackNWhite':
                ImageFilterController.blackNWhiteFilter(img, imgData, canvasContext, width, height);
                break;
            case 'sepia':
                ImageFilterController.sepia(img, imgData, canvasContext, width, height);
                break;
            default:
                break;
        }
    }

    const overhaulFilterApply = (filter: string, imgData: ImageData) => {
        if (!canvasContext) return;

        switch (filter) {
            case 'original':
                ImageFilterController.originalFilter(img, imgData, canvasContext, width, height);
                break;
            case 'blackNWhite':
                ImageFilterController.blackNWhiteFilter(img, imgData, canvasContext, width, height);
                break;
            case 'sepia':
                ImageFilterController.sepia(img, imgData, canvasContext, width, height);
                break;
            default:
                break;
        }
    }
    
    const handleBrightnessChange = (event: ChangeEvent<{}>, value: number | number[]) => {
        if (typeof value === 'number')
            setBrightness(value);

        if (!canvasContext) return;

        canvasContext.drawImage(img, 0, 0, img.width, img.height);
        overhaulFilterApply(filter, canvasContext?.getImageData(0, 0, img.width, img.height));

        const imgData: ImageData = canvasContext?.getImageData(0, 0, img.width, img.height);

        ImageFilterController.applyBrightness(img, imgData, canvasContext, width, height, brightness);
    }

    const handleBrightnessInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (typeof event.target.value === 'number')
            setBrightness(event.target.value);
        else
            setBrightness(Number(event.target.value));
    }

    const handleSaturationChange = (event: ChangeEvent<{}>, value: number | number[]) => {
        if (typeof value === 'number')
            setSaturation(value);

        if (!canvasRef.current) return;

        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        const imgData: ImageData = ctx?.getImageData(0, 0, img.width, img.height);

    }

    const handleSaturationInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (typeof event.target.value === 'number')
            setSaturation(event.target.value);
        else
            setSaturation(Number(event.target.value));
    }

    const returnSettings = () => {
        if (!canvasContext) return;

        canvasContext.drawImage(img, 0, 0, img.width, img.height);
        setSaturation(0);
        setBrightness(0);
    }

    const saveImage = () => {
        if (!canvas || !file) return;

        const canvasImage: string = canvas.toDataURL(file.type, 1.0);

        const fileName: string = file.name.substring(0, file.name.indexOf('.'));
        const fileTypeEnd: string = file.name.substring(file.name.indexOf('.'), file.name.length);
        const a: HTMLAnchorElement = document.createElement("a");
        a.href = canvasImage;
        a.download = `${fileName}-${filter}${fileTypeEnd}`;
        a.click();
    }

    return (
        <>
            {
                showSliders ? <Paper className={classes.sliders}>
                    <Typography gutterBottom>
                        Brightness
                    </Typography>
                    <Grid container spacing={2} alignItems={"center"}>
                        <Grid item>
                            <Brightness5Icon />
                        </Grid>
                        <Grid item xs>
                            <Slider
                                value={brightness}
                                onChange={handleBrightnessChange}
                                min={-100}
                                max={100}
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={brightness}
                                onChange={handleBrightnessInput}
                                className={classes.input}
                                margin="dense"
                                inputProps={{
                                    step: 10,
                                    min: -100,
                                    max: 100,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                    <br/>
                    <Typography gutterBottom>
                        Saturation
                    </Typography>
                    <Grid container spacing={2} alignItems={"center"}>
                        <Grid item>
                            <Brightness5Icon />
                        </Grid>
                        <Grid item xs>
                            <Slider
                                value={saturation}
                                onChange={handleSaturationChange}
                                min={0}
                                max={100}
                                aria-labelledby="input-slider"
                            />
                        </Grid>
                        <Grid item>
                            <Input
                                value={saturation}
                                onChange={handleSaturationInput}
                                className={classes.input}
                                margin="dense"
                                inputProps={{
                                    step: 10,
                                    min: 0,
                                    max: 100,
                                    type: 'number',
                                    'aria-labelledby': 'input-slider',
                                }}
                            />
                        </Grid>
                    </Grid>
                    <br/>
                    <Grid container spacing={2} alignItems={"center"}>
                        <Grid item>
                            <Fab onClick={returnSettings}>
                                <RestoreIcon />
                            </Fab>
                        </Grid>
                        <Grid item>
                            <Fab onClick={saveImage}>
                                <SaveIcon />
                            </Fab>
                        </Grid>
                    </Grid>
                </Paper> : <></>
            }
            {
                img ? <canvas ref={canvasRef} width={width} height={height}/> : <div>Upload an image!</div>
            }
            {
                img ? <div className={classes.root}>
                    <Card className={classes.card}>
                        <CardActionArea onClick={() => applyFilter('original')}>
                            <CardMedia
                                className={classes.media}
                                image={"http://placekitten.com/200/300"}
                            />
                            <CardContent>
                                <Typography variant={"caption"}>
                                    Original
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card className={classes.card}>
                        <CardActionArea onClick={() => applyFilter('blackNWhite')}>
                            <CardMedia
                                image={"http://placekitten.com/200/300"}
                                className={classes.media}
                            />
                            <CardContent>
                                <Typography variant={"caption"}>
                                    Black 'n White
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                    <Card className={classes.card}>
                        <CardActionArea onClick={() => applyFilter('sepia')}>
                            <CardMedia
                                image={"http://placekitten.com/200/300"}
                                className={classes.media}
                            />
                            <CardContent>
                                <Typography variant={"caption"}>
                                    Sepia
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                    </Card>
                </div> : <div></div>
            }
        </>
    )
}