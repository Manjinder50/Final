import React,{Fragment,useState,useEffect} from 'react';
import './Home.css';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import {makeStyles} from "@material-ui/core";
import Header from "../../common/header/Header";
import {Link} from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

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
        card: {
            minWidth: 240,
            maxWidth: 240,
            backgroundColor: theme.spacing.unit,
        },
        cardTitle:{
            color: theme.palette.primary.light,
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 250,
            maxWidth: 450,
            width: '76%',
        },

    }));
    const classes = styles();
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [releasedMovies, setReleasedMovies] = useState([]);
    const [allReleasedMovies, setAllReleasedMovies] = useState([]);
    const [allGenres, setAllGenres] = useState([]);
    const [allArtists, setAllArtists] = useState([]);
    const [genresSelected, setGenresSelected] = useState([]);
    const [artistsSelected, setArtistsSelected] = useState([]);
    const [filterForm, setFilterForm] = useState({
        moviename: '',
        releaseStartDate: 'dd-mm-yyyy',
        releaseEndDate: 'dd-mm-yyyy',
    })

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
                        setAllReleasedMovies(finalReleasedMovies);
                    })

            })
    }

    const getGenres = () => {
        fetch('http://localhost:8085/api/v1/genres')
            .then(response => response.json())
            .then(data => {
                const newGenres = [];
                data["genres"].forEach( (g) => {
                        const {genre} = g;
                        newGenres.push(genre);
                    }
                )

                setAllGenres(newGenres);
            });
    }

    const getArtists = () => {
        fetch('http://localhost:8085/api/v1/artists?page=1&limit=10')
            .then(response => response.json())
            .then(data => {
                const total = data["total_count"];
                fetch(`http://localhost:8085/api/v1/artists?page=1&limit=${total}`)
                    .then(response => response.json())
                    .then(data => {
                        const newArtists = [];
                        data["artists"].forEach((artist) => {
                            const {first_name, last_name} = artist;
                            const name = `${first_name} ${last_name}`
                            newArtists.push(name);
                        })

                        setAllArtists(newArtists);
                    })
            });
    }

    useEffect(() => {
        getMoviesList();
        getGenres();
        getArtists();
    }, []);

    const applyFilter = (e) => {
        console.log("Inside apply filter");
        e.preventDefault();
        let currentList = allReleasedMovies;

        if(moviename !== '') {
        currentList = currentList.filter(movie => movie.title.toLowerCase().includes(moviename.toLowerCase()));
        }
        console.log(currentList);


        if(genresSelected.length > 0) {
            currentList = currentList.filter(data => {
                let genreFound = false;
                for(let i=0; i < data.genres.length; i++) {
                    const d = data.genres[i];
                    if(genresSelected.includes(d)) {
                        genreFound = true;
                        break;
                    }
                }

                return genreFound;
            });
        }
        console.log(currentList);

        if(releaseStartDate !== 'dd-mm-yyyy' && releaseEndDate !== 'dd-mm-yyyy') {
            currentList = currentList.filter(data => {
                const current_release = Date.parse(data.release_date);
                const start = Date.parse(releaseStartDate);
                const end = Date.parse(releaseEndDate);
                console.log(end);
                return current_release >= start && current_release <= end
            });
        }

        console.log(currentList);

        if(artistsSelected.length > 0) {
            currentList = currentList.filter(data => {
                let artistFound = false;
                for(let i=0; i < data.artists.length; i++) {
                    const d = `${data.artists[i].first_name} ${data.artists[i].last_name}`;
                    if(artistsSelected.includes(d)) {
                        artistFound = true;
                        break;
                    }
                }
                return artistFound;
            });
        }

        console.log(currentList);

        if(moviename === '' && (releaseStartDate === '' || releaseEndDate === '')
            && genresSelected.length === 0 && artistsSelected.length === 0) {
            setReleasedMovies(allReleasedMovies);
        } else {
            setReleasedMovies(currentList);
        }

        console.log(currentList);

    }

    const filterChangeHandlerInput = (e) => {
    const state = filterForm;
    state[e.target.name] = e.target.value;
    setFilterForm({...state})
    }

    const handleGenreChange = (e) => {
        setGenresSelected(e.target.value);
    };

    const handleArtistChange = (e) => {
        setArtistsSelected(e.target.value);
    }

    const {moviename, releaseStartDate, releaseEndDate} = filterForm;

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
                <div className="filter-movies">
                    <Card className={classes.card}>
                        <CardContent>
                            <Typography className={classes.cardTitle}>
                                FIND MOVIES BY:
                            </Typography>
                            <form className={"filter-form"} onSubmit={applyFilter}>
                                <FormControl className={classes.formControl}>
                                    <TextField id={"moviename"} label={"Movie Name"} name={"moviename"} onChange = {filterChangeHandlerInput}></TextField>
                                </FormControl>
                                <FormControl className = {classes.formControl}>
                                    <InputLabel id="genres-checkboxes-label">Genres</InputLabel>
                                    <Select
                                        labelId="genres-checkboxes-label"
                                        id="genres-checkbox"
                                        multiple
                                        value={genresSelected}
                                        onChange={handleGenreChange}
                                        input={<Input />}
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {allGenres.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={genresSelected.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <InputLabel id="artists-checkbox-label">Artists</InputLabel>
                                    <Select
                                        labelId="artists-checkbox-label"
                                        id="artists-checkbox"
                                        multiple
                                        value={artistsSelected}
                                        onChange={handleArtistChange}
                                        input={<Input />}
                                        renderValue={(selected) => selected.join(', ')}
                                    >
                                        {allArtists.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                <Checkbox checked={artistsSelected.indexOf(name) > -1} />
                                                <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="start-date"
                                        label="Release Date Start"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        name="releaseStartDate"
                                        onChange={filterChangeHandlerInput}
                                        value={releaseStartDate}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <TextField
                                        id="end-date"
                                        label="Release Date End"
                                        type="date"
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        name="releaseEndDate"
                                        onChange={filterChangeHandlerInput}
                                        value={releaseEndDate}
                                    />
                                </FormControl>
                                <FormControl className={classes.formControl}>
                                    <Button className="applyButton" name="Apply" variant="contained" color="primary"
                                            type="submit">APPLY</Button>
                                </FormControl>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </Fragment>
    )
}