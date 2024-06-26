import {createAsyncThunk, createSlice, isFulfilled, isPending} from "@reduxjs/toolkit";
import {IGenre, IMovie} from "../../interfaces";
import {movieService} from "../../services";



interface IState {
    movies: IMovie[];
    genres: IGenre[];
    moviesByGenre: IMovie[];
    movieDetails:IMovie | null;
    searchMovie:IMovie[];
    loading: boolean;
}

const initialState: IState = {
    movies: [],
    genres: [],
    moviesByGenre: [],
    movieDetails: null,
    searchMovie:[],
    loading: false,
};

const getAll = createAsyncThunk<IMovie[], number>(
    'moviesSlice/getAll',
    async (page, {rejectWithValue}) => {
        try {
            const {data} = await movieService.getAll(page);
            const {results} = data
            return results
        } catch (error) {
            return rejectWithValue('Failed to fetch movies')
        }
    }
)

const getMovieDetails = createAsyncThunk<IMovie, number>(
    'moviesSlice/getMovieDetails',
    async (id,{rejectWithValue})=>{
        try {
            const {data} = await movieService.getMovieById(id);
            return data
        }catch (error) {
            return rejectWithValue('Failed to fetch movies')
        }
    }
)

const allGenres = createAsyncThunk<IGenre[], void>(
    'moviesSlice/allGenres',
    async (_, {rejectWithValue}) => {
        try {
            const {data} = await movieService.getGenres();
            const {genres} = data
            return genres
        } catch (error) {
            return rejectWithValue('Failed to fetch genres')
        }
    }
)

const movieByGenre = createAsyncThunk<IMovie[], [string]>(
    'moviesSlice/movieByGenre',
    async ([id], {rejectWithValue}) =>{
        try {
            const {data} = await movieService.getMoviesByGenre(id);
            const {results} = data
            console.log(results);
            return results
        }catch (error) {
            return rejectWithValue('Failed to fetch genres')
        }
    }
)

const searchMoviesByName = createAsyncThunk<IMovie[], string>(
    'moviesSlice/searchMoviesByName',
    async (name,{rejectWithValue})=>{
        try {
            const {data} = await movieService.getMovieByName(name);
            const {results} = data;
            return results
        }catch (error) {
            return rejectWithValue('Failed to fetch genres')
        }
    }
)

const moviesSlice = createSlice({
    name: 'moviesSlice',
    initialState,
    reducers: {},
    extraReducers: builder => builder
        .addCase(getAll.fulfilled, (state, action) => {
            state.movies = action.payload
        })
        .addCase(getMovieDetails.fulfilled, (state, action)=>{
            state.movieDetails = action.payload
        })
        .addCase(allGenres.fulfilled, (state, action)=>{
            state.genres = action.payload
        })
        .addCase(movieByGenre.fulfilled,(state, action)=>{
            state.moviesByGenre = action.payload
        })
        .addCase(searchMoviesByName.fulfilled,(state, action)=>{
            state.searchMovie = action.payload
        })
        .addMatcher(isPending(getAll,getMovieDetails, allGenres, movieByGenre),(state, action)=>{
            state.loading = true
        })
        .addMatcher(isFulfilled(),(state, action)=>{
            state.loading = false
        })
    })


const {reducer: movieReducer, actions} = moviesSlice;

const movieActions = {
    ...actions,
    getAll,
    getMovieDetails,
    allGenres,
    movieByGenre,
    searchMoviesByName
}

export {
    movieActions,
    movieReducer
}