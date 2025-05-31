const ErrorPage = () => {
  return (
    <div className="text-white text-center m-auto">
      <h1 className="text-6xl font-bold">Oops!</h1>
      <p className="text-xl mt-4">
        Something went wrong. Please try again later.
      </p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-light-blue rounded-md hover:brightness-110"
      >
        Go Home
      </a>
    </div>
  )
}

export default ErrorPage
