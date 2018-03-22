import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import marked from 'marked';

import '../assets/index.scss'

class Marked extends React.Component {
    state = {
        input: ""
    }

    render() {
        return (
            <React.Fragment>
                <nav className="navbar is-primary" role="navigation" aria-label="main navigation" style={{marginBottom: 30}}>
                    <div className="navbar-brand">
                        <a className="navbar-item" href="https://bulma.io">
                            <img src="https://bulma.io/images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28"/>
                        </a>
                    </div>
                </nav>
                <div className="container">
                    <div className="columns">
                        <div className="column">
                            <textarea className="textarea is-primary" rows="20" cols="80" onChange={this.handleOnChange}></textarea>
                        </div>
                        <DisplayMarkup input={this.state.input} />
                    </div>
                </div>
            </React.Fragment>
        )
    }

    handleOnChange = (event) =>
        this.setState({
            input: event.target.value
        })
}

class DisplayMarkup extends React.Component {
    render() {
        return (
            <div dangerouslySetInnerHTML={createMarkup(this.props.input)} className="column"></div>
        )
    }
}

const createMarkup = (input) => {
    var rawMarkup = marked(input, { sanitize: true });
    return { __html: rawMarkup };
}


ReactDOM.render(<Marked />, document.getElementById("app"))



