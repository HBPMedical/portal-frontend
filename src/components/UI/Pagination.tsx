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
        <PaginationContainer.Prev
          disabled={currentPage === 0}
          onClick={(): void => handleSetCurrentPage(currentPage - 1)}
        />

        {[...Array(totalPages).keys()].map((n) => (
          <PaginationContainer.Item
            key={`page-${n}`}
            onClick={(): void => handleSetCurrentPage(n)}
            active={currentPage === n}
          >
            {n + 1}
          </PaginationContainer.Item>
        ))}

        <PaginationContainer.Next
          onClick={(): void => handleSetCurrentPage(currentPage + 1)}
          active={totalPages === currentPage}
          disabled={currentPage >= totalPages - 1}
        />
      </PaginationContainer>
    )) || <div></div>
  );
};

export default Pagination;
