import HelloWorld from './components/HelloWorld';
import styles from './styles.module.scss';
import Image from './assets/logo.jpg';

export default function App() {
  
  return (
    <div class={styles.app}>
      <img alt="Velto logo" src={Image} />
      <HelloWorld msg="Hello Velto + Vite" />
    </div>
  )
}