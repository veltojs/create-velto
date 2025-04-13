import { ref } from "@velto/runtime"

import styles from "./styles.module.scss";

export default function Test(props = {}) {
  const count = ref(0);
  return (
    <div class={styles.helloworld}>
      <h1>{ props.msg }</h1>

      <p>
        <a href="https://vitejs.dev/guide/features.html" target="_blank">
          Vite Docs
        </a>
        |
        <a href="https://github.com/zebing/velto" target="_blank">Velto Docs</a>
      </p>

      <button type="button" onClick={() => count.setValue(count.value + 1)}>count is: {count.value}</button>
    </div>
  )
}