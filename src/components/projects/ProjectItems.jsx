const ProjectItems = ({ item }) => {
    const handleNavigation = (url) => {
      window.open(url, "_blank");
    };
  
    return (
      <div className="project__card" key={item.id}>
        <img className="project__img" src={item.image} alt="" />
        <h3 className="project__title">{item.title}</h3>
        <div classname="button__row">
            <button
            onClick={() => handleNavigation(item.link)}
            className="btn project-btn"
            >
            Demo
            </button>
            <button
            onClick={() => handleNavigation(item.github)}
            className="btn project-btn"
            >
            Github
            </button>
        </div>
        
      </div>
    );
  };
  
  export default ProjectItems;
  