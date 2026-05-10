// ComicsList.js
import "./comicsList.scss";
import { Component } from "react";

import ApiService from "../../service/apiService";
import Error from "../error/error";

class ComicsList extends Component {
  state = {
    loading: false,
    comics: [],
    limit: 8,
    offset: 0,
    error: false,
  };

  apiService = new ApiService();
  controller = null;

  componentDidMount() {
    const { limit, offset } = this.state;
    this.loadComics(limit, offset);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.offset !== this.state.offset) {
      this.loadComics(this.state.limit, this.state.offset);
    }
  }

  componentWillUnmount() {
    if (this.controller) this.controller.abort();
  }

  // delay = (ms) => new Promise((res) => setTimeout(res, ms));

  loadComics = async (limit, offset) => {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();

    this.setState({ loading: true, error: false });

    try {
      // Если это "фейковая" задержка — лучше убрать в проде
      // await this.delay(400);

      const res = await this.apiService.getAllComics(limit, offset, this.controller.signal);

      if (this.controller.signal.aborted) return;

      this.setState({
        loading: false,
        comics: res?.results || [],
        error: false,
      });
    } catch (e) {
      if (e?.name === "AbortError") return;
      this.setState({ loading: false, error: true });
    }
  };

  next = () => {
    this.setState(({ offset, limit }) => ({ offset: Math.min(offset + limit, 100) }));
  };

  prev = () => {
    this.setState(({ offset, limit }) => ({ offset: Math.max(offset - limit, 0) }));
  };

  render() {
    const { comics, loading, error, limit } = this.state;

    return (
      <div className="comics__list">
        {error && <Error />}

        {loading ? <ComicsSkeleton limit={limit} /> : <ComicsGrid comics={comics} />}

        <div className="buttons__wrapper">
          <button className="button button__main button__long" onClick={this.prev} disabled={loading}>
            <div className="inner">Prev comics</div>
          </button>
          <button className="button button__main button__long" onClick={this.next} disabled={loading}>
            <div className="inner">Next comics</div>
          </button>
        </div>
      </div>
    );
  }
}

const ComicsGrid = ({ comics }) => {
  return (
    <ul className="comics__grid">
      {comics.map((item) => (
        <li className="comics__item" key={item.id}>
          <a className="comics__link" href={item.site_detail_url} target="_blank" rel="noreferrer">
            <img
              src={item.image?.original_url}
              alt={item.name || item.volume?.name || "comic"}
              className="comics__item-img"
            />
            <div className="comics__item-name">{item.volume?.name || item.name}</div>
          </a>
        </li>
      ))}
    </ul>
  );
};

const ComicsSkeleton = ({ limit }) => {
  return (
    <ul className="comics__grid">
      {Array.from({ length: limit }, (_, id) => (
        <li className="comics__skelet pulse-light" key={id} />
      ))}
    </ul>
  );
};

export default ComicsList;
