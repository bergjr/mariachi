import PageHero from '../../components/PageHero/PageHero'
import HotelsList from '../../components/HotelsList/HotelsList'
import hotelsImg from '../../assets/backgrounds/image-2.webp'
import styles from './Hotels.module.scss'

export default function Hotels() {
  return (
    <div className={styles.hotels}>
      <PageHero
        image={hotelsImg}
        title="Find Your Hotel"
        subtitle="Browse thousands of hotels worldwide, from cosy boutique stays to luxury five-star resorts."
      />
      <HotelsList />
    </div>
  )
}
