import HelloWorld from './components/HelloWorld';
import styles from './styles.module.scss';

export default function App() {
  
  return (
    <div class={styles.app}>
      <img alt="Velto logo" src="./assets/logo.jpg" />
      <HelloWorld msg="Hello Velto + Vite" />
    </div>
  )
}