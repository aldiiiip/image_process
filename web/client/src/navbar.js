import { Link } from 'react-router-dom';

const Navbar = () => {
    return (  
        <nav className="navbar">
            <h1>Wastewater Attributes Analysis</h1>
            <div className="links">
                <Link to="/">Home</Link>
                <Link to="/image-gallery">Image Gallery</Link>
            </div>
        </nav>
    );
}
 
export default Navbar;