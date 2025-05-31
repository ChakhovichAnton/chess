const NotFound = () => {
  return (
    <div className="text-white text-center m-auto">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Oops! Page not found.</p>
      <div className="mt-12">
        <a
          href="/"
          className="px-6 py-3 bg-light-blue rounded-md hover:brightness-110"
        >
          Go Home
        </a>
      </div>
    </div>
  )
}

export default NotFound
