import MatchWithOpponent from './MatchWithOpponent'
import GameTable from './GameTable'

const LandingPage = () => {
  return (
    <div>
      <h1>Chess App</h1>
      <p>Start a game by finding an opponent</p>
      <MatchWithOpponent />
      <GameTable />
    </div>
  )
}

export default LandingPage
