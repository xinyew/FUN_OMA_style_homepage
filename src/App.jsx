import Header from './components/Header'

function App() {
  return (
    <>
      <Header />
      <main style={{ marginTop: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <h1 style={{ opacity: 0.1, fontWeight: 400, letterSpacing: '0.2em' }}>WELCOME TO XYZ</h1>
      </main>
    </>
  )
}

export default App
