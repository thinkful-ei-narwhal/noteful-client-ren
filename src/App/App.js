import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';

import { API_URL } from '../config';

import CreateContext from '../ContextStore';
import './App.css';
import NotefulForm from '../NotefulForm/NotefulForm';

class App extends Component {
  state = {
    notes: [],
    folders: [],
  };

  fetchAPI = (endpoint) => {
    return fetch(`${API_URL}${endpoint}`)
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
      })
      .then((data) => {
        return data;
      });
  };

  deleteNote = (noteId) => {
    return fetch(`${API_URL}notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'content-type': 'application/json',
      },
    }).then(() => {
      const notes = this.state.notes.filter((note) => {
        return note.id !== noteId;
      });
      this.setState({
        notes: notes,
      });
    });
  };

  componentDidMount() {
    this.fetchAPI('notes').then((res) => {
      this.setState({
        notes: res,
      });
    });

    this.fetchAPI('folders').then((res) => {
      this.setState({
        folders: res,
      });
    });
  }

  renderNavRoutes() {
    const { notes, folders } = this.state;
    return (
      <CreateContext.Provider
        value={{
          notes: notes,
          folders: folders,
        }}
      >
        {['/', '/folders/:folderId'].map((path) => (
          <Route exact key={path} path={path} component={NoteListNav} />
        ))}
        <Route path="/notes/:noteId" component={NotePageNav} />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </CreateContext.Provider>
    );
  }

  renderMainRoutes() {
    const { notes, folders } = this.state;

    return (
      <CreateContext.Provider
        value={{
          notes: notes,
          folders: folders,
          deleteNote: this.deleteNote,
        }}
      >
        {['/', '/folders/:folderId'].map((path) => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <Route path="/notes/:noteId" component={NotePageMain} />
        <Route path="/add-folder" component={NotefulForm} />
      </CreateContext.Provider>
    );
  }

  render() {
    return (
      <div className="App">
        <nav className="App__nav">
          {this.state.notes.length > 0 && this.state.folders.length > 0
            ? this.renderNavRoutes()
            : 'Loading...'}
        </nav>
        <header className="App__header">
          <h1>
            <Link to="/">Noteful</Link> <FontAwesomeIcon icon="check-double" />
          </h1>
        </header>
        <main className="App__main">
          {this.state.notes.length > 0 && this.state.folders.length > 0
            ? this.renderMainRoutes()
            : 'Loading'}
        </main>
      </div>
    );
  }
}

export default App;
