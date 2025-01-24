const ProjectItems = ({ item }) => {
    const handleNavigation = (url) => {
      window.open(url, "_blank");
    };
  
    return (
      <div className="project__card" key={item.id}>
        <img className="project__img" src={item.image} alt="" />
        <h3 className="project__title">{item.title}</h3>
        <div className="button__row">
            <div class ="btn_left">
                <button
                onClick={() => handleNavigation(item.link)}
                className="btn project-btn"
                >
                Demo
                </button>
            

            </div>

            <div className="btn_right">
                <button
                onClick={() => handleNavigation(item.github)}
                className="btn project-btn"
                >
                Github
                </button>

            </div>
            
            
        </div>
        
      </div>
    );
  };
  
  export default ProjectItems;
  