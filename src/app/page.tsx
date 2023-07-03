import styles from './page.module.css'
import Quiz from '@/components/Quiz'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <Quiz />
      </div>
    </main>
  )
}
