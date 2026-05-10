
const Capitan404 = () => {
  const data = {
    name: "Capitan 404",
    description:
      "Captain 404 has arrived! He doesn’t know where the hero is, but he knows for sure it’s not your fault. He shrugs a little, smiles, and waits for you to press 'try it'.",
  };

  return (
    <div className="error-char">
      <div className="randomchar__block">
        <img
          src='/img/Capitan404.png'
          alt="Capitan404"
          className="randomchar__img"
        />
        <div className="randomchar__info">
          <p className="randomchar__name">{data.name}</p>
          <p className="randomchar__descr">{data.description}</p>
        </div>
      </div>
    </div>
  );
};

export default Capitan404;
