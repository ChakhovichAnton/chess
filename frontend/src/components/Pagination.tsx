import { FC, PropsWithChildren } from 'react'

interface NextOrPreviousButtonProps extends PropsWithChildren {
  onClick: () => void
  disabled: boolean
}

const NextOrPreviousButton: FC<NextOrPreviousButtonProps> = ({
  onClick,
  disabled,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="hover:enabled:cursor-pointer disabled:hover:cursor-not-allowed px-2 sm:px-4 py-2 bg-white rounded hover:enabled:bg-gray-200 disabled:opacity-60"
    >
      {children}
    </button>
  )
}

interface PaginationProps {
  curPage: number
  pageCount: number
  onPageChange: (newPage: number) => void
  disabled: boolean
}

const Pagination: FC<PaginationProps> = ({
  curPage,
  pageCount,
  onPageChange,
  disabled,
}) => {
  if (pageCount < 1) return null

  const createPageArray = () => {
    const pages: (number | undefined)[] = [1] // Undefined means that "..." is added

    for (let i = 2; i <= pageCount; i++) {
      if (i === pageCount || Math.abs(i - curPage) <= 1) {
        pages.push(i)
      } else if (i === curPage - 2 || i === curPage + 2) {
        pages.push(undefined)
      }
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center space-x-1 sm:space-x-2 mt-6">
      <NextOrPreviousButton
        onClick={() => onPageChange(curPage - 1)}
        disabled={curPage === 1 || disabled}
      >
        Previous
      </NextOrPreviousButton>
      {createPageArray().map((page, index) =>
        page === undefined ? (
          <span key={index} className="p-1 select-none">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`hover:enabled:cursor-pointer aspect-square min-w-10 rounded ${
              page === curPage
                ? 'bg-light-blue text-white font-medium'
                : 'hover:brightness-120 bg-background-gray-light'
            }`}
            disabled={disabled}
          >
            {page}
          </button>
        ),
      )}
      <NextOrPreviousButton
        onClick={() => onPageChange(curPage + 1)}
        disabled={curPage === pageCount || disabled}
      >
        Next
      </NextOrPreviousButton>
    </div>
  )
}

export default Pagination
