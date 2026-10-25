import './App.scss'
import { ThemeProvider, Typography } from '@mui/material'
import opaliteTheme from './theme/opalite'
import { BookList } from './components'
import MainLayout from './layouts/MainLayout.tsx'

function App() {
  return (
    <ThemeProvider theme={opaliteTheme}>
      <MainLayout>
        <main className="main">
          <div className="column">
            <Typography variant="h1">Welcome to book app</Typography>
            <div className="subtitle">
              Your shelf is empty for now. Add your first book and start a reading streak.
            </div>
          </div>
          {/*TODO load the books*/}
          <BookList books={[]} />
        </main>
      </MainLayout>
    </ThemeProvider>
  )
}

export default App
