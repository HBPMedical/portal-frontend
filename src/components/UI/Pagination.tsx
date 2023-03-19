import { Pagination as PaginationContainer } from 'react-bootstrap';

const Pagination = ({
  totalPages,
  currentPage,
  handleSetCurrentPage,
}: {
  totalPages: number;
  currentPage: number;
  handleSetCurrentPage: (page: number) => void;
}): JSX.Element => {
  return (
    (totalPages > 1 && (
      <PaginationContainer className="justify-content-center">
        <li
          onClick={(e): void => {
            if (currentPage > 0) handleSetCurrentPage(currentPage - 1);
          }}
          className={`page-item${currentPage === 0 ? ' disabled' : ''}`}
        >
          <span className="page-link">
            <span aria-hidden="true">‹</span>
            <span className="sr-only">Previous</span>
          </span>
        </li>

        {[...Array(totalPages).keys()].map((n) => (
          <li
            key={`page-${n}`}
            onClick={(e): void => {
              handleSetCurrentPage(n);
            }}
            className={`page-item${currentPage === n ? ' active' : ''}`}
          >
            <span className="page-link">{n + 1}</span>
          </li>
        ))}

        <li
          onClick={(e): void => {
            if (currentPage < totalPages - 1)
              handleSetCurrentPage(currentPage + 1);
          }}
          className={`page-item${
            currentPage >= totalPages - 1 ? ' disabled' : ''
          }`}
        >
          <span className="page-link">
            <span aria-hidden="true">›</span>
            <span className="sr-only">Next</span>
          </span>
        </li>
      </PaginationContainer>
    )) || <div></div>
  );
};

export default Pagination;
