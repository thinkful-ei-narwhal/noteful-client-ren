import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import NoteListNav from '../NoteListNav/NoteListNav';
import NotePageNav from '../NotePageNav/NotePageNav';
import NoteListMain from '../NoteListMain/NoteListMain';
import NotePageMain from '../NotePageMain/NotePageMain';
import AddFolder from '../AddFolder/AddFolder';
import AddNote from '../AddNote/AddNote';
import { API_URL } from '../config';
import ApiContext from '../ApiContext';
import './App.css';

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

  handleAddFolder = (folder) => {
    this.setState({ folders: [...this.state.folders, folder] });
  };
  handleAddNote = (note) => {
    this.setState({ notes: [...this.state.notes, note] });
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
    return (
      <>
        {['/', '/folder/:folderId'].map((path) => (
          <Route exact key={path} path={path} component={NoteListNav} />
        ))}
        <Route path="/note/:noteId" component={NotePageNav} />
        <Route path="/add-folder" component={NotePageNav} />
        <Route path="/add-note" component={NotePageNav} />
      </>
    );
  }

  renderMainRoutes() {
    return (
      <>
        {['/', '/folder/:folderId'].map((path) => (
          <Route exact key={path} path={path} component={NoteListMain} />
        ))}
        <Route path="/note/:noteId" component={NotePageMain} />
        <Route path="/add-folder" component={AddFolder} />
        <Route path="/add-note" component={AddNote} />
      </>
    );
  }

  render() {
    const value = {
      notes: this.state.notes,
      folders: this.state.folders,
      addFolder: this.handleAddFolder,
      addNote: this.handleAddNote,
      deleteNote: this.deleteNote,
    };
    return (
      <ApiContext.Provider value={value}>
        <div className="App">
          <nav className="App__nav">
            {this.state.notes.length > 0 && this.state.folders.length > 0
              ? this.renderNavRoutes()
              : 'Loading...'}
          </nav>
          <header className="App__header">
            <h1>
              <Link to="/">Noteful</Link>{' '}
              <FontAwesomeIcon icon="check-double" />
            </h1>
          </header>
          <main className="App__main">
            {this.state.notes.length > 0 && this.state.folders.length > 0
              ? this.renderMainRoutes()
              : 'Loading'}
          </main>
        </div>
      </ApiContext.Provider>
    );
  }
}

export default App;
