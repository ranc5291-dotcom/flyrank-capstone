import SettingsForm from './components/SettingsForm'

function App() {
  return (
    <main>
      <SettingsForm
        initialValues={{
          displayName: 'Alex Morgan',
          email: 'alex@example.com',
        }}
        onSave={(values) => {
          console.log('Settings saved:', values)
        }}
      />
    </main>
  )
}

export default App
