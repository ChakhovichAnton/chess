const Loading = () => {
  return (
    <div>
      <div className="text-white text-center flex flex-col justify-center items-center mt-32">
        <div className="animate-spin inline-block w-16 h-16 border-4 border-t-4 border-gray-300 rounded-full border-t-blue-600"></div>
        <h1 className="text-2xl mt-6 font-semibold">Loading...</h1>
      </div>
    </div>
  )
}

export default Loading
