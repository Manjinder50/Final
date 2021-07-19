import React, {Fragment,useState,useEffect} from 'react';
import Header from "../../common/header/Header";
import './Details.css';
import {makeStyles} from '@material-ui/core/styles';
import {Link,useParams} from 'react-router-dom';
import Typography from "@material-ui/core/Typography";
import YouTube from 'react-youtube';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";

export default function Details({accessToken,setAccessToken,loginButton,setLoginButton}){
    const styles = makeStyles((theme) => ({

        boldText: {
            fontWeight: "bold",
        },
        wikiMargin:{
            margin: 16,
        }
    }));
    const classes = styles();

    const [movieDetails, setMovieDetails] = useState({
        id: '',
        title: '',
        poster_url: '',
        trailer_url: '',
        genres: [],
        duration: '',
        release_date: '',
        rating: '',
        wiki_url: '',
        storyline: '',
        artists: []
    });

    const videoDetails = {
        height: '500',
        playerVars : {
            autoplay: 1,
        },
    };

    const videoId = movieDetails !== undefined && movieDetails.trailer_url !== undefined?
        movieDetails.trailer_url.slice(movieDetails.trailer_url.indexOf('?v=') + 3, movieDetails.trailer_url.length) : '';

    const[stars, setStars] = useState([false,false,false,false,false]);

    const onStarClick = (e) => {
        const id = e.target.id;
        const n = id.substring(5);
        const selectedStar = [];
        for(let i=0; i<5; i++) {
            selectedStar[i] = i <= n;
        }
        setStars(selectedStar);
    };

    const numberOfStars = 5;
    const params = useParams();
    const getMovie = () => {
        const movieId = params.id;
        fetch(`http://localhost:8085/api/v1/movies/${movieId}`)
            .then(response => response.json())
            .then(data => {
                const {id, title, poster_url, trailer_url, genres, duration,release_date, rating, wiki_url, storyline, artists} = data;
                const movie = {
                    id: id,
                    title: title,
                    poster_url: poster_url,
                    trailer_url: trailer_url,
                    genres: genres,
                    duration: duration,
                    release_date: release_date,
                    rating: rating,
                    wiki_url: wiki_url,
                    storyline: storyline,
                    artists: artists,
                }

                setMovieDetails(movie);
                console.log(`Movie ${movie}`);
            });
    }

    useEffect(() => {
        getMovie();
    }, []);

    return(
        <Fragment>
            <Header accessToken={accessToken} loginButton={loginButton}
                    setAccessToken={setAccessToken} setLoginButton={setLoginButton}
                    showBookShow={true} movieId={params.id}></Header>
            <Link to="/">
                <Typography id="backToHomeBtn" variant="button" display="block" gutterBottom>
                    {'<'} Back to Home
                </Typography>
            </Link>
            <div className="details-container">
                <div className={"left-column"}>
                    <img src={movieDetails.poster_url} alt={movieDetails.title}/>
                </div>
                <div className={"middle-column"}>
                    <Typography component = "h2" gutterBottom>
                        {movieDetails.title}
                    </Typography>
                    <Typography>
                        <span className={classes.boldText}>Genres: </span>
                        {movieDetails.genres.join(', ')}
                    </Typography>
                    <Typography>
                        <span className={classes.boldText}>Duration: </span>
                        {movieDetails.duration}
                    </Typography>
                    <Typography>
                        <span className={classes.boldText}>Release Date: </span>
                        {new Date(movieDetails.release_date).toDateString()}
                    </Typography>
                    <Typography>
                        <span className={classes.boldText}>Rating: </span>
                        {movieDetails.rating}
                    </Typography>
                    <Typography className={classes.wikiMargin}>
                        <span className={classes.boldText}>Plot: </span>
                        (<a href={movieDetails.wiki_url} target="_blank" rel="noopener noreferrer" >Wiki Link</a>) {movieDetails.storyline}
                    </Typography>
                    <Typography className={classes.wikiMargin}>
                        <span className={classes.boldText}>Trailer: </span>
                    </Typography>
                    <div>
                        <YouTube
                            videoId={videoId}
                            opts={videoDetails}/>
                    </div>
                </div>
                <div className={"right-column"}>
                    <Typography className={classes.boldText}>
                        Rate this movie:
                    </Typography>
                    <div className={"starBorderContainer"}>
                        {[...Array(+numberOfStars).keys()].map(n => {
                            return(
                                <StarBorderIcon>
                                    key={`star-${n}`}
                                    id={`star-${n}`}
                                    onClick={onStarClick}
                                    className={stars[n] === true ? 'star-selected': 'star-icon'}
                                </StarBorderIcon>
                            )
                        })}
                    </div>
                    <Typography className={`${classes.boldText} ${classes.wikiMargin}`}   >
                        Artists:
                    </Typography>
                    <GridList className={classes.gridMain} cols={2} cellHeight={250}>
                        {
                            movieDetails.artists.map(artist =>  (
                                    <GridListTile
                                        key={artist.id}
                                    >
                                        <img src={artist.profile_url} alt={artist.first_name} />
                                        <GridListTileBar title={`${artist.first_name} ${artist.last_name}`}></GridListTileBar>
                                    </GridListTile>
                                )
                            )
                        }
                    </GridList>
                </div>

            </div>
        </Fragment>
    )
}