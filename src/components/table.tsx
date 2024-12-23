import React, { useCallback, useEffect, useState } from "react";
import styles from "./table.module.css";
import Pagination from "./pagination/pagination";

interface Project {
  id: string;
  "percentage.funded": number;
  "amt.pledged": number;
}

const ProjectTable: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const ITEMS_PER_PAGE = 5;

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Project[] = await response.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message || "Failed to load projects");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const totalPages = Math.ceil(projects.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProjects = projects.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      document.getElementById("projects-table")?.focus();
    }
  };

  if (isLoading) {
    return (
      <div className={styles.skeleton}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.skeletonRow} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.error} role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Kickstarter Projects</h1>
      <div className={styles.tableWrapper}>
        <table id="projects-table" className={styles.table}>
          <thead>
            <tr>
              <th scope="col">S.No.</th>
              <th scope="col">Percentage Funded</th>
              <th scope="col">Amount Pledged</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProjects.map((project, index) => (
              <tr key={project.id}>
                <td>{startIndex + index + 1}</td>
                <td>{project["percentage.funded"]}%</td>
                <td>${project["amt.pledged"].toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProjectTable;
