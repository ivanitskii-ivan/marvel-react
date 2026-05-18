// RandomChar.js
import { Component } from "react";
import "./randomChar.scss";
import mjolnir from "../../resources/img/mjolnir.png";

import ApiService from "../../service/apiService";
import Spinner from "../spinner/spinner";
import Capitan404 from "../error/capitan404";

class RandomChar extends Component {
  state = {
    char: null,
    imageSize: null,
    loading: true,
    error: false,
  };

  apiService = new ApiService();
  controller = null;

  componentDidMount() {
    this.getRandomCharacter();
  }

  componentWillUnmount() {
    if (this.controller) this.controller.abort();
  }

  getImageSize = (url) => {
    return new Promise((resolve, reject) => {
      if (!url) {
        reject(new Error("Image url not found"));
        return;
      }

      const img = new Image();
      img.onload = () =>
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      img.onerror = () => reject(new Error("Could not read image size"));
      img.src = url;
    });
  };

  getRandomCharacter = async () => {
    if (this.controller) this.controller.abort();
    this.controller = new AbortController();

    const id = Math.floor(Math.random() * (1384 - 1253 + 1)) + 1253;

    this.setState({ loading: true, error: false });

    try {
      const char = await this.apiService.getCharacter(id, this.controller.signal);
      if (this.controller.signal.aborted) return;

      let imageSize = null;
      try {
        imageSize = await this.getImageSize(char?.image);
      } catch {
        // размер картинки не критичен 
        imageSize = null;
      }

      this.setState({ char, imageSize, loading: false, error: false });
    } catch (e) {
      if (e?.name === "AbortError") return;
      this.setState({ loading: false, error: true });
    }
  };

  render() {
    const { char, loading, error, imageSize } = this.state;

    return (
      <div className="randomchar ">
        {loading && <Spinner />}
        {!loading && !error && char && <ViewChar char={char} imgSize={imageSize} />}
        {!loading && error && <Capitan404 />}

        <div className="randomchar__static">
          <p className="randomchar__title">
            Random character for today!
            <br />
            Do you want to get to know him better?
          </p>
          <p className="randomchar__title">Or choose another one</p>

          <button className="button button__main" onClick={this.getRandomCharacter}>
            <div className="inner">try it</div>
          </button>

          <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
        </div>
      </div>
    );
  }
}

const ViewChar = ({ char, imgSize }) => {
  const { name, description, image, home, wiki } = char;
  const height = imgSize?.height || 0;
  const trimmed = (description || "").trim();
  const text = trimmed.length > 200 ? trimmed.slice(0, 200) + "..." : trimmed;

  return (
    <div className="randomchar__block ">
      <img
        src={image}
        alt={name}
        className="randomchar__img"
        style={{ objectPosition: height >= 300 ? "top" : "center" }}
      />

      <div className="randomchar__info">
        <p className="randomchar__name">{name}</p>
        <p className="randomchar__descr">{text}</p>

        <div className="randomchar__btns">
          <a href={home} className="button button__main" target="_blank" rel="noreferrer">
            <div className="inner">homepage</div>
          </a>
          <a href={wiki} className="button button__secondary" target="_blank" rel="noreferrer">
            <div className="inner">Wiki</div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default RandomChar;
