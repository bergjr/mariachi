import PageHero from '../../components/PageHero/PageHero'
import CarsList from '../../components/CarsList/CarsList'
import carsImg from '../../assets/backgrounds/image-3.jpg'
import styles from './RentACar.module.scss'

export default function RentACar() {
  return (
    <div className={styles.rentACar}>
      <PageHero
        image={carsImg}
        title="Rent a Car"
        subtitle="Choose from a wide selection of vehicles — from economy city cars to premium SUVs — and explore Mexico at your own pace."
      />
      <CarsList />
    </div>
  )
}
