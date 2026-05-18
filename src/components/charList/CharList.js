// CharList.js
import "./charList.scss";
import { Component } from "react";
import PropTypes from "prop-types";

import ApiService from "../../service/apiService";
import Spinner from "../spinner/spinner";
import Error from "../error/error";

class CharList extends Component {
  static propTypes = {
    selectedCharId: PropTypes.number,
    onCharSelected: PropTypes.func.isRequired,
    onClearCharId: PropTypes.func.isRequired,
  };

  state = {
    characters: [],
    loading: true,
    error: false,
    offset: 0,
  };

  apiService = new ApiService();
  controller = null;

  componentDidMount() {
    this.loadCharacters(this.state.offset);
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.offset !== this.state.offset) {
      this.loadCharacters(this.state.offset);
    }

    // если выбор персонажа сбросили из App — сбросим active карточки
    if (prevProps.selectedCharId && !this.props.selectedCharId) {
      this.clearActive();
    }
  }

  componentWillUnmount() {
    if (this.controller) this.controller.abort();
  }

  loadCharacters = async (offset) => {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();

    this.setState({ loading: true, error: false });

    try {
      const res = await this.apiService.getAllCharacters(offset, this.controller.signal);

      if (this.controller.signal.aborted) return;

      const characters = await this.attachImageSizes(res?.results || []);

      // выставим active если уже выбран
      const selectedId = this.props.selectedCharId;
      const normalized = characters.map((c) => ({
        ...c,
        active: selectedId ? c.id === selectedId : false,
      }));

      this.setState({
        characters: normalized,
        loading: false,
        error: false,
      });
    } catch (e) {
      if (e?.name === "AbortError") return;
      this.setState({ loading: false, error: true });
    }
  };

  attachImageSizes = (characters) => {
    const list = Array.isArray(characters) ? characters.filter(Boolean) : [];

    const promises = list.map((item) => {
      const imgUrl = item?.image?.medium_url;

      if (!imgUrl) return Promise.resolve({ ...item, heightSize: 0 });

      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ ...item, heightSize: img.naturalHeight || 0 });
        img.onerror = () => resolve({ ...item, heightSize: 0 });
        img.src = imgUrl;
      });
    });

    return Promise.all(promises);
  };

  setActive = (id) => {
    this.setState(
      ({ characters }) => ({
        characters: characters.map((item) => ({
          ...item,
          active: item.id === id,
        })),
      }),
      () => this.props.onCharSelected(id)
    );
  };

  clearActive = () => {
    this.setState(({ characters }) => ({
      characters: characters.map((item) => ({ ...item, active: false })),
    }));
  };

  onCardClick = (item) => {
    if (item.active) {
      this.clearActive();
      this.props.onClearCharId();
      return;
    }
    this.setActive(item.id);
  };

  next = () => {
    this.setState(({ offset }) => ({ offset: Math.min(offset + 6, 100) }));
  };

  prev = () => {
    this.setState(({ offset }) => ({ offset: Math.max(offset - 6, 0) }));
  };

  render() {
    const { characters, loading, error } = this.state;

    const spinner = loading ? <Spinner /> : null;
    const errorView = error ? <Error /> : null;

    return (
      <div>
        <div className="char__list ">
          {errorView}

          <ul className={loading ? "char__grid-center hero-loader__center" : "char__grid"}>
            {spinner}
            {!loading &&
              !error &&
              characters.map((item) => {
                const imgUrl = item?.image?.medium_url;
                const objectTop = item.heightSize > 300;

                return (
                  <li
                    className={`${item.active ? "active-charCard" : ""} char__item`}
                    key={item.id}
                    onClick={() => this.onCardClick(item)}
                  >
                    <img
                      className={objectTop ? "object-top" : ""}
                      src={imgUrl}
                      alt={item.name}
                    />
                    <div className="char__name">{item.name}</div>
                  </li>
                );
              })}
          </ul>
        </div>

        <div className="hero-navigation">
          <button className="button button__main button__long" onClick={this.prev} disabled={loading}>
            <div className="inner">Prev hero</div>
          </button>
          <button className="button button__main button__long" onClick={this.next} disabled={loading}>
            <div className="inner">Next hero</div>
          </button>
        </div>
      </div>
    );
  }
}

export default CharList;
