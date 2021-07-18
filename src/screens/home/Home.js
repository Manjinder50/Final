import React,{Fragment,useState,useEffect} from 'react';
import './Home.css';
import ImageList from '@material-ui/core/ImageList';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {makeStyles} from "@material-ui/core";
import Header from "../../common/header/Header";
import {Link} from 'react-router-dom';

export default function Home({accessToken,setAccessToken,loginButton,setLoginButton}){

    const styles = makeStyles((theme) => ({
        root: {
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        gridList: {
            flexWrap: 'nowrap',
            // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
            transform: 'translateZ(0)',
        },
        title: {
            color: theme.palette.primary.light,
        },
        titleBar: {
            background:
                'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
        },
        rgridMain: {
            justifyContent: 'space-around',
            overflow: 'hidden',
            backgroundColor: theme.palette.background.paper,
        },
        rgridListTile: {
            margin: '16px',
            cursor: "pointer",
        },

    }));
    const classes = styles();
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [releasedMovies, setReleasedMovies] = useState([]);

    const getMoviesList = ()=>{
        fetch('http://localhost:8085/api/v1/movies?page=1&limit=10')
            .then(response => response.json())
            .then(responseData => {
                const totalMoviesReturned = responseData["total_count"];
                fetch(`http://localhost:8085/api/v1/movies?page=1&limit=${totalMoviesReturned}`)
                    .then(response => response.json())
                    .then(data => {
                        const upcomingMovies = data["movies"].filter(movie => movie.status === 'PUBLISHED');
                        const releasedMovies = data["movies"].filter(movie => movie.status === 'RELEASED');

                        const finalUpcomingMovies = [];
                        upcomingMovies.forEach(movie => {
                            const {id, title, poster_url} = movie;
                            const finalUpcomingMovie = {
                                id: id,
                                title: title,
                                poster_url: poster_url
                            };

                            finalUpcomingMovies.push(finalUpcomingMovie);
                        })

                        const finalReleasedMovies = [];
                        releasedMovies.forEach(movie => {
                            const {id, title, poster_url,release_date,genres,artists} = movie;
                            const formattedDate = new Date(release_date).toDateString();
                            const finalReleasedMovie = {
                                id: id,
                                title: title,
                                poster_url: poster_url,
                                release_date: formattedDate,
                                genres: genres,
                                artists: artists
                            };

                            finalReleasedMovies.push(finalReleasedMovie);
                        })

                        setUpcomingMovies(finalUpcomingMovies);
                        setReleasedMovies(finalReleasedMovies);
                    })

            })
    }

    useEffect(() => {
        getMoviesList();
    }, []);

    return(
        <Fragment>
            <Header accessToken={accessToken} loginButton={loginButton}
                    setAccessToken={setAccessToken} setLoginButton={setLoginButton}></Header>
            <div className="heading">Upcoming Movie</div>
            <div className={classes.root}>
                <GridList className={classes.gridList} cols={6} cellHeight = {250}>
                    {upcomingMovies.map(movie => (
                        <GridListTile key={movie.poster_url}>
                            <img src={movie.poster_url} alt={movie.title} />
                            <GridListTileBar
                                title={movie.title}>
                            </GridListTileBar>
                            />
                        </GridListTile>
                    ))}
                </GridList>
            </div>
            <div className="released-movie-container">
                <div className="released-movies">
                    <div className={classes.rgridMain}>
                        <GridList className={classes.rgridList} cols={4} cellHeight={350}>
                            {releasedMovies.map(movie => (
                                <GridListTile
                                    className={classes.rgridListTile}
                                    key={movie.poster_url}
                                >
                                    <Link to={"/movie/" + movie.id} >
                                        <img src={movie.poster_url} alt={movie.title} className="image-link"/>
                                    </Link>
                                    <GridListTileBar
                                        title={movie.title}
                                        subtitle={<span>Released Date: {movie.release_date}</span>}
                                    ></GridListTileBar>
                                </GridListTile>
                            ))}
                        </GridList>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}