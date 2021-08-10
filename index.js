const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const fetch = require('node-fetch');
// eslint-disable-next-line no-unused-yars
const helpers = require('handlebars-helpers')(['string']);

require('dotenv').config();

const PORT = process.env.PORT || 3002; 

const  app = express();

app.use(express.urlencoded({ extended: false }))

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');


app.use(express.static(path.resolve(__dirname, './public')));

app.use(express.urlencoded({ extended: false }))

const catchErrors = asyncFunction => (...args) => asyncFunction(...args).catch(console.error);

const getAllPokemon = catchErrors(async () => {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=898')
        const json = await res.json();
        console.table(json.results)
        return json
})

const getPokemon = catchErrors(async (pokemon = '1') => {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`)
        const json = await res.json();
        return json
})


app.get('/', catchErrors(async (_, res) => {
        const pokemons = await getAllPokemon();
        res.render('home', {
            pokemons: pokemons
        });   
}))

app.post('/search', (req, res) => {
    const search = req.body.search;
    res.redirect(`/${search}`)
})

app.get('/404', (_, res) => res.render('404'))

app.get('/:pokemon', catchErrors(async (req, res) => {
    const search = req.params.pokemon;
    const pokemon = await getPokemon(search)
    if(pokemon){
        res.render('pokemon', {
            pokemon: pokemon
        });
    }else{
        res.redirect('404');
    }
    
}))



app.listen(PORT, () => {
    console.log(`Server run on port : ${PORT}`);
})