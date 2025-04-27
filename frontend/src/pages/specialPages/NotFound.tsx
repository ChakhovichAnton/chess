const NotFound = () => {
  return (
    <div className="text-white text-center flex flex-col justify-center items-center mt-32">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-xl mt-4">Oops! Page not found.</p>
      <a
        href="/"
        className="mt-6 px-6 py-3 bg-light-blue rounded-md hover:brightness-110"
      >
        Go Home
      </a>
    </div>
  )
}

export default NotFound
