// App.js
import { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AppHeader from "../appHeader/AppHeader";
import RandomChar from "../randomChar/RandomChar";
import CharList from "../charList/CharList";
import CharInfo from "../charInfo/CharInfo";
import ErrorBoundary from "../error/ErrorBoundary";
import AppBanner from "../appBanner/AppBanner";
import ComicsList from "../comicsList/ComicsList";

class App extends Component {
  state = {
    selectedCharId: null, // number | null
  };

  onCharSelected = (id) => {
    this.setState({ selectedCharId: id });
  };

  onClearCharId = () => {
    this.setState({ selectedCharId: null });
  };

  render() {
    const { selectedCharId } = this.state;

    return (
      <Router>
        <div className="app">
          <div className="app__wrapper">
            <AppHeader />
            <main>
              <Switch>
                <Route exact path="/">
                  <ErrorBoundary>
                    <RandomChar />
                  </ErrorBoundary>

                  <div className="char__content">
                    <ErrorBoundary>
                      <CharList
                        selectedCharId={selectedCharId}
                        onCharSelected={this.onCharSelected}
                        onClearCharId={this.onClearCharId}
                      />
                    </ErrorBoundary>

                    <ErrorBoundary>
                      <CharInfo
                        charId={selectedCharId}
                        onClearCharId={this.onClearCharId}
                      />
                    </ErrorBoundary>
                  </div>
                </Route>

                <Route exact path="/comics">
                  <AppBanner />
                  <ErrorBoundary>
                    <ComicsList />
                  </ErrorBoundary>
                </Route>
              </Switch>
            </main>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
