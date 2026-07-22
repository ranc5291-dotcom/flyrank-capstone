import SettingsForm from './components/SettingsForm'

const initialSettings = {
  displayName: 'Alex Morgan',
  email: 'alex@example.com',
}

function App() {
  return (
    <main>
      <SettingsForm
        initialValues={initialSettings}
        onSave={(values) => {
          console.log('Settings saved:', values)
        }}
      />
    </main>
  )
}

export default App
