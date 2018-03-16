import React from 'react';
import ReactDOM from 'react-dom';
import debounce from 'lodash/debounce';
import axios from 'axios';

import '../assets/index.scss'

axios.defaults.baseURL = "https://gateway.marvel.com"
axios.defaults.params = {
    apikey: '50f87061065636f21d9fff249800ba55'
}

class MarvelApp extends React.Component {
    state = {
        people: [],
        isShowingCharacterDetails: false,
        character: {}
    }

    componentDidMount() {
        this.getData()
    }

    getData = (params = {}) => {
        axios.get('/v1/public/characters', {
            params
        })
        .then((response) => {
            this.setState({ people: response.data.data.results })
        })
        .catch((error) => {
            console.log(error);
        });
    }

    debouncedGetData = debounce(this.getData, 300)

    render() {
        return (
            <React.Fragment>
            { this.state.isShowingCharacterDetails ? <CharacterDetail person={this.state.character} hideDetails={this.handleHideDetails}/> : <HomePage people={this.state.people} onChange={this.handleChange} showDetails={this.handleShowDetails}/> }
            </React.Fragment>
        )
    }

    handleChange = (event) => {
        this.debouncedGetData({ nameStartsWith: event.target.value })
    }

    handleShowDetails = (character) => {
        this.setState({
            isShowingCharacterDetails: true,
            character
        })
    }

    handleHideDetails = (event) => {
        this.setState({
            isShowingCharacterDetails: false,
            character: {}
        })
    }
}

class HomePage extends React.Component {
    render() {
        return (
            <div className="section">
                <div className="field">
                    <div className="control" style={{ marginBottom: 20 }}>
                        <input className="input" type="text" onChange={this.props.onChange} placeholder="Search a Marvel Character.." />
                    </div>
                </div>
                <ul>
                    {this.props.people.map((person) =>
                        <CharacterCard
                            key={person.id}
                            id={person.id}
                            image={`${person.thumbnail.path}.${person.thumbnail.extension}`}
                            name={person.name}
                            description={person.description}
                            characterDetail={this.handleCharacter}
                            comics={person.comics.items.map(comic => ({
                                name: comic.name,
                                url: comic.resourceURI
                            }))}
                        />
                    )}
                </ul>
            </div>
        )
    }

    handleCharacter = (value) => {
        this.props.showDetails(value)
    }
}

class CharacterDetail extends React.Component {
    render() {
        return (
            <React.Fragment>
                <section className="hero is-dark">
                    <div className="hero-body">
                        <a className="button is-dark is-rounded" onClick={this.handleClick}>
                            <span className="icon"><i className="fas fa-arrow-left"></i></span>
                            <span>Back to Search</span>
                        </a><br /><br />
                        <div className="container">
                            <figure className="image is-128x128">
                                <img src={`${this.props.person.thumbnail.path}.${this.props.person.thumbnail.extension}`} alt="Image" style={{ borderRadius: 10 }} />
                            </figure>
                            <h1 className="title">{this.props.person.name}</h1>
                            <h2 className="subtitle">{this.props.person.id}</h2>
                        </div>
                    </div>       
                </section>
                <div className="section">
                    <div className="content">
                        <div className="container">
                            <div className="box">
                                <h1 className="title is-3 has-text-centered" style={{paddingBottom: 15}}>Character Description</h1>

                                <p className="has-text-centered">{this.props.person.description || "No description"}</p>
                            </div>
                        </div>
                    </div>

                    <div className="content" style={{marginTop: 30}}>
                        <div className="container">
                            <div className="columns">
                                <div className="column is-4 has-text-centered box">
                                    <h1 className="title is-4 has-text-centered">Comics Appeared In</h1>
                                    <ItemList
                                        items={this.props.person.comics.items.map(comic => ({
                                            name: comic.name,
                                            url: comic.resourceURI
                                        }))}
                                        limit={10} 
                                    />
                                </div>
                                <div className="column is-4 has-text-centered box">
                                    <h1 className="title is-4">Series Appeared In</h1>
                                    <ItemList 
                                        items={this.props.person.series.items.map(series => ({
                                            name: series.name,
                                            url: series.resourceURI
                                        }))}
                                        limit={10}
                                    />
                                    
                                </div>
                                <div className="column is-4 has-text-centered box">
                                    <h1 className="title is-4">Stories Featured In</h1>
                                    <ItemList
                                        items={this.props.person.stories.items.map(story => ({
                                            name: story.name,
                                            url: story.resourceURI
                                        }))}
                                        limit={10}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        )
    } 

    handleClick = (event) => {
        this.props.hideDetails(event)
    }
}

class CharacterCard extends React.Component {
    render() {
        return (
            <div className="box">
                <article className="media">
                    <div className="media-left">
                        <figure className="image is-64x64">
                            <img src={this.props.image} alt="Image" />
                        </figure>
                    </div>
                    <div className="media-content">
                        <h1 className="title is-marginless" onClick={this.handleClick}>{this.props.name}</h1><br />
                        <p>
                            {this.props.description || 'No description'}
                        </p>
                        <br/>
                        <p className="heading">Comics Appeared In</p>
                        <ItemList items={this.props.comics} />
                    </div>
                </article>
            </div>
        )
    }

    handleClick = (event) => {
        axios.get('/v1/public/characters', {
            params: {
                id: this.props.id
            }
        })
        .then((response) => {
            this.props.characterDetail(response.data.data.results[0])
        })
        .catch((error) => {
            console.log(error);
        });
        
    }
}

const ItemList = ({ items, limit = 3}) =>
    items.length > 0 ? (
        <React.Fragment>
            {
                items.slice(0, limit).map(item =>
                    <ItemTemplate name={item.name} url={item.url} key={item.url} />
                )
            }
        </React.Fragment>
    ) : null

const ItemTemplate = (props) => 
    <div className="field">
        <div className="control">
            <a href={props.url}>{props.name}</a>
        </div>
    </div>

    

ReactDOM.render(<MarvelApp />, document.getElementById("app"))



