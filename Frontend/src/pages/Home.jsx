import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <h1>Bienvenue sur ArkTrack</h1>

            <p>Une Plateforme moderne pour la gestion des services, suivre vos projets en temps réel.</p>

            <div>
                <Link to="/login">
                    <button>Se connecter</button>
                </Link>

                <Link to="/register">
                    <button>S'inscrire</button>
                </Link>
            </div>
        </div>
    );
}

export default Home;