// spinner.js
import "./spinner.scss";

const Spinner = () => {
  return (
    <div className="hero-loader">
      <div className="hero-loader__orbit">
        <div className="hero-loader__weapon">
          <img src="/img/TorWeapon.png" alt="Weapon" />
        </div>
      </div>
      <div className="hero-loader__hero">
        <img src="/img/Tor.png" alt="Tor" />
      </div>
    </div>
  );
};

export default Spinner;
