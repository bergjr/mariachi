import Hero from '../../components/Hero/Hero'
import OffersSection from '../../components/OffersSection/OffersSection'
import styles from './Home.module.scss'

export default function Home() {
  return (
    <div className={styles.home}>
      <Hero />
      <OffersSection />
    </div>
  )
}
