// CharInfo.js
import "./charInfo.scss";
import { Component } from "react";
import PropTypes from "prop-types";

import ApiService from "../../service/apiService";
import Error from "../error/error";
import Spinner from "../spinner/spinner";
import Skeleton from "../skeleton/Skeleton";

class CharInfo extends Component {
  static propTypes = {
    charId: PropTypes.number,
    onClearCharId: PropTypes.func.isRequired,
  };

  state = {
    char: null,
    loading: false,
    error: false,
  };

  apiService = new ApiService();
  controller = null;

  componentDidUpdate(prevProps) {
    if (this.props.charId !== prevProps.charId) {
      this.loadCharacter(this.props.charId);
    }
  }

  componentWillUnmount() {
    if (this.controller) this.controller.abort();
  }

  loadCharacter = async (id) => {
    // Если очищаем выбор — чистим состояние
    if (!id) {
      this.setState({ char: null, loading: false, error: false });
      return;
    }

    if (this.controller) this.controller.abort();
    this.controller = new AbortController();

    this.setState({ loading: true, error: false });

    try {
      const char = await this.apiService.getCharacter(id, this.controller.signal);

      // Если запрос был отменён — не трогаем state
      if (this.controller.signal.aborted) return;

      this.setState({
        char,
        loading: false,
        error: false,
      });
    } catch (e) {
      if (e?.name === "AbortError") return;
      this.setState({ loading: false, error: true });
    }
  };

  closeModal = () => {
    this.props.onClearCharId();
  };

  render() {
    const { loading, char, error } = this.state;

    const skeleton = !loading && !error && !char ? <Skeleton /> : null;
    const errorMessage = error ? <Error /> : null;
    const spinner = loading ? <Spinner /> : null;
    const view = !loading && !error && char ? <View char={char} /> : null;

    // Если персонаж не выбран — можно скрыть крестик
    const showClose = !!this.props.charId;

    return (
      <div className="char__info">
        {showClose && (
          <span className="close__modal" onClick={this.closeModal}>
            &#10006;
          </span>
        )}

        {skeleton}
        {errorMessage}
        {spinner}
        {view}
      </div>
    );
  }
}

const View = ({ char }) => {
  const { image, name, description, home, wiki, comicsChar } = char;

  return (
    <>
      <div className="char__basics">
        <img src={image} alt={name} style={{ objectPosition: "top" }} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={home} className="button button__main" target="_blank" rel="noreferrer">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary" target="_blank" rel="noreferrer">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>

      <div className="char__descr">{description}</div>
      <div className="char__comics">Comics:</div>

      <ul className="char__comics-list">
        {(comicsChar || []).map((item) => (
          <li className="char__comics-item" key={item.id}>
            {item.image?.thumb_url ? (
              <img src={item.image.thumb_url} alt={item.name} />
            ) : (
              <span>{item.name}</span>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

View.propTypes = {
  char: PropTypes.object.isRequired,
};

export default CharInfo;
