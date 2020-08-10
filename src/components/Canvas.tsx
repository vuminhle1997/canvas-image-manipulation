import React, {useState, useEffect, useRef, ChangeEvent} from 'react';
import {Card, CardActionArea, CardMedia, CardContent, Typography, Paper, Grid, Slider, Input} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Brightness5Icon from '@material-ui/icons/Brightness5';

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
        width: '250px'
    },
    input: {
        width: 50
    }
});

const clamp = (num: number) => {
    if (num < 0) return 0;
    if (num > 255) return 255;
    return num;
}

export default function CanvasImage({data, img}: {width: number, height: number, data: string, img: HTMLImageElement}) {
    const classes = useStyles();
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [ width, setWidth ] = useState<number>(window.innerWidth);
    const [ height, setHeight ] = useState<number>(window.innerHeight);
    const [ image, setImage ] = useState<HTMLImageElement>(img);
    const [ canvas, setCanvas ] = useState<HTMLCanvasElement>();
    const [ canvasContext, setCanvasContext ] = useState<CanvasRenderingContext2D | null>(null);

    const [showSliders, setShowSliders] = useState<boolean>(true);
    const [brightness, setBrightness] = useState<number>(0);
    const [contrast, setContrast] = useState<number>(0);
    const [saturation, setSaturation] = useState<number>(0);

    useEffect(() => {
        if (!image) return;

        setHeight(image.height);
        setWidth(image.width);

        if (!canvasRef.current) return;

        const canvas: HTMLCanvasElement  = canvasRef.current;
        setCanvas(canvas);
        const ctx: CanvasRenderingContext2D | null = canvas.getContext("2d");

        img.onload = () => {
            ctx?.drawImage(img, 0, 0, img.width, img.height);
        }
        return () => {
            console.log('cleared');
        }
    }, []);

    useEffect(() => {
        setImage(img);

    }, [data])

    const applyFilter = (filter: string) => {
        if (!canvasRef.current) return;

        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        const imgData: ImageData = ctx?.getImageData(0, 0, img.width, img.height);

        switch (filter) {
            case 'original':
                originalFilter(imgData, ctx);
                break;
            case 'blackNWhite':
                blackNWhiteFilter(imgData, ctx);
                break;
            case 'sepia':
                sepia(imgData, ctx);
                break;
            default:
                break;
        }
    }

    const originalFilter = (imgData: ImageData, ctx: CanvasRenderingContext2D) => {
        ctx.drawImage(img, 0, 0, img.width, img.height);
        setBrightness(0);
        setSaturation(0);
        setContrast(0);
    }

    const blackNWhiteFilter = (imgData: ImageData, ctx: CanvasRenderingContext2D) => {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const pos = (y * width + x) * 4;

                const r = imgData.data[pos];
                const g = imgData.data[pos + 1];
                const b = imgData.data[pos + 2];
                const diff = (r + g + b) /3;

                imgData.data[pos] = diff;
                imgData.data[pos + 1] = diff;
                imgData.data[pos + 2] = diff;
            }
        }

        ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
    }

    const sepia = (imgData: ImageData, ctx: CanvasRenderingContext2D) => {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const pos = (y * width + x) * 4;

                const r: number = imgData.data[pos];
                const g: number = imgData.data[pos + 1];
                const b: number = imgData.data[pos + 2];

                const newR = clamp((r * 0.393) + (g * 0.769) + (b * 0.189));
                const newG = clamp((r * 0.349) + (g * 0.686) + (b * 0.168));
                const newB = clamp((r * 0.272) + (g * 0.534) + (b * 0.131));

                imgData.data[pos] = newR;
                imgData.data[pos + 1] = newG;
                imgData.data[pos + 2] = newB;
            }
        }
        ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
    }

    const handleBrightnessChange = (event: ChangeEvent<{}>, value: number | number[]) => {
        if (typeof value === 'number')
            setBrightness(value);

        if (!canvasRef.current) return;

        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, img.width, img.height);

        const imgData: ImageData = ctx?.getImageData(0, 0, img.width, img.height);

        applyBrightness(imgData, ctx);
    }

    const handleBrightnessInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (typeof event.target.value === 'number')
            setBrightness(event.target.value);
        else
            setBrightness(Number(event.target.value));
    }

    const applyBrightness = (imgData: ImageData, ctx: CanvasRenderingContext2D) => {
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const pos = (y * width + x) * 4;

                const r: number = imgData.data[pos];
                const g: number = imgData.data[pos + 1];
                const b: number = imgData.data[pos + 2];

                const newR = clamp(r + brightness);
                const newG = clamp(g + brightness);
                const newB = clamp(b + brightness);

                imgData.data[pos] = newR;
                imgData.data[pos + 1] = newG;
                imgData.data[pos + 2] = newB;
            }
        }
        ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
    }

    const handleSaturationChange = (event: ChangeEvent<{}>, value: number | number[]) => {
        if (typeof value === 'number')
            setSaturation(value);

        if (!canvasRef.current) return;

        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        const imgData: ImageData = ctx?.getImageData(0, 0, img.width, img.height);

        applySaturation(imgData, ctx);
    }

    const handleSaturationInput = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        if (typeof event.target.value === 'number')
            setSaturation(event.target.value);
        else
            setSaturation(Number(event.target.value));
    }

    const applySaturation = (imgData: ImageData, ctx: CanvasRenderingContext2D) => {
        return;
        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                const pos = (y * width + x) * 4;

                const r: number = imgData.data[pos];
                const g: number = imgData.data[pos + 1];
                const b: number = imgData.data[pos + 2];

                const newR = clamp(r + brightness);
                const newG = clamp(g + brightness);
                const newB = clamp(b + brightness);

                imgData.data[pos] = newR;
                imgData.data[pos + 1] = newG;
                imgData.data[pos + 2] = newB;
            }
        }
        ctx.putImageData(imgData, 0, 0, 0, 0, img.width, img.height);
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