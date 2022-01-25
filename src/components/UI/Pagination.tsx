import React from 'react';
import { Pagination } from 'react-bootstrap';

export default ({
  totalPages,
  currentPage,
  handleSetCurrentPage
}: {
  totalPages: number;
  currentPage: number;
  handleSetCurrentPage: (page: number) => void;
}): JSX.Element => {
  return (
    (totalPages > 1 && (
      <Pagination className="justify-content-center">
        <Pagination.Prev
          disabled={currentPage === 0}
          onClick={(): void => handleSetCurrentPage(currentPage - 1)}
        />

        {[...Array(totalPages).keys()].map(n => (
          <Pagination.Item
            key={`page-${n}`}
            onClick={(): void => handleSetCurrentPage(n)}
            active={currentPage === n}
          >
            {n + 1}
          </Pagination.Item>
        ))}

        <Pagination.Next
          onClick={(): void => handleSetCurrentPage(currentPage + 1)}
          active={totalPages === currentPage}
          disabled={currentPage >= totalPages - 1}
        />
      </Pagination>
    )) || <div></div>
  );
};
