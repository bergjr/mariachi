import PageHero from '../../components/PageHero/PageHero'
import flightsImg from '../../assets/backgrounds/image-1.jpg'
import styles from './Flights.module.scss'

export default function Flights() {
  return (
    <div className={styles.flights}>
      <PageHero
        image={flightsImg}
        title="Find Your Flight"
        subtitle="Search hundreds of routes and compare fares to get the best deal on your next journey."
      />
    </div>
  )
}
