import React, {useState, useEffect, useRef} from 'react';
import {Card, CardActionArea, CardMedia, CardContent, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

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
    }
})

export default function CanvasImage({data, img}: {width: number, height: number, data: string, img: HTMLImageElement}) {
    const classes = useStyles();
    const canvasRef = React.useRef<HTMLCanvasElement>(null)
    const [ width, setWidth ] = useState<number>(window.innerWidth);
    const [ height, setHeight ] = useState<number>(window.innerHeight);
    const [ image, setImage ] = useState<HTMLImageElement>(img);
    const [ canvas, setCanvas ] = useState<HTMLCanvasElement>();
    const [ canvasContext, setCanvasContext ] = useState<CanvasRenderingContext2D | null>(null);

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
            default:
                break;
        }
    }

    const originalFilter = (imgData: ImageData, ctx: CanvasRenderingContext2D) => {
        ctx.drawImage(img, 0, 0, img.width, img.height);
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

    return (
        <>
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
                </div> : <div></div>
            }
        </>
    )
}