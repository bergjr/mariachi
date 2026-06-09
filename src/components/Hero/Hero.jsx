import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SearchBox from '../SearchBox/SearchBox'
import airplaneNav from '../../assets/backgrounds/airplane-nav.jpg'
import styles from './Hero.module.scss'

export default function Hero() {
  return (
    <Box
      component="section"
      className={styles.hero}
      style={{ backgroundImage: `url(${airplaneNav})` }}
    >
      <Box className={styles.overlay} />
      <Box className={styles.row}>
        <Box className={styles.text}>
          <Typography variant="h2" className={styles.title}>
            Your Next<br />Destination Awaits
          </Typography>
          <Typography variant="body1" className={styles.subtitle}>
            Wherever you dream to go, Mariachi takes you there in comfort and style.
          </Typography>
        </Box>
        <Box className={styles.searchWrapper}>
          <SearchBox />
        </Box>
      </Box>
    </Box>
  )
}
