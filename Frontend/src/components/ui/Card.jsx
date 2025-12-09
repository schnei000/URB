import PropTypes from "prop-types";

export default function Card({ title, children, style = {} }) {
  return (
    <div className="bg-white p-5 rounded-lg shadow-lg mb-5" style={style}>
      {/* Titre si fourni */}
      {title && <h3 className="mb-4 text-lg font-semibold text-gray-800">{title}</h3>}

      {/* Contenu */}
      <div>{children}</div>
    </div>
  );
}

Card.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  style: PropTypes.object
};
