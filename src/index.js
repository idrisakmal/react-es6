import React from 'react';
import ReactDOM from 'react-dom';
import '../assets/index.scss'

class TodoItem extends React.Component {
    state = {
        isShowingInput: false
    }

    render() {
        return (
            <div className="box">
                {this.state.isShowingInput ? <TodoForm onSubmit={this.handleSubmit} defaultData={this.props.todo} /> : <p onDoubleClick={this.handleChangeInput}>{this.props.todo}</p> }
                <button className="button is-danger" onClick={event => this.props.onDelete(event, this.props.id)}>X</button>
            </div>
        )
    }

    handleChangeInput = (event) => {
        event.preventDefault()
        this.setState({isShowingInput: true})
    }

    handleSubmit = (event, data) => {
        this.props.onUpdate(event, this.props.id, data)
        this.setState({isShowingInput: false})
    }
}

class TodoList extends React.Component {
    state = {
        todos: []
    }

    render() {
        return (
            <React.Fragment>
                <section className="section">
                    <div className="container">
                        <h1 className="title">Todo List</h1>

                        <TodoForm onSubmit={this.handleSubmit} />
                        {this.state.todos.map((todo, index) => (
                            <TodoItem todo={todo} key={index} id={index} onDelete={this.handleDelete} onUpdate={this.handleUpdate} />
                        ))}        
                    </div>
                </section>
            </React.Fragment>
        )
    }

    handleSubmit = (event, data) => {
        event.preventDefault()
        this.setState(prevState => ({
            todos: [
                ...prevState.todos,
                data
            ]
        }))
    }

    handleDelete = (event, index) => {
        this.setState(prevState => ({
            todos: [
                ...prevState.todos.slice(0, index), 
                ...prevState.todos.slice(index + 1)
            ]
        }))
    }

    handleUpdate = (event, index, data) => {
        this.setState(prevState => ({
            todos: [
                ...prevState.todos.slice(0, index),
                data,
                ...prevState.todos.slice(index + 1)
            ]
        }))
    }
}

class TodoForm extends React.Component {
    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="field">
                    <div className="control" style={{marginBottom: 20}}>
                        <input className="input" ref={this.setInput} type="text" onChange={this.handleChange} defaultValue={this.props.defaultData} autoFocus placeholder="What do you wanna do today?" />
                    </div>
                </div>
            </form>
        )
    }

    handleChange = (event) => {
        console.log(event)
        this.setState({ value: event.target.value });
    }

    handleSubmit = (event) => {
        console.log(event)
        this.props.onSubmit(event, this.state.value);
        this.input.value = ''
    }

    setInput = (ref) => {
        this.input = ref
    }
}

   
ReactDOM.render(<TodoList />, document.getElementById('app'))