export interface Project {
  id: string;
  'percentage.funded': number;
  "amt.pledged": number;
}

// export interface ApiResponse extends Array<Project> {}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}
