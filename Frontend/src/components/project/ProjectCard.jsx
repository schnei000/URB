function ProjectCard({ project }) {
    return (
        <div style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: "8px" }}>
            <h3>{project.name}</h3>
            <p>{project.description}</p>
        </div>
    );
}

export default ProjectCard;
